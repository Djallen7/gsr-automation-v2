-- RBAC roles + PII table lockdown
--
-- STATUS: NOT YET APPLIED. Review and test on a Supabase BRANCH (sign in as each role,
-- confirm an 'editor' is denied guest PII) before merging/applying to production.
--
-- Why: today every sensitive table uses USING(true), so ANY authenticated user can read
-- all 175 guest contacts (PII), booking pipeline, outreach drafts, and email threads.
-- Only 2 accounts exist right now (both Daniel's) and both become 'producer', so applying
-- this cannot lock anyone out. It puts the gate in place BEFORE crew/editor accounts exist.
--
-- Design: deny-by-default. A user with no row in user_roles gets NOTHING. Production-workflow
-- tables (episodes, graphics, distributions, etc.) are intentionally left as authenticated
-- for now; role-scoping those is a follow-up once editor accounts actually exist.
-- All statements are idempotent.

-- 1. Role registry -----------------------------------------------------------------
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('producer','co_producer','editor')),
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;
grant select on public.user_roles to authenticated;

-- 2. Role helpers (SECURITY DEFINER so they read user_roles without recursing through RLS)
create or replace function public.current_role()
returns text
language sql stable security definer set search_path = ''
as $$
  select role from public.user_roles where user_id = (select auth.uid());
$$;

create or replace function public.is_at_least(min_role text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select case (select role from public.user_roles where user_id = (select auth.uid()))
    when 'producer'    then true
    when 'co_producer' then min_role in ('co_producer','editor')
    when 'editor'      then min_role = 'editor'
    else false                       -- no role row => deny by default
  end;
$$;

grant execute on function public.current_role() to authenticated;
grant execute on function public.is_at_least(text) to authenticated;

-- 3. user_roles policies: read your own row; only producers manage roles ------------
drop policy if exists user_roles_read_own on public.user_roles;
create policy user_roles_read_own on public.user_roles
  for select using ((select auth.uid()) = user_id or public.is_at_least('producer'));

drop policy if exists user_roles_admin on public.user_roles;
create policy user_roles_admin on public.user_roles
  for all using (public.is_at_least('producer')) with check (public.is_at_least('producer'));

-- 4. Seed existing accounts (both are Daniel's) as producer. Keyed by email so portable.
insert into public.user_roles (user_id, role)
select id, 'producer' from auth.users
where email in ('danielallen.tn@gmail.com','dallen@davidrives.com')
on conflict (user_id) do update set role = excluded.role;

-- TEMPLATE — add teammates as they get accounts (uncomment + edit email):
--   insert into public.user_roles (user_id, role)
--   select id, 'co_producer' from auth.users where email = 'REPLACE_ME'
--   on conflict (user_id) do update set role = excluded.role;
-- Use 'editor' for shoot-day crew — the policies below deny editors all guest PII + booking.

-- 5. Lock down PII / private tables to co_producer+ (editors denied) ----------------
-- Clean slate per table (drops whatever permissive policy names exist today), then
-- recreate standardized role-gated policies.
do $$
declare
  tbl text;
  pol record;
  sensitive text[] := array['guests','booking_pipeline','outreach_drafts','email_threads','interview_prep'];
begin
  foreach tbl in array sensitive loop
    for pol in select policyname from pg_policies where schemaname='public' and tablename=tbl loop
      execute format('drop policy if exists %I on public.%I', pol.policyname, tbl);
    end loop;
    execute format($f$create policy %I on public.%I for select using (public.is_at_least('co_producer'))$f$,
                   tbl||'_select_coproducer', tbl);
    execute format($f$create policy %I on public.%I for insert with check (public.is_at_least('co_producer'))$f$,
                   tbl||'_insert_coproducer', tbl);
    execute format($f$create policy %I on public.%I for update using (public.is_at_least('co_producer')) with check (public.is_at_least('co_producer'))$f$,
                   tbl||'_update_coproducer', tbl);
    execute format($f$create policy %I on public.%I for delete using (public.is_at_least('producer'))$f$,
                   tbl||'_delete_producer', tbl);
  end loop;
end $$;
