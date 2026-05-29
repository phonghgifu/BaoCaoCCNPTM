#!/usr/bin/env node

/**
 * Script insert bài viết chi tiết vào Supabase
 * Chạy: node insert-articles-simple.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key] = value;
  }
});

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
);

const articlesData = [
  {
    title: 'React Hooks: Từ useState đến useReducer',
    slug: 'react-hooks-tu-usestate-den-usereducer',
    excerpt: 'Hiểu rõ cách sử dụng Hooks trong React và khi nào nên dùng useReducer thay vì useState.',
    content: `React Hooks là feature hữu ích giúp chúng ta sử dụng state và lifecycle mà không cần Class Component. Bài viết này sẽ đi sâu vào cách sử dụng hooks, từ useState cơ bản đến useReducer phức tạp.\n\n## useState - Quản lý state đơn giản\n\nuseState là hook phổ biến nhất. Nó nhận giá trị khởi tạo và trả về một mảng gồm state hiện tại và hàm update.`
  },
  {
    title: 'Performance Optimization trong React: memo, useMemo, useCallback',
    slug: 'performance-optimization-trong-react-memo-usememo-usecallback',
    excerpt: 'Cách tối ưu render performance bằng React.memo, useMemo và useCallback.',
    content: `Khi ứng dụng React phát triển, hiệu năng render có thể trở thành vấn đề. Bài viết này hướng dẫn cách tối ưu performance bằng các kỹ thuật như memoization.`
  },
  {
    title: 'Custom Hooks: Tái sử dụng logic trong React',
    slug: 'custom-hooks-tai-su-dung-logic-trong-react',
    excerpt: 'Tạo custom hooks để giảm code duplication và tái sử dụng logic giữa các component.',
    content: `Custom hooks là cách tuyệt vời để chia sẻ logic giữa các component. Chúng là function JavaScript bắt đầu với "use" và có thể sử dụng các hooks khác.`
  },
  {
    title: 'TypeScript Generics: Viết code tái sử dụng được',
    slug: 'typescript-generics-viet-code-tai-su-dung-duoc',
    excerpt: 'Hiểu về TypeScript Generics và cách sử dụng chúng để tạo code linh hoạt và type-safe.',
    content: `TypeScript Generics là tính năng mạnh mẽ cho phép viết code tái sử dụng được mà vẫn đảm bảo type safety.`
  },
  {
    title: 'TypeScript Decorators và Metadata',
    slug: 'typescript-decorators-va-metadata',
    excerpt: 'Sử dụng Decorators để thêm metadata và tính năng vào class, method, property.',
    content: `TypeScript Decorators là tính năng nâng cao cho phép annotate và modify class declaration, method, accessor, property hoặc parameter.`
  },
  {
    title: 'PostgreSQL Query Optimization: Index và EXPLAIN',
    slug: 'postgresql-query-optimization-index-va-explain',
    excerpt: 'Cách sử dụng INDEX, EXPLAIN ANALYZE để tối ưu query PostgreSQL.',
    content: `PostgreSQL là database mạnh mẽ nhưng query chậm có thể là vấn đề lớn.`
  },
  {
    title: 'N+1 Query Problem và cách giải quyết',
    slug: 'n-plus-1-query-problem-va-cach-giai-quyet',
    excerpt: 'Hiểu và khắc phục N+1 query problem trong ứng dụng web.',
    content: `N+1 query problem là lỗi phổ biến gây hiệu năng kém.`
  },
  {
    title: 'RESTful API Design: Best Practices',
    slug: 'restful-api-design-best-practices',
    excerpt: 'Những nguyên tắc thiết kế RESTful API tốt và cách implement.',
    content: `RESTful API là chuẩn để xây dựng web services.`
  },
  {
    title: 'Web Performance: Lazy Loading, Code Splitting, Compression',
    slug: 'web-performance-lazy-loading-code-splitting-compression',
    excerpt: 'Kỹ thuật tối ưu hiệu năng web: lazy loading, code splitting, gzip compression.',
    content: `Web performance quan trọng cho SEO và user experience.`
  },
  {
    title: 'Web Security: CSRF, XSS, SQL Injection Prevention',
    slug: 'web-security-csrf-xss-sql-injection-prevention',
    excerpt: 'Các lỗ hổng web phổ biến và cách phòng chống: CSRF, XSS, SQL Injection.',
    content: `Web security là vấn đề quan trọng.`
  },
  {
    title: 'Unit Testing và Integration Testing trong JavaScript',
    slug: 'unit-testing-va-integration-testing-trong-javascript',
    excerpt: 'Cách viết unit tests và integration tests với Jest, Vitest, React Testing Library.',
    content: `Testing là phần quan trọng của development.`
  },
  {
    title: 'Docker & Docker Compose cho development',
    slug: 'docker-and-docker-compose-cho-development',
    excerpt: 'Sử dụng Docker và Docker Compose để containerize ứng dụng.',
    content: `Docker giúp đảm bảo consistency giữa development và production.`
  }
];

(async () => {
  console.log('🚀 Bắt đầu insert bài viết...\n');

  try {
    // Lấy author đầu tiên
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1);

    if (profileError) {
      console.error('❌ Lỗi lấy profile:', profileError.message);
      process.exit(1);
    }

    if (!profiles || profiles.length === 0) {
      console.error('❌ Lỗi: Không tìm thấy author. Hãy đăng ký tài khoản trước!');
      console.error('   Truy cập: http://localhost:3000/register');
      process.exit(1);
    }

    const authorId = profiles[0].id;
    console.log(`✅ Tìm thấy author: ${authorId}\n`);

    // Insert từng bài viết
    let successCount = 0;
    let errorCount = 0;

    for (const article of articlesData) {
      try {
        const { error } = await supabase
          .from('posts')
          .upsert(
            {
              author_id: authorId,
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              status: 'published',
              published_at: new Date().toISOString()
            },
            { onConflict: 'slug' }
          );

        if (error) throw error;

        console.log(`✅ "${article.title}"`);
        successCount++;
      } catch (err) {
        console.error(`❌ "${article.title}": ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Kết quả: ${successCount}/${articlesData.length} thành công, ${errorCount} lỗi`);
    console.log('\n🎉 Insert bài viết hoàn tất!');
    console.log('\n📱 Hãy refresh trang web: http://localhost:3000/blog\n');

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (err) {
    console.error('💥 Lỗi:', err.message);
    process.exit(1);
  }
})();
