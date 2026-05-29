-- ============================================================
-- RLS POLICIES FOR PROJECTS TABLE
-- Chạy file này sau khi 04_PROJECTS_SCHEMA.sql đã execute
-- ============================================================

-- Enable RLS trên bảng projects
alter table public.projects enable row level security;
alter table public.project_likes enable row level security;

-- ============================================================
-- POLICIES CHO BẢNG PROJECTS
-- ============================================================

-- Policy: Mọi người có thể xem tất cả projects
create policy "Projects are viewable by everyone"
on public.projects for select
using (true);

-- Policy: Authenticated users có thể tạo projects
create policy "Authenticated users can create projects"
on public.projects for insert
with check (auth.role() = 'authenticated');

-- Policy: Chỉ chủ sở hữu mới có thể update project của mình
create policy "Owners can update their own projects"
on public.projects for update
using (auth.uid() = (select author_id from public.posts where id = project_id limit 1)) -- Giả định project liên kết với post, cần điều chỉnh
with check (auth.uid() = (select author_id from public.posts where id = project_id limit 1)); -- Cần thêm user_id vào bảng projects

-- Policy: Chỉ chủ sở hữu mới có thể delete project của mình
create policy "Owners can delete their own projects"
on public.projects for delete
using (auth.uid() = (select author_id from public.posts where id = project_id limit 1)); -- Cần thêm user_id vào bảng projects

-- ============================================================
-- POLICIES CHO BẢNG PROJECT_LIKES
-- ============================================================

-- Policy: Mọi người có thể xem project_likes
create policy "Project likes are viewable by everyone"
on public.project_likes for select
using (true);

-- Policy: Authenticated users có thể like projects
create policy "Authenticated users can like projects"
on public.project_likes for insert
with check (auth.uid() = user_id);

-- Policy: Users chỉ có thể unlike (delete) like của mình
create policy "Users can unlike their own likes"
on public.project_likes for delete
using (auth.uid() = user_id);

-- ============================================================
-- COMPLETE
-- ============================================================
