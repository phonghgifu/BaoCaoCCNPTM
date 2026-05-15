'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/context'
import { getPublicUrl } from '@/lib/supabase/storage'
import { reportError } from '@/lib/telemetry'

// Safely stringify errors (handles circular refs)
function stringifyError(err: any): string {
  try {
    if (!err) return 'unknown error'
    if (err instanceof Error) return err.message
    if (typeof err === 'object') {
      const seen = new WeakSet()
      return JSON.stringify(err, function (_key, value) {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]'
          seen.add(value)
        }
        return value
      })
    }
    return String(err)
  } catch (e) {
    try {
      return String(err)
    } catch (e2) {
      return 'unserializable error'
    }
  }
}

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string | null
  link: string | null
}

export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()
  const detailHref = project.link && project.link !== '#' ? project.link : `/portfolio/${project.id}`
  const isExternalLink = !!project.link && /^https?:\/\//.test(project.link)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const { data: countData, error: countErr } = await supabase
          .from('project_likes')
          .select('*', { count: 'exact' })
          .eq('project_id', project.id)

        if (countErr) throw countErr

        if (mounted) setLikeCount(countData?.length || 0)

        if (user) {
          const { data: likeData } = await supabase
            .from('project_likes')
            .select('*')
            .eq('project_id', project.id)
            .eq('user_id', user.id)
            .single()

          if (mounted) setIsLiked(!!likeData)
        }
      } catch (err) {
        console.error('Error loading likes:', stringifyError(err))
        if (mounted) {
          setLikeCount(0)
          setIsLiked(false)
        }
      }
    }

    load()

    if (project.image && project.image.includes('/')) {
      try {
        const url = getPublicUrl(project.image)
        if (mounted) setImageUrl(url)
      } catch (err) {
        reportError(err, { source: 'ProjectCard.getPublicUrl', projectId: project.id })
      }
    }

    return () => {
      mounted = false
    }
  }, [project.id, project.image, user?.id])

  const handleLike = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', project.id)
          .eq('user_id', user.id)

        if (error) throw error

        setIsLiked(false)
        setLikeCount((c) => Math.max(0, c - 1))
      } else {
        const { error } = await supabase.from('project_likes').insert({
          project_id: project.id,
          user_id: user.id,
        })

        if (error) throw error

        setIsLiked(true)
        setLikeCount((c) => c + 1)
      }
    } catch (err) {
      reportError(err, { source: 'ProjectCard.handleLike', projectId: project.id })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Mở chi tiết dự án ${project.title}`}
        className="group overflow-hidden rounded-[2rem] surface-card cursor-pointer transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/30"
      >
        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[var(--surface-soft)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                imageLoaded ? 'animate-blur-to-sharp' : 'opacity-50'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 text-white gradient-foreground">
              <span className="text-7xl opacity-95" aria-hidden>{project.image ?? '📁'}</span>
              <span className="sr-only">Hình ảnh dự án: {project.title}</span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-7">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 transition group-hover:text-blue-600">
            {project.title}
          </h3>
          <p className="text-sm leading-7 text-gray-600 mb-4 line-clamp-3">{project.description}</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 2).map((tech, i) => (
                <span
                  key={i}
                  className="inline-block rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium text-[var(--page-fg)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
                disabled={loading}
                className={`like-button rounded-full px-4 py-2 text-sm font-medium transition ${
                  isLiked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 liked'
                    : 'bg-[var(--surface-soft)] text-[var(--page-fg)] hover:bg-gray-200'
                } disabled:opacity-50`}
                aria-pressed={isLiked}
                aria-label={isLiked ? `Bỏ thích ${project.title}` : `Thích ${project.title}`}
              >
                <span aria-hidden>{isLiked ? '❤️' : '🤍'}</span>
                <span className="sr-only">{isLiked ? 'Đã thích' : 'Chưa thích'}</span>
                <span aria-live="polite"> {likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen}>
        <div className="space-y-6 py-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className={`h-64 w-full rounded-2xl object-cover ${
                imageLoaded ? 'animate-blur-to-sharp' : 'opacity-50'
              }`}
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 text-white">
              <span className="text-9xl opacity-95">{project.image ?? '📁'}</span>
            </div>
          )}

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{project.title}</h2>
            <p className="mb-4 text-gray-700 leading-7">{project.description}</p>
            <p className="mb-4 text-sm text-gray-600">
              Technologies: {project.technologies.join(', ')}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isExternalLink ? (
                <a
                  href={detailHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
                  aria-label={`Mở dự án ${project.title} trên trang mới`}
                >
                  Xem dự án ↗
                </a>
              ) : (
                <a
                  href={detailHref}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
                  aria-label={`Xem chi tiết dự án ${project.title}`}
                >
                  Xem chi tiết →
                </a>
              )}

              <button
                onClick={handleLike}
                disabled={loading}
                className={`like-button rounded-2xl px-4 py-2.5 transition ${
                  isLiked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 liked'
                    : 'bg-[var(--surface-soft)] text-[var(--page-fg)] hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {isLiked ? '❤️ Bỏ thích' : '🤍 Thích'} ({likeCount})
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
