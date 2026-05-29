# CHƯƠNG 3. PHÂN TÍCH CHỨC NĂNG

## 3.1 Tổng Quan Phân Tích Chức Năng

### 3.1.1 Định Nghĩa và Mục Đích

Phân tích chức năng (Functional Analysis) là quá trình chi tiết hóa các yêu cầu chính từ Chương 2 thành các chức năng cụ thể, dễ hiểu, và có khả năng triển khai. Mục đích của phân tích chức năng là:

- **Làm rõ yêu cầu**: Chuyển đổi yêu cầu chung chung thành các chức năng cụ thể với định nghĩa rõ ràng
- **Định nghĩa actor và luồng**: Xác định ai sử dụng chức năng, điều kiện tiên quyết, và các bước thực hiện
- **Xác định tiêu chí chấp nhận**: Thiết lập các tiêu chí để xác minh rằng chức năng được triển khai đúng
- **Hỗ trợ thiết kế**: Cung cấp cơ sở cho giai đoạn thiết kế chi tiết và triển khai

### 3.1.2 Cấu Trúc Mô Tả Chức Năng

Mỗi chức năng được mô tả theo cấu trúc đồng nhất bao gồm:

| Phần tử | Mô tả |
|--------|------|
| **Mô tả (Description)** | Mục đích chức năng, lợi ích người dùng |
| **Actor** | Người dùng hoặc vai trò sử dụng chức năng |
| **Input** | Dữ liệu đầu vào với định dạng và ràng buộc |
| **Output** | Kết quả trả về sau khi thực hiện chức năng |
| **Precondition** | Điều kiện tiên quyết phải thỏa mãn trước khi thực hiện |
| **Main Flow** | Luồng chính mô tả các bước thực hiện bình thường |
| **Alternative Flow** | Các trường hợp ngoại lệ và xử lý lỗi |
| **Postcondition** | Trạng thái hệ thống sau khi thực hiện thành công |
| **Acceptance Criteria** | Tiêu chí chấp nhận để xác minh chức năng |

### 3.1.3 Phân Loại Chức Năng

Các chức năng của hệ thống được phân loại thành các nhóm chính:

1. **Hệ thống xác thực (Authentication System)**: Quản lý tài khoản và phiên đăng nhập
2. **Quản lý bài viết (Post Management)**: Tạo, chỉnh sửa, xóa, liệt kê bài viết
3. **Hệ thống bình luận (Comments System)**: Tạo, xóa bình luận theo thời gian thực
4. **Tương tác nội dung (Interaction Features)**: Like/Unlike bài viết
5. **Quản lý hình ảnh (Image Management)**: Tải lên và quản lý hình ảnh
6. **Tìm kiếm và lọc (Search & Filtering)**: Tìm kiếm nội dung và lọc bài viết
7. **Quản lý hồ sơ (User Profile Management)**: Xem và chỉnh sửa thông tin cá nhân
8. **Quản trị hệ thống (Admin Dashboard)**: Thống kê và quản lý người dùng

---

## 3.2 Hệ Thống Xác Thực (Authentication System)

### 3.2.1 Đăng Ký Người Dùng (User Registration)

#### Mô Tả
Cho phép người dùng vô danh tạo tài khoản mới thông qua email và mật khẩu. Sau khi đăng ký thành công, hệ thống sẽ gửi email xác minh và tài khoản sẽ ở trạng thái chờ xác minh.

#### Actor
- **Primary Actor**: Khách vô danh (Anonymous User)
- **Secondary Actor**: Hệ thống email, Supabase Auth

#### Input
- **Email**: string, định dạng RFC 5322, phải là duy nhất trong hệ thống
- **Mật khẩu**: string, độ dài tối thiểu 8 ký tự, phải chứa: uppercase, lowercase, số, ký tự đặc biệt
- **Tên hiển thị**: string, độ dài 1-100 ký tự
- **Xác nhận mật khẩu**: string, phải trùng khớp với mật khẩu

#### Output
- Tài khoản người dùng được tạo với trạng thái email_pending
- Email xác minh được gửi đến địa chỉ email đăng ký
- Người dùng được chuyển hướng tới trang "Kiểm tra email của bạn"

#### Precondition
- Người dùng không đăng nhập
- Hệ thống email hoạt động bình thường

#### Main Flow
1. Người dùng nhấp vào nút "Đăng ký"
2. Biểu mẫu đăng ký được hiển thị với các trường: email, mật khẩu, xác nhận mật khẩu, tên hiển thị
3. Người dùng nhập đầy đủ thông tin
4. Người dùng nhấp nút "Đăng ký"
5. Hệ thống xác thực định dạng dữ liệu:
   - Email có định dạng RFC 5322
   - Mật khẩu đủ mạnh (chứa uppercase, lowercase, số, ký tự đặc biệt)
   - Xác nhận mật khẩu trùng khớp
   - Tên hiển thị độ dài hợp lệ
6. Hệ thống kiểm tra email chưa tồn tại trong cơ sở dữ liệu
7. Hệ thống hash mật khẩu bằng bcrypt (cost ≥ 12)
8. Hệ thống tạo bản ghi người dùng với trạng thái email_pending
9. Hệ thống tạo token xác minh email (có hiệu lực 24 giờ)
10. Hệ thống gửi email xác minh chứa link với token
11. Người dùng được chuyển hướng tới trang "Kiểm tra email"

#### Alternative Flow
- **Email đã tồn tại**: Hiển thị thông báo lỗi "Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác"
- **Mật khẩu không đủ mạnh**: Hiển thị thông báo yêu cầu mật khẩu phải chứa: chữ hoa, chữ thường, số, ký tự đặc biệt
- **Mật khẩu không trùng khớp**: Hiển thị thông báo "Xác nhận mật khẩu không khớp"
- **Email gửi thất bại**: Hiển thị thông báo "Có lỗi khi gửi email. Vui lòng thử lại" và cho phép người dùng yêu cầu gửi lại email

#### Postcondition
- Bản ghi người dùng được tạo trong cơ sở dữ liệu
- Trạng thái tài khoản: email_pending
- Email xác minh được gửi thành công

#### Acceptance Criteria
- ✅ Email được xác thực theo RFC 5322
- ✅ Mật khẩu được hash bằng bcrypt với cost ≥ 12
- ✅ Email xác minh được gửi trong < 5 giây
- ✅ Token xác minh có hiệu lực 24 giờ
- ✅ Người dùng không thể đăng nhập cho đến khi xác minh email
- ✅ Email chưa được xác minh không thể tạo bài viết

---

### 3.2.2 Đăng Nhập Người Dùng (User Login)

#### Mô Tả
Cho phép người dùng đăng nhập vào hệ thống bằng email/mật khẩu hoặc thông qua GitHub OAuth. Sau khi xác thực thành công, hệ thống tạo phiên đăng nhập và JWT token.

#### Actor
- **Primary Actor**: Người dùng (có tài khoản đã xác minh email)
- **Secondary Actor**: GitHub (cho OAuth), Supabase Auth

#### Input

**Phương thức 1: Email/Password**
- Email: string, định dạng RFC 5322
- Mật khẩu: string

**Phương thức 2: GitHub OAuth**
- Authorization code từ GitHub (được gửi từ redirect callback)

#### Output
- JWT token được tạo (có hiệu lực 7 ngày)
- Token được lưu trong HTTP-only cookie
- Người dùng được chuyển hướng tới dashboard
- Session được khởi tạo

