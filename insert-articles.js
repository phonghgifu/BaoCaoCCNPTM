#!/usr/bin/env node

/**
 * Script insert bài viết chi tiết vào Supabase
 * Chạy: npm run insert-articles
 */

require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const articlesData = [
  {
    title: 'React Hooks: Từ useState đến useReducer',
    slug: 'react-hooks-tu-usestate-den-usereducer',
    excerpt: 'Hiểu rõ cách dùng Hooks và khi nào nên chuyển từ useState sang useReducer.',
    content: `React Hooks giúp functional component quản lý state và side effects rõ ràng hơn mà không cần Class Component.

1) useState cho state đơn giản
- Phù hợp với toggle, đếm số lượng, trạng thái mở/đóng
- Dễ đọc và dễ dùng cho UI nhỏ

2) useEffect cho side effects
- Dùng khi cần fetch data, subscribe event hoặc sync với DOM
- Cần dependency array rõ ràng để tránh chạy lại ngoài ý muốn

3) useReducer cho state phức tạp
- Hợp khi nhiều action cùng tác động lên một state
- Giúp luồng cập nhật dễ dự đoán hơn

4) Cách chọn nhanh
- State đơn giản: useState
- State có nhiều bước xử lý: useReducer
- Tác vụ phụ: useEffect

Kết luận: chọn hook theo độ phức tạp của logic, không chọn theo thói quen.`
  },
  {
    title: 'Performance Optimization trong React: memo, useMemo, useCallback',
    slug: 'performance-optimization-trong-react-memo-usememo-usecallback',
    excerpt: 'Cách giảm render thừa và tối ưu tính toán trong React.',
    content: `Tối ưu performance trong React nên bắt đầu từ việc đo đạc trước khi áp dụng memoization.

1) React.memo
- Giảm re-render cho component có props ổn định
- Không nên bọc mọi component một cách mặc định

2) useMemo
- Cache giá trị tính toán tốn kém như filter hoặc sort
- Chỉ có ích khi chi phí tính toán đủ lớn

})();
3) Thực hành tốt
- Dùng .dockerignore để giảm image size
- Ưu tiên multi-stage build khi deploy
- Không chạy container bằng root nếu không cần

4) Workflow thực tế
- Build image
- Chạy container
- Kiểm tra log và health
- Dọn tài nguyên không dùng nữa

Kết luận: container tốt là container nhỏ, rõ trách nhiệm và dễ lặp lại ở mọi môi trường.`
  }
];

