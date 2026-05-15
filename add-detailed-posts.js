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
    content: `Supabase là một nền tảng Backend-as-a-Service (BaaS) mã nguồn mở, được xây dựng trên nền tảng PostgreSQL. Nó cung cấp đầy đủ các tính năng cần thiết cho một backend hiện đại, giúp bạn xây dựng ứng dụng nhanh chóng mà không cần quản lý server phức tạp.

Các tính năng chính của Supabase:

1. PostgreSQL Database
- Cơ sở dữ liệu quan hệ mạnh mẽ
- Hỗ trợ các truy vấn SQL phức tạp
- Khả năng mở rộng không giới hạn
- Backup tự động và recovery

2. Authentication (Xác thực)
- Xác thực đa phương thức: email/password, OAuth, Magic Link
- Quản lý session tự động
- Mã hóa mật khẩu an toàn
- Hỗ trợ social login

3. Realtime (Cập nhật theo thời gian thực)
- Broadcast thay đổi dữ liệu realtime
- Presence tracking (theo dõi người dùng online)
- Collaboration features
- Subscription-based updates

4. Storage (Lưu trữ file)
- Lưu trữ file và hình ảnh
- CDN tích hợp để truy cập nhanh
- Access control với Row Level Security
- URL công khai cho file

5. Edge Functions (Serverless)
- Chạy code JavaScript/TypeScript trên edge
- Không cần setup server
- Tự động scaling
- Kết nối với Supabase database

So sánh Supabase với Firebase:

Điểm giống nhau:
- Cả hai đều là BaaS
- Cung cấp authentication, realtime, storage
- Dễ tích hợp với frontend

Điểm khác biệt chính:
- Supabase dùng PostgreSQL (SQL), Firebase dùng Firestore (NoSQL)
- Supabase mã nguồn mở, Firebase là proprietary
- Supabase cho phép truy vấn SQL phức tạp
- Supabase có RLS (Row Level Security) tích hợp
- Firebase có Firestore dengan koleksi nested, Supabase dùng relational schema
- Supabase rẻ hơn Firebase ở phần lưu trữ dữ liệu lớn

Tại sao chọn Supabase?

✓ Mã nguồn mở - bạn có toàn quyền kiểm soát
✓ SQL mạnh mẽ - truy vấn dữ liệu phức tạp dễ dàng
✓ RLS Security - bảo mật ở mức row
✓ PostgreSQL - đáng tin cậy, được dùng rộng rãi
✓ Giá rẻ - phù hợp với startup
✓ Developer-friendly - API rõ ràng, documentation tốt

Kết luận:

Supabase là lựa chọn tuyệt vời cho những developer muốn xây dựng backend mạnh mẽ mà không cần lo lắng về infrastructure. Nếu bạn cần SQL, mã nguồn mở, và giá cả hợp lý, Supabase là giải pháp hoàn hảo.`,
    image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'PostgreSQL vs NoSQL: Chọn cơ sở dữ liệu nào?',
    slug: 'postgresql-vs-nosql-chon-co-so-du-lieu-nao',
    excerpt: 'So sánh chi tiết giữa PostgreSQL (SQL) và NoSQL. Hiểu rõ khi nào dùng cái nào để lựa chọn đúng cho dự án của bạn.',
    content: `Khi xây dựng ứng dụng, một trong những quyết định quan trọng nhất là lựa chọn cơ sở dữ liệu. PostgreSQL (SQL) và NoSQL đều có ưu và nhược điểm riêng.

PostgreSQL (Relational Database - SQL):

Ưu điểm:
- ACID compliance - đảm bảo tính toàn vẹn dữ liệu
- SQL query language - mạnh mẽ, dễ học
- JOIN tables - kết hợp dữ liệu từ nhiều bảng
- Relationship management - quản lý quan hệ giữa các entity
- Mature ecosystem - công cụ, tài liệu rất nhiều
- Transaction support - giao dịch an toàn

Nhược điểm:
- Schema rigid - phải định nghĩa structure trước
- Vertical scaling - khó mở rộng ngang (horizontal)
- Phức tạp với dữ liệu không cấu trúc

NoSQL (Document/Key-Value Databases):

Ưu điểm:
- Flexible schema - thay đổi structure dễ dàng
- Horizontal scaling - mở rộng ngang dễ
- Tốc độ nhanh với dữ liệu đơn giản
- Lưu dữ liệu không cấu trúc tốt
- Nested data support - lưu trữ object phức tạp

Nhược điểm:
- Không có JOIN - khó kết hợp dữ liệu
- Consistency issues - eventual consistency
- Không có ACID transactions
- Data duplication - dữ liệu trùng lặp

So sánh chi tiết:

Dữ liệu cấu trúc (Structured):
→ PostgreSQL tốt hơn (user profiles, products, orders)

Dữ liệu lồng nhau (Nested):
→ NoSQL tốt hơn (JSON documents, logs)

Truy vấn phức tạp:
→ PostgreSQL (JOIN, aggregation)

Tốc độ ghi dữ liệu:
→ NoSQL nhanh hơn

Mở rộng:
→ NoSQL dễ mở rộng ngang (horizontal)

Khi nào dùng PostgreSQL:

✓ E-commerce: users, products, orders - cần relational
✓ CRM: contacts, deals, pipelines - cần relationship
✓ Blog/News: articles, authors, comments - cần JOIN
✓ Banking: transactions cần ACID compliance
✓ Complex queries: reports, analytics

Khi nào dùng NoSQL:

✓ Real-time analytics: huge volume data
✓ Chat apps: unstructured messages
✓ Social media: flexible profile data
✓ IoT: sensor data, logs
✓ Content management: flexible documents

Kết luận:

Không có cơ sở dữ liệu hoàn hảo. PostgreSQL tốt cho ứng dụng business logic phức tạp, NoSQL tốt cho scale lớn với dữ liệu đơn giản. Nhiều startup ngày nay dùng cả hai (PostgreSQL + Redis/MongoDB) cho trường hợp sử dụng khác nhau.`,
    image_url: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Authentication là gì? Cách bảo mật người dùng trong ứng dụng',
    slug: 'authentication-la-gi-cach-bao-mat-nguoi-dung',
    excerpt: 'Hiểu rõ về Authentication (xác thực) và Authorization (phân quyền). Cách triển khai một hệ thống login an toàn.',
    content: `Authentication (Xác thực) là quá trình xác minh danh tính của người dùng. Nó trả lời câu hỏi: "Bạn là ai?"

Authorization (Phân quyền) là quá trình quyết định quyền hạn của người dùng đã được xác thực. Nó trả lời câu hỏi: "Bạn có quyền làm gì?"

Các phương pháp Authentication:

1. Email/Password
- Người dùng đăng ký với email và password
- Server hash mật khẩu (bcrypt, argon2)
- Kiểm tra khi đăng nhập
- Đơn giản nhưng cần mật khẩu mạnh
- Nguy hiểm nếu user dùng lại mật khẩu

2. Magic Link (Email)
- Gửi link đặc biệt đến email người dùng
- Click link để đăng nhập (không cần password)
- An toàn hơn (không lưu password)
- Cần confirm email
- Tốc độ đăng nhập chậm (phải check email)

3. Two-Factor Authentication (2FA)
- Yêu cầu 2 bước xác thực
- Ví dụ: password + OTP (one-time password)
- OTP có thể từ SMS, email, hoặc authenticator app
- Rất an toàn nhưng phức tạp hơn
- Google Authenticator, Authy, ...

4. OAuth (Social Login)
- Đăng nhập bằng Google, Facebook, GitHub, ...
- Không cần password
- Người dùng ủy quyền cho app
- Sử dụng xác thực của bên thứ ba
- Thuận tiện nhưng phụ thuộc vào third-party

5. Biometric (Sinh trắc)
- Vân tay (Fingerprint)
- Nhận diện khuôn mặt (Face Recognition)
- Rất an toàn và tiện lợi
- Chủ yếu trên mobile apps
- Khó implement trên web

Bảo mật Password:

❌ Sai:
- Lưu password plain text
- Hash weak (MD5, SHA1)
- Không salt

✓ Đúng:
- Dùng bcrypt, argon2, scrypt
- Tự động add salt
- Slow hashing (intentional)
- Minimize password lifetime

JWT Token vs Session:

JWT (JSON Web Token):
- Token stateless, không cần lưu server
- Dùng cho API, mobile, microservices
- Dễ scale (không cần sync session)
- Có thể revoke khó (cần blacklist)

Session:
- Lưu session trên server
- Dùng cho web traditional
- Cần session store (Redis, database)
- Revoke dễ (xóa session)

Hacking Common:

1. Brute Force
→ Giới hạn attempts, rate limiting

2. Phishing
→ Kiểm tra URL, 2FA

3. Man-in-the-Middle
→ HTTPS, Secure cookies

4. SQL Injection
→ Parameterized queries

5. XSS (Cross-Site Scripting)
→ Sanitize input, CSP headers

Kết luận:

Authentication là nền tảng của bảo mật ứng dụng. Không có cách nào hoàn hảo, hãy mix nhiều phương pháp (password + 2FA, OAuth + JWT) để có hệ thống vừa an toàn vừa user-friendly.`,
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
