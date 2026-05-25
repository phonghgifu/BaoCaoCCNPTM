-- ============================================================
-- STORAGE BUCKETS FOR AVATAR + THUMBNAIL UPLOADS
-- Bucket dùng chung blog-images với 2 folder chuẩn:
-- - avatars/{user_id}/...
-- - thumbnails/{user_id}/...
-- ============================================================

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images"
on storage.objects for select
using (bucket_id = 'blog-images');

drop policy if exists "Authenticated users can upload blog images" on storage.objects;
create policy "Authenticated users can upload blog images"
on storage.objects for insert
with check (
  bucket_id = 'blog-images'
  and auth.role() = 'authenticated'
  and split_part(name, '/', 2) = auth.uid()::text
);

drop policy if exists "Users can update their own blog images" on storage.objects;
create policy "Users can update their own blog images"
on storage.objects for update
using (
  bucket_id = 'blog-images'
  and split_part(name, '/', 2) = auth.uid()::text
)
with check (
  bucket_id = 'blog-images'
  and split_part(name, '/', 2) = auth.uid()::text
);

drop policy if exists "Users can delete their own blog images" on storage.objects;
create policy "Users can delete their own blog images"
on storage.objects for delete
using (
  bucket_id = 'blog-images'
  and split_part(name, '/', 2) = auth.uid()::text
);