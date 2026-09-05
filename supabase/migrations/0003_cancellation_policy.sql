-- Coursly — tutor cancellation policy.
--
-- Rule: a tutor may not self-cancel a lesson less than 3 hours before it starts.
-- This is enforced as a BEFORE UPDATE trigger, not just in the app, so it can't be
-- bypassed by calling PostgREST/the API directly instead of going through the UI —
-- only an admin (is_admin()) or the service role (support tooling / future ops
-- jobs) may push a late cancellation through, for genuine emergencies.
--
-- A student cancelling their own booking is NOT subject to this window — the rule
-- is specifically about tutor reliability, which is what cancellation_rate below
-- tracks and what a future matching pipeline penalizes ranking with.

alter table bookings
  add column cancelled_at         timestamptz,
  add column cancelled_by         uuid references profiles (id),
  add column is_late_cancellation boolean;

comment on column bookings.is_late_cancellation is
  'True if this booking was cancelled less than 3 hours before start_at, '
  'regardless of who cancelled it or which path pushed it through.';

alter table tutor_profiles
  add column cancellation_rate numeric(5,4) not null default 0
    check (cancellation_rate between 0 and 1);

comment on column tutor_profiles.cancellation_rate is
  'Share of this tutor''s own finalized bookings (cancelled or completed) that '
  'the tutor cancelled less than 3 hours before start. Recomputed by '
  'trg_after_booking_cancellation. See lib/matching/score.ts (`reliability` '
  'factor = 1 - cancellation_rate) for how it is meant to feed ranking — that '
  'pipeline does not call computeMatch() with real data yet, so this is not wired '
  'end-to-end, only tracked.';

-- Used by the recompute query in after_booking_cancellation() below.
create index bookings_tutor_status_idx on bookings (tutor_id, status) where deleted_at is null;

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
    new.cancelled_by := coalesce(new.cancelled_by, auth.uid());
    new.is_late_cancellation := hours_left < 3;
  end if;
  return new;
end $$;

create trigger trg_enforce_cancellation_window
  before update on bookings
  for each row execute function enforce_cancellation_window();

-- ------------------------------------------------------------------ side effects
-- security definer: must write tutor_profiles / notifications regardless of
-- whether the caller who updated the booking (student or tutor) owns those rows.
create or replace function after_booking_cancellation() returns trigger
  security definer set search_path = public
  language plpgsql as $$
begin
  update tutor_profiles
  set cancellation_rate = coalesce(
    (select count(*) filter (where is_late_cancellation and cancelled_by = tutor_id)::numeric
            / nullif(count(*), 0)
     from bookings
     where tutor_id = new.tutor_id
       and status in ('cancelled', 'completed')
       and deleted_at is null),
    0
  )
  where user_id = new.tutor_id;

  -- Spec: an automatic rebooking-suggestion notice to the student, only for the
  -- case that actually reaches self-service — a tutor cancelling early enough.
  -- A late cancellation can only reach 'cancelled' via the admin/service-role
  -- override above, which is a human-handled support flow, not covered here.
  if new.status = 'cancelled' and new.cancelled_by = new.tutor_id then
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

create trigger trg_after_booking_cancellation
  after update of status on bookings
  for each row
  when (new.status is distinct from old.status and new.status in ('cancelled', 'completed'))
  execute function after_booking_cancellation();
