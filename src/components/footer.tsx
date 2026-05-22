import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,1))] text-slate-200 shadow-[0_-20px_50px_rgba(15,23,42,0.18)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-200">Professional Blog</p>
            <h3 className="mt-4 max-w-xl text-2xl font-bold text-white sm:text-3xl">Chia sẻ kiến thức với một giao diện rõ ràng, sáng, và có nhịp điệu như sản phẩm thật.</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Nền tảng blog và portfolio cho sinh viên năm 4, kết nối blog, dự án, search, dashboard và trải nghiệm đọc trên một hệ sky-blue + slate thống nhất.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Liên Kết</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/" className="transition hover:text-sky-200">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-sky-200">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-sky-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="transition hover:text-sky-200">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Khám Phá</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/search" className="transition hover:text-sky-200">
                  Tìm kiếm nội dung
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-sky-200">
                  Tạo tài khoản
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-sky-200">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-sky-200">
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
