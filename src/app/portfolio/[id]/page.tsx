import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ id: string }>
}

function getProjectImageUrl(image: string | null) {
  if (!image || !image.includes('/')) return null

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_PROJECTS_BUCKET ?? 'blog-images'
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!baseUrl) return null

  return `${baseUrl}/storage/v1/object/public/${bucket}/${image}`
}

export default async function PortfolioProjectPage({ params }: PageProps) {
  const { id } = await params
  const projectId = Number(id)

  if (!Number.isFinite(projectId)) {
    notFound()
  }

  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, title, description, technologies, image, link, created_at')
    .eq('id', projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  const imageUrl = getProjectImageUrl(project.image)
  const technologies = project.technologies ?? []
  const projectDescription = project.description ?? 'Dự án này đang được cập nhật thông tin mô tả chi tiết.'
  const updatedAt = new Date(project.created_at).toLocaleDateString('vi-VN')
  const hasExternalLink = Boolean(project.link && project.link !== '#')

  const details = [
    {
      label: 'Ngày cập nhật',
      value: updatedAt,
    },
    {
      label: 'Số công nghệ',
      value: technologies.length.toString(),
    },
    {
      label: 'Loại dự án',
      value: imageUrl ? 'Có ảnh minh họa' : 'Dựa trên biểu tượng',
    },
  ]

  return (
    <main className="relative isolate overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_56%),radial-gradient(circle_at_right,rgba(168,85,247,0.12),transparent_42%)]" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur hover:border-blue-300 hover:bg-white"
          >
            ← Quay lại Portfolio
          </Link>

          {hasExternalLink && (
            <a
              href={project.link ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Mở dự án gốc
            </a>
          )}
        </div>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.22)]">
          <div className="grid lg:grid-cols-[1.3fr_0.9fr]">
            <div className="relative min-h-88 overflow-hidden bg-slate-100 lg:min-h-136">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={project.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-88 items-center justify-center bg-[linear-gradient(135deg,#3b82f6_0%,#8b5cf6_52%,#d946ef_100%)] text-white lg:min-h-136">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-4xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-sm">
                    <span className="text-8xl drop-shadow-sm">{project.image ?? '📁'}</span>
                    <div className="absolute -right-4 -top-4 rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
                      Portfolio
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  Dự án nổi bật
                </span>
                <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  Cập nhật {updatedAt}
                </span>
              </div>
            </div>

            <div className="space-y-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-4">
                <p className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                  Project Detail
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  {projectDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {details.map((detail) => (
                  <div key={detail.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{detail.label}</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{detail.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Công nghệ sử dụng</h2>
                  <span className="text-sm text-slate-500">{technologies.length} mục</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">Mô tả ngắn</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Đây là trang chi tiết dự án được trình bày theo kiểu portfolio chuyên nghiệp hơn: có ảnh/hero rõ ràng,
                    thông tin tóm tắt, công nghệ và nút mở dự án nếu có.
                  </p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                  <h2 className="text-lg font-bold">Trạng thái hiển thị</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Nếu dữ liệu dự án có thêm ảnh, link và mô tả chi tiết, trang này sẽ trông giống một case study hơn là
                    một bản ghi cơ bản.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}