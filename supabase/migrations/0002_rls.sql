-- Coursly — Row Level Security.
-- Principle (spec): a student sees only their own bookings/messages/homework; a tutor
-- sees only students they have an ACTIVE relationship with (a confirmed/completed
-- booking). Everything money- or access-related is also re-checked server-side.

-- ------------------------------------------------------------------ role helpers
create or replace function auth_has_role(r user_role) returns boolean
  language sql stable as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and r = any (roles) and deleted_at is null
  );
$$;

create or replace function is_admin() returns boolean
  language sql stable as $$ select auth_has_role('admin'); $$;

-- Does the current user (as tutor) have an active relationship with this student?
create or replace function tutor_has_student(student uuid) returns boolean
  language sql stable as $$
  select exists (
    select 1 from bookings b
    where b.tutor_id = auth.uid()
      and b.student_id = student
      and b.status in ('confirmed', 'completed')
      and b.deleted_at is null
  );
$$;

-- ------------------------------------------------------------------ enable RLS everywhere
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','student_profiles','tutor_profiles','subjects','languages',
    'tutor_subjects','tutor_languages','tutor_availability','bookings','lessons',
    'platform_settings','payments','reviews','conversations','messages','homework',
    'homework_submissions','materials','notes','goals','progress','notifications',
    'reports','verification_requests','ai_summaries','ai_generations'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
  end loop;
end $$;

-- ------------------------------------------------------------------ profiles
create policy "profiles: self read"      on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles: public tutor"   on profiles for select using (
  exists (select 1 from tutor_profiles tp
          where tp.user_id = profiles.id and tp.verification_status = 'verified')
);
create policy "profiles: self update"    on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: admin write"    on profiles for all    using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ student_profiles
create policy "student_profiles: owner"  on student_profiles for all
  using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid() or is_admin());

-- ------------------------------------------------------------------ tutor_profiles
create policy "tutor_profiles: public verified" on tutor_profiles for select
  using (verification_status = 'verified' or user_id = auth.uid() or is_admin());
create policy "tutor_profiles: owner write"     on tutor_profiles for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tutor_profiles: owner insert"    on tutor_profiles for insert
  with check (user_id = auth.uid());
create policy "tutor_profiles: admin"           on tutor_profiles for all
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ taxonomy (public read, admin write)
create policy "subjects: read"   on subjects   for select using (true);
create policy "subjects: admin"  on subjects   for all    using (is_admin()) with check (is_admin());
create policy "languages: read"  on languages  for select using (true);
create policy "languages: admin" on languages  for all    using (is_admin()) with check (is_admin());

-- tutor_subjects / tutor_languages / tutor_availability: public read, owner write
do $$
declare t text;
begin
  foreach t in array array['tutor_subjects','tutor_languages','tutor_availability'] loop
    execute format($f$
      create policy "%1$s: read" on %1$I for select using (true);
      create policy "%1$s: owner" on %1$I for all
        using (tutor_id = auth.uid() or is_admin())
        with check (tutor_id = auth.uid() or is_admin());
    $f$, t);
  end loop;
end $$;

-- ------------------------------------------------------------------ bookings
create policy "bookings: participants read" on bookings for select
  using (student_id = auth.uid() or tutor_id = auth.uid() or is_admin());
create policy "bookings: student creates"   on bookings for insert
  with check (student_id = auth.uid());
-- status transitions happen through Edge Functions (service role); tutors/students
-- may only touch their own row for limited fields — enforced in the function layer.
create policy "bookings: participants update" on bookings for update
  using (student_id = auth.uid() or tutor_id = auth.uid())
  with check (student_id = auth.uid() or tutor_id = auth.uid());
create policy "bookings: admin" on bookings for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ lessons
create policy "lessons: participants" on lessons for select using (
  exists (select 1 from bookings b where b.id = lessons.booking_id
          and (b.student_id = auth.uid() or b.tutor_id = auth.uid()))
  or is_admin()
);

