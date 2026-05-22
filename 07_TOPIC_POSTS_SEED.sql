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
      'App Router là nền tảng điều hướng hiện đại trong Next.js, giúp tổ chức route theo thư mục và tách rõ layout, page, loading, error.

1) App Router giải quyết vấn đề gì
- Tổ chức route trực quan theo file system
- Hỗ trợ nested layout cho từng nhóm màn hình
- Dễ kết hợp server component và client component

2) Cấu trúc thư mục cơ bản
- page.tsx: nội dung chính của route
- layout.tsx: khung dùng chung cho route con
- loading.tsx: trạng thái đang tải
- error.tsx: xử lý lỗi riêng cho route

3) Khi nào phù hợp
- Website có nhiều page lồng nhau
- Dashboard có sidebar, header, content area
- Dự án cần tách rõ dữ liệu server và tương tác client

4) Checklist cho người mới
- Xác định page nào dùng chung layout
- Chỉ chuyển component sang client khi thật sự cần state hoặc event
- Dùng route group để giữ cấu trúc sạch

Kết luận: App Router giúp codebase dễ đọc hơn khi dự án lớn lên, miễn là bạn tổ chức route và layout theo đúng mục đích.'
    ),
    (
      'Tối ưu hiệu năng Next.js với dynamic rendering',
      'toi-uu-hieu-nang-nextjs-voi-dynamic-rendering',
      'Khi nào nên dùng static, ISR và dynamic render trong Next.js.',
      'Chọn đúng chiến lược render là cách nhanh nhất để cân bằng giữa tốc độ và độ mới của dữ liệu.

1) Ba chiến lược chính
- Static rendering: render sẵn, tải nhanh, phù hợp nội dung ít thay đổi
- ISR: cập nhật theo chu kỳ, cân bằng giữa performance và freshness
- Dynamic rendering: luôn render theo request, phù hợp dữ liệu cá nhân hóa

2) Cách chọn theo loại trang
- Blog public: static hoặc ISR
- Trang sản phẩm: static + ISR khi đổi giá/tồn kho
- Dashboard cá nhân: dynamic vì phụ thuộc user session

3) Dấu hiệu chọn sai
- Trang public nhưng vẫn render động mọi lúc
- Trang user-specific nhưng cache quá lâu
- Mỗi lần cập nhật lại phải deploy mới

4) Checklist thực chiến
- Xác định phần nào có thể cache, phần nào phải động
- Tách dữ liệu thay đổi nhanh khỏi dữ liệu thay đổi chậm
- Đo lại TTFB, LCP sau khi đổi chiến lược

Kết luận: dynamic rendering không phải lúc nào cũng tốt nhất; điều quan trọng là chọn đúng theo bản chất dữ liệu.'
    ),
    (
      'Triển khai middleware auth trong Next.js',
      'trien-khai-middleware-auth-trong-nextjs',
      'Bảo vệ route dashboard bằng middleware và redirect thông minh.',
      'Middleware auth giúp chặn truy cập sớm trước khi trang được render, giảm rò rỉ nội dung và tăng trải nghiệm điều hướng.

1) Middleware làm gì
- Kiểm tra request trước khi vào route
- Redirect người chưa đăng nhập sang login
- Cho phép route public đi thẳng qua

2) Những route cần bảo vệ
- Dashboard
- Profile
- Create/Edit content
- Các route thao tác dữ liệu riêng tư

3) Lưu ý khi triển khai
- Không redirect mọi route nếu chỉ một số route cần auth
- Tránh logic auth quá nặng trong middleware
- Kiểm tra cookie/session theo cách nhẹ nhất có thể

4) Checklist debug
- User đã login nhưng vẫn bị redirect? Kiểm tra cookie path/domain
- Route public bị chặn? Kiểm tra matcher
- Middleware chạy nhưng session chưa kịp hydrate? Kiểm tra flow client/server

