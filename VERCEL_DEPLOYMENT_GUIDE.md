# 🚀 Next.js + Supabase Vercel Deployment Guide

## ❌ Vấn Đề: Lỗi Missing Environment Variables

```
Error: Missing Supabase environment variables.
Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file
```

---

## ✅ Giải Thích Chi Tiết

### 1️⃣ **Vì sao Next.js không đọc được biến môi trường trên Vercel?**

**Nguyên nhân:**
- `.env.local` là file **LOCAL ONLY**, không được commit lên git
- `.env.local` nằm trong `.gitignore`
- Vercel không có access đến file này
- Build trên Vercel không có `.env.local`

**Chứng minh:**
```bash
# Local machine
$ cat .env.local
NEXT_PUBLIC_SUPABASE_URL=https://bwsuuckbekvfgahwawvl.supabase.co  ✅ Có

# Vercel server (khi pull code từ GitHub)
$ cat .env.local
# File không tồn tại! ❌
```

---

## 🔧 Giải Pháp: Cấu Hình Đúng Local + Vercel

### **2️⃣ Cấu Hình trên Local (Development)**

#### Bước 1: Tạo `.env.local`
```bash
cd BaoCaoCCNPTM
cp .env.example .env.local  # Hoặc tạo file mới
```

#### Bước 2: Điền Supabase credentials
```bash
# .env.local (KHÔNG commit file này!)
NEXT_PUBLIC_SUPABASE_URL=https://bwsuuckbekvfgahwawvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_smYrzflTVCK6Ek9jJTl7IQ_PMKs-_2_
```

#### Bước 3: Kiểm tra .gitignore
```bash
# .gitignore phải có:
.env*           # Ignore all .env files
!.env.example   # Exception: commit .env.example
```

✅ **Local development sẽ hoạt động**

---

### **3️⃣ Vị Trí File .env.local**

```
BaoCaoCCNPTM/
├── .env.local              ← ĐẶT ĐÂY (local development)
├── .env.example            ← Template (commit lên git)
├── .env.production         ← ĐẶT ĐÂY (local build)
├── .gitignore              ← Phải ignore .env.local
├── src/
│   └── lib/supabase/
│       ├── client.ts
│       └── server.ts
└── package.json
```

**Quan trọng:**
- ✅ `.env.local` - KHÔNG commit
- ✅ `.env.example` - Commit (chỉ template)
- ✅ `.env.production` - KHÔNG commit (chỉ local build)

---

### **4️⃣ Environment Variables trên Vercel**

**YES! Bạn CẦN thiết lập trên Vercel Dashboard!**

#### Bước 1: Vào Vercel Dashboard
```
https://vercel.com/dashboard
→ Projects
→ Chọn project: bao-cao-ccnptm
→ Settings
→ Environment Variables
```

#### Bước 2: Thêm variables (Production)
```
NAME: NEXT_PUBLIC_SUPABASE_URL
VALUE: https://bwsuuckbekvfgahwawvl.supabase.co
ENVIRONMENTS: ✅ Production, Preview, Development

NAME: NEXT_PUBLIC_SUPABASE_ANON_KEY
VALUE: sb_publishable_smYrzflTVCK6Ek9jJTl7IQ_PMKs-_2_
ENVIRONMENTS: ✅ Production, Preview, Development
```

#### Bước 3: Redeploy
```
Deployments → Click latest → Redeploy
```

---

## 🐛 Debug: Cách Check process.env trong Next.js

### **5️⃣ Debug Environment Variables**

#### Cách 1: Server Component (App Router)
```typescript
// src/app/debug/page.tsx
export default function DebugPage() {
  return (
    <div>
      <h1>Environment Variables Debug</h1>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}</p>
    </div>
  )
}
```

#### Cách 2: API Route
```typescript
// src/app/api/debug/route.ts
export async function GET() {
  return Response.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Sensitive - only in development!
    allEnv: process.env
  })
}
```

