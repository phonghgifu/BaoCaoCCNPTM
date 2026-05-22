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
      'Server Actions giúp xử lý submit form trực tiếp ở server mà không cần tự tạo endpoint riêng trong nhiều trường hợp.

1) Khi nào nên dùng Server Actions
- Form CRUD nhỏ và vừa (tạo/sửa bài viết, comment, profile)
- Cần giảm boilerplate giữa client và server
- Muốn tận dụng revalidatePath hoặc revalidateTag ngay sau khi ghi dữ liệu

2) Khi nào nên dùng API Route thay thế
- Cần public endpoint cho mobile app hoặc hệ thống bên ngoài
- Cần custom middleware, rate limit theo endpoint, version API
- Cần response format ổn định cho nhiều client khác nhau

3) Luồng chuẩn cho form bằng Server Actions
- Bước 1: Validate input ở server (không chỉ validate ở client)
- Bước 2: Ghi dữ liệu bằng transaction nếu có nhiều bảng liên quan
- Bước 3: Revalidate trang/list liên quan
- Bước 4: Trả về trạng thái thành công hoặc message lỗi rõ ràng

4) Checklist triển khai
- Luôn kiểm tra quyền user trước khi mutate
- Tránh trả lỗi chung chung, hãy gắn mã lỗi theo trường hợp
- Log lỗi kỹ thuật ở server, không lộ stack trace cho người dùng

Kết luận: Server Actions phù hợp cho web app nội bộ hoặc sản phẩm có luồng form rõ ràng; API Route phù hợp hơn khi cần mở rộng tích hợp đa nền tảng.'
    ),
    (
      'Next.js caching và revalidation thực chiến',
      'nextjs-caching-va-revalidation-thuc-chien',
      'Hiểu rõ cache, revalidate và no-store trong dự án thật.',
      'Caching trong Next.js quyết định trực tiếp đến tốc độ tải trang và độ tươi của dữ liệu.

1) Ba chế độ thường gặp
- Cache theo mặc định cho dữ liệu ít thay đổi
- Revalidate theo chu kỳ cho dữ liệu cập nhật định kỳ
- no-store cho dữ liệu thời gian thực hoặc dữ liệu nhạy cảm theo user

2) Quy tắc chọn nhanh
- Trang blog công khai: cache + revalidate (ví dụ 60s đến 300s)
- Dashboard cá nhân: ưu tiên no-store hoặc cache rất ngắn
- Dữ liệu thống kê realtime: no-store hoặc fetch trực tiếp từ client

3) Revalidation đúng chỗ
- revalidatePath: dùng khi nội dung ảnh hưởng theo route cụ thể
- revalidateTag: dùng khi nhiều route dùng chung một nguồn dữ liệu

4) Các lỗi phổ biến
- Quên revalidate sau khi tạo/sửa/xóa dẫn đến UI hiển thị dữ liệu cũ
- Dùng no-store quá nhiều làm mất lợi ích hiệu năng
- Dùng cache cho dữ liệu phụ thuộc phiên đăng nhập

5) Checklist thực chiến
- Xác định rõ từng nguồn dữ liệu thuộc loại static, periodic hay realtime
- Đặt SLA cập nhật: chậm tối đa bao nhiêu giây là chấp nhận được
- Đo lại bằng Web Vitals sau khi thay đổi chiến lược cache

Kết luận: cache tốt không chỉ làm nhanh hơn mà còn làm hệ thống ổn định hơn khi traffic tăng.'
    ),
    (
      'Debug lỗi RLS trong Supabase nhanh và đúng',
      'debug-loi-rls-trong-supabase-nhanh-va-dung',
      'Checklist xử lý lỗi policy khi insert/update dữ liệu.',
      'RLS là lớp bảo vệ dữ liệu quan trọng, nhưng rất dễ sai khi policy phức tạp.

1) Hiểu đúng hai phần của policy
- USING: điều kiện để đọc/xóa bản ghi hiện có
- WITH CHECK: điều kiện để ghi dữ liệu mới hoặc update bản ghi

2) Quy trình debug 5 bước
- Bước 1: Kiểm tra session user và auth.uid() có tồn tại không
- Bước 2: Xác minh bảng đã bật RLS chưa
- Bước 3: Đọc lại policy theo từng thao tác select/insert/update/delete
- Bước 4: Test bằng SQL Editor với cùng role
- Bước 5: So sánh dữ liệu thực tế với điều kiện policy

