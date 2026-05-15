import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deriveCategory, deriveTags, type ContentPost } from '@/lib/content'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata = {
  title: 'Tìm kiếm bài viết',
  description: 'Tìm kiếm bài viết trên blog',
}

type SearchResult = ContentPost & {
  profiles?: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params.q || ''

  let results: SearchResult[] = []
  let error: string | null = null

  if (query.trim().length > 0) {
    const { data, error: searchError } = await supabase.rpc('search_posts', { search_query: query })

    if (searchError) {
      error = searchError.message
    } else {
      results = (data || []) as SearchResult[]
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 p-6 text-white shadow-2xl shadow-blue-200/30 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Search</p>
        <h1 className="mt-2 text-4xl font-black sm:text-5xl">Tìm kiếm bài viết</h1>
        <p className="mt-3 max-w-2xl text-blue-50">
          Search theo tiêu đề, tóm tắt hoặc nội dung để tìm đúng bài bạn cần trong vài giây.
        </p>
      </div>

      <form method="GET" className="surface-card mb-8 rounded-[2rem] p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Nhập từ khóa tìm kiếm..."
            className="w-full rounded-2xl border border-[var(--surface-border)] px-4 py-3 text-base shadow-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Tìm kiếm
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {['Next.js', 'Supabase', 'UI/UX', 'Portfolio', 'SEO'].map((topic) => (
            <Link
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-3 py-1.5 text-[var(--page-fg)] transition hover:border-blue-300 hover:text-blue-700"
            >
              {topic}
            </Link>
          ))}
        </div>
      </form>

      {query.trim().length === 0 ? (
        <div className="surface-card rounded-[2rem] py-16 text-center">
          <p className="text-center text-[var(--surface-muted)]">Hãy nhập từ khóa để tìm kiếm bài viết</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
          Lỗi: {error}
        </div>
      ) : results.length === 0 ? (
        <div className="surface-card rounded-[2rem] py-16 text-center">
          <p className="text-[var(--surface-muted)]">Không tìm thấy bài viết nào phù hợp với &quot;{query}&quot;</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-3 rounded-[2rem] surface-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[var(--surface-muted)]">
              Tìm thấy <strong>{results.length}</strong> kết quả cho &quot;{query}&quot;
            </p>
            <p className="text-sm text-[var(--surface-muted)]">Gợi ý theo dõi các tag và category để mở rộng phạm vi tìm kiếm.</p>
          </div>

          <div className="space-y-6">
            {results.map((post) => (
              <article
                key={post.id}
                className="surface-card overflow-hidden rounded-[2rem] transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/40"
              >
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                    <span className="rounded-full bg-blue-50 px-3 py-1">{deriveCategory(post)}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1">{deriveTags(post).slice(0, 2).join(' · ')}</span>
                  </div>

                  <Link href={`/posts/${post.slug}`}>
                    <h2 className="mt-4 text-2xl font-semibold transition-colors hover:text-blue-600">
                      {post.title}
                    </h2>
                  </Link>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-2 text-gray-600">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[var(--surface-muted)]">
                    <span>
                      Bởi {post.profiles?.display_name || 'Ẩn danh'}
                    </span>
                    <span>•</span>
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('vi-VN')
                        : 'Chưa xuất bản'}
                    </span>
                  </div>

                  <Link href={`/posts/${post.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                    Đọc tiếp
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