-- ------------------------------------------------------------------ platform_settings
create policy "platform_settings: read"  on platform_settings for select using (true);
create policy "platform_settings: admin" on platform_settings for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ payments (read-only to participants; writes via service role)
create policy "payments: participants read" on payments for select using (
  exists (select 1 from bookings b where b.id = payments.booking_id
          and (b.student_id = auth.uid() or b.tutor_id = auth.uid()))
  or is_admin()
);

-- ------------------------------------------------------------------ reviews
create policy "reviews: public read"   on reviews for select using (true);
create policy "reviews: author writes" on reviews for insert with check (
  author_id = auth.uid()
  and exists (select 1 from bookings b where b.id = booking_id
              and b.status = 'completed'
              and (b.student_id = auth.uid() or b.tutor_id = auth.uid()))
);
create policy "reviews: author edits"  on reviews for update
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "reviews: admin"         on reviews for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ conversations & messages
create policy "conversations: participants" on conversations for select
  using (student_id = auth.uid() or tutor_id = auth.uid() or is_admin());
create policy "conversations: create"       on conversations for insert
  with check (student_id = auth.uid() or tutor_id = auth.uid());

create policy "messages: participants read" on messages for select using (
  exists (select 1 from conversations c where c.id = messages.conversation_id
          and (c.student_id = auth.uid() or c.tutor_id = auth.uid()))
  or is_admin()
);
create policy "messages: sender writes" on messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from conversations c where c.id = conversation_id
              and (c.student_id = auth.uid() or c.tutor_id = auth.uid()))
);

-- ------------------------------------------------------------------ homework (post-MVP)
create policy "homework: parties read" on homework for select
  using (student_id = auth.uid() or tutor_id = auth.uid() or is_admin());
create policy "homework: tutor writes" on homework for all
  using (tutor_id = auth.uid() and tutor_has_student(student_id))
  with check (tutor_id = auth.uid() and tutor_has_student(student_id));

create policy "hw_submissions: parties read" on homework_submissions for select using (
  student_id = auth.uid()
  or exists (select 1 from homework h where h.id = homework_id and h.tutor_id = auth.uid())
  or is_admin()
);
create policy "hw_submissions: student writes" on homework_submissions for insert
  with check (student_id = auth.uid());
create policy "hw_submissions: tutor grades" on homework_submissions for update using (
  exists (select 1 from homework h where h.id = homework_id and h.tutor_id = auth.uid())
);

-- ------------------------------------------------------------------ materials
create policy "materials: visibility" on materials for select using (
  visibility = 'public'
  or tutor_id = auth.uid()
  or (visibility = 'student' and tutor_has_student(auth.uid()))
  or is_admin()
);
create policy "materials: owner write" on materials for all
  using (tutor_id = auth.uid()) with check (tutor_id = auth.uid());

-- ------------------------------------------------------------------ notes / goals / progress (owner-scoped)
create policy "notes: owner" on notes for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "goals: student + their tutors" on goals for select using (
  student_id = auth.uid() or tutor_has_student(student_id) or is_admin()
);
create policy "goals: student writes" on goals for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "progress: student + their tutors" on progress for select using (
  student_id = auth.uid() or tutor_has_student(student_id) or is_admin()
);
create policy "progress: student writes" on progress for insert with check (student_id = auth.uid());

-- ------------------------------------------------------------------ notifications
create policy "notifications: owner" on notifications for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ------------------------------------------------------------------ reports
create policy "reports: reporter reads" on reports for select
  using (reporter_id = auth.uid() or is_admin());
create policy "reports: anyone files"   on reports for insert with check (reporter_id = auth.uid());
create policy "reports: admin"          on reports for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ verification_requests
create policy "verification: owner reads" on verification_requests for select
  using (tutor_id = auth.uid() or is_admin());
create policy "verification: owner files" on verification_requests for insert
  with check (tutor_id = auth.uid());
create policy "verification: admin"       on verification_requests for all
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------ AI tables
create policy "ai_summaries: lesson parties" on ai_summaries for select using (
  exists (select 1 from lessons l join bookings b on b.id = l.booking_id
          where l.id = ai_summaries.lesson_id
            and (b.student_id = auth.uid() or b.tutor_id = auth.uid()))
  or is_admin()
);
create policy "ai_generations: requester" on ai_generations for select
  using (requested_by = auth.uid() or is_admin());