3) Lỗi phổ biến
- Chỉ viết USING mà quên WITH CHECK
- So sánh sai kiểu dữ liệu giữa user_id và auth.uid()
- Policy đúng về cú pháp nhưng sai logic nghiệp vụ

4) Mẫu policy tham khảo
- User chỉ được sửa bài do chính mình tạo
- User chỉ đọc bài published hoặc bài draft của chính họ

5) Checklist trước khi deploy
- Có test case cho user A, user B và anonymous
- Có policy riêng cho select và insert/update
- Có log truy vết lỗi permission ở server

Kết luận: debug RLS hiệu quả cần bám vào luồng nghiệp vụ, không chỉ kiểm tra syntax.'
    ),
    (
      'Supabase Realtime cho bình luận trực tiếp',
      'supabase-realtime-cho-binh-luan-truc-tiep',
      'Cập nhật comment realtime mà không cần refresh trang.',
      'Realtime giúp trải nghiệm bình luận mượt hơn vì người đọc nhìn thấy cập nhật ngay lập tức.

1) Kiến trúc cơ bản
- Client subscribe theo kênh comments của từng bài viết
- Server ghi comment mới vào bảng comments
- Supabase phát sự kiện insert/update/delete về client liên quan

2) Nguyên tắc subscribe đúng
- Subscribe theo post_id để giảm nhiễu sự kiện
- Unsubscribe khi unmount để tránh memory leak
- Chỉ mở subscription khi user đang ở trang chi tiết bài viết

3) Tránh duplicate comment trên UI
- Dùng id làm khóa duy nhất
- Khi nhận event insert, kiểm tra tồn tại trước khi append
- Đồng bộ thứ tự theo created_at để không lệch timeline

4) Xử lý trạng thái mạng yếu
- Optimistic update cho comment vừa gửi
- Retry khi thất bại và hiển thị trạng thái gửi lại
- Có cơ chế refetch định kỳ để tự sửa sai lệch tạm thời

5) Checklist production
- Bật RLS đúng cho bảng comments
- Giới hạn payload và sanitize nội dung comment
- Theo dõi số lượng subscription để kiểm soát chi phí

Kết luận: Realtime hiệu quả khi kết hợp đúng giữa subscribe hẹp, dedupe tốt và cơ chế fallback ổn định.'
    ),
    (
      'UI/UX cho mobile: tối ưu tap target và spacing',
      'ui-ux-cho-mobile-toi-uu-tap-target-va-spacing',
      'Những lỗi phổ biến khi thiết kế mobile và cách sửa nhanh.',
      'Trên mobile, trải nghiệm tốt phụ thuộc rất nhiều vào khả năng thao tác bằng ngón tay và độ rõ ràng thị giác.

1) Tap target tối thiểu
- Nên giữ vùng chạm tối thiểu khoảng 44x44 px
- Với CTA quan trọng, ưu tiên vùng chạm lớn hơn để giảm nhầm lẫn
- Không chỉ tăng kích thước icon, phải tăng cả vùng click thực tế

2) Spacing để giảm lỗi thao tác
- Khoảng cách dọc giữa các action tối thiểu 8 đến 12 px
- Các nút nguy hiểm (xóa, hủy) cần tách khỏi nút chính
- Danh sách có item dày đặc cần tăng line-height và padding

3) Hierarchy cho màn hình nhỏ
- Mỗi màn hình chỉ nên có một mục tiêu chính
- Dùng cỡ chữ, màu và khoảng trắng để dẫn hướng thay vì thêm nhiều hiệu ứng
- Nội dung quan trọng đặt trong viewport đầu tiên

4) Mẫu kiểm tra nhanh trước khi phát hành
- Có thao tác nào người dùng dễ bấm nhầm không?
- Có phần chữ nào quá sát nhau gây khó đọc không?
- Có CTA chính luôn hiển thị rõ ràng ở mọi kích thước máy không?

5) Ví dụ cải tiến thực tế
- Trước: icon nhỏ 20px đặt sát nhau trong thanh công cụ
- Sau: mỗi icon có vùng chạm 44px và thêm khoảng cách 10px
- Kết quả: giảm thao tác nhầm và tăng tỷ lệ hoàn thành tác vụ

