-- ============================================================
-- EXTRA TOPIC POSTS SEED DATA
-- Bổ sung thêm 2 bài/chủ đề (Next.js, Supabase, UI/UX, Portfolio, SEO)
-- Chạy file này trong Supabase SQL Editor sau 07_TOPIC_POSTS_SEED.sql
-- ============================================================

with author_profile as (
  select id
  from public.profiles
  order by created_at asc
  limit 1
),
extra_posts(title, slug, excerpt, content) as (
  values
    (
      'Server Actions trong Next.js: khi nào nên dùng?',
      'server-actions-trong-nextjs-khi-nao-nen-dung',
      'So sánh Server Actions với API Route để xử lý form hiệu quả.',
      'Bài viết phân tích ưu và nhược điểm của Server Actions trong Next.js, cách validate dữ liệu và xử lý lỗi khi submit form.'
    ),
    (
      'Next.js caching và revalidation thực chiến',
      'nextjs-caching-va-revalidation-thuc-chien',
      'Hiểu rõ cache, revalidate và no-store trong dự án thật.',
      'Chúng ta sẽ đi qua các chiến lược caching trong Next.js và cách chọn revalidation phù hợp cho trang nội dung cập nhật thường xuyên.'
    ),
    (
      'Debug lỗi RLS trong Supabase nhanh và đúng',
      'debug-loi-rls-trong-supabase-nhanh-va-dung',
      'Checklist xử lý lỗi policy khi insert/update dữ liệu.',
      'Bài viết đưa ra quy trình debug RLS trong Supabase: kiểm tra auth.uid(), policy using/with check và test bằng SQL Editor.'
    ),
    (
      'Supabase Realtime cho bình luận trực tiếp',
      'supabase-realtime-cho-binh-luan-truc-tiep',
      'Cập nhật comment realtime mà không cần refresh trang.',
      'Hướng dẫn cấu hình Supabase Realtime để đồng bộ bình luận theo thời gian thực và tránh duplicate event ở phía client.'
    ),
    (
      'UI/UX cho mobile: tối ưu tap target và spacing',
      'ui-ux-cho-mobile-toi-uu-tap-target-va-spacing',
      'Những lỗi phổ biến khi thiết kế mobile và cách sửa nhanh.',
      'Bài viết tổng hợp các nguyên tắc UI/UX cho mobile như kích thước tap target, khoảng cách thao tác và hierarchy dễ đọc trên màn hình nhỏ.'
    ),
    (
      'Thiết kế hệ thống màu UI/UX nhất quán',
      'thiet-ke-he-thong-mau-ui-ux-nhat-quan',
      'Xây dựng palette và semantic color token để scale giao diện.',
      'Chúng ta áp dụng color tokens trong UI/UX để đồng nhất trạng thái success, warning, error và tối ưu contrast ở cả light/dark mode.'
    ),
    (
      'Portfolio README giúp tăng sức thuyết phục',
      'portfolio-readme-giup-tang-suc-thuyet-phuc',
      'Cách viết README cho mỗi dự án portfolio dễ hiểu và chuyên nghiệp.',
      'Bài viết hướng dẫn cấu trúc README cho portfolio gồm mục tiêu, kiến trúc, cách chạy và bài học rút ra sau khi triển khai.'
    ),
    (
      'Case study trong portfolio: viết sao cho nổi bật?',
      'case-study-trong-portfolio-viet-sao-cho-noi-bat',
      'Biến một project thành case study có số liệu và giá trị rõ ràng.',
      'Hướng dẫn trình bày case study trong portfolio theo cấu trúc problem-solution-impact để tạo ấn tượng mạnh khi phỏng vấn.'
    ),
    (
      'SEO audit nhanh cho website cá nhân',
      'seo-audit-nhanh-cho-website-ca-nhan',
      'Danh sách kiểm tra SEO kỹ thuật trước khi deploy production.',
      'Bài viết cung cấp quy trình SEO audit gồm indexability, canonical, metadata và tốc độ tải trang để cải thiện hiệu quả tìm kiếm.'
    ),
    (
      'Tối ưu Core Web Vitals để cải thiện SEO',
      'toi-uu-core-web-vitals-de-cai-thien-seo',
      'LCP, CLS, INP ảnh hưởng thế nào đến thứ hạng SEO.',
      'Chúng ta phân tích Core Web Vitals và cách tối ưu ảnh, font, script để tăng điểm hiệu năng, qua đó hỗ trợ SEO dài hạn.'
    )
)
insert into public.posts (author_id, title, slug, excerpt, content, status, published_at)
select
  a.id as author_id,
  e.title,
  e.slug,
  e.excerpt,
  e.content,
  'published'::public.post_status,
  now()
from extra_posts e
cross join author_profile a
on conflict (slug)
do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

-- Kiểm tra nhanh
select
  case
    when title ilike '%Next.js%' then 'Next.js'
    when title ilike '%Supabase%' then 'Supabase'
    when title ilike '%UI/UX%' or title ilike '%UI UX%' then 'UI/UX'
    when title ilike '%Portfolio%' then 'Portfolio'
    when title ilike '%SEO%' then 'SEO'
    else 'Other'
  end as topic,
  count(*) as total_posts
from public.posts
where status = 'published'::public.post_status
group by 1
order by 1;
