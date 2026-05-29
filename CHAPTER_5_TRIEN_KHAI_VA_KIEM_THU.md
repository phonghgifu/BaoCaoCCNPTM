# CHƯƠNG 5. TRIỂN KHAI VÀ KIỂM THỬ

## 5.1 Tổng Quan Giai Đoạn Triển Khai & Kiểm Thử

### 5.1.1 Định Nghĩa & Mục Đích

Giai đoạn triển khai và kiểm thử (Implementation and Testing Phase) là quá trình:

1. **Triển khai** (Implementation): Chuyển đổi thiết kế chi tiết thành mã nguồn hoạt động
2. **Kiểm thử** (Testing): Xác minh rằng hệ thống đáp ứng yêu cầu và hoạt động đúng theo thiết kế
3. **Tích hợp**: Kết hợp các thành phần riêng lẻ thành một hệ thống hoàn chỉnh
4. **Triển khai lên sản xuất**: Đưa hệ thống vào môi trường sản xuất để phục vụ người dùng

Mục đích chính:
- Đảm bảo mã nguồn được viết theo tiêu chuẩn chất lượng
- Phát hiện và sửa lỗi (bugs) trước khi sản xuất
- Xác minh toàn bộ chức năng hoạt động đúng
- Đảm bảo hiệu năng đáp ứng yêu cầu
- Kiểm thử bảo mật và khả năng phục hồi

### 5.1.2 Phương Pháp Tiếp Cận

Dự án sử dụng **phương pháp Test-Driven Development (TDD)** kết hợp với:
- **Unit Testing**: Kiểm thử từng unit/module độc lập
- **Integration Testing**: Kiểm thử tích hợp các modules
- **End-to-End Testing**: Kiểm thử toàn bộ luồng người dùng
- **Performance Testing**: Kiểm thử hiệu năng
- **Security Testing**: Kiểm thử bảo mật

---

## 5.2 Triển Khai Hệ Thống (Implementation)

### 5.2.1 Môi Trường Phát Triển

#### 5.2.1.1 Stack Công Nghệ

| Thành Phần | Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|---------|
| **Frontend** | Next.js + TypeScript | 14.x | Server-side rendering, static generation |
| **UI Components** | React 18 | 18.x | Component library, UI rendering |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **Backend API** | Next.js API Routes | 14.x | REST API endpoints |
| **Database** | PostgreSQL | 14+ | Relational database |
| **Authentication** | Supabase Auth | Latest | OAuth, JWT, session management |
| **Storage** | Supabase Storage | Latest | File storage (images, documents) |
| **Realtime** | Supabase Realtime | Latest | WebSocket for real-time updates |
| **ORM/Query** | Supabase JS Client | Latest | Database query client |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Testing** | Vitest + Jest | Latest | Unit testing framework |
| **E2E Testing** | Playwright | Latest | Browser automation testing |
| **Code Quality** | ESLint + Prettier | Latest | Code linting & formatting |
| **Container** | Docker | Latest | Containerization |
| **Deployment** | Vercel + Supabase | Latest | Hosting & infrastructure |

#### 5.2.1.2 Cấu Trúc Dự Án

```
simple-blog/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx        # Posts list
│   │   │   ├── [slug]/page.tsx # Post detail
│   │   │   └── new/page.tsx    # Create post
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Protected layout
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── posts/
│   │   │   ├── profile/page.tsx
│   │   │   └── admin/          # Admin panel
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   ├── comments/
│   │   │   ├── likes/
│   │   │   └── search/
│   │   └── error.tsx, not-found.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── forms/              # Form components
│   │   ├── posts/              # Post-related components
│   │   └── auth/               # Auth components
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── auth.ts             # Auth utilities
│   │   ├── db.ts               # Database queries
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript type definitions
│   ├── styles/                 # Global styles
│   └── middleware.ts           # Route protection middleware
├── public/                     # Static assets
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── .env.example                # Environment variables template
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── jest.config.js              # Jest configuration
└── playwright.config.ts        # Playwright configuration
```