Kết luận: mobile UX tốt không cần phức tạp, chỉ cần ưu tiên đúng tap target, spacing và hierarchy.'
    ),
    (
      'Thiết kế hệ thống màu UI/UX nhất quán',
      'thiet-ke-he-thong-mau-ui-ux-nhat-quan',
      'Xây dựng palette và semantic color token để scale giao diện.',
      'Hệ thống màu tốt giúp giao diện nhất quán, dễ mở rộng và dễ bảo trì khi sản phẩm lớn dần.

1) Tư duy semantic thay vì hard-code
- Không dùng trực tiếp mã màu theo component
- Dùng token theo ý nghĩa: primary, success, warning, danger, surface, text

2) Cấu trúc token gợi ý
- Base token: bảng màu gốc (blue-100, blue-500, ...)
- Semantic token: màu theo ngữ nghĩa (button-primary-bg, text-muted)
- Component token: ánh xạ semantic token vào từng component

3) Contrast và khả năng đọc
- Đảm bảo tỷ lệ tương phản phù hợp cho text và icon
- Trạng thái disabled không chỉ giảm opacity, cần giữ khả năng nhận biết
- Kiểm tra cả light mode và dark mode

4) Lỗi hay gặp khi scale sản phẩm
- Mỗi màn hình dùng một shade khác nhau cho cùng trạng thái
- Dùng màu để biểu đạt quá nhiều thông tin, thiếu icon hoặc text hỗ trợ
- Không có quy ước đặt tên token nên khó đồng bộ team

5) Checklist triển khai
- Có tài liệu token và ví dụ sử dụng
- Có lint rule hoặc review checklist cho màu sắc
- Có regression test ảnh chụp màn hình cho theme

Kết luận: token hóa màu sắc là bước nền tảng để giao diện vừa đẹp vừa bền vững theo thời gian.'
    ),
    (
      'Portfolio README giúp tăng sức thuyết phục',
      'portfolio-readme-giup-tang-suc-thuyet-phuc',
      'Cách viết README cho mỗi dự án portfolio dễ hiểu và chuyên nghiệp.',
      'README là điểm chạm đầu tiên khi nhà tuyển dụng hoặc đồng đội xem dự án của bạn.

1) Cấu trúc README nên có
- Mục tiêu dự án: giải bài toán gì, dành cho ai
- Tính năng chính: 3 đến 7 ý nổi bật, trình bày ngắn gọn
- Kiến trúc và stack: vì sao chọn công nghệ đó
- Hướng dẫn chạy local: rõ điều kiện tiên quyết và lệnh chạy
- Demo hoặc ảnh chụp màn hình

2) Phần tạo khác biệt
- Trade-off: bạn đã đánh đổi gì trong thiết kế
- Bài học rút ra sau triển khai
- Hướng phát triển tiếp theo

3) Lỗi phổ biến
- README quá dài nhưng thiếu thông tin chạy thử
- Không có phần kiến trúc nên người đọc khó hình dung
- Thiếu biến môi trường mẫu, dẫn đến không chạy được

4) Mẫu checklist trước khi publish
- Người mới clone dự án có chạy được trong 10 phút không?
- Có giải thích rõ cấu trúc thư mục chính không?
- Có nêu hạn chế hiện tại một cách trung thực không?

Kết luận: README tốt không chỉ mô tả dự án, mà còn thể hiện tư duy kỹ thuật và khả năng giao tiếp của bạn.'
    ),
    (
      'Case study trong portfolio: viết sao cho nổi bật?',
      'case-study-trong-portfolio-viet-sao-cho-noi-bat',
      'Biến một project thành case study có số liệu và giá trị rõ ràng.',
      'Case study tốt giúp người đọc hiểu bạn giải quyết vấn đề như thế nào, chứ không chỉ nhìn thấy giao diện đẹp.

1) Khung problem - solution - impact
- Problem: bối cảnh, ràng buộc, chỉ số đang kém
- Solution: kiến trúc, quyết định kỹ thuật, lý do lựa chọn
- Impact: kết quả đo được bằng số liệu

2) Trình bày phần Problem
- Mô tả người dùng mục tiêu và pain points cụ thể
- Nêu rõ giới hạn thời gian, nguồn lực, dữ liệu
- Nêu tiêu chí thành công trước khi bắt đầu

