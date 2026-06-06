create extension if not exists pgcrypto;

create table if not exists public.readiness_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_type text not null,
  target_role text not null,
  confidence_level integer not null,
  biggest_challenge text not null,
  linkedin_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.communication_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_type text,
  target_role text,
  communication_score integer,
  clarity_score integer,
  confidence_score integer,
  structure_score integer,
  professional_presence_score integer,
  strength text,
  improvement_area text,
  is_preview boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists readiness_profiles_user_created_idx
  on public.readiness_profiles(user_id, created_at desc);

create index if not exists communication_reports_user_created_idx
  on public.communication_reports(user_id, created_at desc);

alter table public.readiness_profiles enable row level security;
alter table public.communication_reports enable row level security;

drop policy if exists "Users can insert own readiness profile" on public.readiness_profiles;
create policy "Users can insert own readiness profile"
on public.readiness_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can read own readiness profiles" on public.readiness_profiles;
create policy "Users can read own readiness profiles"
on public.readiness_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read own communication reports" on public.communication_reports;
create policy "Users can read own communication reports"
on public.communication_reports
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert own communication reports" on public.communication_reports;
create policy "Users can insert own communication reports"
on public.communication_reports
for insert
to authenticated
with check (user_id = auth.uid());
