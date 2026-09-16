create policy "Users can upload own files" on storage.objects
  for insert with check (bucket_id = 'dokumentasi' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own files" on storage.objects
  for select using (bucket_id = 'dokumentasi' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own files" on storage.objects
  for delete using (bucket_id = 'dokumentasi' and auth.uid()::text = (storage.foldername(name))[1]);