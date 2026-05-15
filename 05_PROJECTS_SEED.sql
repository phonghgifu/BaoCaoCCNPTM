-- PROJECTS SEED DATA
-- Chạy file này trong Supabase SQL Editor sau khi đã tạo bảng projects và project_likes

-- Bật RLS và thêm policies tối thiểu để portfolio hoạt động
alter table public.projects enable row level security;
alter table public.project_likes enable row level security;

drop policy if exists "Projects are viewable by everyone" on public.projects;
drop policy if exists "Anyone can create projects" on public.projects;
drop policy if exists "Anyone can update projects" on public.projects;
drop policy if exists "Anyone can delete projects" on public.projects;
drop policy if exists "Project likes are viewable by everyone" on public.project_likes;
drop policy if exists "Authenticated users can like projects" on public.project_likes;
drop policy if exists "Users can remove their own project likes" on public.project_likes;

create policy "Projects are viewable by everyone"
on public.projects for select
using (true);

create policy "Anyone can create projects"
on public.projects for insert
with check (true);

create policy "Anyone can update projects"
on public.projects for update
using (true)
with check (true);

create policy "Anyone can delete projects"
on public.projects for delete
using (true);

create policy "Project likes are viewable by everyone"
on public.project_likes for select
using (true);

create policy "Authenticated users can like projects"
on public.project_likes for insert
with check (auth.uid() = user_id);

create policy "Users can remove their own project likes"
on public.project_likes for delete
using (auth.uid() = user_id);

insert into public.projects (title, description, technologies, image, link) values
(
  'Hệ Thống Quản Lý Blog',
  'Một ứng dụng web full-stack xây dựng với Next.js, TypeScript và Supabase. Có tính năng xác thực, quản lý bài viết, bình luận và tương tác cộng đồng.',
  array['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  '🎯',
  null
),
(
  'Ứng Dụng Quản Lý Công Việc',
  'Ứng dụng To-Do list hiện đại với kéo-thả, lưu dữ liệu và giao diện tối/sáng.',
  array['React', 'Drag & Drop', 'Local Storage', 'CSS Modules'],
  '✅',
  null
),
(
  'E-Commerce Platform',
  'Nền tảng thương mại điện tử đầy đủ với giỏ hàng, thanh toán, quản lý sản phẩm và đơn hàng.',
  array['React', 'Node.js', 'MongoDB', 'Stripe', 'Express'],
  '🛒',
  null
),
(
  'Dashboard Phân Tích Dữ Liệu',
  'Dashboard hiển thị metrics quan trọng, biểu đồ và thống kê doanh số bán hàng.',
  array['React', 'Chart.js', 'D3.js', 'API REST'],
  '📊',
  null
),
(
  'Ứng Dụng Mạng Xã Hội Mini',
  'Mạng xã hội đơn giản với khả năng đăng bài, like, bình luận, follow người dùng và tin nhắn trực tiếp.',
  array['React Native', 'Firebase', 'Redux', 'Socket.io'],
  '👥',
  null
),
(
  'Trang Web Du Lịch',
  'Website du lịch đẹp mắt với danh sách điểm đến, thông tin chi tiết, đặt tour và hệ thống review.',
  array['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
  '✈️',
  null
)
on conflict do nothing;