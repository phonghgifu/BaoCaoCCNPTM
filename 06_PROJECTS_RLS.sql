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

-- Policy: Tất cả users có thể update projects (tuỳ chọn - nếu muốn restrict, xóa dòng này)
create policy "Any authenticated user can update projects"
on public.projects for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Policy: Tất cả users có thể delete projects (tuỳ chọn - nếu muốn restrict, xóa dòng này)
create policy "Any authenticated user can delete projects"
on public.projects for delete
using (auth.role() = 'authenticated');

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