Kết luận: middleware auth nên làm ít nhưng đúng việc, ưu tiên bảo vệ route nhạy cảm mà không ảnh hưởng trải nghiệm chung.'
    ),
    (
      'Supabase Auth: Email, OAuth và quản lý session',
      'supabase-auth-email-oauth-va-quan-ly-session',
      'Thiết lập đăng nhập Supabase Auth an toàn cho ứng dụng web.',
      'Supabase Auth cung cấp nhiều cách đăng nhập nhưng điều quan trọng là bạn phải quản lý session và trạng thái người dùng đúng cách.

1) Các hình thức auth phổ biến
- Email/password: dễ hiểu, phù hợp ứng dụng phổ thông
- OAuth: tiện lợi, giảm ma sát đăng nhập
- Magic link: thân thiện với user không muốn nhớ mật khẩu

2) Quản lý session
- Lưu session an toàn bằng cookie httpOnly nếu có thể
- Refresh session khi token gần hết hạn
- Đồng bộ state auth giữa client và server

3) Lỗi thường gặp
- User login rồi nhưng UI chưa cập nhật
- Session hết hạn nhưng không redirect đúng
- OAuth callback xử lý sai state

4) Checklist triển khai
- Có flow đăng xuất rõ ràng
- Có kiểm tra quyền trên server chứ không chỉ trên client
- Có handling cho loading, error và expired session

Kết luận: auth an toàn không chỉ là “đăng nhập được”, mà còn là quản lý session và quyền truy cập nhất quán ở mọi tầng.'
    ),
    (
      'Supabase Storage cho upload ảnh dự án',
      'supabase-storage-cho-upload-anh-du-an',
      'Lưu trữ ảnh vào bucket, lấy public URL và xử lý lỗi thường gặp.',
      'Supabase Storage phù hợp cho portfolio vì nó giúp bạn quản lý ảnh tập trung, dễ cấp quyền và dễ sinh public URL.

1) Luồng upload chuẩn
- Người dùng chọn file
- Client upload vào bucket
- Server hoặc client lưu metadata nếu cần
- Giao diện hiển thị ảnh bằng public URL hoặc signed URL

2) Thiết kế bucket
- Bucket public cho ảnh dự án công khai
- Bucket private cho file nội bộ
- Đặt naming convention rõ ràng để dễ quản lý

3) Xử lý lỗi thường gặp
- File quá lớn
- Sai content-type
- Thiếu quyền đọc bucket
- URL công khai nhưng file không load do cache hoặc path sai

4) Checklist tối ưu hiển thị
- Resize ảnh trước khi upload nếu có thể
- Dùng loading placeholder để tránh layout shift
- Cache hợp lý cho ảnh công khai

Kết luận: storage tốt không chỉ là upload thành công, mà còn phải gọn trong quản lý, an toàn trong quyền truy cập và ổn định khi hiển thị.'
    ),
    (
      'Thiết kế schema PostgreSQL chuẩn trên Supabase',
      'thiet-ke-schema-postgresql-chuan-tren-supabase',
      'Mẹo tạo bảng, khóa ngoại và index để query nhanh hơn.',
      'Schema tốt là nền tảng của ứng dụng bền vững vì nó ảnh hưởng trực tiếp đến tốc độ query, độ toàn vẹn dữ liệu và khả năng mở rộng.

1) Bắt đầu từ mô hình dữ liệu
- Xác định entity chính: users, posts, comments, projects
- Vẽ quan hệ giữa các entity trước khi tạo bảng
- Chỉ lưu những trường thật sự cần thiết

2) Nguyên tắc thiết kế
- Dùng foreign key để giữ toàn vẹn dữ liệu
- Tạo index cho các cột hay filter/sort
- Tách dữ liệu biến động cao khỏi dữ liệu tĩnh nếu cần

3) Khi nào cần migration
- Thêm trường mới
- Đổi kiểu dữ liệu
- Thay đổi ràng buộc hoặc index

4) Checklist thực chiến
- Có naming convention thống nhất không
- Có field created_at, updated_at không
- Query phổ biến nhất đã có index chưa