3) Trình bày phần Solution
- Chia theo từng quyết định chính (database, caching, auth, UI)
- Mỗi quyết định cần có lý do và phương án thay thế đã cân nhắc
- Nêu rủi ro kỹ thuật và cách giảm rủi ro

4) Trình bày phần Impact
- Dùng số liệu trước và sau (thời gian tải, tỷ lệ hoàn thành, lỗi)
- Nếu chưa có production data, dùng benchmark nội bộ có phương pháp rõ ràng
- Kèm ảnh minh họa hoặc biểu đồ đơn giản

5) Checklist phỏng vấn
- Có thể giải thích vì sao không chọn phương án B không?
- Có thể nêu một sai lầm và cách sửa không?
- Có thể tóm tắt dự án trong 2 phút không?

Kết luận: case study mạnh là case study có dữ liệu, có quyết định kỹ thuật và có bài học rõ ràng.'
    ),
    (
      'SEO audit nhanh cho website cá nhân',
      'seo-audit-nhanh-cho-website-ca-nhan',
      'Danh sách kiểm tra SEO kỹ thuật trước khi deploy production.',
      'SEO audit kỹ thuật giúp website cá nhân được lập chỉ mục đúng và tăng cơ hội xuất hiện trên kết quả tìm kiếm.

1) Kiểm tra khả năng index
- robots.txt có chặn nhầm trang quan trọng không
- Có sitemap.xml và khai báo đúng URL canonical không
- Không để trang trùng nội dung cạnh tranh lẫn nhau

2) Metadata cốt lõi
- Mỗi trang có title và description riêng, đúng chủ đề
- Open Graph và Twitter Card đầy đủ cho chia sẻ mạng xã hội
- Heading H1/H2 phân cấp hợp lý, không nhồi từ khóa

3) Kiểm tra kỹ thuật on-page
- 404 và redirect chain phải được xử lý gọn
- Ảnh có alt text và dung lượng tối ưu
- Internal link rõ ràng để bot crawl hiệu quả

4) Tốc độ và trải nghiệm
- Đo Core Web Vitals trên thiết bị mobile
- Giảm script không cần thiết ở trang landing
- Trì hoãn tải tài nguyên không quan trọng

5) Checklist định kỳ
- Audit mỗi lần deploy lớn
- Theo dõi Search Console để phát hiện lỗi index sớm
- Cập nhật nội dung cũ để giữ độ mới của website

Kết luận: audit đều đặn giúp SEO tăng bền vững hơn nhiều so với tối ưu theo đợt.'
    ),
    (
      'Tối ưu Core Web Vitals để cải thiện SEO',
      'toi-uu-core-web-vitals-de-cai-thien-seo',
      'LCP, CLS, INP ảnh hưởng thế nào đến thứ hạng SEO.',
      'Core Web Vitals là nhóm chỉ số quan trọng phản ánh tốc độ tải và độ mượt khi người dùng tương tác.

1) Ba chỉ số cần theo dõi
- LCP: thời gian render phần nội dung lớn nhất
- CLS: mức độ xê dịch layout ngoài ý muốn
- INP: độ trễ khi người dùng tương tác

2) Cách tối ưu LCP
- Ưu tiên tải hero image đúng kích thước
- Dùng nén ảnh hiện đại và preload tài nguyên quan trọng
- Giảm blocking CSS hoặc JavaScript ở phần đầu trang

3) Cách tối ưu CLS
- Luôn đặt width/height cho ảnh và media
- Tránh chèn banner muộn làm đẩy layout
- Dự trù không gian cho font khi chưa tải xong

4) Cách tối ưu INP
- Tách nhỏ tác vụ JavaScript nặng
- Trì hoãn script bên thứ ba không cấp thiết
- Dùng debounce/throttle cho sự kiện nhập liệu và cuộn trang

5) Quy trình theo dõi
- Đo ở môi trường thật bằng RUM nếu có thể
- So sánh trước/sau mỗi lần tối ưu
- Ưu tiên sửa trang có traffic cao trước

Kết luận: cải thiện Core Web Vitals vừa tăng trải nghiệm người dùng vừa hỗ trợ SEO dài hạn một cách bền vững.'
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
