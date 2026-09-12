-- Coursly — chat: realtime, sender integrity, conversation freshness, and a
-- narrow accessor for a conversation partner's display fields.
--
-- The participants-only RLS on conversations/messages already exists in
-- 0002_rls.sql and is NOT changed here except point (e). This migration adds:
--
--   a) messages -> supabase_realtime publication, so the thread view can
--      subscribe to INSERTs. INSERT-only, so no REPLICA IDENTITY change needed.
--   b) BEFORE INSERT on messages: sender_id is always auth.uid(), never taken
--      from the request payload (same rule as bookings.cancelled_by in 0004).
--   c) AFTER INSERT on messages: bump conversations.updated_at so the list
--      re-sorts by most-recent. SECURITY DEFINER because participants have no
--      (and should not have) an UPDATE policy on conversations.
--   d) conversation_partner(conv_id): SECURITY DEFINER function returning ONLY
--      id / full_name / avatar_url / locale of the OTHER party, and only to a
--      participant. `profiles` RLS otherwise hides a student's row from their
--      tutor; this avoids widening that row-level policy (which would also
--      expose email).
--   e) tighten "conversations: create": student-initiated only, and the target
--      must be a verified tutor. Stops empty/spam conversations against
--      arbitrary profile ids. A tutor replies by inserting into messages, not
--      by creating conversations.
--
-- END-TO-END TEST PRECONDITION: the test tutor (user_id
-- f6d5e187-cf75-4058-a828-a3bb5e01f673) must have
-- tutor_profiles.verification_status = 'verified', or (e) blocks the
-- conversation and (d) has nothing to return. If it is still 'pending':
--   update tutor_profiles set verification_status = 'verified'
--   where user_id = 'f6d5e187-cf75-4058-a828-a3bb5e01f673';

-- a) ---------------------------------------------------------------- realtime
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'messages'
     )
  then
    execute 'alter publication supabase_realtime add table messages';
  end if;
end $$;

-- b) ------------------------------------------------------ sender_id integrity
-- Strict, like bookings.cancelled_by: the client never sets the sender. A
-- service-role insert would get sender_id = NULL and fail the NOT NULL
-- constraint — intentional; there is no system-message path yet.
create or replace function set_message_sender() returns trigger
  language plpgsql as $$
begin
  new.sender_id := auth.uid();
  return new;
end $$;

drop trigger if exists trg_set_message_sender on messages;
create trigger trg_set_message_sender
  before insert on messages
  for each row execute function set_message_sender();

-- c) --------------------------------------------------- conversation freshness
create or replace function bump_conversation_on_message() returns trigger
  security definer set search_path = public
  language plpgsql as $$
begin
  update conversations set updated_at = now() where id = new.conversation_id;
  return new;
end $$;

drop trigger if exists trg_bump_conversation_on_message on messages;
create trigger trg_bump_conversation_on_message
  after insert on messages
  for each row execute function bump_conversation_on_message();

-- d) ------------------------------------------- partner display fields (narrow)
create or replace function conversation_partner(conv_id uuid)
  returns table (id uuid, full_name text, avatar_url text, locale text)
  security definer set search_path = public
  language sql stable as $$
  select p.id, p.full_name, p.avatar_url, p.locale
  from conversations c
  join profiles p
    on p.id = case
      when c.student_id = auth.uid() then c.tutor_id
      when c.tutor_id   = auth.uid() then c.student_id
    end
  where c.id = conv_id
    and (c.student_id = auth.uid() or c.tutor_id = auth.uid())
    and p.deleted_at is null;
$$;

revoke all on function conversation_partner(uuid) from public;
grant execute on function conversation_partner(uuid) to authenticated;

-- e) --------------------------------------------- tighten conversation creation
drop policy if exists "conversations: create" on conversations;
create policy "conversations: create" on conversations for insert
  with check (
    student_id = auth.uid()
    and exists (
      select 1 from tutor_profiles tp
      where tp.user_id = tutor_id
        and tp.verification_status = 'verified'
        and tp.deleted_at is null
    )
  );
