-- Fix 2 — Identity: guarantee a public.users row with id = auth.users.id
--
-- WHY: subscriptions.user_id is a FK to public.users(id). RLS is (user_id = auth.uid())
-- and the app reads by auth.uid(). So a paid user only works if a public.users row exists
-- with id = auth.uid(). Today only 1 of 3 auth users has one (2 orphans).
--
-- SAFE BY DESIGN: the trigger catches any unique conflict and skips (it will NOT break
-- signups even if your app also inserts a users row). The backfill only touches accounts
-- with no matching row and no email clash. No deletes, no id changes to existing rows.
-- You can run STEP 1 + STEP 2 together.

-- ───────────────────────────────────────────────────────────────────────────
-- STEP 1 — Trigger: every new auth user gets a matching public.users row (id = auth.uid()).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.users (id, email, name)
    values (
      new.id,
      new.email,
      coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
      )
    );
  exception when unique_violation then
    -- A row already exists for this id or email; leave it untouched. Never blocks signup.
    null;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────────────────────────────────────────────────────────
-- STEP 2 — Backfill existing orphaned auth users (only where NO id row AND NO email row).
insert into public.users (id, email)
select a.id, a.email
from auth.users a
where not exists (select 1 from public.users u  where u.id = a.id)
  and not exists (select 1 from public.users u2 where u2.email = a.email);

-- ───────────────────────────────────────────────────────────────────────────
-- STEP 3 — Verify (read-only). Run this after; expect orphan_auth_users = 0.
select
  (select count(*) from auth.users) as auth_users,
  (select count(*) from public.users) as public_users,
  (select count(*) from auth.users a
     where not exists (select 1 from public.users u where u.id = a.id)) as orphan_auth_users;
