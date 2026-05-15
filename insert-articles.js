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
    excerpt: 'Hiểu rõ cách sử dụng Hooks trong React và khi nào nên dùng useReducer thay vì useState.',
    content: `React Hooks là feature hữu ích giúp chúng ta sử dụng state và lifecycle mà không cần Class Component. Bài viết này sẽ đi sâu vào cách sử dụng hooks, từ useState cơ bản đến useReducer phức tạp.

## useState - Quản lý state đơn giản

useState là hook phổ biến nhất. Nó nhận giá trị khởi tạo và trả về một mảng gồm state hiện tại và hàm update.

Ví dụ:
const [count, setCount] = useState(0);

Đây là cách để quản lý state trong functional component. Mỗi lần setCount được gọi, component sẽ re-render với giá trị state mới.

## useEffect - Side effects trong functional component

useEffect cho phép ta thực hiện các tác vụ phụ như fetch data, subscribe event, hoặc thay đổi DOM.

## useReducer - Quản lý state phức tạp

Khi state có logic phức tạp, useReducer là lựa chọn tốt hơn useState. Nó giống như Redux nhưng nhỏ hơn.

## Kết luận

Có thể sử dụng useReducer khi:
- State có nhiều state values liên quan
- Logic update state phức tạp
- Muốn tối ưu hiệu năng bằng cách truyền dispatch xuống thay vì callback`
  },
  {
    title: 'Performance Optimization trong React: memo, useMemo, useCallback',
    slug: 'performance-optimization-trong-react-memo-usememo-usecallback',
    excerpt: 'Cách tối ưu render performance bằng React.memo, useMemo và useCallback.',
    content: `Khi ứng dụng React phát triển, hiệu năng render có thể trở thành vấn đề. Bài viết này hướng dẫn cách tối ưu performance bằng các kỹ thuật như memoization.

## React.memo - Ngăn re-render không cần thiết

React.memo là HOC (Higher Order Component) giúp component chỉ re-render khi props thay đổi.

## useMemo - Cache giá trị tính toán

useMemo giúp cache kết quả tính toán để tránh tính lại mỗi khi render.

## useCallback - Cache function reference

useCallback tương tự useMemo nhưng cho function. Nó đảm bảo function reference không thay đổi (trừ khi dependency thay đổi).

## Khi nào sử dụng?

- React.memo: Child component render lại thường xuyên nhưng props ít thay đổi
- useMemo: Tính toán tốn kém (sorting, filtering large array)
- useCallback: Truyền callback xuống memo component hoặc sử dụng trong dependency array

Hãy profile ứng dụng trước và optimize sau khi phát hiện bottleneck!`
  },
  {
    title: 'Custom Hooks: Tái sử dụng logic trong React',
    slug: 'custom-hooks-tai-su-dung-logic-trong-react',
    excerpt: 'Tạo custom hooks để giảm code duplication và tái sử dụng logic giữa các component.',
    content: `Custom hooks là cách tuyệt vời để chia sẻ logic giữa các component. Chúng là function JavaScript bắt đầu với "use" và có thể sử dụng các hooks khác.

## Ví dụ: useFetch Hook

Hãy tạo custom hook để fetch data:

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

## Lợi ích của Custom Hooks

1. Code reusability: Chia sẻ logic giữa các component
2. Cleaner components: Component chỉ focus vào rendering logic
3. Dễ test: Logic được tách biệt trong hook riêng
4. Type safety: Dễ thêm TypeScript types`
  },
  {
    title: 'TypeScript Generics: Viết code tái sử dụng được',
    slug: 'typescript-generics-viet-code-tai-su-dung-duoc',
    excerpt: 'Hiểu về TypeScript Generics và cách sử dụng chúng để tạo code linh hoạt và type-safe.',
    content: `TypeScript Generics là tính năng mạnh mẽ cho phép viết code tái sử dụng được mà vẫn đảm bảo type safety.

## Generic Functions

Bắt đầu với một ví dụ đơn giản:

function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(123);

## Generic Constraints

Đôi khi bạn muốn limit generic type. Sử dụng extends:

interface HasLength {
  length: number;
}

function loggingIdentity<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

## Generic Classes

class GenericQueue<T> {
  private items: T[] = [];

  enqueue(item: T) {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }
}

const queue = new GenericQueue<string>();
queue.enqueue("Hello");
queue.enqueue("World");`
  },
  {
    title: 'TypeScript Decorators và Metadata',
    slug: 'typescript-decorators-va-metadata',
    excerpt: 'Sử dụng Decorators để thêm metadata và tính năng vào class, method, property.',
    content: `TypeScript Decorators là tính năng nâng cao cho phép annotate và modify class declaration, method, accessor, property hoặc parameter.

## Class Decorators

Class decorator nhận class constructor và có thể modify nó:

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

## Method Decorators

Method decorator nhận 3 parameters: target, propertyKey, descriptor.

## Ứng dụng thực tế

Decorators rất hữu ích cho:
1. ORM Libraries: Định nghĩa schema bằng decorators (TypeORM)
2. API Frameworks: Định nghĩa routes (NestJS)
3. Validation: Thêm validation rules
4. Logging: Tự động log method calls`
  },
  {
    title: 'PostgreSQL Query Optimization: Index và EXPLAIN',
    slug: 'postgresql-query-optimization-index-va-explain',
    excerpt: 'Cách sử dụng INDEX, EXPLAIN ANALYZE để tối ưu query PostgreSQL.',
    content: `PostgreSQL là database mạnh mẽ nhưng query chậm có thể là vấn đề lớn.

## EXPLAIN ANALYZE - Xem query plan

Trước tiên, hãy xem execution plan của query:

EXPLAIN ANALYZE
SELECT * FROM posts WHERE author_id = '123';

Kết quả sẽ cho biết:
- Node type (Sequential Scan, Index Scan, Hash Join)
- Rows estimated vs actual
- Execution time

## Indexes - Tăng tốc độ truy vấn

Index giúp database tìm kiếm dữ liệu nhanh hơn:

CREATE INDEX idx_posts_author_id ON posts(author_id);

## Types of Indexes

1. B-tree Index (default): Tốt cho comparison (=, <, >, BETWEEN)
2. Hash Index: Tốt cho equality only
3. GiST, GIN: Cho full-text search, array
4. BRIN: Cho very large tables`
  },
  {
    title: 'N+1 Query Problem và cách giải quyết',
    slug: 'n-plus-1-query-problem-va-cach-giai-quyet',
    excerpt: 'Hiểu và khắc phục N+1 query problem trong ứng dụng web.',
    content: `N+1 query problem là lỗi phổ biến gây hiệu năng kém.

## Ví dụ N+1 Problem

Giả sử có schema:
- posts table
- comments table (posts có many comments)

Code sai:
const posts = await db.query("SELECT * FROM posts LIMIT 10");

for (const post of posts) {
  const comments = await db.query(
    "SELECT * FROM comments WHERE post_id = $1", 
    [post.id]
  );
  post.comments = comments;
}

Kết quả: 1 + 10 = 11 queries!

## Giải pháp 1: JOIN

SELECT 
  p.id, p.title, p.content,
  c.id as comment_id, c.content as comment_content
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
LIMIT 10;

## Giải pháp 2: Eager Loading

Nếu dùng ORM (e.g., Sequelize, TypeORM):

const posts = await postRepository.find({
  relations: ['comments'],
  take: 10
});`
  },
  {
    title: 'RESTful API Design: Best Practices',
    slug: 'restful-api-design-best-practices',
    excerpt: 'Những nguyên tắc thiết kế RESTful API tốt và cách implement.',
    content: `RESTful API là chuẩn để xây dựng web services.

## 1. Sử dụng đúng HTTP Methods

GET    /api/posts         - Lấy danh sách posts
GET    /api/posts/:id     - Lấy chi tiết 1 post
POST   /api/posts         - Tạo post mới
PUT    /api/posts/:id     - Update toàn bộ post
PATCH  /api/posts/:id     - Update một phần post
DELETE /api/posts/:id     - Xóa post

## 2. Status Codes chuẩn

200 OK              - Request thành công
201 Created         - Resource mới được tạo
204 No Content      - Request thành công, không có response body
400 Bad Request     - Client error (invalid data)
401 Unauthorized    - Chưa authenticate
403 Forbidden       - Không có permission
404 Not Found       - Resource không tồn tại
500 Server Error    - Server error

## 3. API Versioning

Hãy version API để dễ maintain khi có breaking changes:

/api/v1/posts
/api/v2/posts`
  },
  {
    title: 'Web Performance: Lazy Loading, Code Splitting, Compression',
    slug: 'web-performance-lazy-loading-code-splitting-compression',
    excerpt: 'Kỹ thuật tối ưu hiệu năng web: lazy loading, code splitting, gzip compression.',
    content: `Web performance quan trọng cho SEO và user experience.

## 1. Lazy Loading - Tải resource khi cần

### Image Lazy Loading

<img loading="lazy" src="image.jpg" alt="description" />

### Component Lazy Loading (React)

const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

## 2. Code Splitting - Chia nhỏ bundle

Thay vì 1 file JavaScript lớn, chia thành nhiều chunks.

## 3. Compression

### Gzip Compression

gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;

## Metrics để đo

- LCP (Largest Contentful Paint): Khi element lớn nhất render
- FID (First Input Delay): Delay từ user input đến response
- CLS (Cumulative Layout Shift): Bao nhiêu layout shift`
  },
  {
    title: 'Web Security: CSRF, XSS, SQL Injection Prevention',
    slug: 'web-security-csrf-xss-sql-injection-prevention',
    excerpt: 'Các lỗ hổng web phổ biến và cách phòng chống: CSRF, XSS, SQL Injection.',
    content: `Web security là vấn đề quan trọng.

## 1. XSS (Cross-Site Scripting)

XSS xảy ra khi attacker inject JavaScript code vào page.

### React tự động escape

return <div>{userComment}</div>; // Safe

### HTML Escape

const escapeHTML = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  };
  return text.replace(/[&<>"]/g, m => map[m]);
};

## 2. CSRF (Cross-Site Request Forgery)

### CSRF Token

const csrfToken = crypto.randomBytes(32).toString('hex');
session.csrfToken = csrfToken;

## 3. SQL Injection

### Parameterized Queries

const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);`
  },
  {
    title: 'Unit Testing và Integration Testing trong JavaScript',
    slug: 'unit-testing-va-integration-testing-trong-javascript',
    excerpt: 'Cách viết unit tests và integration tests với Jest, Vitest, React Testing Library.',
    content: `Testing là phần quan trọng của development.

## 1. Unit Testing - Test function độc lập

### Setup Jest

npm install --save-dev jest @testing-library/jest-dom

### Ví dụ Unit Test

describe('Math utilities', () => {
  test('add function should return sum', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('multiply function should return product', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});

## 2. Testing React Components

### React Testing Library

npm install --save-dev @testing-library/react

## 3. Mocking Dependencies

const mockCallback = jest.fn();
button.addEventListener('click', mockCallback);

fireEvent.click(button);

expect(mockCallback).toHaveBeenCalled();`
  },
  {
    title: 'Docker & Docker Compose cho development',
    slug: 'docker-and-docker-compose-cho-development',
    excerpt: 'Sử dụng Docker và Docker Compose để containerize ứng dụng.',
    content: `Docker giúp đảm bảo consistency giữa development và production.

## 1. Docker Basics

### Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

### Build và Run

docker build -t my-app:1.0 .

docker run -p 3000:3000 -e NODE_ENV=development my-app:1.0

## 2. Docker Compose - Multiple Services

### docker-compose.yml

version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password

## Best Practices

✓ Use .dockerignore để reduce image size
✓ Use Alpine images (nhỏ hơn)
✓ Multi-stage builds cho production
✓ Don't run as root`
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

    if (profileError || !profiles || profiles.length === 0) {
      console.error('❌ Lỗi: Không tìm thấy author. Hãy đăng ký tài khoản trước!');
      process.exit(1);
    }

    const authorId = profiles[0].id;
    console.log(`✅ Tìm thấy author: ${authorId}\n`);

    // Insert từng bài viết
    let successCount = 0;
    let errorCount = 0;

    for (const article of articlesData) {
      try {
        const { data, error } = await supabase
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

        console.log(`✅ ${article.title}`);
        successCount++;
      } catch (err) {
        console.error(`❌ ${article.title}: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Kết quả: ${successCount} thành công, ${errorCount} lỗi`);
    console.log('🎉 Insert bài viết hoàn tất!\n');
    console.log('Hãy refresh trang web: http://localhost:3000/blog');

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (err) {
    console.error('💥 Lỗi:', err.message);
    process.exit(1);
  }
})();
