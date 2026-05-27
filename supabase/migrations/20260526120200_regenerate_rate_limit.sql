-- Per-user rate limiting for /api/regenerate.
-- Each successful Anthropic call inserts a row. The route checks count over
-- a rolling window before issuing the next call.

create table if not exists public.regenerate_attempts (
  id          bigserial    primary key,
  user_id     uuid         not null references auth.users(id) on delete cascade,
  graphic_id  uuid         not null,
  created_at  timestamptz  not null default now()
);

create index if not exists regenerate_attempts_user_created_idx
  on public.regenerate_attempts (user_id, created_at desc);

alter table public.regenerate_attempts enable row level security;

drop policy if exists "read_own_regenerate_attempts"   on public.regenerate_attempts;
drop policy if exists "insert_own_regenerate_attempts" on public.regenerate_attempts;

create policy "read_own_regenerate_attempts"
  on public.regenerate_attempts for select
  using (auth.uid() = user_id);

create policy "insert_own_regenerate_attempts"
  on public.regenerate_attempts for insert
  with check (auth.uid() = user_id);
