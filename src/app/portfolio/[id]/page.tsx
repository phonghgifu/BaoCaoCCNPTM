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

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link href="/portfolio" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Quay lại Portfolio
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white">
              <span className="text-8xl">{project.image ?? '📁'}</span>
            </div>
          )}
        </div>

        <div className="p-8 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{project.title}</h1>
              <p className="text-gray-500 text-sm">
                Cập nhật: {new Date(project.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>

            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 transition"
              >
                Mở liên kết
              </a>
            )}
          </div>

          <p className="text-lg leading-8 text-gray-700 mb-8">{project.description}</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Công nghệ sử dụng</h2>
            <div className="flex flex-wrap gap-3">
              {(project.technologies ?? []).map((tech: string) => (
                <span key={tech} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-gray-50 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Giới thiệu nhanh</h2>
            <p className="text-gray-600">
              Đây là trang chi tiết của dự án portfolio. Bạn có thể mở ảnh, xem mô tả, công nghệ sử dụng và link gốc nếu có.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}