import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { AuthProvider } from '@/lib/auth/context'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: {
    default: 'Professional Blog - Chia Sẻ Kiến Thức Chuyên Nghiệp',
    template: '%s | Professional Blog',
  },
  description: 'Nền tảng blog và portfolio chuyên nghiệp cho sinh viên năm 4 với blog, dự án, search, dashboard và trải nghiệm đọc tối ưu.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Professional Blog - Chia Sẻ Kiến Thức Chuyên Nghiệp',
    description: 'Nền tảng blog và portfolio chuyên nghiệp với giao diện như sản phẩm thật.',
    url: 'http://localhost:3000',
    siteName: 'Professional Blog',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Blog - Chia Sẻ Kiến Thức Chuyên Nghiệp',
    description: 'Nền tảng blog và portfolio chuyên nghiệp với giao diện như sản phẩm thật.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={plusJakartaSans.className}>
        <AuthProvider>
          <a href="#content" className="skip-link sr-only">Bỏ qua tới nội dung</a>
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_22%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.10),transparent_28%)]" />
          <Header />
          <main id="content" className="relative min-h-screen overflow-x-hidden bg-(--page-bg) text-(--page-fg) transition-colors duration-300">
            <div className="w-full">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
