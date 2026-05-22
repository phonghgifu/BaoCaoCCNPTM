'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { logout } from '@/lib/auth/helpers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    router.push('/')
  }

  return (
    <nav className="border-b border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.88))] text-[var(--page-fg)] shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 py-2">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-blue-600 to-slate-700 text-white shadow-lg shadow-sky-200/50 transition group-hover:-translate-y-0.5 group-hover:scale-105">
              <span className="text-lg font-bold">B</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Professional Blog</p>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Skyline Notes</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Trang Chủ
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-solid)] px-3 py-2 shadow-sm">
                  <span className="hidden max-w-44 truncate text-sm text-slate-600 md:inline dark:text-slate-300">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? '...' : 'Đăng Xuất'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
