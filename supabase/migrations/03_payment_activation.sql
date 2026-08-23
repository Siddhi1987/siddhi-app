-- Fix 3 — Payment activation plumbing (run in Supabase SQL editor).
-- 1) Make the subscription upsert idempotent (unique on razorpay_order_id).
-- 2) Upgrade the signup trigger so it ALSO claims a subscription paid before the account existed.
-- Safe/additive. Run STEP A then STEP B.

-- ───────────────────────────────────────────────────────────────────────────
-- STEP A — unique constraint so verify-payment / webhook upserts don't duplicate.
-- (NULLs are allowed and don't conflict, so existing rows are unaffected.)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_razorpay_order_id_key'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_razorpay_order_id_key unique (razorpay_order_id);
  end if;
end $$;

-- ───────────────────────────────────────────────────────────────────────────
-- STEP B — signup trigger: create the public.users row AND link any pending subscription
--          that was paid (by email) before the account existed.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- create the profile row (id = auth.uid()); never break signup on conflict
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
    null;
  end;

  -- claim a subscription that was paid before this account was created (guest -> signup)
  begin
    update public.subscriptions
       set user_id = new.id, updated_at = now()
     where user_id is null
       and lower(email) = lower(new.email);
  exception when others then
    null;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
