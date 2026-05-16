import Link from 'next/link'
import { Footer } from '@/components/footer'
import { PortfolioBrowser } from '@/components/portfolio/portfolio-browser'
import { PortfolioActions } from '@/components/portfolio/portfolio-actions'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Portfolio - Professional Blog',
  description: 'Xem portfolio và các dự án từ cộng đồng sinh viên năm 4',
}

type Project = {
  id: number
  title: string
  description: string
  technologies: string[] | null
  image: string | null
  link: string | null
}

export default async function PortfolioPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, description, technologies, image, link, likes_count')
    .order('created_at', { ascending: false })
    .limit(12)

  const displayedProjects: Project[] = ((projects ?? []) as any[]).map((project: any) => ({
    id: project.id,
    title: project.title,
    description: project.description ?? '',
    technologies: project.technologies ?? [],
    image: project.image ?? null,
    link: project.link ?? null,
  }))

  const totalProjects = projects?.length ?? 0

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative section-shell">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-lg shadow-blue-100/30">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Những dự án đẳng cấp
              </div>

              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Khám Phá
                <br />
                <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  Những Dự Án Tuyệt Vời
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                Portfolio chuyên nghiệp từ cộng đồng sinh viên. Xem các dự án, công nghệ sử dụng và liên kết trực tiếp đến code.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>🚀 Chia Sẻ Dự Án</span>
                </Link>
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-3">
                  <span className="text-2xl font-black text-blue-600">{totalProjects}</span>
                  <span className="text-sm font-semibold text-gray-600">Dự án</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: '📦', label: 'Dự Án Chia Sẻ', value: '150+' },
              { icon: '👥', label: 'Sinh Viên Tham Gia', value: '500+' },
              { icon: '👀', label: 'Lượt Xem Hàng Tháng', value: '1000+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-600">{stat.label}</p>
                <p className="mt-3 text-4xl font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Dự Án Mới Nhất</p>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Những Tác Phẩm Tuyệt Vời</h2>
          </div>

          {error ? (
            <div className="rounded-3xl border-2 border-red-200 bg-red-50/80 p-8 sm:p-10 text-center">
              <span className="text-5xl">⚠️</span>
              <h3 className="mt-4 text-2xl font-bold text-red-900">Không tải được portfolio</h3>
              <p className="mt-2 text-red-700">Vui lòng kiểm tra kết nối cơ sở dữ liệu</p>
            </div>
          ) : totalProjects > 0 ? (
            <>
              <PortfolioBrowser projects={displayedProjects.map((project) => ({
                id: project.id,
                title: project.title,
                description: project.description,
                technologies: project.technologies ?? [],
                image: project.image,
                link: project.link,
              }))} />
            </>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white py-16 px-6 text-center">
              <span className="text-6xl">📭</span>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Chưa có dự án nào</h3>
              <p className="mt-2 text-gray-600">Hãy chia sẻ dự án đầu tiên của bạn!</p>
              <Link
                href="/dashboard/new"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white transition hover:shadow-lg"
              >
                ✍️ Chia Sẻ Dự Án
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl">
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">Bạn Có Dự Án Tuyệt Vời?</h2>
                <p className="mt-3 text-lg text-blue-50 max-w-xl">
                  Chia sẻ công việc của bạn với cộng đồng và nhận phản hồi từ những người đam mê công nghệ.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-blue-600 transition hover:bg-blue-50"
                >
                  Đăng Ký
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  Đăng Nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
