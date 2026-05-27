-- Feature 1: Storage bucket for lower-third images.
-- public read so the dashboard can render thumbnails without signed URLs;
-- authenticated write so only logged-in team members upload.

insert into storage.buckets (id, name, public)
values ('lower-thirds', 'lower-thirds', true)
on conflict (id) do nothing;

create policy "read_lower_thirds_public" on storage.objects
  for select
  using (bucket_id = 'lower-thirds');

create policy "upload_lower_thirds_authenticated" on storage.objects
  for insert
  with check (
    bucket_id = 'lower-thirds'
    and auth.role() = 'authenticated'
  );

create policy "update_lower_thirds_authenticated" on storage.objects
  for update
  using (
    bucket_id = 'lower-thirds'
    and auth.role() = 'authenticated'
  );

create policy "delete_lower_thirds_authenticated" on storage.objects
  for delete
  using (
    bucket_id = 'lower-thirds'
    and auth.role() = 'authenticated'
  );
