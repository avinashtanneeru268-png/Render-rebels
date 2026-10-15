-- 0003_storage.sql: Private inspection-media bucket configuration
insert into storage.buckets (id, name, public)
values ('inspection-media', 'inspection-media', false)
on conflict (id) do nothing;

-- Media owner policies based on folder path '<user_id>/...'
drop policy if exists "media_owner_read" on storage.objects;
create policy "media_owner_read" on storage.objects for select
  using (bucket_id = 'inspection-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "media_owner_write" on storage.objects;
create policy "media_owner_write" on storage.objects for insert
  with check (bucket_id = 'inspection-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "media_owner_delete" on storage.objects;
create policy "media_owner_delete" on storage.objects for delete
  using (bucket_id = 'inspection-media' and (storage.foldername(name))[1] = auth.uid()::text);
