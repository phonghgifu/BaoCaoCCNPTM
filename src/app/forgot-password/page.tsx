'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setMessage('Kiểm tra email của bạn để reset mật khẩu. Link sẽ hết hạn trong 1 giờ.')
      setEmail('')
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_center_right,rgba(51,65,85,0.16),transparent_32%)]" />
      <div className="surface-card w-full max-w-3xl overflow-hidden">
        <div className="bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-8 py-10 text-slate-100 sm:px-10">
          <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">Khôi phục truy cập</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Quên mật khẩu</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Nhập email của bạn để nhận hướng dẫn reset mật khẩu. Luồng này dùng cùng ngôn ngữ thiết kế với login/register.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6 bg-[var(--surface-solid)] px-8 py-10 sm:px-10">
          {message && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="email@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!message}
            className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Đang gửi...' : 'Gửi hướng dẫn reset'}
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Nhớ mật khẩu?{' '}
              <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
