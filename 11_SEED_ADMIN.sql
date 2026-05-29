-- ============================================================
-- SEED ADMIN USER
-- Cấp quyền admin cho user cụ thể
-- Chạy file này sau khi user đã đăng ký
-- ============================================================

-- ⚠️ QUAN TRỌNG: Thay UUID bằng giá trị thực của user bạn muốn cấp quyền admin
-- Bạn có thể lấy UUID từ Supabase Dashboard → Authentication → Users

UPDATE public.profiles
SET role = 'admin'
WHERE id = '96420f57-fb6e-46a6-baf0-0dba3847b767'; -- UUID của phongcicho@gmail.com

-- Câu lệnh kiểm tra (tùy chọn)
-- SELECT id, display_name, role FROM public.profiles WHERE role = 'admin';

SELECT 'Cấp quyền admin cho user 96420f57-fb6e-46a6-baf0-0dba3847b767 thành công!' as result;