Kết luận: schema chuẩn không phải schema “phức tạp”, mà là schema đủ rõ, đủ gọn và đủ tối ưu cho truy vấn thực tế.'
    ),
    (
      'Nguyên tắc UI/UX cho dashboard sinh viên',
      'nguyen-tac-ui-ux-cho-dashboard-sinh-vien',
      'Cách thiết kế dashboard dễ đọc, dễ thao tác và có thứ bậc rõ ràng.',
      'Dashboard tốt phải trả lời nhanh: tôi đang ở đâu, dữ liệu nào quan trọng, và thao tác tiếp theo là gì.

1) Visual hierarchy
- Đưa số liệu quan trọng lên đầu
- Dùng cỡ chữ, màu sắc và spacing để phân tầng thông tin
- Giảm số lượng điểm nhấn trong cùng một viewport

2) Spacing system
- Dùng khoảng cách thống nhất cho card, section và action
- Tránh nhồi quá nhiều khối thông tin sát nhau
- Giữ nhịp đọc ổn định cho người dùng

3) Consistency
- Một kiểu button cho một nhóm hành động
- Một kiểu trạng thái cho cùng loại dữ liệu
- Một ngôn ngữ màu cho success, warning, error

4) Checklist dashboard sinh viên
- Có thể nhìn 5 giây là biết tình trạng chính không
- Action quan trọng có rõ ràng không
- Trạng thái trống và lỗi có được thiết kế tử tế không

Kết luận: dashboard dễ dùng không cần nhiều hiệu ứng, chỉ cần thông tin đúng chỗ và hành động rõ ràng.'
    ),
    (
      'UI/UX micro-interactions giúp giao diện sống động',
      'ui-ux-micro-interactions-giup-giao-dien-song-dong',
      'Animation nhỏ nhưng đúng chỗ để tăng cảm giác chuyên nghiệp.',
      'Micro-interactions là những phản hồi nhỏ giúp người dùng hiểu rằng giao diện đang lắng nghe thao tác của họ.

1) Mục đích của micro-interactions
- Phản hồi trạng thái hành động
- Giảm cảm giác giao diện “đơ”
- Tạo cảm giác chuyên nghiệp và có chủ đích

2) Ví dụ nên dùng
- Hover nhẹ cho button và card
- Loading skeleton khi chờ dữ liệu
- Success toast sau khi lưu thành công

3) Điều cần tránh
- Animation quá dài làm chậm tác vụ
- Hiệu ứng chỉ để trang trí, không có ý nghĩa
- Quá nhiều motion trong cùng một màn hình

4) Checklist áp dụng
- Có phục vụ thông tin không hay chỉ gây nhiễu
- Có giữ được hiệu năng trên máy yếu không
- Có tôn trọng người dùng cần giảm motion không

Kết luận: micro-interactions tốt là micro-interactions có lý do, đúng lúc và không làm người dùng phân tâm.'
    ),
    (
      'Accessibility trong UI/UX: từ ARIA đến keyboard',
      'accessibility-trong-ui-ux-tu-aria-den-keyboard',
      'Các checklist accessibility cơ bản cho form, modal và navigation.',
      'Accessibility giúp sản phẩm dùng được cho nhiều người hơn và thường cũng làm UI sạch hơn, logic hơn.

1) Những yếu tố nền tảng
- aria-label cho thành phần không có text rõ ràng
- tab order hợp lý cho keyboard navigation
- contrast đủ tốt cho text và icon

2) Modal và form
- Modal cần focus trap
- Escape phải đóng modal
- Form cần label rõ, error message dễ đọc

3) Lỗi phổ biến
- Dùng div giả button mà không có role và keyboard handler
- Icon-only button không có mô tả
- Placeholder bị dùng thay cho label

4) Checklist cơ bản
- Có thể dùng toàn bộ sản phẩm chỉ bằng bàn phím không
- Screen reader có đọc đúng không
- Text có đủ tương phản không

