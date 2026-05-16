'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { logout } from '@/lib/auth/helpers'
import './header-animations.css'

export function Header() {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const applyTheme = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme)
    window.localStorage.setItem('theme', nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchTerm.trim()

    if (!query) return

    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    setIsMobileMenuOpen(false)
    router.push('/')
  }

  const navItemClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`)

    return [
      'rounded-full px-4 py-2 text-sm font-medium transition',
      active
        ? 'bg-[var(--surface-soft)] text-[var(--page-fg)] shadow-sm'
        : 'text-[var(--surface-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--page-fg)]',
    ].join(' ')
  }

  return (
    <header className="sticky top-0 z-50 navbar-glass shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 py-2">
          <Link href="/" className="group flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-cyan-500 to-emerald-400 text-white shadow-lg shadow-blue-200/40 transition group-hover:-translate-y-0.5 group-hover:scale-105">
              <span className="font-bold">P</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] uppercase tracking-[0.28em] text-(--surface-muted)">Professional Blog</div>
              <span className="text-lg font-bold text-(--page-fg) lg:text-xl">Chia Sẻ Kiến Thức</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} role="search" aria-label="Tìm kiếm" className="hidden lg:flex flex-1 max-w-xl items-center gap-3">
            <div className="relative flex-1">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Tìm kiếm nội dung"
                placeholder="Tìm bài viết, dự án, chủ đề..."
                className="w-full rounded-2xl border border-(--surface-border) bg-(--surface-solid) px-4 py-3 pr-12 text-sm shadow-sm outline-none transition focus:border-blue-500"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-(--surface-muted)">⌘K</span>
            </div>
            <button type="submit" className="btn btn-primary press-scale">
              Tìm kiếm
            </button>
          </form>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link href="/" className={navItemClass('/')}>
              Trang Chủ
            </Link>
            <Link href="/blog" className={navItemClass('/blog')}>
              Blog
            </Link>
            <Link href="/portfolio" className={navItemClass('/portfolio')}>
              Portfolio
            </Link>

            <button
              type="button"
              onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-ghost tap-target"
              aria-label="Chuyển giao diện sáng tối"
            >
              {theme === 'dark' ? '☀️ Sáng' : '🌙 Tối'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 rounded-2xl border border-(--surface-border) bg-(--surface-solid) px-3 py-2 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs text-(--surface-muted)">Đang đăng nhập</p>
                  <p className="max-w-40 truncate text-sm font-semibold text-(--page-fg)">{user?.email}</p>
                </div>
                <Link href="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-sm font-medium text-(--surface-muted) transition hover:text-(--page-fg) disabled:opacity-50"
                >
                  {isLoading ? 'Đang thoát...' : 'Thoát'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-(--surface-border) bg-(--surface-solid) px-3 py-2 shadow-sm">
                <Link href="/login" className="btn btn-ghost">
                  Đăng Nhập
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="btn btn-ghost tap-target"
              aria-label="Mở tìm kiếm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
              </svg>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost tap-target"
              aria-label="Mở menu"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <>
            {/* Overlay backdrop */}
            <div
              className="menu-overlay-enter fixed inset-0 z-30 md:hidden bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Mobile menu */}
            <div id="mobile-menu" role="navigation" aria-label="Điều hướng chính" className="mobile-menu-enter md:hidden fixed inset-x-0 top-18 z-40 border-b border-(--surface-border) bg-(--surface-solid) backdrop-blur-md space-y-4 py-4 px-2 max-h-[calc(100vh-72px)] overflow-y-auto">
              <div className="space-y-2 rounded-2xl border border-(--surface-border) bg-(--surface-soft) p-3">
                <label className="block text-xs uppercase tracking-[0.22em] font-semibold text-(--surface-muted) px-2">Điều hướng</label>
                <Link href="/" className="menu-item block rounded-2xl px-4 py-3 text-(--page-fg) transition hover:bg-(--surface-soft)" onClick={() => setIsMobileMenuOpen(false)}>
                  Trang Chủ
                </Link>
                <Link href="/blog" className="menu-item block rounded-2xl px-4 py-3 text-(--page-fg) transition hover:bg-(--surface-soft)" onClick={() => setIsMobileMenuOpen(false)}>
                  Blog
                </Link>
                <Link href="/portfolio" className="menu-item block rounded-2xl px-4 py-3 text-(--page-fg) transition hover:bg-(--surface-soft)" onClick={() => setIsMobileMenuOpen(false)}>
                  Portfolio
                </Link>
                <button
                  type="button"
                  onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full rounded-2xl px-4 py-3 text-left text-(--page-fg) transition hover:bg-(--surface-soft)"
                >
                  {theme === 'dark' ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối'}
                </button>

                {isAuthenticated ? (
                  <div className="space-y-3 border-t border-(--surface-border) pt-3">
                    <p className="px-4 text-sm text-(--surface-muted)">{user?.email}</p>
                    <Link
                      href="/dashboard"
                      className="block rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-center font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-[var(--surface-border)] px-4 py-3 text-[var(--page-fg)] disabled:opacity-50 transition hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      {isLoading ? 'Đang thoát...' : 'Đăng Xuất'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 border-t border-[var(--surface-border)] pt-3">
                    <Link
                      href="/login"
                      className="block rounded-2xl border border-[var(--surface-border)] px-4 py-3 text-center font-medium text-[var(--page-fg)] hover:bg-(--surface-soft) transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng Nhập
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-center font-semibold text-white hover:shadow-lg hover:-translate-y-0.5 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng Ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 sm:items-center">
            <div role="dialog" aria-modal="true" aria-label="Tìm kiếm" className="w-full max-w-2xl rounded-2xl bg-[var(--surface-solid)] p-6 shadow-2xl">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  autoFocus
                  type="search"
                  aria-label="Tìm kiếm nội dung"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm bài viết, dự án, chủ đề..."
                  className="flex-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-solid)] px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
                <button type="submit" className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Tìm</button>
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Đóng tìm kiếm" className="ml-2 rounded-2xl px-4 py-3 text-sm">Đóng</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
