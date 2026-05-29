/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const posts = [
  {
    title: 'Supabase là gì? Hướng dẫn BaaS mã nguồn mở',
    slug: 'supabase-la-gi-huong-dan-baas-ma-nguon-mo',
    excerpt: 'Supabase là một Backend-as-a-Service mã nguồn mở, được xây dựng trên PostgreSQL. Hãy khám phá các tính năng chính và cách sử dụng.',
    content: `Supabase là một nền tảng Backend-as-a-Service (BaaS) mã nguồn mở được xây trên PostgreSQL. Điểm mạnh của nó không chỉ nằm ở việc có sẵn database, auth hay storage, mà còn ở chỗ toàn bộ các phần đó được ghép lại theo một mô hình rất dễ phát triển cho ứng dụng web hiện đại.

1) Supabase giải quyết vấn đề gì?
- Bạn không phải tự dựng backend từ đầu cho từng tính năng phổ biến
- Bạn vẫn giữ được lợi thế của PostgreSQL và SQL
- Bạn có thể tập trung vào product thay vì quản lý infrastructure quá sớm

2) Các thành phần chính
- PostgreSQL Database: lưu dữ liệu quan hệ, hỗ trợ query phức tạp
- Authentication: email/password, OAuth, magic link, session management
- Realtime: subscribe dữ liệu thay đổi theo thời gian thực
- Storage: lưu ảnh, file và tài nguyên tĩnh
- Edge Functions: chạy logic serverless ở cạnh hệ thống

3) Khi nào nên dùng Supabase?
- Khi bạn muốn prototype nhanh nhưng không hy sinh cấu trúc dữ liệu
- Khi ứng dụng cần auth, upload file và realtime ngay từ đầu
- Khi team muốn đọc được SQL thay vì phụ thuộc hoàn toàn vào abstraction

4) So sánh tư duy với Firebase
- Supabase mạnh ở relational data và SQL
- Firebase mạnh ở tốc độ xây dựng nhưng thiên về NoSQL
- Supabase phù hợp hơn nếu dữ liệu có quan hệ rõ ràng như blog, dashboard, project, comment

5) Checklist triển khai thực tế
- Xác định rõ bảng nào public, bảng nào private
- Thiết kế RLS ngay từ đầu
- Dùng index cho các cột hay query
- Tách logic auth, storage và data access theo module

Kết luận: Supabase phù hợp nhất khi bạn muốn một backend hiện đại nhưng vẫn giữ được kiểm soát về dữ liệu, bảo mật và khả năng mở rộng.` ,
    image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'PostgreSQL vs NoSQL: Chọn cơ sở dữ liệu nào?',
    slug: 'postgresql-vs-nosql-chon-co-so-du-lieu-nao',
    excerpt: 'So sánh chi tiết giữa PostgreSQL (SQL) và NoSQL. Hiểu rõ khi nào dùng cái nào để lựa chọn đúng cho dự án của bạn.',
    content: `Khi chọn cơ sở dữ liệu, câu hỏi đúng không phải là “SQL hay NoSQL tốt hơn”, mà là “mô hình dữ liệu nào phù hợp nhất với bài toán của tôi”.

  1) PostgreSQL phù hợp khi nào?
  - Dữ liệu có quan hệ rõ ràng: users, posts, comments, orders
  - Cần transaction và tính toàn vẹn cao
  - Cần query tổng hợp, filter, join, báo cáo

  2) NoSQL phù hợp khi nào?
  - Dữ liệu linh hoạt và thay đổi schema thường xuyên
  - Dữ liệu lồng nhau hoặc document-based
  - Ưu tiên scale ngang và ghi nhanh

  3) Trade-off cần hiểu
  - PostgreSQL chặt chẽ hơn, nên dữ liệu sạch và query phức tạp mạnh
  - NoSQL linh hoạt hơn, nhưng dễ làm dữ liệu trùng lặp và logic phân tán

  4) Cách chọn thực tế
  - Blog, dashboard, ecommerce nhỏ và vừa: PostgreSQL thường hợp hơn
  - Chat, log, event stream hoặc dữ liệu biến động cao: NoSQL có thể hợp hơn
  - Nhiều hệ thống dùng kết hợp: PostgreSQL cho core data, Redis hoặc MongoDB cho nhu cầu riêng

  5) Checklist trước khi quyết định
  - Dữ liệu của bạn có quan hệ chặt không?
  - Bạn cần transaction mức nào?
  - Schema có thay đổi liên tục không?
  - Team của bạn mạnh về SQL hay document store hơn?

  Kết luận: chọn database tốt là chọn theo bản chất dữ liệu và nhu cầu phát triển dài hạn, không phải chạy theo xu hướng.` ,
    image_url: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Authentication là gì? Cách bảo mật người dùng trong ứng dụng',
    slug: 'authentication-la-gi-cach-bao-mat-nguoi-dung',
    excerpt: 'Hiểu rõ về Authentication (xác thực) và Authorization (phân quyền). Cách triển khai một hệ thống login an toàn.',
    content: `Authentication là quá trình xác minh danh tính người dùng. Authorization là quá trình quyết định họ được làm gì sau khi đã xác thực. Hai khái niệm này thường bị nhầm lẫn nhưng lại phục vụ hai tầng hoàn toàn khác nhau của bảo mật.

  1) Các cách xác thực phổ biến
  - Email/password: dễ triển khai, phù hợp đa số ứng dụng
  - Magic link: giảm gánh nặng nhớ mật khẩu
  - OAuth: tận dụng danh tính từ bên thứ ba
  - 2FA: tăng độ an toàn bằng lớp xác thực thứ hai

  2) Bảo mật mật khẩu đúng cách
  - Không lưu plain text
  - Dùng hash mạnh như bcrypt hoặc argon2
  - Có salt và tốc độ hash đủ chậm để chống brute force

  3) JWT vs session
  - JWT phù hợp khi cần stateless và nhiều client
  - Session phù hợp khi cần kiểm soát và revoke dễ hơn
  - Không có lựa chọn nào tốt tuyệt đối cho mọi hệ thống

  4) Rủi ro phổ biến
  - Brute force nếu không rate limit
  - Phishing nếu user không kiểm tra domain
  - MITM nếu không dùng HTTPS
  - XSS và SQL injection nếu input không được xử lý đúng

  5) Checklist thiết kế auth
  - Có step xác thực rõ ràng
  - Có kiểm tra quyền ở server
  - Có handling cho expired session/token
  - Có logging nhưng không lộ dữ liệu nhạy cảm

  Kết luận: hệ thống auth tốt là hệ thống cân bằng giữa an toàn, khả dụng và khả năng mở rộng.` ,
    image_url: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Realtime Database là gì? Cập nhật dữ liệu theo thời gian thực',
    slug: 'realtime-database-la-gi-cap-nhat-du-lieu-thuc-chinh',
    excerpt: 'Khám phá công nghệ Realtime Database. Cách triển khai chat, notification, collaborative editing với dữ liệu thay đổi liên tục.',
    content: `Realtime Database là công nghệ cho phép dữ liệu được cập nhật và đồng bộ giữa server và client theo thời gian thực, không cần refresh trang.

Cách hoạt động:

1. Traditional (Polling):
Client → Request data → Server → Response → Client (mỗi 5s)
- Không thực sự realtime
- Tốn bandwidth
- Độ trễ cao (up to 5s)

2. WebSocket (True Realtime):
Server ↔ WebSocket Connection ↔ Client
- Hai chiều: server gửi data ngay khi có thay đổi
- Client lắng nghe và cập nhật UI tức thì
- Tiết kiệm bandwidth
- Độ trễ cực thấp (< 100ms)

Các sử dụng của Realtime:

1. Chat / Messaging
- Tin nhắn xuất hiện ngay
- Xem khi người kia đang gõ
- Online status

2. Collaboration Tools
- Google Docs, Figma, Miro
- Nhiều người edit cùng lúc
- Thấy cursor của người khác
- Real-time typing indicator

3. Live Notifications
- Cập nhật số unread
- Alert khi có event mới
- Progress bar realtime

4. Live Dashboard
- Metrics cập nhật liên tục
- Stock prices, sports scores
- Analytics dashboard

5. Multiplayer Games
- Vị trí player update ngay
- Synchronize game state
- Latency compensation

Realtime Technologies:

1. WebSocket
- Two-way communication
- Full duplex (cả hai chiều cùng lúc)
- Được dùng phổ biến
- Hỗ trợ tốt trên browsers

2. Server-Sent Events (SSE)
- Server push data đến client
- One-way (chỉ server gửi)
- Dễ implement
- Tốt cho notifications

3. Polling
- Client hỏi server mỗi X time
- Simple nhưng không efficient
- Độ trễ cao
- Tốn bandwidth

Challenges:

1. Synchronization
- Multiple updates at same time
- Conflict resolution
- Operational Transform (OT) vs CRDT

2. Scalability
- Hàng ngàn connections cùng lúc
- Message queue (Redis, RabbitMQ)
- Horizontal scaling (sticky sessions)

3. Offline Support
- Nếu mất connection?
- Queue messages, sync lại khi online
- Service Workers

4. Security
- Validate mỗi update
- Row Level Security
- Rate limiting

Realtime Databases/Services:

- Supabase Realtime (PostgreSQL + WebSocket)
- Firebase Realtime Database
- Firebase Firestore (với listeners)
- Socket.io (library)
- PusherJS (service)
- Convex (modern BaaS)

Ví dụ Supabase Realtime:

const subscription = supabase
  .from('messages')
  .on('INSERT', payload => {
    // Thêm message mới vào UI
    setMessages([...messages, payload.new])
  })
  .subscribe()

Kết luận:

Realtime Database là công nghệ thiết yếu cho ứng dụng modern (chat, collaboration, notifications). WebSocket là cách best practice, kết hợp với proper message handling, conflict resolution, và security layers.`,
    image_url: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Backend-as-a-Service (BaaS) là gì? Tại sao startup dùng?',
    slug: 'baas-backend-as-a-service-la-gi-tai-sao-startup-dung',
    excerpt: 'Hiểu về Backend-as-a-Service. Ưu nhược điểm của BaaS so với tự build backend. Khi nào nên dùng BaaS?',
    content: `Backend-as-a-Service (BaaS) là mô hình cung cấp cloud service cho phép developer xây dựng ứng dụng mà không cần quản lý backend infrastructure.

Thay vì tự build:
- Database
- Authentication
- API servers
- File storage
- Email service
- Payment processing

Bạn sử dụng BaaS provider (Supabase, Firebase, etc) để có những features này sẵn.

Các thành phần của BaaS:

1. Database as a Service
- Managed PostgreSQL, MongoDB
- Automatic backups
- Scaling tự động
- Monitoring & alerts

2. Authentication as a Service
- User registration, login
- Social auth (Google, GitHub)
- Multi-factor authentication
- Session management

3. Storage as a Service
- File upload/download
- CDN tích hợp
- Access control
- Image optimization

4. API Gateway
- Endpoints tự động
- Rate limiting
- Request/response logging
- API documentation

5. Functions as a Service (FaaS)
- Serverless functions
- Event-driven
- Auto-scaling
- Pay-per-execution

Ưu điểm của BaaS:

✓ Nhanh chóng
- Không cần setup server
- Có thể launch trong 1-2 ngày
- Focus vào frontend/product

✓ Chi phí thấp
- Startup không cần team backend
- Flexible pricing (pay-as-you-go)
- Không cần DevOps engineer

✓ Scalability
- Tự động scale khi cần
- Không cần lo infra
- Handle traffic spikes

✓ Bảo mật
- Certified security
- Automatic updates
- PCI-DSS compliant

✓ Maintenance
- Automatic backups
- Uptime 99.99%
- Provider maintain infrastructure

Nhược điểm của BaaS:

✗ Vendor Lock-in
- Khó migrate sang provider khác
- Phụ thuộc vào provider
- Ngôn ngữ/framework hạn chế

✗ Giá thay đổi
- Pricing có thể tăng
- Unexpected costs ở scale lớn
- Difficult to predict bills

✗ Limitations
- Queries có thể hạn chế
- Custom logic khó implement
- Performance tuning limited

✗ Privacy
- Data lưu trên server của provider
- Cần review privacy policy
- Compliance issues (GDPR, etc)

✗ Support
- Tùy vào tier
- Community support có thể không đủ

BaaS vs Backend tự build:

BaaS tốt cho:
- Startup muốn launch nhanh
- MVP (Minimum Viable Product)
- Ít traffic ban đầu
- Không cần logic backend phức tạp
- Team nhỏ (1-2 developers)

Tự build tốt cho:
- Large scale applications
- Custom business logic phức tạp
- Cần full control
- Cost-sensitive ở scale lớn
- Team backend lớn

Các BaaS Provider nổi tiếng:

1. Firebase (Google)
- Most popular
- Realtime database, hosting
- Cloud functions

2. Supabase
- PostgreSQL open-source
- Row Level Security
- More flexible queries

3. Convex
- Modern, TypeScript-first
- Reactive system
- Built-in auth & storage

4. AWS Amplify
- Tích hợp AWS services
- Powerful nhưng phức tạp
- Most expensive

5. Back4app
- Parse platform
- Self-hostable

Kết luận:

BaaS là lựa chọn thông minh cho startup và MVP. Bạn tiết kiệm thời gian, tiền bạc, và engineering effort. Tuy nhiên, khi ứng dụng lớn (million+ users, complex logic), hãy cân nhắc backend tự build để tối ưu chi phí và linh hoạt hơn.`,
    image_url: 'https://images.pexels.com/photos/3769714/pexels-photo-3769714.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
]

async function insertPosts() {
  try {
    // Get the first user to use as author
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (!profiles || profiles.length === 0) {
      console.error('❌ Không tìm thấy user nào')
      return
    }

    const authorId = profiles[0].id

    // Insert posts
    const { error } = await supabase.from('posts').insert(
      posts.map(post => ({
        author_id: authorId,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image_url: post.image_url,
        status: 'published',
        published_at: new Date().toISOString()
      }))
    )

    if (error) {
      console.error('❌ Lỗi khi thêm bài viết:', error.message)
      return
    }

    console.log(`✅ Thêm ${posts.length} bài viết chi tiết thành công!`)

    // Count total posts
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    console.log(`📊 Tổng bài viết published: ${count}`)
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  }
}

insertPosts()