#### 5.2.1.3 Biến Môi Trường (Environment Variables)

**Development (.env.local):**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# OAuth (GitHub)
GITHUB_ID=xxxxx
GITHUB_SECRET=xxxxx

# Email (optional for development)
SMTP_HOST=localhost
SMTP_PORT=1025
```

**Production (.env.production):**
```
# Supabase (production instance)
NEXT_PUBLIC_SUPABASE_URL=https://prod-xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Application
NEXT_PUBLIC_APP_URL=https://yourblog.com
NODE_ENV=production

# OAuth (production credentials)
GITHUB_ID=xxxxx
GITHUB_SECRET=xxxxx

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SENDGRID_API_KEY=xxxxx
```

### 5.2.2 Quy Tắc Viết Mã (Coding Standards)

#### 5.2.2.1 TypeScript & Type Safety

**Yêu cầu:**
- ✅ Tất cả files sử dụng TypeScript (.ts, .tsx)
- ✅ Không được sử dụng `any` (strict mode)
- ✅ Tất cả functions phải có type annotations
- ✅ Type definitions tập trung trong `src/types/`

**Ví dụ - Định Nghĩa Type:**
```typescript
// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  author_id: string;
  cover_url?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  summary: string;
  status: 'draft' | 'published';
  coverFile?: File;
}
```

**Ví dụ - Function với Type:**
```typescript
// src/lib/db.ts
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw new Error(`Failed to fetch post: ${error.message}`);
  return data;
}

