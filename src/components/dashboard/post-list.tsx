import Link from 'next/link'
import { Post } from '@/types/database'
import { DeletePostButton } from './delete-post-button'
import { deriveCategory, estimateReadTime } from '@/lib/content'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          role="article"
          aria-labelledby={`post-title-${post.id}`}
          className="surface-card rounded-[1.75rem] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  {deriveCategory(post)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    post.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                  {estimateReadTime(post)} phút đọc
                </span>
              </div>

              <h2 id={`post-title-${post.id}`} className="mt-4 text-2xl font-bold tracking-tight text-gray-900">{post.title}</h2>

              {post.excerpt && (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">{post.excerpt}</p>
              )}

              <p className="mt-4 text-xs text-gray-500">
                Tạo ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Link
                href={`/posts/${post.slug}`}
                aria-label={`Xem bài viết ${post.title}`}
                className="rounded-xl border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-[var(--page-fg)] transition hover:border-blue-300 hover:text-blue-700"
              >
                Xem
              </Link>
              <Link
                href={`/dashboard/edit/${post.id}`}
                aria-label={`Sửa bài viết ${post.title}`}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Sửa
              </Link>
              <DeletePostButton postId={post.id} postTitle={post.title} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
