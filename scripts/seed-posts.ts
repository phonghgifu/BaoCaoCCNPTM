import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

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
      content: `Bài viết phân tích ưu và nhược điểm của Server Actions trong Next.js, cách validate dữ liệu và xử lý lỗi khi submit form.`,
    },
    {
      title: 'Next.js caching và revalidation thực chiến',
      excerpt: 'Hiểu rõ cache, revalidate và no-store trong dự án thật.',
      content: `Chúng ta sẽ đi qua các chiến lược caching trong Next.js và cách chọn revalidation phù hợp cho trang nội dung cập nhật thường xuyên.`,
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
      content: `Bài viết đưa ra quy trình debug RLS trong Supabase: kiểm tra auth.uid(), policy using/with check và test bằng SQL Editor.`,
    },
    {
      title: 'Supabase Realtime cho bình luận trực tiếp',
      excerpt: 'Cập nhật comment realtime mà không cần refresh trang.',
      content: `Hướng dẫn cấu hình Supabase Realtime để đồng bộ bình luận theo thời gian thực và tránh duplicate event ở phía client.`,
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
      content: `Bài viết tổng hợp các nguyên tắc UI/UX cho mobile như kích thước tap target, khoảng cách thao tác và hierarchy dễ đọc trên màn hình nhỏ.`,
    },
    {
      title: 'Thiết kế hệ thống màu UI/UX nhất quán',
      excerpt: 'Xây dựng palette và semantic color token để scale giao diện.',
      content: `Chúng ta áp dụng color tokens trong UI/UX để đồng nhất trạng thái success, warning, error và tối ưu contrast ở cả light/dark mode.`,
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
      content: `Hướng dẫn trình bày case study trong portfolio theo cấu trúc problem-solution-impact để tạo ấn tượng mạnh khi phỏng vấn.`,
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
      content: `Bài viết cung cấp quy trình SEO audit gồm indexability, canonical, metadata và tốc độ tải trang để cải thiện hiệu quả tìm kiếm.`,
    },
    {
      title: 'Tối ưu Core Web Vitals để cải thiện SEO',
      excerpt: 'LCP, CLS, INP ảnh hưởng thế nào đến thứ hạng SEO.',
      content: `Chúng ta phân tích Core Web Vitals và cách tối ưu ảnh, font, script để tăng điểm hiệu năng, qua đó hỗ trợ SEO dài hạn.`,
    },
  ],
} as const

const samplePosts = Object.values(topicPosts).flat()

async function seedPosts() {
  try {
    // Lấy user đầu tiên
    const { data: { users } } = await supabase.auth.admin.listUsers()

    if (!users || users.length === 0) {
      console.error('❌ Không tìm thấy user nào. Vui lòng tạo user trước.')
      return
    }

    const userId = users[0].id
    console.log(`📝 Sử dụng user ID: ${userId}`)

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
    data?.forEach((post: any, idx: number) => {
      console.log(`  ${idx + 1}. ${post.title}`)
    })
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message)
  }
}

seedPosts()
