-- Feature 1: Row-level security per FEATURE_1_LOWER_THIRDS.md
-- Prototype scope: all authenticated users can read everything and insert/update.
-- Tightened producer-only policies come later when the team grows.

alter table episodes enable row level security;
alter table graphics enable row level security;
alter table graphics_variations enable row level security;

create policy "read_all_authenticated" on episodes
  for select using (auth.role() = 'authenticated');
create policy "read_all_authenticated" on graphics
  for select using (auth.role() = 'authenticated');
create policy "read_all_authenticated" on graphics_variations
  for select using (auth.role() = 'authenticated');

create policy "insert_episodes_authenticated" on episodes
  for insert with check (auth.role() = 'authenticated');
create policy "insert_graphics_authenticated" on graphics
  for insert with check (auth.role() = 'authenticated');
create policy "insert_variations_authenticated" on graphics_variations
  for insert with check (auth.role() = 'authenticated');

create policy "update_episodes_authenticated" on episodes
  for update using (auth.role() = 'authenticated');
create policy "update_graphics_authenticated" on graphics
  for update using (auth.role() = 'authenticated');