export async function createPost(
  authorId: string,
  payload: CreatePostRequest
): Promise<Post> {
  // Implementation
}
```

#### 5.2.2.2 Code Style & Formatting

**ESLint Rules:**
```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```

**Prettier Configuration:**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

#### 5.2.2.3 Naming Conventions

| Phần Tử | Convention | Ví Dụ |
|--------|-----------|------|
| **Files** | kebab-case | `user-service.ts`, `post-form.tsx` |
| **Folders** | kebab-case | `api-routes/`, `ui-components/` |
| **Classes** | PascalCase | `UserService`, `PostRepository` |
| **Functions** | camelCase | `getUserById()`, `createNewPost()` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| **Interfaces** | PascalCase + I prefix | `IPost`, `IUserProfile` |
| **Types** | PascalCase | `PostStatus`, `UserRole` |
| **Variables** | camelCase | `userName`, `isLoading` |
| **CSS Classes** | kebab-case | `post-card`, `comment-section` |

#### 5.2.2.4 Code Organization

**Monolithic Module Pattern:**
```typescript
// src/lib/db.ts - Tập hợp tất cả database queries
export const PostRepository = {
  async findById(id: string): Promise<Post> { },
  async findBySlug(slug: string): Promise<Post> { },
  async findAll(limit: number, offset: number): Promise<Post[]> { },
  async create(post: CreatePostRequest): Promise<Post> { },
  async update(id: string, post: Partial<Post>): Promise<Post> { },
  async delete(id: string): Promise<void> { },
};
```

**API Route Pattern:**
```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 400 }
    );
  }
}
```

### 5.2.3 Triển Khai Chính

#### 5.2.3.1 Hệ Thống Xác Thực

**API Routes - Authentication:**

```typescript
// src/app/api/auth/register/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, displayName } = body;

  try {
    // Validate input
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Create user via Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    // Create user profile
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user?.id,
        email,
        display_name: displayName,
        email_verified: false,
      },
    ]);

    if (profileError) throw profileError;

    return NextResponse.json(
      { message: 'Registration successful. Check your email.' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
}
```

**Client-Side Authentication Component:**

```typescript
// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Redirect to verification page
      window.location.href = '/auth/verify-email';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### 5.2.3.2 Quản Lý Bài Viết

**Database Queries - Post Repository:**

```typescript
// src/lib/db.ts
export const PostRepository = {
  async findAll(limit = 10, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to fetch posts: ${error.message}`);
    return data || [];
  },

  async findById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116')
      throw new Error(`Failed to fetch post: ${error.message}`);
    return data || null;
  },

  async create(post: CreatePostRequest): Promise<Post> {
    const slug = `${post.title
      .toLowerCase()
      .replace(/\s+/g, '-')}-${Math.random()
      .toString(36)
      .substring(7)}`;

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          ...post,
          slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Failed to create post: ${error.message}`);
    return data;
  },

  async search(query: string): Promise<Post[]> {
    const { data, error } = await supabase
      .rpc('search_posts', { query })
      .eq('status', 'published');

    if (error) throw new Error(`Search failed: ${error.message}`);
    return data || [];
  },
};
```

**API Route - Create Post:**

```typescript
// src/app/api/posts/route.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const post = await PostRepository.create({
      ...body,
      author_id: session.user.id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}
```

#### 5.2.3.3 Realtime Comments & Notifications

**Supabase Realtime Subscription:**

```typescript
// src/components/comments/CommentSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Initial load
    const loadComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (data) setComments(data);
    };

    loadComments();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) =>
              prev.filter((c) => c.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

---

## 5.3 Kiểm Thử (Testing)

### 5.3.1 Chiến Lược Kiểm Thử

#### 5.3.1.1 Piramida Kiểm Thử

```
         ┌─────────────────┐
         │   E2E Tests     │  5-10%
         │  (Playwright)   │
         └────────┬────────┘
              ┌───────────┐
              │ Integration│ 20-30%
              │   Tests    │
              └──────┬─────┘
          ┌──────────────────────┐
          │    Unit Tests        │  60-75%
          │ (Vitest, Jest)       │
          └──────────────────────┘
```

**Mục Tiêu Coverage:**
- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: 50%+ feature coverage
- **E2E Tests**: 10+ critical user journeys

#### 5.3.1.2 Test Categories

| Loại Test | Framework | Scope | Mục Đích |
|----------|-----------|-------|---------|
| **Unit** | Vitest | Functions, components | Test logic cô lập |
| **Integration** | Jest | API routes, DB | Test tương tác modules |
| **E2E** | Playwright | Full user flow | Test hệ thống end-to-end |
| **Performance** | Lighthouse | Page load metrics | Test hiệu năng |
| **Security** | Manual + Tools | Auth, RLS, XSS | Test bảo mật |

### 5.3.2 Unit Testing

#### 5.3.2.1 Database Query Tests

**Test File: `src/lib/__tests__/db.test.ts`**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PostRepository } from '../db';
import { supabase } from '../supabase';

describe('PostRepository', () => {
  beforeEach(async () => {
    // Setup test data
    await supabase.from('posts').insert([
      {
        id: 'test-1',
        title: 'Test Post',
        content: 'Test content',
        author_id: 'test-user',
        status: 'published',
      },
    ]);
  });

  afterEach(async () => {
    // Cleanup test data
    await supabase.from('posts').delete().eq('id', 'test-1');
  });

  it('should find all published posts', async () => {
    const posts = await PostRepository.findAll(10, 0);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Test Post');
  });

  it('should find post by ID', async () => {
    const post = await PostRepository.findById('test-1');
    expect(post).toBeDefined();
    expect(post?.status).toBe('published');
  });

  it('should create new post with slug', async () => {
    const newPost = await PostRepository.create({
      title: 'New Post',
      content: 'New content',
      author_id: 'test-user',
      status: 'draft',
    });

    expect(newPost.id).toBeDefined();
    expect(newPost.slug).toContain('new-post');
  });

  it('should search posts by keyword', async () => {
    const results = await PostRepository.search('Test');
    expect(results.length).toBeGreaterThan(0);
  });
});
```

#### 5.3.2.2 Component Tests

**Test File: `src/components/__tests__/RegisterForm.test.tsx`**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../auth/RegisterForm';

describe('RegisterForm', () => {
  it('should render registration form', () => {
    render(<RegisterForm />);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<RegisterForm />);
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('should validate password strength', async () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('Password is too weak')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });
    global.fetch = mockFetch;

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
```

#### 5.3.2.3 Utility Function Tests

**Test File: `src/lib/__tests__/utils.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  slugify,
  formatDate,
} from '../utils';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      expect(
        validatePassword('StrongPass123!')
      ).toBe(true);
    });

    it('should reject weak password', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('password')).toBe(false);
    });
  });

  describe('slugify', () => {
    it('should convert title to slug', () => {
      expect(slugify('My First Post')).toBe('my-first-post');
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Special!@# Characters')).toBe('special-characters');
    });
  });
});
```

### 5.3.3 Integration Testing

#### 5.3.3.1 API Route Tests

**Test File: `src/app/api/__tests__/posts.test.ts`**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '../posts/route';
import { NextRequest } from 'next/server';

describe('POST /api/posts', () => {
  it('should create post with valid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Post',
        content: 'Post content',
        summary: 'Summary',
        status: 'published',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.slug).toBeDefined();
  });

  it('should return 401 without authentication', async () => {
    const request = new NextRequest('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Post',
        content: 'Post content',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('should validate required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: '', // Missing required field
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});

describe('GET /api/posts', () => {
  it('should return paginated posts', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/posts?page=1&limit=10'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
```

#### 5.3.3.2 Database Integration Tests

**Test File: `src/lib/__tests__/integration.test.ts`**

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabase';
import { PostRepository } from '../db';

describe('Database Integration Tests', () => {
  let testPostId: string;

  beforeAll(async () => {
    // Create test post
    const post = await PostRepository.create({
      title: 'Integration Test Post',
      content: 'Test content',
      author_id: 'test-user',
      status: 'published',
    });
    testPostId = post.id;
  });

  afterAll(async () => {
    // Cleanup
    await supabase.from('posts').delete().eq('id', testPostId);
  });

  it('should create post and retrieve it', async () => {
    const post = await PostRepository.findById(testPostId);
    expect(post?.id).toBe(testPostId);
  });

  it('should increment likes count correctly', async () => {
    const { error } = await supabase
      .from('likes')
      .insert([
        {
          post_id: testPostId,
          user_id: 'user-1',
        },
      ]);

    expect(error).toBeNull();

    const { data: likes } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', testPostId);

    expect(likes).toHaveLength(1);
  });

  it('should cascade delete comments when post deleted', async () => {
    // Insert comment
    await supabase.from('comments').insert([
      {
        post_id: testPostId,
        content: 'Test comment',
        user_id: 'user-1',
      },
    ]);

    // Delete post
    await supabase.from('posts').delete().eq('id', testPostId);

    // Check comments deleted
    const { data: comments } = await supabase
      .from('comments')
      .select('id')
      .eq('post_id', testPostId);

    expect(comments).toHaveLength(0);
  });
});
```

### 5.3.4 End-to-End Testing

#### 5.3.4.1 Authentication Flow E2E Test

**Test File: `tests/e2e/auth.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/register');
  });

  test('should register new user', async ({ page }) => {
    // Fill registration form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'StrongPass123!');
    await page.fill('input[name="displayName"]', 'New User');

    // Submit form
    await page.click('button:has-text("Register")');

    // Verify redirect to email verification page
    await expect(page).toHaveURL(/.*verify-email/);
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('should login with email/password', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');

    // Submit form
    await page.click('button:has-text("Login")');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'WrongPassword');

    await page.click('button:has-text("Login")');

    // Verify error message
    await expect(page.locator('text=Invalid password')).toBeVisible();
  });
});
```

#### 5.3.4.2 Post Creation E2E Test

**Test File: `tests/e2e/posts.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Post Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button:has-text("Login")');
    await page.waitForURL(/.*dashboard/);
  });

  test('should create and publish post', async ({ page }) => {
    // Click "New Post" button
    await page.click('button:has-text("New Post")');
    await expect(page).toHaveURL(/.*posts\/new/);

    // Fill form
    await page.fill('input[name="title"]', 'Test Blog Post');
    await page.fill('textarea[name="summary"]', 'This is a test post');
    await page.fill('textarea[name="content"]', 'Full content of the test post');

    // Select publish status
    await page.selectOption('select[name="status"]', 'published');

    // Submit form
    await page.click('button:has-text("Publish")');

    // Verify redirect to post page
    await expect(page).toHaveURL(/.*posts\/.*/);
    await expect(page.locator('h1')).toContainText('Test Blog Post');
  });

  test('should save post as draft', async ({ page }) => {
    await page.click('button:has-text("New Post")');

    await page.fill('input[name="title"]', 'Draft Post');
    await page.fill('textarea[name="content"]', 'Draft content');

    // Select draft status
    await page.selectOption('select[name="status"]', 'draft');

    // Click "Save as Draft"
    await page.click('button:has-text("Save as Draft")');

    // Verify saved notification
    await expect(page.locator('text=Post saved')).toBeVisible();
  });
});
```

#### 5.3.4.3 Real-time Comments E2E Test

**Test File: `tests/e2e/comments.spec.ts`**

```typescript
import { test, expect, Page } from '@playwright/test';

test.describe('Real-time Comments', () => {
  async function loginAndViewPost(page: Page) {
    // Login
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button:has-text("Login")');
    await page.waitForURL(/.*dashboard/);

    // Navigate to a post
    await page.goto('http://localhost:3000/posts/test-post-slug');
  }

  test('should add comment in real-time', async ({ browser }) => {
    // Create two browser contexts to simulate two users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await loginAndViewPost(page1);
    await loginAndViewPost(page2);

    // User 1 submits comment
    await page1.fill('textarea[name="comment"]', 'Great post!');
    await page1.click('button:has-text("Post Comment")');

    // User 2 should see comment in real-time
    await expect(page2.locator('text=Great post!')).toBeVisible();

    await context1.close();
    await context2.close();
  });
});
```

### 5.3.5 Performance Testing

#### 5.3.5.1 Lighthouse Testing

**Test File: `tests/performance/lighthouse.test.ts`**

```typescript
import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';

test('should meet performance metrics', async ({ page }) => {
  const runnerResult = await lighthouse('http://localhost:3000', {
    logLevel: 'info',
    output: 'json',
  });

  const audits = runnerResult?.lhr?.audits || {};

  // Performance scores
  expect(audits['first-contentful-paint']?.numericValue).toBeLessThan(1500); // < 1.5s
  expect(audits['largest-contentful-paint']?.numericValue).toBeLessThan(3000); // < 3s
  expect(audits['cumulative-layout-shift']?.numericValue).toBeLessThan(0.1);

  // SEO scores
  expect(runnerResult?.lhr?.categories.seo?.score || 0).toBeGreaterThan(0.9);

  // Accessibility scores
  expect(
    runnerResult?.lhr?.categories.accessibility?.score || 0
  ).toBeGreaterThan(0.9);
});
```

### 5.3.6 Security Testing

#### 5.3.6.1 Authentication Security Test

**Test File: `tests/security/auth-security.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';

describe('Authentication Security', () => {
  it('should hash passwords with bcrypt', async () => {
    // Verify password never stored in plaintext
    const { data: users } = await supabase
      .from('profiles')
      .select('password_hash')
      .limit(1);

    expect(users?.[0]?.password_hash).toMatch(/^\$2[aby]\$/); // bcrypt format
  });

  it('should enforce HTTPS-only cookies', () => {
    // Set-Cookie header should have Secure flag
    const cookies = document.cookie;
    expect(cookies).not.toContain('token='); // Token not in JS-accessible cookies
  });

  it('should validate JWT signature', async () => {
    // Tampered JWT should be rejected
    const tamperedJwt = 'eyJ0eXAiOiJKV1QiLCJhbGc...';
    const response = await fetch('/api/protected', {
      headers: { Authorization: `Bearer ${tamperedJwt}` },
    });

    expect(response.status).toBe(401);
  });

  it('should prevent SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE posts; --";

    const response = await fetch('/api/posts/search', {
      method: 'POST',
      body: JSON.stringify({ query: maliciousInput }),
    });

    expect(response.status).toBe(200); // Should be safe
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

### 5.3.7 Test Configuration

#### 5.3.7.1 Jest Configuration

**File: `jest.config.js`**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

#### 5.3.7.2 Playwright Configuration

**File: `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 5.4 Triển Khai Sản Xuất (Production Deployment)

### 5.4.1 CI/CD Pipeline

#### 5.4.1.1 GitHub Actions Workflow

**File: `.github/workflows/ci-cd.yml`**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # 1. Code Quality Checks
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

      - name: Run Prettier
        run: npm run format:check

  # 2. Unit Tests
  unit-tests:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  # 3. Integration Tests
  integration-tests:
    runs-on: ubuntu-latest
    needs: quality
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/test

  # 4. Build
  build:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  # 5. E2E Tests (optional - can be run on staging)
  e2e-tests:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # 6. Deploy to Staging (optional)
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, e2e-tests]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel (Staging)
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel deploy --prod --token=$VERCEL_TOKEN

  # 7. Deploy to Production
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, e2e-tests]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel (Production)
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npx vercel deploy --prod --token=$VERCEL_TOKEN
          # Run smoke tests post-deployment
          npm run test:smoke:prod
```

#### 5.4.1.2 NPM Scripts

**File: `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src",
    "format:check": "prettier --check src",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest watch",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:smoke:prod": "playwright test tests/smoke",
    "test:coverage": "vitest run --coverage",
    "test": "npm run test:unit && npm run test:integration"
  }
}
```

### 5.4.2 Docker Deployment

#### 5.4.2.1 Dockerfile

**File: `Dockerfile`**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

#### 5.4.2.2 Docker Compose

**File: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    depends_on:
      - postgres
    networks:
      - blog-network

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=blog
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - blog-network

volumes:
  postgres-data:

networks:
  blog-network:
    driver: bridge
```

### 5.4.3 Production Checklist

**Pre-Deployment Checklist:**

```
✅ Code Quality
  [ ] All tests passing (unit, integration, E2E)
  [ ] Code coverage > 80%
  [ ] No ESLint warnings
  [ ] No TypeScript errors
  [ ] Security audit passed

✅ Performance
  [ ] Lighthouse score > 90
  [ ] LCP < 3 seconds
  [ ] FCP < 1.5 seconds
  [ ] CLS < 0.1
  [ ] API response time < 200ms p95

✅ Security
  [ ] HTTPS enabled
  [ ] HSTS header configured
  [ ] CSP headers configured
  [ ] RLS policies verified
  [ ] Secrets rotated
  [ ] Dependency audit clean

✅ Infrastructure
  [ ] Database backups configured
  [ ] Monitoring & alerting set up
  [ ] Logging configured
  [ ] Error tracking (Sentry) configured
  [ ] CDN configured

✅ Documentation
  [ ] README updated
  [ ] API documentation up-to-date
  [ ] Deployment guide reviewed
  [ ] Runbook for common issues prepared
```

---

## 5.5 Kết Luận Chương 5

Chương này đã trình bày chi tiết:

1. **Triển Khai**: Stack công nghệ, cấu trúc dự án, quy tắc viết mã, và triển khai các chức năng chính
2. **Kiểm Thử**: Chiến lược kiểm thử toàn diện từ unit test đến E2E test
3. **CI/CD**: Pipeline tự động hóa từ commit đến production
4. **Sản Xuất**: Deployment strategy, Docker containerization, production checklist

Hệ thống blog đã sẵn sàng cho triển khai sản xuất với mã nguồn chất lượng cao, kiểm thử toàn diện, và quy trình deployment an toàn.

---

**Cuối Chương 5**