Kết luận: accessibility là chất lượng sản phẩm, không phải tính năng phụ. Làm đúng ngay từ đầu sẽ rẻ hơn sửa sau này.'
    ),
    (
      'Xây dựng trang Portfolio nổi bật cho lập trình viên',
      'xay-dung-trang-portfolio-noi-bat-cho-lap-trinh-vien',
      'Cách trình bày dự án portfolio theo hướng kể chuyện sản phẩm.',
      'Portfolio hiệu quả không phải là nơi liệt kê mọi thứ bạn từng làm, mà là nơi chọn đúng dự án để kể câu chuyện năng lực.

1) Chọn dự án theo mục tiêu
- Muốn frontend: chọn dự án có UI và UX tốt
- Muốn full-stack: chọn dự án có auth, CRUD, API, database
- Muốn product thinking: chọn dự án có số liệu và bài học

2) Cấu trúc mỗi project
- Vấn đề
- Giải pháp
- Kết quả
- Công nghệ sử dụng

3) Cách làm nổi bật
- Nêu ràng buộc cụ thể và quyết định kỹ thuật
- Dùng ảnh chụp hoặc demo ngắn
- Viết ngắn gọn nhưng có chiều sâu

4) Checklist trước khi public
- Mỗi dự án có một điểm khác biệt rõ không
- Có thể giải thích trong 1-2 phút không
- Các link demo và source code có hoạt động không

Kết luận: portfolio tốt là portfolio có chọn lọc, có logic và thể hiện cách bạn suy nghĩ như một người làm sản phẩm.'
    ),
    (
      'Portfolio project card: nội dung nào cần có?',
      'portfolio-project-card-noi-dung-nao-can-co',
      'Checklist thông tin quan trọng trong mỗi project card của portfolio.',
      'Project card là lớp tóm tắt đầu tiên của một dự án, nên nó phải đủ ngắn để quét nhanh nhưng đủ rõ để tạo hứng thú.

1) Thành phần tối thiểu
- Tên dự án
- Ảnh đại diện hoặc screenshot
- Mô tả ngắn
- Stack chính
- Link demo hoặc source code

2) Những thông tin nên ưu tiên
- Vấn đề dự án giải quyết
- Kết quả nổi bật nhất
- Vai trò của bạn trong dự án

3) Những gì nên tránh
- Quá nhiều text khiến card nặng và rối
- Quá nhiều badge công nghệ không có trọng tâm
- Link không rõ ràng hoặc không hoạt động

4) Checklist thiết kế
- Card có dễ đọc ở mobile không
- Có đủ khoảng thở để nhìn nhanh không
- CTA có nổi bật nhưng không quá lấn át không

Kết luận: project card tốt là card cho người đọc hiểu nhanh “dự án này có gì đáng chú ý” chỉ trong vài giây.'
    ),
    (
      'Portfolio cá nhân và cách chọn dự án để trưng bày',
      'portfolio-ca-nhan-va-cach-chon-du-an-de-trung-bay',
      'Không phải dự án nào cũng nên đưa vào portfolio.',
      'Chọn dự án để trưng bày là một quyết định chiến lược: mỗi project nên chứng minh một năng lực cụ thể, không phải chỉ để lấp đầy trang.

1) Nguyên tắc chọn
- Chọn dự án có câu chuyện rõ ràng
- Chọn dự án có độ khác biệt về kỹ thuật hoặc sản phẩm
- Chọn dự án mà bạn hiểu sâu, kể được chi tiết

2) Nên đưa vào
- Dự án thể hiện kỹ năng mạnh nhất
- Dự án có kết quả đo được
- Dự án có vấn đề thực tế và cách giải quyết cụ thể

3) Không nên đưa vào
- Dự án copy tutorial không có dấu ấn riêng
- Dự án đã quá cũ và không còn phản ánh năng lực hiện tại
- Dự án chỉ đẹp bề ngoài nhưng không có chiều sâu

4) Checklist cuối
- Mỗi dự án có một mục tiêu showcase rõ ràng không
- Có đủ diversity giữa frontend, backend, product, testing không
- Portfolio có thể dẫn dắt nhà tuyển dụng đi qua đúng câu chuyện bạn muốn kể không