#### Precondition
- Tài khoản đã được đăng ký
- Email đã được xác minh
- Hệ thống đăng nhập hoạt động bình thường

#### Main Flow - Phương Thức Email/Password

1. Người dùng nhấp vào "Đăng nhập"
2. Biểu mẫu đăng nhập được hiển thị
3. Người dùng nhập email và mật khẩu
4. Người dùng nhấp "Đăng nhập"
5. Hệ thống xác thực định dạng email (RFC 5322)
6. Hệ thống tìm người dùng theo email trong cơ sở dữ liệu
7. Hệ thống so sánh mật khẩu nhập với hash bcrypt
8. Hệ thống kiểm tra tài khoản không bị khóa (failed_login_attempts < 5)
9. Hệ thống reset bộ đếm failed_login_attempts
10. Hệ thống tạo JWT token với exp: 7 ngày, iss: blog-system, sub: user_id
11. Hệ thống lưu JWT trong HTTP-only cookie với thuộc tính: Secure, SameSite=Strict
12. Hệ thống ghi nhật ký đăng nhập (timestamp, IP address)
13. Người dùng được chuyển hướng tới /dashboard

#### Main Flow - Phương Thức GitHub OAuth

1. Người dùng nhấp "Đăng nhập bằng GitHub"
2. Hệ thống chuyển hướng tới endpoint GitHub OAuth (authorize)
3. GitHub hiển thị trang xác minh
4. Người dùng xác minh và GitHub gửi callback code
5. Hệ thống nhận code từ query parameter
6. Hệ thống exchange code cho access_token từ GitHub API
7. Hệ thống lấy thông tin người dùng từ GitHub API (/user endpoint)
8. Hệ thống kiểm tra người dùng GitHub có tồn tại trong database (theo github_id)
9. **Trường hợp người dùng mới**: Tạo bản ghi người dùng mới, email từ GitHub, email_verified = true
10. **Trường hợp người dùng tồn tại**: Cập nhật github_id nếu chưa liên kết
11. Hệ thống tạo JWT token (exp: 7 ngày)
12. Hệ thống lưu JWT trong HTTP-only cookie
13. Người dùng được chuyển hướng tới /dashboard

#### Alternative Flow

- **Email không tồn tại**: Hiển thị thông báo "Email không được tìm thấy. Vui lòng đăng ký hoặc thử email khác"
- **Mật khẩu sai**: Hiển thị thông báo "Mật khẩu không chính xác". Tăng failed_login_attempts
- **Quá 5 lần sai (tài khoản bị khóa)**: Hiển thị thông báo "Tài khoản bị khóa do quá nhiều lần nhập sai. Vui lòng đặt lại mật khẩu"
- **Email chưa xác minh**: Hiển thị thông báo "Vui lòng xác minh email trước khi đăng nhập" và cho phép gửi lại email xác minh
- **GitHub auth thất bại**: Hiển thị thông báo "Không thể kết nối với GitHub. Vui lòng thử lại" và quay trở lại trang đăng nhập
- **Token hết hạn**: Hệ thống tự động làm mới token khi còn < 1 ngày hiệu lực (refresh trong background)

#### Postcondition
- JWT token được lưu trong HTTP-only cookie
- Phiên đăng nhập được tạo trong hệ thống
- Người dùng có quyền truy cập tài nguyên được bảo vệ
- Nhật ký đăng nhập được ghi

#### Acceptance Criteria
- ✅ Email/password xác thực chính xác
- ✅ GitHub OAuth integration hoạt động
- ✅ JWT token ký bằng RS256, exp < 7 ngày
- ✅ Cookie là HTTP-only, Secure, SameSite=Strict
- ✅ Rate limiting: tối đa 5 lần cố gắng/5 phút trên một IP
- ✅ Token được làm mới tự động khi còn < 1 ngày
- ✅ Đăng nhập thất bại được ghi nhật ký

---

### 3.2.3 Quên Mật Khẩu (Password Reset)

#### Mô Tả
Cho phép người dùng đặt lại mật khẩu thông qua email khi quên mật khẩu hiện tại. Hệ thống gửi link chứa token có hiệu lực hạn chế.

#### Actor
- **Primary Actor**: Người dùng (có tài khoản)
- **Secondary Actor**: Hệ thống email, Supabase Auth

#### Input
- **Email**: string, định dạng RFC 5322

#### Output
- Email khôi phục mật khẩu được gửi
- Thông báo "Kiểm tra email của bạn để đặt lại mật khẩu"
- Link khôi phục chứa reset token

#### Precondition
- Người dùng có tài khoản trong hệ thống

#### Main Flow

1. Người dùng nhấp "Quên mật khẩu" trên trang đăng nhập
2. Biểu mẫu nhập email được hiển thị
3. Người dùng nhập email
4. Người dùng nhấp "Gửi link khôi phục"
5. Hệ thống xác thực định dạng email
6. Hệ thống kiểm tra email có tồn tại (không tiết lộ)
7. Hệ thống tạo token reset password (random, 32 bytes hex)
8. Hệ thống hash token bằng SHA-256
9. Hệ thống lưu token hash vào database với exp: 1 giờ, field: password_reset_token, password_reset_expires
10. Hệ thống tạo link: `https://blog.com/reset-password?token={token}`
11. Hệ thống gửi email chứa link khôi phục
12. Hiển thị thông báo "Email khôi phục đã được gửi. Kiểm tra email của bạn"
13. Người dùng nhấp link trong email
14. Hệ thống xác thực token (kiểm tra exp, so sánh hash)
15. Biểu mẫu đặt lại mật khẩu được hiển thị
16. Người dùng nhập mật khẩu mới và xác nhận
17. Hệ thống xác thực mật khẩu mới (độ mạnh)
18. Hệ thống hash mật khẩu mới (bcrypt, cost ≥ 12)
19. Hệ thống cập nhật password hash trong database
20. Hệ thống xóa password_reset_token (invalidate)
21. Hiển thị thông báo "Mật khẩu đã được đặt lại. Vui lòng đăng nhập"
22. Chuyển hướng tới trang đăng nhập

#### Alternative Flow

- **Email không tồn tại**: Hiển thị thông báo "Nếu email tồn tại, liên kết khôi phục sẽ được gửi" (không tiết lộ)
- **Token hết hạn**: Hiển thị thông báo "Link đã hết hạn. Vui lòng yêu cầu link mới"
- **Email gửi thất bại**: Cho phép người dùng yêu cầu gửi lại email
- **Token đã sử dụng**: Hiển thị thông báo "Link đã được sử dụng. Vui lòng yêu cầu link mới"

#### Postcondition
- Mật khẩu được cập nhật trong hệ thống
- Token reset được invalidate
- Người dùng có thể đăng nhập với mật khẩu mới

#### Acceptance Criteria
- ✅ Reset token có hiệu lực 1 giờ
- ✅ Reset link chỉ có thể sử dụng 1 lần (one-time use)
- ✅ Email khôi phục được gửi trong < 5 giây
- ✅ Không tiết lộ thông tin người dùng (email tồn tại hay không)
- ✅ Mật khẩu cũ không thể được sử dụng để đăng nhập sau khi reset

---

### 3.2.4 Đăng Xuất (Logout)

#### Mô Tả
Cho phép người dùng kết thúc phiên đăng nhập an toàn. Hệ thống xóa JWT token và invalidate phiên.

