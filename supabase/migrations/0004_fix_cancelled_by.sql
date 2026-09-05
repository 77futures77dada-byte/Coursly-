-- Coursly — harden bookings.cancelled_by and fix cancellation attribution.
--
-- Two changes, both replacing functions defined in 0003_cancellation_policy.sql.
-- The triggers themselves are unchanged (same function names).
--
-- 1) enforce_cancellation_window(): cancelled_by is now always auth.uid() from
--    the server session, never coalesced with the request payload. 0003 did
--    `coalesce(new.cancelled_by, auth.uid())`, which let a tutor send
--    `cancelled_by = <student_id>` on their own late cancellation to dodge
--    attribution. The RAISE NOTICE used while debugging is not present here.
--
-- 2) after_booking_cancellation(): a late cancellation counts toward the tutor's
--    cancellation_rate, and the student gets the rebooking notification,
--    whenever the canceller is NOT the student
--    (`cancelled_by is distinct from student_id`). Safe default: it covers a
--    NULL cancelled_by (service role / support acting on the tutor's behalf),
--    an admin's own id, and the normal tutor_id — every non-student
--    cancellation lands on the tutor. 0003 keyed both checks on
--    `cancelled_by = tutor_id`, so a support-executed cancellation escaped both.
--
-- Edge case: when the same account is both student and tutor on a booking (only
-- in test fixtures), a tutor self-cancel is indistinguishable from a student one
-- and won't be counted. Real bookings always have distinct parties.

-- ------------------------------------------------------------------ enforcement
create or replace function enforce_cancellation_window() returns trigger
  language plpgsql as $$
declare
  hours_left        numeric;
  is_tutor_initiated boolean;
begin
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    hours_left := extract(epoch from (old.start_at - now())) / 3600;
    is_tutor_initiated := auth.uid() = old.tutor_id;

    if is_tutor_initiated and hours_left < 3
       and not (is_admin() or auth.role() = 'service_role') then
      raise exception 'cancellation_window_closed'
        using detail = 'Tutor-initiated cancellations are blocked less than 3 hours '
                        'before the lesson starts. Route to support for emergencies.';
    end if;

    new.cancelled_at := now();
    new.cancelled_by := auth.uid();
    new.is_late_cancellation := hours_left < 3;
  end if;
  return new;
end $$;

-- ------------------------------------------------------------------ side effects
-- security definer: must write tutor_profiles / notifications regardless of
-- whether the caller who updated the booking (student or tutor) owns those rows.
create or replace function after_booking_cancellation() returns trigger
  security definer set search_path = public
  language plpgsql as $$
begin
  update tutor_profiles
  set cancellation_rate = coalesce(
    (select count(*) filter (
              where is_late_cancellation and cancelled_by is distinct from student_id
            )::numeric
            / nullif(count(*), 0)
     from bookings
     where tutor_id = new.tutor_id
       and status in ('cancelled', 'completed')
       and deleted_at is null),
    0
  )
  where user_id = new.tutor_id;

  -- Rebooking-suggestion notice to the student whenever someone other than the
  -- student cancelled (the tutor, or support on the tutor's behalf).
  if new.status = 'cancelled' and new.cancelled_by is distinct from new.student_id then
    insert into notifications (user_id, type, payload)
    values (
      new.student_id,
      'booking_cancelled_rebook_suggested',
      jsonb_build_object(
        'booking_id', new.id,
        'subject_id', new.subject_id,
        'tutor_id', new.tutor_id,
        'start_at', new.start_at
      )
    );
  end if;

  return new;
end $$;