Kết luận: portfolio mạnh là portfolio có chủ đích, có chọn lọc và có khả năng kể một câu chuyện nghề nghiệp nhất quán.'
    ),
    (
      'SEO cơ bản cho website Next.js',
      'seo-co-ban-cho-website-nextjs',
      'Thiết lập title, description và Open Graph đúng chuẩn SEO.',
      'SEO cơ bản trong Next.js nên bắt đầu từ metadata đúng, cấu trúc heading chuẩn và nội dung có khả năng được crawl tốt.

1) Metadata cần có
- title riêng cho từng trang
- description mô tả đúng nội dung
- Open Graph cho chia sẻ mạng xã hội

2) Semantic heading
- Mỗi trang chỉ nên có một H1 chính
- H2/H3 chia nội dung theo chủ đề hợp lý
- Không dùng heading chỉ để tạo kiểu chữ

3) Internal linking
- Liên kết đến các bài liên quan
- Dẫn người dùng và bot đến các trang quan trọng
- Tránh tạo trang mồ côi không có link trỏ đến

4) Checklist nhanh
- Trang có metadata riêng chưa
- Ảnh có alt text chưa
- URL có rõ nghĩa và ổn định chưa

Kết luận: SEO cơ bản hiệu quả nhất là làm đúng nền tảng trước khi nghĩ đến tối ưu nâng cao.'
    ),
    (
      'Technical SEO: sitemap, robots và structured data',
      'technical-seo-sitemap-robots-va-structured-data',
      'Những thành phần technical SEO không thể thiếu.',
      'Technical SEO là lớp nền giúp search engine hiểu website của bạn rõ hơn, crawl đúng hơn và hiển thị tốt hơn.

1) Sitemap.xml
- Liệt kê URL quan trọng để bot tìm nhanh hơn
- Cập nhật khi có nội dung mới
- Không đưa vào URL kém chất lượng hoặc trùng lặp

2) robots.txt
- Chặn các khu vực không cần index
- Không chặn nhầm trang quan trọng
- Dùng cùng sitemap để điều hướng bot tốt hơn

3) Structured data
- Giúp bot hiểu loại nội dung: bài viết, sản phẩm, FAQ
- Tăng cơ hội hiển thị rich snippets
- Phải khớp với nội dung thực tế trên trang

4) Checklist triển khai
- Kiểm tra bằng Search Console
- Xác nhận canonical đúng
- Không có lỗi redirect hoặc 404 trong các URL quan trọng

Kết luận: technical SEO tốt làm nền tảng cho mọi nỗ lực content SEO phía trên.'
    ),
    (
      'On-page SEO cho bài blog kỹ thuật',
      'on-page-seo-cho-bai-blog-ky-thuat',
      'Tối ưu từ khóa SEO tự nhiên trong tiêu đề, đoạn mở đầu và nội dung.',
      'On-page SEO cho blog kỹ thuật nên ưu tiên người đọc trước, công cụ tìm kiếm sau, vì nội dung dễ đọc mới có khả năng giữ chân và chuyển đổi.

1) Keyword intent
- Xác định người đọc đang muốn học gì
- Dùng từ khóa chính tự nhiên trong title và đoạn mở đầu
- Tránh nhồi keyword gây mất tự nhiên

2) Cấu trúc nội dung
- Mở đầu nêu vấn đề rõ ràng
- Thân bài chia thành các phần có logic
- Kết luận tóm lại và gợi ý bước tiếp theo

3) Readability
- Đoạn ngắn, câu rõ, tiêu đề phụ cụ thể
- Có danh sách và ví dụ minh họa khi cần
- Tránh viết quá nhiều đoạn dài liên tục

4) CTA phù hợp
- Mời đọc bài liên quan
- Hướng người đọc đến demo hoặc nguồn code
- Không ép chuyển đổi quá sớm khi nội dung còn học thuật

Kết luận: on-page SEO tốt là sự cân bằng giữa rõ ràng, hữu ích và đúng mục đích tìm kiếm.'
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