#### Actor
- **Primary Actor**: Người dùng đã đăng nhập

#### Input
- Không có input

#### Output
- JWT token được xóa
- Phiên kết thúc
- Người dùng được chuyển hướng tới trang chủ

#### Precondition
- Người dùng đang đăng nhập

#### Main Flow

1. Người dùng nhấp "Đăng xuất"
2. Hệ thống xóa HTTP-only cookie chứa JWT
3. Hệ thống ghi nhật ký đăng xuất (timestamp, user_id)
4. Người dùng được chuyển hướng tới `/`

#### Postcondition
- JWT token không còn hiệu lực
- Phiên đăng nhập được kết thúc
- Người dùng mất quyền truy cập tài nguyên được bảo vệ

#### Acceptance Criteria
- ✅ Cookie được xóa hoàn toàn
- ✅ Đăng xuất được ghi nhật ký
- ✅ Người dùng không thể sử dụng token cũ

---

## 3.3 Quản Lý Bài Viết (Post Management)

### 3.3.1 Tạo Bài Viết (Create Post)

#### Mô Tả
Cho phép tác giả tạo bài viết mới với tiêu đề, nội dung, hình ảnh bìa. Bài viết có thể được lưu dưới dạng bản nháp hoặc xuất bản ngay lập tức.

#### Actor
- **Primary Actor**: Người dùng đã xác thực (Tác giả)
- **Secondary Actor**: Supabase Storage, Supabase Database

#### Input
- **Tiêu đề**: string, độ dài 1-200 ký tự
- **Tóm tắt**: string, độ dài 1-500 ký tự
- **Nội dung**: HTML/Markdown, độ dài tối thiểu 100 ký tự
- **Ảnh bìa**: file image (JPEG, PNG, WebP), kích thước tối đa 5MB
- **Trạng thái**: enum (draft | published)

#### Output
- Bài viết được tạo trong cơ sở dữ liệu
- Slug được tự động tạo từ tiêu đề + MD5(post_id)
- Ảnh bìa được lưu trên Supabase Storage
- Thông báo "Bài viết được tạo thành công"
- Chuyển hướng tới trang xem bài viết hoặc chỉnh sửa

#### Precondition
- Người dùng đã đăng nhập
- Email của người dùng đã được xác minh
- Hệ thống storage hoạt động bình thường

#### Main Flow

1. Tác giả nhấp "Viết bài viết mới"
2. Biểu mẫu soạn thảo được hiển thị với các trường: tiêu đề, tóm tắt, nội dung, upload ảnh bìa
3. Tác giả nhập tiêu đề
4. Tác giả nhập nội dung (hỗ trợ Markdown/HTML rich editor)
5. Tác giả upload ảnh bìa (client-side validate: loại file, kích thước)
6. Tác giả chọn trạng thái: draft hoặc published
7. Tác giả nhấp "Lưu dưới dạng nháp" hoặc "Xuất bản"
8. Hệ thống xác thực dữ liệu:
   - Tiêu đề: không rỗng, ≤ 200 ký tự
   - Nội dung: ≥ 100 ký tự
   - Tóm tắt: không rỗng, ≤ 500 ký tự
   - Ảnh bìa: file type (JPEG/PNG/WebP), ≤ 5MB
9. Hệ thống upload ảnh bìa tới `posts/{post_id}/cover.*` trên Supabase Storage
10. Hệ thống tạo bản ghi bài viết trong database:
    - author_id = current_user.id
    - title, content, summary
    - status = draft | published
    - cover_url = public URL từ storage
    - created_at, updated_at = current timestamp
11. Hệ thống tạo slug: `slugify(title) + '-' + md5(post_id).substring(0, 8)`
12. **Nếu published**: Hệ thống gửi thông báo tới followers (nếu có hệ thống follow)
13. **Nếu published**: Bài viết được indexed cho tìm kiếm
14. Hiển thị thông báo "Bài viết được tạo thành công"
15. Chuyển hướng tới `/posts/{slug}` (xem bài viết)

#### Alternative Flow

- **Ảnh bìa không hợp lệ**: Hiển thị thông báo "Ảnh phải là JPEG, PNG hoặc WebP, kích thước ≤ 5MB"
- **Tải ảnh thất bại**: Cho phép người dùng thử lại hoặc bỏ qua
- **Nội dung quá ngắn**: Hiển thị thông báo "Nội dung phải ít nhất 100 ký tự"
- **Lỗi database**: Hiển thị thông báo "Có lỗi khi tạo bài viết. Vui lòng thử lại"

#### Postcondition
- Bài viết được lưu trong cơ sở dữ liệu
- Ảnh bìa được lưu trên storage
- Slug được tạo và là duy nhất
- Nếu published: bài viết hiển thị công khai
- Nếu draft: chỉ tác giả thấy

#### Acceptance Criteria
- ✅ Bài viết được tạo thành công
- ✅ Slug được tạo tự động và là duy nhất
- ✅ author_id = current user
- ✅ Timestamps (created_at, updated_at) chính xác
- ✅ RLS policy: chỉ tác giả thấy bài viết draft
- ✅ Published posts hiển thị công khai
- ✅ Upload ảnh < 30 giây

---

### 3.3.2 Chỉnh Sửa Bài Viết (Edit Post)

#### Mô Tả
Cho phép tác giả chỉnh sửa nội dung bài viết của mình. Chỉ tác giả mới có quyền chỉnh sửa.

#### Actor
- **Primary Actor**: Tác giả của bài viết (người dùng đã xác thực)

#### Input
- **Post ID hoặc Slug**: định danh bài viết
- **Tiêu đề, tóm tắt, nội dung, ảnh bìa** (tất cả tuỳ chọn, chỉ những gì thay đổi)
- **Trạng thái**: draft | published (tuỳ chọn)

#### Output
- Bài viết được cập nhật
- Timestamp updated_at được refresh
- Thông báo "Bài viết được cập nhật"

#### Precondition
- Người dùng đã đăng nhập
- Người dùng = tác giả bài viết
- Bài viết tồn tại
- RLS policy cho phép chỉnh sửa

#### Main Flow

1. Tác giả nhấp "Chỉnh sửa" trên bài viết
2. Hệ thống kiểm tra RLS: current_user.id = post.author_id
3. Biểu mẫu soạn thảo được populated với dữ liệu hiện tại
4. Tác giả thay đổi các trường cần chỉnh sửa
5. Tác giả nhấp "Lưu thay đổi"
6. Hệ thống xác thực dữ liệu (tiêu đề, nội dung, ảnh bìa)
7. **Nếu upload ảnh bìa mới**: 
   - Upload ảnh mới tới storage
   - Xóa ảnh cũ từ storage
   - Cập nhật cover_url
8. Hệ thống cập nhật bản ghi bài viết: title, content, summary, status, cover_url
9. Hệ thống refresh updated_at = current timestamp
10. **Nếu thay đổi status từ draft → published**: Gửi thông báo tới followers
11. Hiển thị thông báo "Bài viết được cập nhật"
12. Chuyển hướng tới trang xem bài viết

#### Alternative Flow

- **Người dùng không phải tác giả**: Hiển thị thông báo "Bạn không có quyền chỉnh sửa bài viết này"
- **Bài viết không tồn tại**: Hiển thị thông báo "Bài viết không tìm thấy"
- **Tải ảnh thất bại**: Hiển thị thông báo và cho phép thử lại

#### Postcondition
- Bài viết được cập nhật trong database
- Ảnh cũ được xóa khỏi storage (nếu upload ảnh mới)
- Updated_at được cập nhật
- Thay đổi được phản ánh ngay lập tức

#### Acceptance Criteria
- ✅ Chỉ tác giả mới có thể chỉnh sửa (RLS policy)
- ✅ Updated_at thay đổi
- ✅ Ảnh cũ được xóa khỏi storage khi upload ảnh mới
- ✅ Version history được lưu (soft-delete old versions - tuỳ chọn)
- ✅ Thay đổi được lưu trong < 5 giây

---

### 3.3.3 Xóa Bài Viết (Delete Post)

#### Mô Tả
Cho phép tác giả hoặc admin xóa bài viết. Khi xóa bài viết, tất cả bình luận, lượt thích liên quan cũng bị xóa (cascade delete).

#### Actor
- **Primary Actor**: Tác giả của bài viết
- **Secondary Actor**: Admin (quản trị viên hệ thống)

#### Input
- **Post ID**: định danh bài viết cần xóa

#### Output
- Bài viết bị xóa
- Tất cả bình luận, lượt thích, ảnh liên quan bị xóa
- Chuyển hướng tới trang chủ

#### Precondition
- Người dùng = tác giả bài viết hoặc admin
- Bài viết tồn tại

#### Main Flow

1. Tác giả nhấp "Xóa bài viết" (thường ở menu chỉnh sửa)
2. Dialog xác nhận được hiển thị: "Bạn chắc chắn muốn xóa bài viết này? Hành động không thể hoàn tác"
3. Người dùng nhấp "Xác nhận xóa"
4. Hệ thống kiểm tra RLS: current_user.id = post.author_id hoặc role = admin
5. Hệ thống thực hiện cascade delete:
   - Xóa tất cả comments trên bài viết (ON DELETE CASCADE)
   - Xóa tất cả likes trên bài viết (ON DELETE CASCADE)
   - Xóa ảnh bìa từ Supabase Storage
6. Hệ thống xóa bài viết từ database
7. Hiển thị thông báo "Bài viết đã được xóa"
8. Chuyển hướng tới `/`

#### Alternative Flow

- **Người dùng không phải tác giả hoặc admin**: Hiển thị thông báo "Bạn không có quyền xóa bài viết này"
- **Bài viết không tồn tại**: Hiển thị thông báo "Bài viết không tìm thấy"
- **Xóa ảnh thất bại**: Log lỗi nhưng vẫn xóa bài viết (ảnh cũ sẽ được dọn dẹp sau)

#### Postcondition
- Bài viết không tồn tại trong hệ thống
- Tất cả dữ liệu liên quan (comments, likes, images) bị xóa
- Storage được dọn dẹp

#### Acceptance Criteria
- ✅ Chỉ tác giả/admin có quyền xóa (RLS)
- ✅ Cascade delete hoạt động đúng
- ✅ Ảnh bìa được xóa từ storage
- ✅ Xóa không thể hoàn tác (hard delete)

---

### 3.3.4 Liệt Kê Bài Viết (List Posts)

#### Mô Tả
Hiển thị danh sách bài viết công khai hoặc danh sách bài viết của tác giả. Hỗ trợ phân trang, sắp xếp, lọc và tìm kiếm.

#### Actor
- **Primary Actor**: Bất kỳ người dùng (công khai lấy published posts)
- **Secondary Actor**: Tác giả (lấy own posts), Admin (lấy tất cả)

#### Input
- **Page**: số trang (default 1)
- **Limit**: số bài viết mỗi trang (default 10, max 50)
- **Sort**: cách sắp xếp (created_at_desc | created_at_asc | likes_count_desc)
- **Filter status**: draft | published (tuỳ chọn)
- **Filter author_id**: lọc theo tác giả (tuỳ chọn)
- **Search**: từ khóa tìm kiếm (tuỳ chọn)

#### Output
- Array của post objects (paginated)
- Metadata: total_count, current_page, total_pages, has_next

#### Precondition
- Hệ thống database hoạt động bình thường

#### Main Flow

1. Người dùng truy cập blog home hoặc author's blog page
2. Hệ thống xác định vai trò người dùng (anonymous, author, admin)
3. Hệ thống query posts với RLS:
   - **Public users**: `status = 'published'`
   - **Tác giả xem own posts**: `author_id = current_user.id` (tất cả status)
   - **Admin**: tất cả posts
4. Hệ thống áp dụng filters:
   - Status filter (nếu có)
   - Author filter (nếu có)
5. **Nếu search query**:
   - Full-text search trên `title || content` sử dụng tsvector
   - Rank kết quả theo relevance
6. Hệ thống sắp xếp kết quả theo `sort` parameter
7. Hệ thống tính pagination:
   - offset = (page - 1) * limit
   - Query: LIMIT limit OFFSET offset
8. Hệ thống trả về:
   - Array posts (limit items)
   - Metadata: total_count, current_page, total_pages, has_next, has_prev
9. Frontend render danh sách posts với:
   - Tiêu đề, tóm tắt, ảnh bìa
   - Tác giả, ngày tạo
   - Lượt thích, số bình luận
   - Thumbnail

#### Alternative Flow

- **Không có posts**: Hiển thị thông báo "Chưa có bài viết nào"
- **Search không tìm thấy**: Hiển thị "Không tìm thấy bài viết phù hợp"
- **Page > total_pages**: Chuyển hướng tới page cuối cùng hoặc page 1

#### Postcondition
- Danh sách posts được trả về
- Phân trang chính xác
- RLS được enforce

#### Acceptance Criteria
- ✅ RLS policy enforce: public chỉ thấy published
- ✅ Pagination chính xác (offset/limit)
- ✅ Full-text search hoạt động
- ✅ Performance < 200ms (với database index)
- ✅ Sort mặc định: created_at DESC
- ✅ Metadata trả về đầy đủ

---

### 3.3.5 Xem Chi Tiết Bài Viết (View Post)

#### Mô Tả
Hiển thị toàn bộ nội dung bài viết, bình luận, lượt thích, thông tin tác giả.

#### Actor
- **Primary Actor**: Bất kỳ người dùng (public posts), tác giả (own posts)

#### Input
- **Post Slug**: slug của bài viết (ví dụ: `tieu-de-bai-viet-abc123`)

#### Output
- Post detail object:
  - title, content, summary, cover_url
  - author (id, name, avatar)
  - created_at, updated_at
  - likes_count, comments_count
  - comments array (paginated)
  - is_liked_by_current_user (boolean)

#### Precondition
- Bài viết tồn tại
- Người dùng có quyền xem (published hoặc tác giả)

#### Main Flow

1. Người dùng nhấp vào link bài viết hoặc truy cập `/posts/{slug}`
2. Hệ thống query bài viết by slug từ database
3. **RLS check**:
   - Nếu status = published: cho phép xem
   - Nếu status = draft: chỉ tác giả xem
   - Nếu không published và không phải tác giả: error 403 Not Found
4. Hệ thống query thông tin tác giả (từ profiles table)
5. Hệ thống tính likes_count, comments_count
6. Hệ thống query comments (paginated, default 20)
7. Hệ thống kiểm tra current_user đã like bài viết (is_liked_by_current_user)
8. Hệ thống increment view_count (tuỳ chọn)
9. Frontend render post detail page:
   - Post header: tiêu đề, tác giả, ngày tạo, lượt thích, số bình luận
   - Cover image
   - Post content (render HTML/Markdown)
   - Comments section
   - Like button

#### Alternative Flow

- **Bài viết không tồn tại**: Hiển thị trang 404 "Bài viết không tìm thấy"
- **Access denied (draft, not author)**: Hiển thị trang 403 "Bạn không có quyền xem bài viết này"

#### Postcondition
- Post detail được trả về với tất cả metadata
- Comments được load
- Like status được xác định

#### Acceptance Criteria
- ✅ Slug lookup O(1) với database index
- ✅ RLS enforce
- ✅ Comments paginate chính xác
- ✅ Likes count chính xác
- ✅ Performance < 500ms

---

## 3.4 Hệ Thống Bình Luận (Comments System)

### 3.4.1 Tạo Bình Luận (Create Comment)

#### Mô Tả
Cho phép người dùng tạo bình luận trên bài viết. Bình luận được cập nhật theo thời gian thực cho tất cả người xem.

#### Actor
- **Primary Actor**: Người dùng đã xác thực

#### Input
- **Post ID**: định danh bài viết
- **Content**: string, độ dài 1-1000 ký tự

#### Output
- Bình luận được tạo
- Realtime broadcast: bình luận mới được gửi tới client khác
- Comments count được tăng

#### Precondition
- Người dùng đã đăng nhập
- Bài viết tồn tại và được published

#### Main Flow

1. Người dùng scroll tới comment section
2. Người dùng nhập bình luận vào text field
3. Người dùng nhấp "Gửi bình luận"
4. Hệ thống xác thực dữ liệu:
   - Content không rỗng
   - Content ≤ 1000 ký tự
5. Hệ thống tạo bản ghi comment:
   - post_id = current post
   - user_id = current user
   - content = comment text
   - created_at = current timestamp
6. Hệ thống tăng post.comments_count
7. Hệ thống broadcast realtime event via Supabase Realtime:
   - Event type: INSERT
   - Table: comments
   - Payload: new comment object
8. UI update: bình luận mới được thêm vào danh sách
9. Text field được xóa
10. Hiển thị thông báo "Bình luận được gửi"

#### Alternative Flow

- **Content trống**: Hiển thị thông báo "Bình luận không được để trống"
- **Content quá dài**: Hiển thị thông báo "Bình luận tối đa 1000 ký tự"
- **Bài viết không tồn tại**: Hiển thị thông báo "Bài viết không tìm thấy"
- **Database error**: Hiển thị thông báo "Có lỗi khi gửi bình luận. Vui lòng thử lại"

#### Postcondition
- Bình luận được lưu trong database
- Comments count được tăng
- Realtime broadcast được gửi
- Bình luận visible cho tất cả người xem

#### Acceptance Criteria
- ✅ Comment user_id = current user
- ✅ Created_at timestamp chính xác
- ✅ Realtime broadcast hoạt động
- ✅ Comments count được tăng
- ✅ Comment visible ngay lập tức cho tác giả

---

### 3.4.2 Xóa Bình Luận (Delete Comment)

#### Mô Tả
Cho phép tác giả bình luận hoặc admin xóa bình luận. Xóa được broadcast realtime.

#### Actor
- **Primary Actor**: Người dùng tạo bình luận, Admin

#### Input
- **Comment ID**: định danh bình luận

#### Output
- Bình luận bị xóa
- Realtime broadcast: bình luận xóa được gửi tới clients
- Comments count được giảm

#### Precondition
- Người dùng = tác giả comment hoặc admin
- Comment tồn tại

#### Main Flow

1. Người dùng hover over bình luận của mình
2. "Delete" button được hiển thị (menu icon hoặc button trực tiếp)
3. Người dùng nhấp "Delete"
4. Dialog xác nhận được hiển thị: "Xóa bình luận này?"
5. Người dùng nhấp "Xác nhận"
6. Hệ thống kiểm tra RLS: current_user.id = comment.user_id hoặc role = admin
7. Hệ thống xóa comment từ database
8. Hệ thống giảm post.comments_count
9. Hệ thống broadcast realtime event:
   - Event type: DELETE
   - Table: comments
   - Payload: { id: comment_id }
10. UI update: bình luận được xóa khỏi danh sách
11. Hiển thị thông báo "Bình luận đã được xóa"

#### Alternative Flow

- **Người dùng không phải tác giả/admin**: Hiển thị thông báo "Bạn không có quyền xóa bình luận này"
- **Comment không tồn tại**: Hiển thị thông báo "Bình luận không tìm thấy"
- **Database error**: Hiển thị thông báo "Có lỗi. Vui lòng thử lại"

#### Postcondition
- Bình luận không tồn tại trong database
- Comments count được giảm
- Realtime broadcast được gửi
- Bình luận biến mất khỏi tất cả clients

#### Acceptance Criteria
- ✅ RLS: chỉ tác giả/admin xóa
- ✅ Realtime broadcast
- ✅ Comments count giảm
- ✅ Xóa không thể hoàn tác

---

## 3.5 Tương Tác Nội Dung (Interaction Features)

### 3.5.1 Thích Bài Viết (Like Post)

#### Mô Tả
Cho phép người dùng "thích" bài viết. Mỗi người dùng chỉ có thể like 1 lần cho 1 bài viết.

#### Actor
- **Primary Actor**: Người dùng đã xác thực

#### Input
- **Post ID**: định danh bài viết

#### Output
- Like record được tạo
- Like button UI thay đổi (filled/active)
- Likes count được tăng
- Realtime broadcast

#### Precondition
- Người dùng đã đăng nhập
- Bài viết được published
- Người dùng chưa like bài viết

#### Main Flow

1. Người dùng xem bài viết
2. Like button được hiển thị (trái tim icon)
3. Người dùng nhấp like button
4. Hệ thống kiểm tra người dùng chưa like bài viết này (UNIQUE constraint)
5. Hệ thống tạo like record:
   - post_id = current post
   - user_id = current user
   - created_at = current timestamp
6. Hệ thống tăng post.likes_count
7. Hệ thống broadcast realtime event:
   - Event type: INSERT
   - Table: likes
8. UI update:
   - Like button thay đổi từ outline → filled (active state)
   - Likes count tăng 1
9. Hiển thị thông báo ngắn "Bạn đã thích bài viết này"

#### Alternative Flow

- **Người dùng đã like**: Hệ thống kiểm tra constraint, không cho phép tạo duplicate
- **Database error**: Hiển thị thông báo "Có lỗi. Vui lòng thử lại"

#### Postcondition
- Like record được lưu
- Likes count tăng
- Button active state được set

#### Acceptance Criteria
- ✅ UNIQUE(post_id, user_id) constraint enforce
- ✅ Người dùng chỉ like 1 lần
- ✅ Likes count chính xác
- ✅ Realtime broadcast
- ✅ UI reflect ngay lập tức

---

### 3.5.2 Bỏ Thích Bài Viết (Unlike Post)

#### Mô Tả
Cho phép người dùng bỏ "thích" bài viết đã like trước đó.

#### Actor
- **Primary Actor**: Người dùng đã like bài viết

#### Input
- **Post ID**: định danh bài viết

#### Output
- Like record được xóa
- Like button UI quay về trạng thái outline
- Likes count được giảm
- Realtime broadcast

#### Precondition
- Người dùng đã đăng nhập
- Người dùng đã like bài viết này

#### Main Flow

1. Người dùng xem bài viết (đã like)
2. Like button ở trạng thái filled (active)
3. Người dùng nhấp like button lần thứ 2 (để bỏ like)
4. Hệ thống tìm like record: `WHERE post_id = ? AND user_id = ?`
5. Hệ thống xóa like record từ database
6. Hệ thống giảm post.likes_count
7. Hệ thống broadcast realtime event:
   - Event type: DELETE
   - Table: likes
8. UI update:
   - Like button thay đổi từ filled → outline (inactive state)
   - Likes count giảm 1
9. Hiển thị thông báo ngắn "Bỏ thích bài viết"

#### Alternative Flow

- **Người dùng chưa like**: Hiển thị thông báo (không xảy ra trong UI bình thường)
- **Database error**: Hiển thị thông báo "Có lỗi. Vui lòng thử lại"

#### Postcondition
- Like record không tồn tại
- Likes count giảm
- Button inactive state được set

#### Acceptance Criteria
- ✅ Like record xóa chính xác
- ✅ Likes count giảm
- ✅ Realtime broadcast
- ✅ UI reflect ngay lập tức

---

## 3.6 Quản Lý Hình Ảnh (Image Management)

### 3.6.1 Tải Lên Hình Ảnh (Upload Image)

#### Mô Tả
Cho phép người dùng tải lên hình ảnh bìa hoặc hình ảnh đính kèm. Hình ảnh được lưu trên Supabase Storage và trả về public URL.

#### Actor
- **Primary Actor**: Người dùng đã xác thực

#### Input
- **File**: binary data của file hình ảnh
- **Type**: enum (cover | content_attachment)
- **File format**: JPEG, PNG, WebP
- **File size**: ≤ 5MB

#### Output
- Hình ảnh được lưu trên Supabase Storage
- Public URL được trả về
- URL có thể được sử dụng ngay lập tức

#### Precondition
- Người dùng đã đăng nhập
- Hệ thống storage hoạt động
- Disk space khả dụng

#### Main Flow

1. Người dùng nhấp "Upload ảnh" trong biểu mẫu soạn thảo
2. File picker dialog được hiển thị
3. Người dùng chọn file ảnh
4. Client-side validation:
   - File type check: JPEG, PNG, WebP (by MIME type)
   - File size check: ≤ 5MB
5. **Nếu validation fail**: Hiển thị thông báo lỗi
6. **Nếu validation pass**: 
   - Optional: Compress/resize ảnh (WebP, max width 1200px)
   - Upload tới Supabase Storage: `/posts/{post_id}/{uuid}.{ext}`
7. Hệ thống server-side validate:
   - File type check
   - File size check
   - Virus scan (tuỳ chọn)
8. Hệ thống lưu file vào storage bucket
9. Hệ thống tạo public URL: `https://storage.supabase.co/...`
10. Hệ thống trả về JSON response:
    - url: public URL
    - size: file size
    - format: file format
11. Frontend insert image URL vào editor

#### Alternative Flow

- **Định dạng file không hợp lệ**: Hiển thị "Chỉ hỗ trợ JPEG, PNG, WebP"
- **Kích thước vượt quá**: Hiển thị "Ảnh tối đa 5MB"
- **Upload thất bại**: Cho phép người dùng thử lại
- **Storage quota đầy**: Hiển thị "Dung lượng lưu trữ không đủ. Vui lòng liên hệ admin"

#### Postcondition
- Hình ảnh được lưu trên storage
- Public URL accessible
- Metadata được ghi lại (optional)

#### Acceptance Criteria
- ✅ Upload < 30 giây
- ✅ URL accessible công khai
- ✅ File type validation chính xác
- ✅ Size validation < 5MB
- ✅ Storage organization: `/posts/{post_id}/`

---

## 3.7 Tìm Kiếm và Lọc (Search & Filtering)

### 3.7.1 Tìm Kiếm Nội Dung (Full-Text Search)

#### Mô Tả
Cho phép người dùng tìm kiếm bài viết dựa trên từ khóa. Tìm kiếm áp dụng trên tiêu đề, tóm tắt và nội dung.

#### Actor
- **Primary Actor**: Bất kỳ người dùng

#### Input
- **Query**: string, độ dài tối thiểu 2 ký tự

#### Output
- Array của matching posts (top 20)
- Relevance ranking

#### Precondition
- Hệ thống database hoạt động
- Full-text index được tạo

#### Main Flow

1. Người dùng nhấp vào search box
2. Người dùng nhập keyword (≥ 2 ký tự)
3. API được gọi: `/api/posts/search?q={query}`
4. Hệ thống execute full-text search query:
   ```sql
   SELECT * FROM posts 
   WHERE status = 'published'
   AND to_tsvector('english', title || ' ' || summary || ' ' || content) 
           @@ plainto_tsquery('english', ?)
   ORDER BY ts_rank(to_tsvector('english', title || ' ' || summary || ' ' || content), 
            plainto_tsquery('english', ?)) DESC
   LIMIT 20
   ```
5. Hệ thống highlight keywords trong results
6. Hệ thống trả về JSON array
7. Frontend render search results:
   - Post title (với keyword highlight)
   - Post summary (với keyword highlight)
   - Author, date
   - Likes count

#### Alternative Flow

- **Query < 2 ký tự**: Không search, hiển thị "Nhập ít nhất 2 ký tự"
- **Không tìm thấy**: Hiển thị "Không tìm thấy bài viết phù hợp"
- **Special characters**: Escape SQL injection risk

#### Postcondition
- Search results được trả về
- Results ranked by relevance

#### Acceptance Criteria
- ✅ Full-text search sử dụng GIN index
- ✅ Performance < 100ms
- ✅ Relevance ranking hoạt động
- ✅ SQL injection prevention

---

### 3.7.2 Lọc Bài Viết (Filter Posts)

#### Mô Tả
Cho phép người dùng lọc bài viết theo tiêu chí: trạng thái, tác giả, ngày tạo.

#### Actor
- **Primary Actor**: Admin (lọc tất cả), Author (lọc own posts)

#### Input
- **Status**: draft | published
- **Author ID**: user_id (tuỳ chọn)
- **Date range**: from_date, to_date (tuỳ chọn)

#### Output
- Filtered posts list
- Metadata: count, pages

#### Precondition
- Hệ thống database hoạt động

#### Main Flow

1. Người dùng truy cập admin panel hoặc author dashboard
2. Người dùng nhấp filter icon
3. Filter panel được hiển thị
4. Người dùng chọn filters:
   - Status: published, draft
   - Author (nếu admin)
   - Date range (nếu cần)
5. Người dùng nhấp "Apply filters"
6. Hệ thống query posts với WHERE clauses:
   - `status = ?` (nếu selected)
   - `author_id = ?` (nếu selected)
   - `created_at BETWEEN ? AND ?` (nếu date range)
7. Hệ thống trả về filtered results
8. UI render filtered posts

#### Alternative Flow

- **Không có results**: Hiển thị "Không tìm thấy bài viết phù hợp"
- **Invalid date range**: Hiển thị thông báo lỗi

#### Postcondition
- Filtered results được trả về

#### Acceptance Criteria
- ✅ RLS enforce: draft posts chỉ admin/author thấy
- ✅ Performance với index (status, created_at)
- ✅ Date range filter chính xác

---

## 3.8 Quản Lý Hồ Sơ (User Profile Management)

### 3.8.1 Xem Hồ Sơ Người Dùng (View User Profile)

#### Mô Tả
Cho phép người dùng xem hồ sơ công khai hoặc hồ sơ cá nhân. Hiển thị thông tin cá nhân, danh sách bài viết, thống kê.

#### Actor
- **Primary Actor**: Bất kỳ người dùng (view public profile), chủ sở hữu (view own)

#### Input
- **User ID hoặc Username**: định danh người dùng

#### Output
- Profile information:
  - Avatar, display name, bio
  - Posts count, likes received count
  - Created date
  - Recent posts (published only)

#### Precondition
- Người dùng tồn tại

#### Main Flow

1. Người dùng nhấp vào link hồ sơ tác giả
2. Hệ thống query user profile từ database
3. Hệ thống query published posts của người dùng
4. Hệ thống tính aggregates:
   - posts_count = COUNT(published posts)
   - likes_received = SUM(likes_count) of all published posts
5. Hệ thống query recent posts (top 5, sorted by created_at DESC)
6. Frontend render profile page:
   - Avatar (large)
   - Display name, bio
   - Stats: posts count, likes received
   - Recent posts list
   - Member since date

#### Alternative Flow

- **Người dùng không tồn tại**: Hiển thị 404 "Người dùng không tìm thấy"

#### Postcondition
- Profile information được trả về

#### Acceptance Criteria
- ✅ Chỉ published posts được hiển thị
- ✅ Aggregates chính xác
- ✅ Performance < 300ms

---

### 3.8.2 Chỉnh Sửa Hồ Sơ (Edit User Profile)

#### Mô Tả
Cho phép người dùng chỉnh sửa thông tin cá nhân: tên hiển thị, tiểu sử, avatar.

#### Actor
- **Primary Actor**: Người dùng đã xác thực (chỉnh sửa own profile)

#### Input
- **Display name**: string, độ dài 1-100 ký tự
- **Bio**: string, độ dài 0-500 ký tự
- **Avatar**: file image (JPEG, PNG, WebP, ≤ 2MB)

#### Output
- Profile được cập nhật
- Thay đổi reflected ngay lập tức
- Thông báo "Hồ sơ được cập nhật"

#### Precondition
- Người dùng đã đăng nhập

#### Main Flow

1. Người dùng truy cập `/dashboard/profile`
2. Hệ thống query current user profile
3. Biểu mẫu populated với dữ liệu hiện tại
4. Người dùng chỉnh sửa các trường
5. **Nếu upload avatar**:
   - Client validate: file type, size
   - Upload tới storage: `/profiles/{user_id}/avatar.{ext}`
6. Người dùng nhấp "Save changes"
7. Hệ thống xác thực dữ liệu:
   - Display name: 1-100 chars
   - Bio: 0-500 chars
8. Hệ thống cập nhật profile record:
   - display_name, bio
   - avatar_url (nếu upload)
   - updated_at = current timestamp
9. **Nếu upload avatar mới**: Xóa avatar cũ từ storage
10. Hiển thị thông báo "Hồ sơ được cập nhật"
11. Chuyển hướng hoặc refresh trang

#### Alternative Flow

- **Avatar không hợp lệ**: Hiển thị thông báo lỗi
- **Display name trống**: Hiển thị thông báo "Tên hiển thị không được để trống"
- **Database error**: Hiển thị thông báo "Có lỗi. Vui lòng thử lại"

#### Postcondition
- Profile được cập nhật
- Avatar cũ được xóa (nếu upload mới)

#### Acceptance Criteria
- ✅ Chỉ chủ sở hữu chỉnh sửa own profile
- ✅ Avatar upload < 2MB
- ✅ Changes reflected ngay lập tức
- ✅ Updated_at được refresh

---

## 3.9 Quản Trị Hệ Thống (Admin Dashboard)

### 3.9.1 Xem Thống Kê (View Statistics)

#### Mô Tả
Cho phép admin xem dashboard với tổng quan hệ thống: số người dùng, bài viết, bình luận, lượt thích.

#### Actor
- **Primary Actor**: Admin (role = admin)

#### Input
- Không có input

#### Output
- Dashboard stats:
  - Total users
  - Total published posts
  - Total comments
  - Total likes
  - Recent activity

#### Precondition
- Người dùng = admin
- Hệ thống database hoạt động

#### Main Flow

1. Admin truy cập `/dashboard/admin`
2. Hệ thống query aggregation:
   ```sql
   SELECT 
     COUNT(*) as total_users FROM users WHERE role = 'user',
     COUNT(*) as total_posts FROM posts WHERE status = 'published',
     COUNT(*) as total_comments FROM comments,
     COUNT(*) as total_likes FROM likes,
     COUNT(*) as active_users_today FROM users 
       WHERE last_login >= NOW() - INTERVAL '1 day'
   ```
3. Hệ thống query recent activity:
   - New users (last 7 days)
   - New posts (last 7 days)
   - Most liked posts (top 5)
4. Hệ thống trả về JSON object với stats
5. Frontend render dashboard:
   - Stats cards: users, posts, comments, likes
   - Charts: posts per day, active users timeline
   - Recent activity list

#### Alternative Flow

- **Database slow**: Hiển thị cached stats (TTL 1 min)

#### Postcondition
- Stats được trả về
- Dashboard rendered

#### Acceptance Criteria
- ✅ Real-time data (hoặc cached max 1 min)
- ✅ RLS: chỉ admin
- ✅ Performance < 200ms

---

### 3.9.2 Quản Lý Người Dùng (Manage Users)

#### Mô Tả
Cho phép admin xem danh sách người dùng, chỉnh sửa role, khóa/mở khóa tài khoản.

#### Actor
- **Primary Actor**: Admin

#### Input
- **User ID** (for edit)
- **Role**: user | moderator | admin
- **Status**: active | locked

#### Output
- Users list (paginated)
- User được cập nhật (nếu edit)

#### Precondition
- Người dùng = admin

#### Main Flow

1. Admin truy cập `/dashboard/admin/users`
2. Hệ thống query users list (paginated)
3. Frontend render table:
   - User ID, Email, Display Name
   - Role, Status, Created Date
   - Action buttons: Edit, Lock/Unlock, Delete
4. Admin nhấp edit button trên user row
5. Edit panel được hiển thị
6. Admin thay đổi role (user/moderator/admin) hoặc status (active/locked)
7. Admin nhấp "Save"
8. Hệ thống xác thực:
   - Admin không thể remove role admin khỏi chính mình
9. Hệ thống cập nhật user record
10. Hệ thống ghi audit log: who changed what at when
11. Hiển thị thông báo "Người dùng được cập nhật"
12. Table refresh

#### Alternative Flow

- **Cố gắng remove admin khỏi bản thân**: Hiển thị thông báo "Không thể thay đổi role của chính bạn"

#### Postcondition
- User record được cập nhật
- Audit log được ghi

#### Acceptance Criteria
- ✅ RLS: chỉ admin
- ✅ Pagination
- ✅ Audit logging
- ✅ Cannot remove self as admin

---

## 3.10 Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 3.10.1 Hiệu Năng (Performance)

Hệ thống phải đáp ứng các tiêu chí hiệu năng sau:

| Tiêu Chí | Mục Tiêu | Phương Pháp Đạt Được |
|----------|----------|------------------|
| **Page Load Time (LCP)** | < 3 giây | Code splitting, lazy loading (Next.js), image optimization |
| **First Contentful Paint (FCP)** | < 1.5 giây | Critical CSS, font optimization, minimize JavaScript |
| **Time to Interactive (TTI)** | < 5 giây | JavaScript optimization, defer non-critical scripts |
| **API Response Time (p95)** | < 200ms | Database indexing, query optimization, caching |
| **Database Query Time** | < 50ms | B-tree indexes, query profiling |
| **Full-Text Search** | < 100ms | GIN indexes, query optimization |
| **File Upload** | < 30 giây | Client-side compression, resumable upload |

**Kỹ Thuật Tối Ưu:**
- **Frontend**: Code splitting, lazy loading, image optimization (WebP, responsive)
- **Database**: B-tree indexing (B-tree untuk columns thường xuyên query), GIN indexing (full-text search), connection pooling
- **Caching**: Redis for session, CDN for static assets
- **Compression**: gzip/brotli for HTTP responses

### 3.10.2 Bảo Mật (Security)

| Tiêu Chí | Mục Tiêu | Cách Thực Hiện |
|----------|----------|---------------|
| **Password Hashing** | bcrypt, cost ≥ 12 | Tất cả passwords được hash trước lưu vào DB |
| **JWT Security** | RS256 signed, HTTP-only cookie | Ký bằng private key, verify bằng public key |
| **HTTPS** | All traffic encrypted | HSTS header, TLS 1.3 |
| **SQL Injection Prevention** | Prepared statements | Parameterized queries, no string concatenation |
| **XSS Prevention** | Content Security Policy | CSP headers, sanitize user input |
| **CSRF Protection** | SameSite cookie | SameSite=Strict for cookies |
| **Data Encryption** | At rest & transit | TLS 1.3, encrypted database columns (sensitive data) |
| **Row Level Security (RLS)** | Database level | PostgreSQL RLS policies enforce user access |
| **Rate Limiting** | 100 req/min per user | Middleware rate limiting on API |

### 3.10.3 Khả Năng Mở Rộng (Scalability)

| Tiêu Chí | Mục Tiêu | Kỹ Thuật |
|----------|----------|---------|
| **Concurrent Users** | 1000+ | Load balancing, auto-scaling servers |
| **Database Connections** | Pooling | PgBouncer, Supabase Connection Pooling |
| **Storage** | Unlimited | Supabase Storage (S3 backend) |
| **API Rate Limiting** | 100 req/min per user | Middleware rate limiting |
| **Horizontal Scaling** | Multiple instances | Vercel auto-scaling, stateless design |

### 3.10.4 Tính Sẵn Sàng (Availability)

| Tiêu Chí | Mục Tiêu |
|----------|----------|
| **Uptime** | 99.9% (monthly) |
| **MTTR** | < 15 phút |
| **Backup** | Daily automated backups |
| **Disaster Recovery** | RPO ≤ 1 day, RTO ≤ 4 hours |

### 3.10.5 Khả Năng Bảo Trì (Maintainability)

- **Code Quality**: ESLint, Prettier, TypeScript type checking
- **Testing**: Unit tests (80%+), Integration tests, E2E tests
- **Documentation**: README, API docs, inline comments for complex logic
- **Monitoring**: Sentry for error tracking, DataDog for APM
- **Logging**: Structured logs, centralized log aggregation

### 3.10.6 Sử Dụng Dễ Dàng (Usability)

| Tiêu Chí | Mục Tiêu |
|----------|----------|
| **Responsiveness** | Mobile, Tablet, Desktop friendly |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Loading States** | Skeleton screens, spinners for async operations |
| **Error Messages** | Clear, actionable error messages |
| **UX Flow** | < 3 clicks per action (90% common tasks) |

---

## 3.11 Sơ Đồ Use Cases (Use Case Diagram)

### Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hệ Thống Blog                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GUEST / ANONYMOUS USER                                 │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ UC-1: Register (Đăng ký tài khoản)                     │   │
│  │ UC-2: Login (Đăng nhập)                                │   │
│  │ UC-3: View Published Posts (Xem bài viết công khai)   │   │
│  │ UC-4: View Post Detail (Xem chi tiết bài viết)        │   │
│  │ UC-5: Search Posts (Tìm kiếm bài viết)                │   │
│  │ UC-6: View User Profile (Xem hồ sơ người dùng)        │   │
│  │ UC-7: Forgot Password (Quên mật khẩu)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AUTHENTICATED USER / AUTHOR                             │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ UC-8: Create Post (Tạo bài viết)                       │   │
│  │ UC-9: Edit Own Post (Chỉnh sửa bài viết của mình)      │   │
│  │ UC-10: Delete Own Post (Xóa bài viết)                 │   │
│  │ UC-11: Like/Unlike Post (Thích/bỏ thích bài viết)     │   │
│  │ UC-12: Comment on Post (Bình luận trên bài viết)       │   │
│  │ UC-13: Delete Own Comment (Xóa bình luận của mình)     │   │
│  │ UC-14: Edit User Profile (Chỉnh sửa hồ sơ)            │   │
│  │ UC-15: Logout (Đăng xuất)                              │   │
│  │ UC-16: View Own Profile (Xem hồ sơ của mình)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ADMIN / MODERATOR                                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ UC-17: View Dashboard (Xem bảng điều khiển thống kê)   │   │
│  │ UC-18: Manage Users (Quản lý người dùng)               │   │
│  │ UC-19: Moderate Comments (Kiểm duyệt bình luận)        │   │
│  │ UC-20: Delete Any Post (Xóa bài viết bất kỳ)          │   │
│  │ UC-21: View All Posts (Xem tất cả bài viết)           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.12 Tóm Tắt Phân Tích Chức Năng

### Bảng Tóm Tắt Chức Năng

| Module | Chức Năng | Độ Phức Tạp | Ưu Tiên |
|--------|---------|-----------|--------|
| **Authentication** | Register, Login, Logout, Password Reset | Cao | **Cao** |
| **Post Management** | Create, Edit, Delete, List, View, Search | Cao | **Cao** |
| **Comments** | Create, Delete, Realtime Updates | Trung bình | **Cao** |
| **Like/Unlike** | Like, Unlike, Counter | Thấp | **Cao** |
| **Image Upload** | Upload, Storage Management, Cleanup | Trung bình | **Cao** |
| **Search** | Full-text Search, Filter | Trung bình | **Trung bình** |
| **User Profile** | View, Edit, Statistics | Thấp | **Trung bình** |
| **Admin Dashboard** | Statistics, User Management, Moderation | Cao | **Trung bình** |

---

## 3.13 Kết Luận

Phân tích chức năng chi tiết trong chương này cung cấp nền tảng vững chắc cho quá trình thiết kế và triển khai hệ thống blog. Mỗi chức năng được mô tả một cách rõ ràng với:

- **Actor và role**: Xác định ai sử dụng chức năng
- **Main flow và alternative flow**: Mô tả chi tiết các quy trình
- **Tiêu chí chấp nhận**: Định nghĩa thành công của chức năng
- **Yêu cầu phi chức năng**: Đảm bảo hiệu năng, bảo mật, scalability

Những yêu cầu này sẽ hướng dẫn cho giai đoạn thiết kế chi tiết (Chương 4) và triển khai (Chương 5).

---

**Cuối Chương 3**
