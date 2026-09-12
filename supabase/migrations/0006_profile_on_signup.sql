-- Coursly — create a public.profiles row for every auth user.
--
-- Nothing did this before: `profiles.id` references `auth.users(id)` but there
-- was no trigger, and `profiles` has no INSERT policy, so the app can't create
-- its own row. Chat needs it — `conversations.student_id` / `tutor_id` FK to
-- `profiles(id)`, so a brand-new user can't start (or be in) a conversation
-- until their profile row exists.
--
-- Standard Supabase pattern: SECURITY DEFINER trigger on auth.users.

create or replace function handle_new_user() returns trigger
  security definer set search_path = public
  language plpgsql as $$
begin
  insert into profiles (id, email, full_name, avatar_url, locale)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'locale', ''), 'et')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill anyone who already signed up (the test accounts, etc.).
insert into profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  nullif(u.raw_user_meta_data ->> 'full_name', ''),
  nullif(u.raw_user_meta_data ->> 'avatar_url', '')
from auth.users u
on conflict (id) do nothing;
