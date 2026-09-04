-- Coursly — initial schema.
-- Mirrors spec section 2. Every table has id/created_at/updated_at; tables where a
-- user can lose data get deleted_at (soft delete). RLS is enabled on every table
-- and policies are defined in 0002_rls.sql.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ enums
create type user_role as enum ('student', 'tutor', 'admin');
create type verification_status as enum ('pending', 'under_review', 'verified', 'rejected', 'suspended');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'disputed');
create type payment_status as enum ('pending', 'succeeded', 'refunded', 'failed');
create type material_visibility as enum ('private', 'student', 'public');
create type ai_generation_type as enum ('exercise', 'explanation', 'flashcards', 'lesson_summary');
create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- ------------------------------------------------------------------ helpers
create or replace function set_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Attaches created_at/updated_at behaviour to a table.
create or replace function attach_timestamps(tbl regclass) returns void
  language plpgsql as $$
begin
  execute format(
    'create trigger trg_updated_at before update on %s
       for each row execute function set_updated_at()', tbl);
end $$;

-- ------------------------------------------------------------------ identity
-- Supabase manages auth.users. `profiles` is our public mirror + app data.
create table profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  locale       text not null default 'et',
  -- array, not a scalar: one account may hold several roles later (spec section 61)
  roles        user_role[] not null default '{student}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create table student_profiles (
  user_id       uuid primary key references profiles (id) on delete cascade,
  date_of_birth date,
  parent_id     uuid references profiles (id),      -- parent account (post-MVP feature)
  survey        jsonb not null default '{}',        -- onboarding answers
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table tutor_profiles (
  user_id             uuid primary key references profiles (id) on delete cascade,
  slug                text unique,
  headline            text,
  bio                 text,
  price_hour          numeric(8,2),
  currency            text not null default 'EUR',
  response_time_avg   interval,
  verification_status verification_status not null default 'pending',
  trust_score         numeric(5,2) not null default 0,
  intro_video_url     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz
);

-- ------------------------------------------------------------------ taxonomy
create table subjects (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name_et    text not null,
  name_ru    text not null,
  name_en    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table languages (
  id   uuid primary key default gen_random_uuid(),
  code text unique not null   -- et, ru, en, fi, lv, lt
);

create table tutor_subjects (
  tutor_id   uuid not null references tutor_profiles (user_id) on delete cascade,
  subject_id uuid not null references subjects (id) on delete cascade,
  levels     text[] not null default '{}',
  primary key (tutor_id, subject_id)
);

create table tutor_languages (
  tutor_id    uuid not null references tutor_profiles (user_id) on delete cascade,
  language_id uuid not null references languages (id) on delete cascade,
  primary key (tutor_id, language_id)
);

create table tutor_availability (
  id        uuid primary key default gen_random_uuid(),
  tutor_id  uuid not null references tutor_profiles (user_id) on delete cascade,
  weekday   smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time   time not null,
  timezone   text not null default 'Europe/Tallinn',
  check (end_time > start_time)
);

-- ------------------------------------------------------------------ bookings & lessons
create table bookings (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references profiles (id),
  tutor_id     uuid not null references tutor_profiles (user_id),
  subject_id   uuid not null references subjects (id),
  start_at     timestamptz not null,
  duration_min smallint not null check (duration_min > 0),
  price_total  numeric(10,2) not null,
  status       booking_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);
create index on bookings (student_id);
create index on bookings (tutor_id);
create index on bookings (start_at);

create table lessons (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null unique references bookings (id) on delete cascade,
  classroom_room_id text,
  started_at        timestamptz,
  ended_at          timestamptz,
  recording_consent boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ------------------------------------------------------------------ money
create table platform_settings (
  id               boolean primary key default true check (id),   -- single row
  platform_fee_bps integer not null default 1500,                  -- 15%
  updated_at       timestamptz not null default now()
);
insert into platform_settings (id) values (true) on conflict do nothing;

create table payments (
  id                       uuid primary key default gen_random_uuid(),
  booking_id               uuid not null references bookings (id),
  stripe_payment_intent_id text unique,
  amount                   numeric(10,2) not null,
  platform_fee             numeric(10,2) not null,
  tutor_payout             numeric(10,2) not null,
  status                   payment_status not null default 'pending',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index on payments (booking_id);

-- ------------------------------------------------------------------ reviews
create table reviews (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id),
  author_id  uuid not null references profiles (id),
  target_id  uuid not null references profiles (id),
  rating     smallint not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id, author_id)
);

-- ------------------------------------------------------------------ messaging
create table conversations (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id),
  tutor_id   uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, tutor_id)
);

create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  sender_id       uuid not null references profiles (id),
  body            text,
  attachment_url  text,
  created_at      timestamptz not null default now()
);
create index on messages (conversation_id, created_at);

-- ------------------------------------------------------------------ homework & materials (post-MVP tables, defined now)
create table homework (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings (id),
  tutor_id    uuid not null references profiles (id),
  student_id  uuid not null references profiles (id),
  title       text not null,
  description text,
  due_date    timestamptz,
  attachments jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create table homework_submissions (
  id             uuid primary key default gen_random_uuid(),
  homework_id    uuid not null references homework (id) on delete cascade,
  student_id     uuid not null references profiles (id),
  answer_text    text,
  attachment_url text,
  score          numeric(5,2),
  feedback       text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table materials (
  id         uuid primary key default gen_random_uuid(),
  tutor_id   uuid not null references profiles (id),
  subject_id uuid references subjects (id),
  title      text not null,
  file_url   text not null,
  visibility material_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  booking_id uuid references bookings (id),
  body       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ------------------------------------------------------------------ goals & progress (post-MVP)
create table goals (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references profiles (id) on delete cascade,
  subject_id   uuid not null references subjects (id),
  target_score numeric(6,2),
  current_score numeric(6,2),
  deadline     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table progress (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id) on delete cascade,
  subject_id  uuid not null references subjects (id),
  metric      text not null,
  value       numeric(10,2) not null,
  recorded_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ ops
create table notifications (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type    text not null,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id),
  target_id   uuid not null references profiles (id),
  reason      text not null,
  status      report_status not null default 'open',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table verification_requests (
  id           uuid primary key default gen_random_uuid(),
  tutor_id     uuid not null references tutor_profiles (user_id) on delete cascade,
  document_url text,               -- purged by a job after review (GDPR, spec section 33)
  status       verification_status not null default 'pending',
  reviewed_by  uuid references profiles (id),
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------------ AI (out of MVP; schema records the model for honest labelling)
create table ai_summaries (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid not null references lessons (id) on delete cascade,
  content    jsonb not null,
  model      text not null,
  created_at timestamptz not null default now()
);

create table ai_generations (
  id           uuid primary key default gen_random_uuid(),
  requested_by uuid not null references profiles (id),
  type         ai_generation_type not null,
  input        jsonb not null,
  output       jsonb,
  model        text not null,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------------ updated_at triggers
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','student_profiles','tutor_profiles','subjects','bookings','lessons',
    'payments','reviews','conversations','homework','homework_submissions','materials',
    'notes','goals','progress','reports','verification_requests'
  ] loop
    execute format(
      'create trigger trg_updated_at before update on %I
         for each row execute function set_updated_at()', t);
  end loop;
end $$;
