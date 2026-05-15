import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Professional Blog</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Chia sẻ kiến thức theo cách rõ ràng hơn, đẹp hơn và có định hướng sản phẩm.</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Nền tảng blog và portfolio dành cho sinh viên năm 4 với blog, dự án, search, dashboard và trải nghiệm đọc được thiết kế như một sản phẩm thật.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Liên Kết</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="transition hover:text-white">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Khám Phá</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/search" className="transition hover:text-white">
                  Tìm kiếm nội dung
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-white">
                  Tạo tài khoản
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} Professional Blog. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>Chính sách bảo mật</span>
            <span>Điều khoản sử dụng</span>
            <span>Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
