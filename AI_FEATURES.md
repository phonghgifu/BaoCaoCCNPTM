# AI Features Proposal

## High-value AI ideas
- AI title assistant: gợi ý tiêu đề ngắn, rõ, tối ưu SEO.
- AI summary generator: tự sinh tóm tắt 2-3 dòng cho bài viết.
- AI tag suggestion: đề xuất tag dựa trên nội dung bài.
- AI rewrite mode: chuyển nội dung sang giọng văn học thuật, báo cáo hoặc portfolio.
- AI search assistant: cho phép tìm bài bằng câu hỏi tự nhiên.
- AI cover image prompt: tạo prompt hình ảnh theo chủ đề bài viết.

## AI workflow gợi ý
1. Người dùng nhập nội dung nháp.
2. Hệ thống phân tích title/content/tags.
3. AI trả về title, summary, tags, và tone suggestion.
4. Người dùng duyệt lại trước khi xuất bản.

## Gợi ý triển khai
- Dùng server action hoặc API route để gọi model.
- Lưu prompt, output và feedback để cải thiện chất lượng.
- Chỉ bật AI cho `editor` và `admin`.
