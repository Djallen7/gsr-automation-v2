-- Baseline RLS policies for the GSR dashboard.
-- Captures the state previously documented only in FEATURE_1_LOWER_THIRDS.md.
-- Idempotent: safe to re-run.

alter table public.episodes              enable row level security;
alter table public.graphics              enable row level security;
alter table public.graphics_variations   enable row level security;

-- episodes
drop policy if exists "read_all_authenticated"      on public.episodes;
drop policy if exists "insert_episodes_authenticated" on public.episodes;
drop policy if exists "update_episodes_authenticated" on public.episodes;

create policy "read_all_authenticated"
  on public.episodes for select
  using (auth.role() = 'authenticated');

create policy "insert_episodes_authenticated"
  on public.episodes for insert
  with check (auth.role() = 'authenticated');

create policy "update_episodes_authenticated"
  on public.episodes for update
  using (auth.role() = 'authenticated');

-- graphics
drop policy if exists "read_all_authenticated"          on public.graphics;
drop policy if exists "insert_graphics_authenticated"   on public.graphics;
drop policy if exists "update_graphics_authenticated"   on public.graphics;
drop policy if exists "update_graphics_propresenter_flag" on public.graphics;

create policy "read_all_authenticated"
  on public.graphics for select
  using (auth.role() = 'authenticated');

create policy "insert_graphics_authenticated"
  on public.graphics for insert
  with check (auth.role() = 'authenticated');

create policy "update_graphics_authenticated"
  on public.graphics for update
  using (auth.role() = 'authenticated');

-- graphics_variations
drop policy if exists "read_all_authenticated"          on public.graphics_variations;
drop policy if exists "insert_variations_authenticated" on public.graphics_variations;

create policy "read_all_authenticated"
  on public.graphics_variations for select
  using (auth.role() = 'authenticated');

create policy "insert_variations_authenticated"
  on public.graphics_variations for insert
  with check (auth.role() = 'authenticated');
