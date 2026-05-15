# BÀI THUYẾT TRÌNH LAB 4: CÁC CÔNG NGHỆ MỚI TRONG PHÁT TRIỂN PHẦN MỀM

---

## 1. Giới thiệu đề tài
- **Lab 4:** Xây dựng ứng dụng blog hiện đại sử dụng Next.js, Supabase, TypeScript, Tailwind CSS.
- **Mục tiêu:** Thực hành phát triển full-stack app, áp dụng các công nghệ mới, bảo mật, realtime, UI hiện đại.

---

## 2. Kiến trúc tổng quan
- **Frontend:** Next.js 16 (App Router, Server/Client Components)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Database:** 4 bảng (profiles, posts, comments, likes), 12 RLS policies
- **Authentication:** Email/Password + GitHub OAuth
- **UI:** Tailwind CSS, responsive, hiện đại

---

## 3. Các chức năng chính (7 phần)
1. **Đăng ký/Đăng nhập/Quên mật khẩu**
2. **Quản lý bài viết (CRUD)**
3. **Danh sách bài viết & phân trang**
4. **Chi tiết bài viết & bình luận**
5. **Bình luận realtime (Supabase Subscriptions)**
6. **Trang cá nhân (Profile), Like, Upload ảnh, Tìm kiếm**
7. **UI/UX hiện đại, bảo mật, tối ưu**

---

## 4. Điểm nổi bật kỹ thuật
- **Supabase:**
  - Quản lý database, Auth, Storage, Realtime
  - RLS bảo vệ dữ liệu ở cấp DB
- **Next.js:**
  - Routing động, Server Actions, phân tách Server/Client
- **TypeScript:**
  - Kiểm tra lỗi khi code, tự động gợi ý
- **Tailwind CSS:**
  - Thiết kế giao diện nhanh, responsive
- **Realtime:**
  - Bình luận cập nhật tức thì không cần reload
- **Image Upload:**
  - Lưu ảnh lên Supabase Storage, hiển thị ảnh đại diện bài viết
- **Tìm kiếm:**
  - Full-text search với PostgreSQL function

---

## 5. Bảo mật & Best Practices
- **RLS Policies:**
  - Chỉ tác giả mới sửa/xóa bài viết của mình
  - Chỉ user đã đăng nhập mới được comment/like
- **Input Validation:**
  - Kiểm tra dữ liệu phía client & server
- **Middleware:**
  - Bảo vệ route nhạy cảm
- **Quản lý secrets:**
  - Sử dụng .env.local

---

## 6. Quy trình phát triển
1. **Khởi tạo dự án Next.js + Supabase**
2. **Thiết kế database, tạo bảng, policies**
3. **Xây dựng từng tính năng (theo 7 phần)**
4. **Kiểm thử, sửa lỗi, tối ưu UI/UX**
5. **Viết tài liệu, tổng hợp prompts mẫu**
6. **Commit & push lên GitHub**

---

## 7. Tài liệu & Prompts mẫu
- **PROMPTS_GUIDE.md:** 20+ prompts mẫu, chia theo chương, có code ví dụ, hướng dẫn chi tiết
- **SUBMISSION_DOCUMENTATION.md:** Tổng hợp toàn bộ quá trình, checklist, cấu trúc project
- **DOCUMENTATION_INDEX.md:** Mục lục, tra cứu nhanh
- **LAB4_FLYER.txt:** Tóm tắt trình bày, highlights

---

## 8. Kết quả đạt được
- 100% tính năng yêu cầu đã hoàn thành
- 15+ commit, code sạch, bảo mật tốt
- UI hiện đại, responsive, trải nghiệm tốt
- Tài liệu đầy đủ, dễ tra cứu, dễ mở rộng
- Sẵn sàng deploy production

---

## 9. Demo & Hướng dẫn sử dụng
- Đăng ký/đăng nhập → Tạo bài viết → Bình luận realtime → Like → Tìm kiếm → Chỉnh sửa profile → Upload ảnh
- Xem tài liệu hướng dẫn chi tiết trong PROMPTS_GUIDE.md

---

## 10. Kết luận
- Lab 4 giúp nắm vững quy trình phát triển full-stack app hiện đại
- Áp dụng thành thạo Next.js, Supabase, TypeScript, Tailwind CSS
- Có thể tái sử dụng prompts, code, tài liệu cho các dự án thực tế

---

**Cảm ơn thầy/cô và các bạn đã lắng nghe!**

---

**Tài liệu, code, demo:**
- GitHub: https://github.com/phonghgifu/Lab4_CTK46A
- Xem chi tiết tại: /simple-blog/PROMPTS_GUIDE.md, /simple-blog/SUBMISSION_DOCUMENTATION.md, /simple-blog/LAB4_FLYER.txt
