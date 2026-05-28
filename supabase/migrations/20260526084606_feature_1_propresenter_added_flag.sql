-- Stage 6 needs a flag for "marked as added to ProPresenter."
-- Simple boolean column on graphics; defaults to false; not null.
alter table graphics
  add column propresenter_added boolean not null default false;

create policy "update_graphics_propresenter_flag" on graphics
  for update using (auth.role() = 'authenticated');
