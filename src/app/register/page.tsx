'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate input
      if (!formData.email || !formData.password || formData.password.length < 6) {
        setError('Email và mật khẩu (tối thiểu 6 ký tự) là bắt buộc')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.displayName || formData.email,
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Success - redirect to login
        router.push('/login?message=Đăng ký thành công! Vui lòng đăng nhập.')
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(51,65,85,0.16),transparent_30%)]" />
      <div className="surface-card w-full max-w-7xl overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="order-2 bg-(--surface-solid) p-8 sm:p-10 lg:order-1 lg:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Đăng ký tài khoản</h2>
              <p className="mt-2 text-sm text-slate-600">Tạo tài khoản để bắt đầu viết blog</p>
            </div>

            <form onSubmit={handleRegister} className="mt-8 space-y-6">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Tên hiển thị (tùy chọn)
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-slate-500">Tối thiểu 6 ký tự</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-2xl bg-linear-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Đã có tài khoản?{' '}
                <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>

          <div className="order-1 bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-8 text-slate-100 sm:p-10 lg:order-2 lg:p-12">
            <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">Bắt đầu nhanh</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Một tài khoản là đủ để viết, lưu nháp, xuất bản và quản lý nội dung.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Thiết kế mới ưu tiên sự gọn gàng: input nổi bật, button xanh dương-sky, nền slate sâu và khoảng thở rõ ràng.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">• Tên hiển thị, email và mật khẩu được giữ nguyên logic.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">• Tạo cảm giác đồng bộ với navbar, footer và dashboard.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