#### Cách 3: Build Log
```bash
# Thêm vào next.config.ts
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    console.log('=== ENVIRONMENT VARIABLES ===')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    return config
  }
}
```

#### Cách 4: Check built files
```bash
npm run build
cd .next/server
grep -r "NEXT_PUBLIC_SUPABASE" .
# Nếu thấy "your-" hoặc undefined = lỗi config
```

---

## 🛡️ Fix Supabase Client Không Crash Khi Build

### **6️⃣ Sửa Supabase Client**

#### Hiện tại (có lỗi):
```typescript
// src/lib/supabase/client.ts ❌ CRASH khi build
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase variables')  // ← Crash ngay lúc build
  }
  
  return createBrowserClient(url, key)
}
```

#### Fix (graceful fallback):
```typescript
// src/lib/supabase/client.ts ✅ KHÔNG crash
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    // Trả về mock client thay vì crash
    console.warn('⚠️ Supabase not configured - using mock client')
    
    if (typeof window === 'undefined') {
      // Server-side: không khiến build fail
      return {
        auth: { getSession: () => ({ data: { session: null } }) },
        from: () => ({ select: () => ({ data: null }) })
      } as any
    }
    
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }
  
  return createBrowserClient(url, key)
}
```

#### Hoặc dùng `dynamic()` để skip server-side rendering:
```typescript
// src/lib/supabase/client.ts
'use client'

import dynamic from 'next/dynamic'
import { createBrowserClient } from '@supabase/ssr'

// Lazy load - chỉ load trên browser, không load khi build
export const createClient = dynamic(
  () => import('./client-only').then(mod => mod.createClient),
  { ssr: false }
)
```

---

## ✅ Checklist Deploy Vercel

- [ ] `.env.local` có credentials đúng (local)
- [ ] `.env.production` có credentials đúng (local build)
- [ ] `.env.example` committed lên git (template)
- [ ] `.gitignore` có `.env*` và `!.env.example`
- [ ] Vercel Dashboard: thêm 2 environment variables
- [ ] Build local thành công: `npm run build`
- [ ] Push code lên GitHub
- [ ] Vercel auto-deploy hoặc manual redeploy
- [ ] Check Vercel build logs: không có error
- [ ] Test app trên https://your-domain.vercel.app

---

## 🚀 Quick Fix Checklist

### Nếu vẫn lỗi:

1. **Local:**
   ```bash
   rm -rf .next
   npm run build  # Test build
   ```

2. **Vercel Dashboard:**
   - Vào Settings → Environment Variables
   - Check 2 variables đã add
   - Redeploy

3. **Code Fix:**
   - Update `src/lib/supabase/client.ts` với graceful fallback
   - Update `src/lib/supabase/server.ts` tương tự
   - Push lên GitHub

4. **Verify:**
   ```bash
   npm run build
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

---

## 📋 File Structure

```
project/
├── .env.local              # (local development)
│   NEXT_PUBLIC_SUPABASE_URL=...
│   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
│
├── .env.example           # ✅ Committed
│   NEXT_PUBLIC_SUPABASE_URL=your_url_here
│   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
│
├── .env.production        # (local build test)
│   NEXT_PUBLIC_SUPABASE_URL=...
│   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
│
├── .gitignore
│   .env*
│   !.env.example
│
└── src/
    └── lib/supabase/
        ├── client.ts      # ✅ Updated with fallback
        └── server.ts      # ✅ Updated with fallback
```

---

## 🎯 Tóm Tắt

| Environment | Method | File | Committed? |
|------------|--------|------|-----------|
| Local Dev  | `.env.local` | Machine local | ❌ No |
| Local Build | `.env.production` | Machine local | ❌ No |
| Vercel | Dashboard settings | Vercel cloud | ✅ Yes |
| Template | `.env.example` | Git repo | ✅ Yes |

**Key Point:** Vercel không thể đọc `.env.local` → phải set trên Vercel Dashboard!

---

## 🔗 Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase Next.js Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
