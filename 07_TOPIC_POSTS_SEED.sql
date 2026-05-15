-- ============================================================
-- TOPIC POSTS SEED DATA
-- 5 chủ đề: Next.js, Supabase, UI/UX, Portfolio, SEO
-- Mỗi chủ đề tối thiểu 3 bài viết
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Yêu cầu: bảng profiles phải có ít nhất 1 user
-- Nếu chưa có user/profile, hãy đăng ký 1 tài khoản trước rồi chạy lại.

with author_profile as (
  select id
  from public.profiles
  order by created_at asc
  limit 1
),
seed_posts(title, slug, excerpt, content) as (
  values
    (
      'Next.js App Router cho người mới bắt đầu',
      'nextjs-app-router-cho-nguoi-moi-bat-dau',
      'Tổng quan App Router trong Next.js và cách tổ chức route theo thư mục.',
      'Bài viết này giới thiệu App Router trong Next.js, bao gồm layout lồng nhau, server component và cách chia module hợp lý cho dự án lớn.'
    ),
    (
      'Tối ưu hiệu năng Next.js với dynamic rendering',
      'toi-uu-hieu-nang-nextjs-voi-dynamic-rendering',
      'Khi nào nên dùng static, ISR và dynamic render trong Next.js.',
      'Chúng ta sẽ so sánh static generation, ISR và dynamic rendering trong Next.js để chọn chiến lược render phù hợp cho từng trang.'
    ),
    (
      'Triển khai middleware auth trong Next.js',
      'trien-khai-middleware-auth-trong-nextjs',
      'Bảo vệ route dashboard bằng middleware và redirect thông minh.',
      'Hướng dẫn cấu hình middleware trong Next.js để kiểm tra session và điều hướng người dùng đến trang login khi chưa đăng nhập.'
    ),
    (
      'Supabase Auth: Email, OAuth và quản lý session',
      'supabase-auth-email-oauth-va-quan-ly-session',
      'Thiết lập đăng nhập Supabase Auth an toàn cho ứng dụng web.',
      'Bài này tập trung vào Supabase Auth, cách tích hợp OAuth, refresh session và quản lý trạng thái đăng nhập trong ứng dụng client/server.'
    ),
    (
      'Supabase Storage cho upload ảnh dự án',
      'supabase-storage-cho-upload-anh-du-an',
      'Lưu trữ ảnh vào bucket, lấy public URL và xử lý lỗi thường gặp.',
      'Chúng ta đi qua quy trình upload file lên Supabase Storage, đặt bucket policy và hiển thị ảnh tối ưu trên giao diện portfolio.'
    ),
    (
      'Thiết kế schema PostgreSQL chuẩn trên Supabase',
      'thiet-ke-schema-postgresql-chuan-tren-supabase',
      'Mẹo tạo bảng, khóa ngoại và index để query nhanh hơn.',
      'Bài viết trình bày cách xây dựng schema trên Supabase gồm normal form, foreign key, index và migration để dễ mở rộng.'
    ),
    (
      'Nguyên tắc UI/UX cho dashboard sinh viên',
      'nguyen-tac-ui-ux-cho-dashboard-sinh-vien',
      'Cách thiết kế dashboard dễ đọc, dễ thao tác và có thứ bậc rõ ràng.',
      'Trong bài này, chúng ta áp dụng các nguyên tắc UI/UX như visual hierarchy, spacing system và consistency để nâng chất lượng dashboard.'
    ),
    (
      'UI/UX micro-interactions giúp giao diện sống động',
      'ui-ux-micro-interactions-giup-giao-dien-song-dong',
      'Animation nhỏ nhưng đúng chỗ để tăng cảm giác chuyên nghiệp.',
      'Bài viết chia sẻ cách dùng micro-interactions trong UI/UX: hover, loading state và transition để tăng trải nghiệm mà không gây rối.'
    ),
    (
      'Accessibility trong UI/UX: từ ARIA đến keyboard',
      'accessibility-trong-ui-ux-tu-aria-den-keyboard',
      'Các checklist accessibility cơ bản cho form, modal và navigation.',
      'Hướng dẫn cải thiện UI/UX theo accessibility: aria-label, focus trap, tab order và contrast để sản phẩm thân thiện hơn với mọi người dùng.'
    ),
    (
      'Xây dựng trang Portfolio nổi bật cho lập trình viên',
      'xay-dung-trang-portfolio-noi-bat-cho-lap-trinh-vien',
      'Cách trình bày dự án portfolio theo hướng kể chuyện sản phẩm.',
      'Bài viết hướng dẫn cách viết nội dung portfolio: bài toán, giải pháp, kết quả đo lường và công nghệ để tăng tính thuyết phục với nhà tuyển dụng.'
    ),
    (
      'Portfolio project card: nội dung nào cần có?',
      'portfolio-project-card-noi-dung-nao-can-co',
      'Checklist thông tin quan trọng trong mỗi project card của portfolio.',
      'Chúng ta bàn về cấu trúc project card trong portfolio: ảnh, mô tả ngắn, stack kỹ thuật, liên kết demo và nguồn code.'
    ),
    (
      'Portfolio cá nhân và cách chọn dự án để trưng bày',
      'portfolio-ca-nhan-va-cach-chon-du-an-de-trung-bay',
      'Không phải dự án nào cũng nên đưa vào portfolio.',
      'Bài này tập trung vào chiến lược chọn dự án portfolio theo mục tiêu nghề nghiệp, đảm bảo mỗi dự án thể hiện một năng lực khác nhau.'
    ),
    (
      'SEO cơ bản cho website Next.js',
      'seo-co-ban-cho-website-nextjs',
      'Thiết lập title, description và Open Graph đúng chuẩn SEO.',
      'Hướng dẫn SEO cho Next.js với metadata API, semantic heading và internal linking để tăng khả năng hiển thị trên công cụ tìm kiếm.'
    ),
    (
      'Technical SEO: sitemap, robots và structured data',
      'technical-seo-sitemap-robots-va-structured-data',
      'Những thành phần technical SEO không thể thiếu.',
      'Trong bài này, chúng ta cấu hình technical SEO gồm robots.txt, sitemap.xml và schema markup để cải thiện crawlability và rich snippets.'
    ),
    (
      'On-page SEO cho bài blog kỹ thuật',
      'on-page-seo-cho-bai-blog-ky-thuat',
      'Tối ưu từ khóa SEO tự nhiên trong tiêu đề, đoạn mở đầu và nội dung.',
      'Bài viết chia sẻ khung on-page SEO: keyword intent, heading structure, readability và CTA phù hợp cho blog công nghệ.'
    )
)
insert into public.posts (author_id, title, slug, excerpt, content, status, published_at)
select
  a.id as author_id,
  s.title,
  s.slug,
  s.excerpt,
  s.content,
  'published'::public.post_status,
  now()
from seed_posts s
cross join author_profile a
on conflict (slug)
do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

-- Kiểm tra nhanh kết quả
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
