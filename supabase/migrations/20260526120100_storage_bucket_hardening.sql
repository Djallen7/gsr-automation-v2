-- Harden the lower-thirds storage bucket.
-- Previously: public read, no size cap, any mime type accepted.
-- Now: public read, authenticated write, 5 MB cap, PNG only.
-- Idempotent.

update storage.buckets
set
  public             = true,
  file_size_limit    = 5242880,                -- 5 MB
  allowed_mime_types = array['image/png']
where id = 'lower-thirds';

drop policy if exists "lower_thirds_public_read"          on storage.objects;
drop policy if exists "lower_thirds_authenticated_insert" on storage.objects;
drop policy if exists "lower_thirds_authenticated_update" on storage.objects;
drop policy if exists "lower_thirds_authenticated_delete" on storage.objects;

create policy "lower_thirds_public_read"
  on storage.objects for select to public
  using (bucket_id = 'lower-thirds');

create policy "lower_thirds_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'lower-thirds');

create policy "lower_thirds_authenticated_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'lower-thirds');

create policy "lower_thirds_authenticated_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'lower-thirds');
