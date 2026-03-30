-- 1. Add game column to leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS game text;

-- 2. Storage Buckets Setup
-- You might have to run this in the SQL editor since storage buckets aren't created by standard table scripts.
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public Access" 
  on storage.objects for select 
  using ( bucket_id = 'images' );

create policy "Auth Insert" 
  on storage.objects for insert 
  with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Auth Update" 
  on storage.objects for update 
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Auth Delete" 
  on storage.objects for delete 
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );
