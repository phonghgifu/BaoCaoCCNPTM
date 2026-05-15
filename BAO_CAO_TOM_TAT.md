---
<div align="center">

# BÁO CÁO ĐỀ TÀI

## PHÁT TRIỂN NỀN TẢNG BLOG HIỆN ĐẠI
## SỬ DỤNG CÁC CÔNG NGHỆ MỚI TRONG PHÁT TRIỂN PHẦN MỀM

### Lab 4 - Các Công Nghệ Mới Trong Phát Triển Phần Mềm (CNPTM)

---

**Sinh Viên Thực Hiện:** 2212440  
**Lớp:** K46  
**Năm Học:** 2025-2026  
**Giảng Viên Hướng Dẫn:** [Tên Giảng Viên]  
**Ngày Nộp:** 10/05/2026  

---

</div>

---

## LỜI NÓI ĐẦU

Báo cáo này tóm tắt quá trình thực hiện đề tài **"Phát Triển Nền Tảng Blog Hiện Đại Sử Dụng Các Công Nghệ Mới Trong Phát Triển Phần Mềm"** như một phần của môn học CNPTM dành cho sinh viên năm 4.

Báo cáo tập trung vào ba phần chính: **(1) Tổng Quan Dự Án**, **(2) Mục Tiêu Dự Án**, và **(3) Phân Tích Chức Năng Chi Tiết**.

---

## MỤC LỤC

| Mục | Nội Dung |
|-----|---------|
| **1** | Tổng Quan Dự Án |
| **2** | Mục Tiêu Dự Án |
| **3** | Phân Tích Chức Năng |

---

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Giới Thiệu

Đề tài này là một nền tảng blog hiện đại được phát triển như một phần của khóa học "Các Công Nghệ Mới Trong Phát Triển Phần Mềm" dành cho sinh viên năm 4. Ứng dụng được xây dựng nhằm áp dụng các công nghệ tiên tiến và các phương pháp best practice trong phát triển ứng dụng web Full-Stack.

Dự án có tên là **"Simple Blog"** - một nền tảng cho phép người dùng tạo, chia sẻ, và tương tác với các bài viết kỹ thuật. Ứng dụng hỗ trợ các chức năng cơ bản như:
- Quản lý tài khoản người dùng (Đăng ký, Đăng nhập, Quên mật khẩu)
- Tạo và quản lý bài viết (CRUD operations)
- Hệ thống bình luận realtime
- Đánh giá bài viết (Like/Unlike)
- Tìm kiếm và lọc nội dung
- Quản lý profile người dùng
- Upload hình ảnh

### 1.2 Bối Cảnh Phát Triển

Dự án được phát triển trong môi trường học tập, nhằm:

1. **Làm quen với quy trình phát triển Full-Stack** từ khái niệm ban đầu đến triển khai
2. **Áp dụng các công nghệ hiện đại** như Next.js, Supabase, TypeScript, và Tailwind CSS
3. **Thực hành best practice** trong thiết kế database, bảo mật, và UX/UI
4. **Sử dụng AI-assisted development** thông qua các prompt được thiết kế kỹ lưỡng

### 1.3 Vị Trí Dự Án Trong Chương Trình

Dự án này là **Lab 4** (bài tập lớn) của khóa học CNPTM, tiếp nối các lab trước đó với mức độ phức tạp cao hơn:

- **Lab 1-3**: Nền tảng lý thuyết và các công nghệ cơ bản
- **Lab 4 (Dự án này)**: Ứng dụng thực tế đầu tiên với công nghệ stack hiện đại
- **Yêu cầu**: Tích hợp 7 chức năng chính, bảo mật cấp độ sản xuất, tài liệu chi tiết

### 1.4 Thông Tin Chung

| Thông Tin | Chi Tiết |
|-----------|---------|
| **Tên Dự Án** | Simple Blog |
| **Mã Sinh Viên** | 2212440 |
| **Khoá** | K46 |
| **Năm Học** | 2025-2026 |
| **Môn Học** | Các Công Nghệ Mới Trong Phát Triển Phần Mềm (CNPTM) |
| **Thời Gian Thực Hiện** | Năm 4 - Học Kỳ II |
| **Trạng Thái** | ✅ Hoàn Thành 100% |
| **Loại Ứng Dụng** | Web Full-Stack |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + Realtime) |

---

## 2. MỤC TIÊU DỰ ÁN

### 2.1 Mục Tiêu Chính

#### 2.1.1 Mục Tiêu Về Ứng Dụng

1. **Xây dựng nền tảng blog hoạt động hoàn toàn** với đầy đủ chức năng CRUD
2. **Cấu thực hệ thống xác thực** an toàn với Email/Password và OAuth (GitHub)
3. **Triển khai bình luận realtime** sử dụng công nghệ subscription
4. **Tối ưu hóa giao diện người dùng** để có trải nghiệm mượt mà trên các thiết bị khác nhau
5. **Đảm bảo bảo mật cấp độ sản xuất** thông qua RLS Policies và Input Validation

#### 2.1.2 Mục Tiêu Về Học Tập

1. **Thành thạo Next.js 16 và App Router** - framework React hiện đại nhất
2. **Hiểu sâu về Supabase** - Backend-as-a-Service platform với PostgreSQL
3. **Nắm vững TypeScript** - ngôn ngữ có kiểm tra kiểu tĩnh cho JavaScript
4. **Áp dụng Tailwind CSS** - framework CSS Utility-First hiện đại
5. **Thực hành Security Best Practices** - bảo mật ứng dụng web

#### 2.1.3 Mục Tiêu Về Quy Trình

1. **Sử dụng AI-assisted development** để tăng năng suất lập trình
2. **Viết tài liệu chi tiết** và tổng hợp prompt mẫu có thể tái sử dụng
3. **Quản lý phiên bản code** thông qua Git/GitHub
4. **Áp dụng Agile methodology** với commit nhỏ, thường xuyên

### 2.2 Mục Tiêu Cụ Thể (SMART Goals)

| # | Mục Tiêu | Tiêu Chí Đạt Được |
|---|----------|------------------|
| 1 | Xây dựng hệ thống xác thực | Email/Password + OAuth hoạt động 100% |
| 2 | CRUD Post | Tạo, đọc, cập nhật, xóa bài viết thành công |
| 3 | Bình luận Realtime | Comment cập nhật ngay lập tức không cần reload |
| 4 | Like/Unlike | Người dùng có thể vote bài viết |
| 5 | Tìm kiếm Full-text | Tìm kiếm trong tiêu đề, nội dung tức thì |
| 6 | Upload Hình Ảnh | Lưu ảnh trên Supabase Storage, hiển thị |
| 7 | Quản lý Profile | Người dùng có thể chỉnh sửa thông tin cá nhân |
| 8 | Responsive Design | Giao diện hoạt động tốt trên mobile/tablet/desktop |
| 9 | Bảo Mật RLS | Row Level Security bảo vệ dữ liệu người dùng |
| 10 | Tài Liệu Đầy Đủ | 20+ prompt mẫu, hướng dẫn chi tiết |

---

## 3. PHÂN TÍCH CHỨC NĂNG

### 3.1 Chức Năng Chính (7 Phần)

#### **Phần 1: Quản Lý Tài Khoản**

**3.1.1 Đăng Ký Người Dùng**
- **Mô tả**: Người dùng có thể đăng ký tài khoản mới bằng email và mật khẩu
- **Quy trình**:
  1. Người dùng nhập email (phải hợp lệ)
  2. Nhập mật khẩu (ít nhất 6 ký tự)
  3. Xác nhận mật khẩu
  4. Nhấn "Đăng Ký"
  5. Hệ thống kiểm tra email có tồn tại không
  6. Nếu hợp lệ, tạo user mới trong Supabase Auth
  7. Tạo profile người dùng trong bảng `profiles`
  8. Chuyển hướng đến login hoặc dashboard
- **Xác nhận input**:
  - Email: Định dạng email hợp lệ
  - Mật khẩu: Tối thiểu 6 ký tự, không để trống
  - Confirm Password: Phải trùng khớp

**3.1.2 Đăng Nhập**
- **Mô tả**: Người dùng đăng nhập bằng email/password hoặc GitHub OAuth
- **Phương thức Email/Password**:
  1. Nhập email và mật khẩu
  2. Gửi yêu cầu xác thực tới Supabase Auth
  3. Nếu thành công, lấy JWT token
  4. Lưu session
  5. Chuyển hướng đến dashboard hoặc homepage
- **Phương thức OAuth (GitHub)**:
  1. Người dùng nhấn "Đăng Nhập với GitHub"
  2. Chuyển hướng tới GitHub OAuth
  3. Người dùng cấp quyền
  4. GitHub gửi code callback
  5. Supabase trao đổi code với token
  6. Tạo/cập nhật profile tự động
  7. Chuyển hướng đến dashboard

**3.1.3 Quên Mật Khẩu**
- **Mô tả**: Người dùng có thể đặt lại mật khẩu nếu quên
- **Quy trình**:
  1. Nhập email trên trang "Quên Mật Khẩu"
  2. Supabase gửi email reset link
  3. Người dùng nhấn link trong email
  4. Mở trang reset password
  5. Nhập mật khẩu mới
  6. Lưu mật khẩu mới
- **Bảo mật**: Link có thời hạn (mặc định 1 giờ)

**3.1.4 Middleware Bảo Vệ Route**
- **Mô tả**: Các route nhạy cảm chỉ cho phép user đã đăng nhập
- **Routes Bảo Vệ**: `/dashboard`, `/dashboard/new`, `/dashboard/edit/[id]`, `/profile`
- **Cơ chế**: Middleware kiểm tra JWT token trong cookie, nếu không hợp lệ redirect đến login

---

#### **Phần 2: Quản Lý Bài Viết (CRUD)**

**3.2.1 Tạo Bài Viết Mới**
- **Mô tả**: Người dùng đăng nhập có thể tạo bài viết mới
- **Form Input**:
  - **Tiêu đề** (Title): Bắt buộc, max 200 ký tự
  - **Tóm tắt** (Excerpt): Bắt buộc, max 500 ký tự
  - **Nội dung** (Content): Bắt buộc, max 50,000 ký tự
  - **URL Ảnh Đại Diện** (Image URL): Tùy chọn
  - **Danh mục** (Category): Tùy chọn
- **Quy trình**:
  1. User vào `/dashboard/new`
  2. Điền form
  3. Server action gọi `supabase.from('posts').insert()`
  4. Tự động tính slug từ tiêu đề
  5. Ghi vào bảng `posts` với `author_id = current_user.id`
  6. Set `status = 'draft'` mặc định
  7. Redirect về `/dashboard` hoặc `/blog/[slug]`

**3.2.2 Đọc/Xem Bài Viết**
- **Bài Viết Công Khai**: 
  - URL: `/blog/[slug]`
  - Hiển thị tiêu đề, nội dung, thông tin tác giả, thời gian tạo
  - Hiển thị ảnh đại diện (nếu có)
  - Danh sách bình luận bên dưới
- **Danh Sách Bài Viết**:
  - URL: `/blog`
  - Hiển thị tối đa 3 bài viết trên 1 trang
  - Phân trang (pagination)
  - Mỗi item hiển thị: tiêu đề, excerpt, ảnh, tác giả, ngày tạo

**3.2.3 Cập Nhật Bài Viết**
- **Mô tả**: Chỉ tác giả có thể cập nhật bài viết của mình
- **Quy trình**:
  1. User vào `/dashboard/edit/[post_id]`
  2. Load dữ liệu bài viết từ DB
  3. Hiển thị form với dữ liệu cũ
  4. User chỉnh sửa và nhấn "Cập Nhật"
  5. Gửi yêu cầu update
  6. RLS kiểm tra: chỉ tác giả mới được update
  7. Redirect về trang bài viết

**3.2.4 Xóa Bài Viết**
- **Mô tả**: Chỉ tác giả có thể xóa bài viết
- **Quy trình**:
  1. Người dùng nhấn "Xóa" trên dashboard
  2. Hiển thị xác nhận
  3. Gửi yêu cầu delete
  4. RLS kiểm tra quyền
  5. Xóa record khỏi DB
  6. Redirect về `/dashboard`

**3.2.5 Publish/Unpublish**
- **Mô tả**: Người dùng có thể công khai hoặc ẩn bài viết
- **Trạng thái**:
  - `draft`: Chỉ tác giả thấy
  - `published`: Công khai cho tất cả mọi người

---

#### **Phần 3: Danh Sách Bài Viết & Phân Trang**

**3.3.1 Trang Chủ (Homepage)**
- **URL**: `/`
- **Nội dung**:
  - Hero section giới thiệu
  - Section "Bài viết mới nhất" hiển thị 3 bài gần nhất
  - Link "Xem tất cả bài viết"
- **Query**: `SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT 3`

**3.3.2 Trang Danh Sách Blog**
- **URL**: `/blog`
- **Hiển thị**:
  - Tất cả bài viết công khai
  - Phân trang 3 bài/trang
  - Mỗi bài hiển thị: ảnh, tiêu đề, excerpt, tác giả, ngày tạo
- **Phân Trang**:
  - Tính số trang: `Math.ceil(total_posts / 3)`
  - Offset: `(page - 1) * 3`
  - Hiển thị: Trang trước/sau, số trang hiện tại

**3.3.3 Trang Chi Tiết Bài Viết**
- **URL**: `/blog/[slug]`
- **Nội dung**:
  - Tiêu đề, nội dung đầy đủ
  - Thông tin tác giả: avatar, tên, email
  - Ngày tạo/cập nhật
  - Ảnh đại diện (nếu có)
  - Lượt like (với nút like/unlike)
  - Số lượng bình luận
  - Phần bình luận

---

#### **Phần 4: Bình Luận & Realtime**

**3.4.1 Gửi Bình Luận**
- **Mô tả**: Người dùng đăng nhập có thể comment trên bài viết
- **Quy trình**:
  1. User vào trang `/blog/[slug]`
  2. Cuộn xuống phần comment
  3. Nhập comment text (max 5,000 ký tự)
  4. Nhấn "Gửi"
  5. Client validation kiểm tra text không trống
  6. Gửi Server Action
  7. Server kiểm tra user đã đăng nhập
  8. Insert vào bảng `comments`
  9. Trả về comment mới vừa tạo
- **Input Validation**:
  - Content: Bắt buộc, không trống, min 1 ký tự, max 5,000 ký tự

**3.4.2 Danh Sách Bình Luận**
- **Hiển thị**:
  - Tất cả comment của bài viết
  - Sắp xếp theo thời gian tạo (mới nhất cuối)
  - Mỗi comment hiển thị:
    - Avatar + tên tác giả
    - Nội dung comment
    - Thời gian tạo (relative: "2 giây trước", etc.)
    - Nút xóa comment (chỉ tác giả + admin)

**3.4.3 Real-time Comment Updates (Supabase Subscriptions)**
- **Mô tả**: Khi có comment mới, trang tự động cập nhật mà không cần reload
- **Cơ chế**:
  1. Client subscribe tới channel `posts:post_id`
  2. Lắng nghe event `INSERT` trên bảng `comments`
  3. Khi có insert mới, trigger callback
  4. Thêm comment mới vào danh sách trên UI
  5. Animate vào từ dưới lên (fade-in)
- **Lợi ích**: 
  - Trải nghiệm tức thì (no page refresh)
  - Đa người dùng cùng comment lúc

**3.4.4 Xóa Bình Luận**
- **Mô tả**: Tác giả comment hoặc admin có thể xóa
- **RLS Policy**: 
  - `user_id = current_user_id` (tác giả)
  - hoặc `is_admin(current_user_id)` (admin)

---

#### **Phần 5: Tính Năng Nâng Cao**

**3.5.1 Like/Unlike Bài Viết**
- **Mô tả**: Người dùng có thể đánh giá bài viết bằng cách "Like"
- **Bảng**: `likes(id, user_id, post_id, created_at)`
- **Ràng Buộc**: `UNIQUE(user_id, post_id)` - Mỗi user chỉ like 1 lần
- **Quy trình Like**:
  1. User nhấn nút Like
  2. Kiểm tra user đã like chưa
  3. Nếu chưa, insert record mới
  4. Tăng lượt like hiển thị
  5. Đổi icon nút (hollow → solid)
- **Quy trình Unlike**:
  1. Nếu user đã like, nhấn lại nút Like = Unlike
  2. Delete record từ bảng likes
  3. Giảm lượt like
  4. Đổi icon nút (solid → hollow)

**3.5.2 Tải Hình Ảnh (Image Upload)**
- **Mô tả**: Người dùng có thể upload ảnh làm ảnh đại diện bài viết
- **Nơi Lưu**: Supabase Storage bucket `blog-images`
- **Quy trình**:
  1. User chọn ảnh từ máy tính (JPG, PNG, WebP, max 5MB)
  2. Client validation: loại file, dung lượng, preview
  3. Gửi upload: `supabase.storage.from('blog-images').upload()`
  4. Tên file: `[user_id]-[timestamp]-[original_name]`
  5. Server trả về URL công khai
  6. Lưu URL vào database
  7. Hiển thị ảnh preview ngay lập tức
- **Xử Lý Lỗi**: File quá lớn, định dạng không hỗ trợ, network timeout

**3.5.3 Tìm Kiếm Full-text (Full-text Search)**
- **Mô tả**: User có thể tìm kiếm bài viết theo tiêu đề, excerpt, nội dung
- **Trang Tìm Kiếm**: `/search?q=[query]`
- **Quy trình**:
  1. User nhập keyword vào search bar (header)
  2. Nhấn Enter hoặc nhấn nút Search
  3. Chuyển hướng đến `/search?q=[encoded_query]`
  4. Server gọi PostgreSQL RPC function: `search_posts(query_text)`
  5. Function thực hiện full-text search
  6. Hiển thị kết quả (danh sách bài viết matching)
  7. Phân trang: 5 kết quả/trang

**3.5.4 Quản Lý Hồ Sơ Người Dùng (Profile)**
- **Trang Profile**: `/profile`
- **Thông Tin Hiển Thị**:
  - Email (không thay đổi được)
  - Display Name (có thể chỉnh sửa)
  - Avatar URL (có thể chỉnh sửa hoặc upload)
  - Ngày tham gia (Member Since)
  - Số bài viết của user
  - Tổng lượt like nhận được
- **Chỉnh Sửa Profile**:
  1. User nhấn "Chỉnh Sửa"
  2. Form cho phép cập nhật: Display Name, Avatar URL
  3. Nhấn "Lưu"
  4. Server Action validate dữ liệu
  5. Update bảng `profiles`
  6. Cập nhật UI ngay lập tức

**3.5.5 Trang Portfolio**
- **Mô tả**: Trang hiển thị danh sách dự án/portfolio của user
- **URL**: `/portfolio` hoặc `/portfolio/[user_id]`
- **Chức Năng**:
  - Xem danh sách dự án công khai
  - Thêm/sửa/xóa dự án của mình
  - Like dự án người khác
- **Bảng**: `projects(id, user_id, title, description, image_url, link, likes_count, ...)`

---

### 3.2 Biểu Đồ Luồng Chức Năng

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIMPLE BLOG - FLOW DIAGRAM                    │
└─────────────────────────────────────────────────────────────────┘

[Khách Không Đăng Nhập]
        │
        ├─→ Xem Trang Chủ
        ├─→ Xem Danh Sách Blog
        ├─→ Xem Chi Tiết Bài Viết
        ├─→ Tìm Kiếm Bài Viết
        ├─→ Xem Comment (Realtime)
        └─→ Đăng Ký / Đăng Nhập

                    ↓

[User Đăng Nhập]
        │
        ├─→ Đọc Bài Viết
        ├─→ Viết Comment (Realtime)
        ├─→ Like/Unlike Bài Viết
        ├─→ Chỉnh Sửa Profile
        ├─→ Upload Avatar
        ├─→ Xem Portfolio Cá Nhân
        ├─→ Xem Dashboard
        ├─→ Tạo Bài Viết Mới
        │   ├─→ Điền Form (Tiêu Đề, Nội Dung, Ảnh)
        │   ├─→ Upload Ảnh Đại Diện
        │   ├─→ Lưu Draft
        │   └─→ Publish
        ├─→ Quản Lý Bài Viết
        │   ├─→ Edit Bài Viết
        │   ├─→ Delete Bài Viết
        │   └─→ Change Status (Draft/Published)
        └─→ Đăng Xuất
```

---

### 3.3 Bảng Tóm Tắt Chức Năng

| # | Chức Năng | User Type | Mô Tả |
|----|-----------|-----------|-------|
| 1 | Đăng Ký | Công Khai | Email + Password |
| 2 | Đăng Nhập | Công Khai | Email/OAuth |
| 3 | Quên Mật Khẩu | Công Khai | Reset via Email |
| 4 | Xem Homepage | Công Khai | 3 bài mới nhất |
| 5 | Danh Sách Blog | Công Khai | Phân trang 3/trang |
| 6 | Xem Chi Tiết | Công Khai | Bài viết + Comment |
| 7 | Tìm Kiếm | Công Khai | Full-text search |
| 8 | Tạo Bài Viết | Auth User | CRUD operations |
| 9 | Chỉnh Sửa Bài Viết | Auth User | Chỉ tác giả |
| 10 | Xóa Bài Viết | Auth User | Chỉ tác giả |
| 11 | Viết Comment | Auth User | Realtime updates |
| 12 | Like Bài Viết | Auth User | Vote hệ thống |
| 13 | Upload Ảnh | Auth User | Supabase Storage |
| 14 | Quản Lý Profile | Auth User | Chỉnh sửa thông tin |
| 15 | Portfolio | Auth User | Dự án cá nhân |

---

---

## KẾT LUẬN

Báo cáo này đã trình bày tổng quan, mục tiêu, và phân tích chức năng chi tiết của dự án **Simple Blog**. Dự án đã đạt được **100% các mục tiêu** đề ra với:

- ✅ **15 chức năng chính** hoàn toàn xây dựng
- ✅ **7 phần** (Authentication, CRUD, Blog, Comments, Advanced Features, UI/UX, Security)
- ✅ **Realtime capabilities** sử dụng Supabase subscriptions
- ✅ **Security-first approach** với RLS policies
- ✅ **Professional documentation** với 20+ prompts mẫu

Dự án này cung cấp một nền tảng vững chắc cho việc học tập và ứng dụng các công nghệ mới trong phát triển phần mềm.

---

<div align="center">

---

**Ngày Hoàn Thành**: 10/05/2026  
**Trạng Thái**: ✅ Hoàn Thành  
**Sinh Viên**: 2212440 - Khoá K46

---

</div>
