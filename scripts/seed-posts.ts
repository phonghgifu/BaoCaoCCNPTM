import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const generateSlug = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const seedEmail = process.env.SEED_POSTS_EMAIL ?? 'seed-content@example.com'
const seedPassword = process.env.SEED_POSTS_PASSWORD ?? 'SeedContent123!'

const topicPosts = {
  'Next.js': [
    {
      title: 'Next.js App Router cho người mới bắt đầu',
      excerpt: 'Tổng quan App Router trong Next.js và cách tổ chức route theo thư mục.',
      content: `Bài viết này giới thiệu App Router trong Next.js, bao gồm layout lồng nhau, server component và cách chia module hợp lý cho dự án lớn.`,
    },
    {
      title: 'Tối ưu hiệu năng Next.js với dynamic rendering',
      excerpt: 'Khi nào nên dùng static, ISR và dynamic render trong Next.js.',
      content: `Chúng ta sẽ so sánh static generation, ISR và dynamic rendering trong Next.js để chọn chiến lược render phù hợp cho từng trang.`,
    },
    {
      title: 'Triển khai middleware auth trong Next.js',
      excerpt: 'Bảo vệ route dashboard bằng middleware và redirect thông minh.',
      content: `Hướng dẫn cấu hình middleware trong Next.js để kiểm tra session và điều hướng người dùng đến trang login khi chưa đăng nhập.`,
    },
    {
      title: 'Server Actions trong Next.js: khi nào nên dùng?',
      excerpt: 'So sánh Server Actions với API Route để xử lý form hiệu quả.',
      content: `Server Actions giúp đẩy logic ghi dữ liệu về phía server mà không cần tạo thêm API Route cho mọi form nhỏ.

    1) Khi nào nên dùng
    - Form đơn giản như tạo bài viết, bình luận hoặc cập nhật profile
    - Luồng submit không cần public API riêng
    - Muốn giảm độ phức tạp của client-side fetch

    2) Khi nào chưa nên dùng
    - Cần API công khai cho app khác sử dụng
    - Cần tách rõ lớp backend domain phức tạp
    - Cần kiểm soát version API độc lập

    3) Điểm cần chú ý
    - Luôn validate input ở server
    - Xử lý lỗi trả về rõ ràng cho UI
    - Không đưa logic nhạy cảm vào client khi không cần thiết

    4) So sánh nhanh với API Route
    - Server Actions gọn hơn cho các tương tác nội bộ trong app
    - API Route linh hoạt hơn khi cần tích hợp ngoài

    Kết luận: chọn Server Actions khi ưu tiên tốc độ triển khai và độ gọn của code, còn API Route vẫn phù hợp khi bạn cần một lớp giao tiếp rõ ràng hơn.`,
    },
    {
      title: 'Next.js caching và revalidation thực chiến',
      excerpt: 'Hiểu rõ cache, revalidate và no-store trong dự án thật.',
      content: `Caching trong Next.js chỉ thực sự hữu ích khi bạn hiểu rõ dữ liệu nào nên ổn định và dữ liệu nào phải cập nhật ngay.

    1) Ba chế độ nên nhớ
    - static: tối ưu cho nội dung ít đổi
    - revalidate: cân bằng giữa tốc độ và độ mới
    - no-store: luôn lấy dữ liệu mới nhất

    2) Cách chọn theo loại trang
    - Trang blog, landing page: thường hợp với revalidate
    - Dashboard cá nhân: nhiều trường hợp cần no-store
    - Trang tài liệu: phù hợp static hoặc revalidate dài

    3) Lỗi hay gặp
    - Cache quá lâu khiến bài viết mới không hiện kịp
    - Dùng no-store cho mọi thứ làm mất lợi thế hiệu năng
    - Không phân biệt cache ở tầng route và tầng fetch

    4) Cách kiểm tra thực tế
    - Đọc lại header và behavior sau khi deploy
    - Test thay đổi nội dung rồi xem page refresh có phản ánh đúng không
    - Theo dõi tác động lên Core Web Vitals

    Kết luận: chiến lược cache tốt không phải là cache tối đa, mà là cache đúng chỗ.`,
    },
  ],
  Supabase: [
    {
      title: 'Supabase Auth: Email, OAuth và quản lý session',
      excerpt: 'Thiết lập đăng nhập Supabase Auth an toàn cho ứng dụng web.',
      content: `Bài này tập trung vào Supabase Auth, cách tích hợp OAuth, refresh session và quản lý trạng thái đăng nhập trong ứng dụng client/server.`,
    },
    {
      title: 'Supabase Storage cho upload ảnh dự án',
      excerpt: 'Lưu trữ ảnh vào bucket, lấy public URL và xử lý lỗi thường gặp.',
      content: `Chúng ta đi qua quy trình upload file lên Supabase Storage, đặt bucket policy và hiển thị ảnh tối ưu trên giao diện portfolio.`,
    },
    {
      title: 'Thiết kế schema PostgreSQL chuẩn trên Supabase',
      excerpt: 'Mẹo tạo bảng, khóa ngoại và index để query nhanh hơn.',
      content: `Bài viết trình bày cách xây dựng schema trên Supabase gồm normal form, foreign key, index và migration để dễ mở rộng.`,
    },
    {
      title: 'Debug lỗi RLS trong Supabase nhanh và đúng',
      excerpt: 'Checklist xử lý lỗi policy khi insert/update dữ liệu.',
      content: `RLS là lớp bảo vệ dữ liệu quan trọng trong Supabase, nhưng nó cũng là nơi dễ phát sinh lỗi nhất nếu policy không khớp với luồng nghiệp vụ.

    1) Hiểu đúng hai phần của policy
    - USING quyết định bản ghi nào được đọc, xóa hoặc nhìn thấy
    - WITH CHECK quyết định dữ liệu nào được phép ghi hoặc cập nhật

    2) Quy trình debug nên đi theo 5 bước
    - Kiểm tra user hiện tại có đăng nhập hay không
    - Xác nhận bảng đã bật RLS
    - Đọc lại policy theo từng thao tác select, insert, update, delete
    - Test trực tiếp bằng SQL Editor với role tương ứng
    - So sánh điều kiện policy với logic thực tế của ứng dụng

    3) Lỗi thường gặp
    - Chỉ viết USING mà quên WITH CHECK
    - So sánh sai kiểu dữ liệu giữa auth.uid() và user_id
    - Policy đúng cú pháp nhưng sai ý nghĩa nghiệp vụ

    4) Checklist trước khi deploy
    - Có test cho user A, user B và anonymous
    - Có policy riêng cho từng hành động
    - Có log lỗi rõ ràng ở server để phân biệt lỗi auth và lỗi data

    Kết luận: debug RLS hiệu quả không nằm ở việc thử ngẫu nhiên, mà ở việc kiểm tra đúng tầng: auth, policy, rồi mới đến dữ liệu thực tế.`,
    },
    {
      title: 'Supabase Realtime cho bình luận trực tiếp',
      excerpt: 'Cập nhật comment realtime mà không cần refresh trang.',
      content: `Supabase Realtime rất hợp cho bình luận, thông báo và các khu vực cần phản hồi ngay sau khi dữ liệu thay đổi.

    1) Bài toán nó giải quyết
    - Người dùng không phải reload để thấy comment mới
    - Giao diện phản hồi tự nhiên hơn
    - Trải nghiệm live được cải thiện rõ rệt

    2) Cách thiết kế luồng
    - Subscribe chỉ ở component cần live update
    - Gộp event mới vào state cục bộ một cách có kiểm soát
    - Đồng bộ lại dữ liệu khi cần refresh toàn bộ danh sách

    3) Lưu ý quan trọng
    - Tránh add duplicate khi event đến nhiều lần
    - Unsubscribe đúng lúc để không leak listener
    - Kiểm tra quyền đọc dữ liệu theo RLS

    4) Khi nào nên dùng
    - Comment feed
    - Notification panel
    - Dashboard metric thay đổi liên tục

    Kết luận: realtime nên phục vụ những điểm chạm thật sự cần live, thay vì gắn vào mọi nơi chỉ vì nghe có vẻ hiện đại.`,
    },
  ],
  'UI/UX': [
    {
      title: 'Nguyên tắc UI/UX cho dashboard sinh viên',
      excerpt: 'Cách thiết kế dashboard dễ đọc, dễ thao tác và có thứ bậc rõ ràng.',
      content: `Trong bài này, chúng ta áp dụng các nguyên tắc UI/UX như visual hierarchy, spacing system và consistency để nâng chất lượng dashboard.`,
    },
    {
      title: 'UI/UX micro-interactions giúp giao diện sống động',
      excerpt: 'Animation nhỏ nhưng đúng chỗ để tăng cảm giác chuyên nghiệp.',
      content: `Bài viết chia sẻ cách dùng micro-interactions trong UI/UX: hover, loading state và transition để tăng trải nghiệm mà không gây rối.`,
    },
    {
      title: 'Accessibility trong UI/UX: từ ARIA đến keyboard',
      excerpt: 'Các checklist accessibility cơ bản cho form, modal và navigation.',
      content: `Hướng dẫn cải thiện UI/UX theo accessibility: aria-label, focus trap, tab order và contrast để sản phẩm thân thiện hơn với mọi người dùng.`,
    },
    {
      title: 'UI/UX cho mobile: tối ưu tap target và spacing',
      excerpt: 'Những lỗi phổ biến khi thiết kế mobile và cách sửa nhanh.',
      content: `Thiết kế mobile tốt bắt đầu từ việc thừa nhận rằng ngón tay không chính xác như con trỏ chuột.

    1) Tap target phải đủ lớn
    - Nút quá nhỏ gây nhấn nhầm
    - Khoảng chạm tối thiểu nên thoải mái trên màn hình nhỏ
    - Icon-only button cần vùng chạm rộng hơn icon hiển thị

    2) Spacing quyết định khả năng đọc
    - Các block nội dung cần khoảng thở rõ ràng
    - Không nhồi quá nhiều hành động vào cùng một hàng
    - Dùng spacing nhất quán để mắt quét nhanh hơn

    3) Ưu tiên nội dung quan trọng
    - Màn hình nhỏ cần hierarchy rõ hơn desktop
    - Luôn đặt CTA chính ở vị trí dễ chạm
    - Giảm số bước trước khi người dùng hoàn tất tác vụ

    4) Checklist nhanh
    - Có thể thao tác bằng một tay không
    - Có vùng đệm đủ cho nút quan trọng không
    - Có đủ khoảng cách giữa các mục chạm liên tiếp không

    Kết luận: UI mobile đẹp không chỉ là gọn, mà là dễ chạm, dễ đọc và ít gây nhầm lẫn.`,
    },
    {
      title: 'Thiết kế hệ thống màu UI/UX nhất quán',
      excerpt: 'Xây dựng palette và semantic color token để scale giao diện.',
      content: `Hệ thống màu tốt giúp giao diện đồng nhất, dễ mở rộng và dễ bảo trì khi sản phẩm tăng quy mô.

    1) Tư duy semantic thay vì hard-code
    - Không gắn màu trực tiếp vào từng component
    - Dùng token theo ý nghĩa: primary, surface, text, success, warning, danger

    2) Cấu trúc token nên có
    - Base token: bảng màu gốc
    - Semantic token: màu theo ngữ nghĩa
    - Component token: ánh xạ token vào button, card, badge, alert

    3) Contrast và khả năng đọc
    - Text phải đủ tương phản trên mọi nền
    - Disabled state không nên chỉ giảm opacity mà làm mất ngữ nghĩa
    - Cần kiểm tra cả light mode và dark mode

    4) Lỗi hay gặp
    - Mỗi màn hình dùng một shade khác nhau cho cùng trạng thái
    - Dùng màu để biểu đạt quá nhiều ý nghĩa
    - Không có quy ước đặt tên token nên team khó đồng bộ

    5) Checklist triển khai
    - Có tài liệu token rõ ràng
    - Có quy ước cho success, warning, error
    - Có kiểm tra contrast trước khi release

    Kết luận: màu sắc nhất quán không chỉ làm giao diện đẹp hơn, mà còn giúp người dùng đọc nhanh và hiểu trạng thái hệ thống tốt hơn.`,
    },
  ],
  Portfolio: [
    {
      title: 'Xây dựng trang Portfolio nổi bật cho lập trình viên',
      excerpt: 'Cách trình bày dự án portfolio theo hướng kể chuyện sản phẩm.',
      content: `Bài viết hướng dẫn cách viết nội dung portfolio: bài toán, giải pháp, kết quả đo lường và công nghệ để tăng tính thuyết phục với nhà tuyển dụng.`,
    },
    {
      title: 'Portfolio project card: nội dung nào cần có?',
      excerpt: 'Checklist thông tin quan trọng trong mỗi project card của portfolio.',
      content: `Chúng ta bàn về cấu trúc project card trong portfolio: ảnh, mô tả ngắn, stack kỹ thuật, liên kết demo và nguồn code.`,
    },
    {
      title: 'Portfolio cá nhân và cách chọn dự án để trưng bày',
      excerpt: 'Không phải dự án nào cũng nên đưa vào portfolio.',
      content: `Bài này tập trung vào chiến lược chọn dự án portfolio theo mục tiêu nghề nghiệp, đảm bảo mỗi dự án thể hiện một năng lực khác nhau.`,
    },
    {
      title: 'Portfolio README giúp tăng sức thuyết phục',
      excerpt: 'Cách viết README cho mỗi dự án portfolio dễ hiểu và chuyên nghiệp.',
      content: `Bài viết hướng dẫn cấu trúc README cho portfolio gồm mục tiêu, kiến trúc, cách chạy và bài học rút ra sau khi triển khai.`,
    },
    {
      title: 'Case study trong portfolio: viết sao cho nổi bật?',
      excerpt: 'Biến một project thành case study có số liệu và giá trị rõ ràng.',
      content: `Case study tốt không chỉ mô tả dự án đã làm, mà còn chứng minh cách bạn tư duy khi giải quyết vấn đề.

    1) Khung problem - solution - impact
    - Problem: bối cảnh, ràng buộc, điểm đau của người dùng
    - Solution: kiến trúc, kỹ thuật, quyết định bạn chọn
    - Impact: kết quả đo được hoặc ít nhất là thay đổi có thể quan sát

    2) Phần Problem nên viết gì
    - Dự án phục vụ ai
    - Vấn đề cụ thể là gì
    - Tại sao giải pháp cũ chưa đủ tốt

    3) Phần Solution nên viết gì
    - Bạn chọn công nghệ gì và vì sao
    - Có trade-off nào đã cân nhắc
    - Có phần nào bạn làm khác đi để giảm rủi ro

    4) Phần Impact nên viết gì
    - Số liệu trước/sau nếu có
    - Kết quả về tốc độ, trải nghiệm hoặc quy trình
    - Bài học rút ra sau khi triển khai

    5) Checklist cho portfolio
    - Người xem hiểu được mục tiêu trong 10 giây không
    - Có đủ dấu ấn cá nhân trong quyết định kỹ thuật không
    - Có liên kết tới demo hoặc source code không

    Kết luận: case study mạnh là case study kể được câu chuyện ra quyết định, không chỉ khoe giao diện.`,
    },
  ],
  SEO: [
    {
      title: 'SEO cơ bản cho website Next.js',
      excerpt: 'Thiết lập title, description và Open Graph đúng chuẩn SEO.',
      content: `Hướng dẫn SEO cho Next.js với metadata API, semantic heading và internal linking để tăng khả năng hiển thị trên công cụ tìm kiếm.`,
    },
    {
      title: 'Technical SEO: sitemap, robots và structured data',
      excerpt: 'Những thành phần technical SEO không thể thiếu.',
      content: `Trong bài này, chúng ta cấu hình technical SEO gồm robots.txt, sitemap.xml và schema markup để cải thiện crawlability và rich snippets.`,
    },
    {
      title: 'On-page SEO cho bài blog kỹ thuật',
      excerpt: 'Tối ưu từ khóa SEO tự nhiên trong tiêu đề, đoạn mở đầu và nội dung.',
      content: `Bài viết chia sẻ khung on-page SEO: keyword intent, heading structure, readability và CTA phù hợp cho blog công nghệ.`,
    },
    {
      title: 'SEO audit nhanh cho website cá nhân',
      excerpt: 'Danh sách kiểm tra SEO kỹ thuật trước khi deploy production.',
      content: `SEO audit kỹ thuật giúp website cá nhân được lập chỉ mục đúng và tránh mất traffic vì lỗi cấu hình cơ bản.

    1) Kiểm tra khả năng index
    - robots.txt có chặn nhầm trang quan trọng không
    - Có sitemap.xml và canonical đúng không
    - Có trang trùng nội dung đang cạnh tranh với nhau không

    2) Metadata cốt lõi
    - Mỗi trang cần title và description riêng
    - Open Graph nên đủ để chia sẻ lên mạng xã hội
    - Heading H1/H2 phải rõ ràng và có cấu trúc

    3) Kiểm tra kỹ thuật on-page
    - 404 và redirect chain phải được xử lý gọn
    - Ảnh phải có alt text
    - Internal link nên dẫn về các trang quan trọng

    4) Tốc độ và trải nghiệm
    - Đo Core Web Vitals trên mobile
    - Giảm script không cần thiết ở đầu trang
    - Tối ưu ảnh và font để giảm layout shift

    5) Checklist định kỳ
    - Audit sau mỗi đợt release lớn
    - Theo dõi Search Console
    - Cập nhật nội dung cũ nếu bài đã lỗi thời

    Kết luận: SEO tốt là kết quả của quy trình kiểm tra đều đặn, không phải một lần tối ưu rồi bỏ đó.`,
    },
    {
      title: 'Tối ưu Core Web Vitals để cải thiện SEO',
      excerpt: 'LCP, CLS, INP ảnh hưởng thế nào đến thứ hạng SEO.',
      content: `Core Web Vitals phản ánh cách website tải và phản hồi trong mắt người dùng, nên nó ảnh hưởng trực tiếp đến trải nghiệm và SEO.

    1) Ba chỉ số cần theo dõi
    - LCP: phần nội dung lớn nhất xuất hiện khi nào
    - CLS: layout có bị xê dịch bất ngờ không
    - INP: thao tác của người dùng có được phản hồi nhanh không

    2) Cách tối ưu LCP
    - Ưu tiên tải hero image đúng kích thước
    - Preload tài nguyên quan trọng
    - Giảm blocking CSS và script ở đầu trang

    3) Cách tối ưu CLS
    - Luôn đặt width/height cho ảnh
    - Dự trù không gian cho banner hoặc font
    - Tránh chèn nội dung muộn làm đẩy layout

    4) Cách tối ưu INP
    - Tách nhỏ tác vụ JavaScript nặng
    - Trì hoãn script bên thứ ba không cần thiết
    - Dùng debounce/throttle cho sự kiện nhập liệu

    5) Quy trình theo dõi
    - Đo ở môi trường thật nếu có thể
    - So sánh trước và sau mỗi thay đổi
    - Sửa trang có traffic cao trước

    Kết luận: tối ưu Core Web Vitals là cách cải thiện song song trải nghiệm người dùng và khả năng hiển thị tìm kiếm.`,
    },
  ],
} as const

const samplePosts = Object.values(topicPosts).flat()

async function seedPosts() {
  try {
    let userId: string | null = null

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: seedEmail,
      password: seedPassword,
    })

    if (signInData.session?.user) {
      userId = signInData.session.user.id
      console.log(`📝 Đăng nhập seed user hiện có: ${userId}`)
    } else {
      if (signInError) {
        console.log('ℹ️ Chưa có seed user, tạo mới...')
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: seedEmail,
        password: seedPassword,
        options: {
          data: {
            display_name: 'Seed Content',
          },
        },
      })

      if (signUpError) {
        console.error('❌ Không tạo được seed user:', signUpError.message)
        return
      }

      userId = signUpData.user?.id ?? signUpData.session?.user.id ?? null

      if (!userId) {
        console.error('❌ Không lấy được user ID từ session đăng ký. Hãy kiểm tra cấu hình Supabase Auth.')
        return
      }

      console.log(`📝 Tạo seed user mới: ${userId}`)
    }

    // Insert hoặc update để script chạy nhiều lần vẫn an toàn
    const postsToInsert = samplePosts.map((post) => ({
      title: post.title,
      slug: generateSlug(post.title),
      excerpt: post.excerpt,
      content: post.content,
      author_id: userId,
      status: 'published',
      published_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('posts')
      .upsert(postsToInsert, { onConflict: 'slug' })
      .select()

    if (error) {
      console.error('❌ Lỗi:', error.message)
      return
    }

    console.log(`✅ Đã seed ${data?.length || 0} bài viết (mỗi chủ đề >= 3 bài)!`)
    console.log('Danh sách bài viết:')
    data?.forEach((post: { title?: string | null }, idx: number) => {
      console.log(`  ${idx + 1}. ${post.title}`)
    })
  } catch (error: unknown) {
    console.error('❌ Lỗi:', error instanceof Error ? error.message : String(error))
  }
}

seedPosts()
