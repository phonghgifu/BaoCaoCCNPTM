import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'
import { deriveTags } from '@/lib/content'

interface BlogPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
    sort?: string
  }>
}

export const metadata = {
  title: 'Blog - Professional Blog',
  description: 'Khám phá tất cả các bài viết trên nền tảng blog chuyên nghiệp',
}

const PAGE_SIZE = 6

function buildPageHref(params: {
  q?: string
  sort?: string
  page?: number
}) {
  const search = new URLSearchParams()

  if (params.q) search.set('q', params.q)
  if (params.sort) search.set('sort', params.sort)
  if (params.page && params.page > 1) search.set('page', String(params.page))

  const query = search.toString()
  return query ? `/blog?${query}` : '/blog'
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const supabase = await createClient()
  const params = await searchParams

  const query = (params.q || '').trim()
  const page = Math.max(1, Number.parseInt(params.page || '1', 10) || 1)
  const sort = params.sort === 'oldest' ? 'oldest' : 'latest'

  let posts: any[] | null = null
  let fetchError: string | null = null
  let totalCount = 0

  try {
    let request = supabase
      .from('posts')
      .select(`
        *,
        profiles (
          display_name,
          avatar_url
        )
      `, { count: 'exact' })
      .eq('status', 'published')

    if (query) {
      request = request.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    }

    request = request.order('published_at', { ascending: sort === 'oldest' })

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const res = await request.range(from, to)

    if (res.error) {
      fetchError = res.error.message
      posts = []
    } else {
      posts = res.data ?? []
      totalCount = res.count ?? 0
    }
  } catch (err: any) {
    fetchError = err?.message ?? String(err)
    posts = []
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const hasResults = posts && posts.length > 0
  const showingStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const showingEnd = totalCount === 0 ? 0 : Math.min(page * PAGE_SIZE, totalCount)

  const topTags = (posts || [])
    .flatMap((post) => deriveTags(post))
    .reduce<Record<string, number>>((accumulator, tag) => {
      accumulator[tag] = (accumulator[tag] || 0) + 1
      return accumulator
    }, {})

  const spotlightTags = Object.entries(topTags)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)

  const authorCounts = (posts || []).reduce<Record<string, { name: string; avatar: string; posts: number }>>((accumulator, post: any) => {
    const authorId = post.author_id || 'unknown'
    const displayName = post.profiles?.display_name || 'Ẩn danh'
    const avatarUrl = post.profiles?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'

    if (!accumulator[authorId]) {
      accumulator[authorId] = { name: displayName, avatar: avatarUrl, posts: 0 }
    }

    accumulator[authorId].posts += 1
    return accumulator
  }, {})

  const spotlightAuthors = Object.values(authorCounts)
    .sort((left, right) => right.posts - left.posts)
    .slice(0, 3)

  return (
    <>
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="relative section-shell">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-lg shadow-blue-100/30">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Tất cả bài viết
              </div>

              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Khám Phá
                <br />
                <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  Bài Viết Chuyên Nghiệp
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                Tìm kiếm nhanh, lọc theo chủ đề, đọc mượt và khám phá những bài viết mới nhất từ cộng đồng.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-gray-600">{totalCount} bài viết • {Math.ceil(totalCount / PAGE_SIZE)} trang</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
            <form method="GET" className="space-y-6">
              {/* Search Input */}
              <div>
                <label htmlFor="q" className="block text-sm font-bold text-gray-900 mb-2">
                  🔍 Tìm kiếm bài viết
                </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  placeholder="Nhập từ khóa: Next.js, Supabase, React..."
                  className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 text-lg placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Filter & Sort Row */}
              <div className="grid gap-4 sm:grid-cols-[1fr_200px] lg:grid-cols-[1fr_200px_160px]">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label htmlFor="sort" className="block text-sm font-semibold text-gray-900 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    defaultValue={sort}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="latest">📅 Mới nhất</option>
                    <option value="oldest">🕐 Cũ nhất</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="col-span-2 sm:col-span-1 lg:col-span-1 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300 active:scale-95"
                >
                  Tìm kiếm
                </button>
              </div>

              {/* Quick Filter Tags */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-600 mb-3">🏷️ Tìm nhanh:</p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'React', 'TypeScript', 'Web Design', 'Supabase'].map((topic) => (
                    <Link
                      key={topic}
                      href={`/blog?q=${encodeURIComponent(topic)}`}
                      className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 hover:shadow-md"
                    >
                      #{topic}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Clear Filter */}
              {query && (
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  ✕ Xóa tìm kiếm
                </Link>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-shell py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '📝', label: 'Tổng bài viết', value: totalCount },
              { icon: '📄', label: 'Hiển thị trong trang', value: hasResults ? posts.length : 0 },
              { icon: '📍', label: 'Trang hiện tại', value: page },
              { icon: '🏷️', label: 'Chủ đề nổi bật', value: spotlightTags.length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md hover:shadow-lg transition">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics & Authors Sidebar */}
      <section className="section-shell py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Topics */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">🏷️ Chủ Đề Nổi Bật</h3>
              <p className="mt-3 text-2xl font-black text-gray-900">Khám Phá Theo Tag</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {spotlightTags.length > 0 ? (
                  spotlightTags.map(([tag, count]) => (
                    <Link
                      key={tag}
                      href={`/blog?q=${encodeURIComponent(tag)}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                    >
                      <span>#{tag}</span>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {count}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có tag.</p>
                )}
              </div>
            </div>

            {/* Authors */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">✍️ Tác Giả Nổi Bật</h3>
              <p className="mt-3 text-2xl font-black text-gray-900">Top Contributors</p>

              <div className="mt-6 space-y-3">
                {spotlightAuthors.length > 0 ? (
                  spotlightAuthors.map((author) => (
                    <div key={author.name} className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-4 transition hover:shadow-md">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{author.name}</p>
                        <p className="text-sm text-gray-600">{author.posts} bài viết</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có dữ liệu.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {fetchError ? (
            <div className="rounded-3xl border-2 border-red-200 bg-red-50/80 p-8 sm:p-10 text-center">
              <span className="text-5xl">⚠️</span>
              <h3 className="mt-4 text-2xl font-bold text-red-900">Có lỗi khi tải bài viết</h3>
              <p className="mt-2 text-red-700">{fetchError}</p>
              <Link href="/" className="mt-6 inline-flex rounded-full bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700">
                Quay lại trang chủ
              </Link>
            </div>
          ) : hasResults ? (
            <div className="space-y-8">
              {/* Results Info */}
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Đang hiển thị <span className="font-bold text-gray-900">{showingStart}–{showingEnd}</span> / <span className="font-bold text-gray-900">{totalCount}</span> bài viết
                  {query && <span className="ml-2">• Từ khóa: <span className="font-bold text-blue-600">{query}</span></span>}
                </p>
              </div>

              {/* Posts Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl hover:border-blue-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 text-5xl opacity-30">
                          ✦
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700 tracking-wide">
                          Featured
                        </span>
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </span>
                      </div>

                      <Link href={`/posts/${post.slug}`} className="block group/link">
                        <h2 className="line-clamp-2 text-xl font-bold text-gray-900 transition group-hover/link:text-blue-600">
                          {post.title}
                        </h2>
                      </Link>

                      {post.excerpt && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Author & CTA */}
                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              post.profiles?.avatar_url ||
                              'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
                            }
                            alt={post.profiles?.display_name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {post.profiles?.display_name || 'Ẩn danh'}
                          </p>
                        </div>

                        <Link
                          href={`/posts/${post.slug}`}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          Đọc <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <nav className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between" aria-label="Pagination">
                <p className="text-sm text-gray-600">
                  Trang <span className="font-bold text-gray-900">{page}</span> / <span className="font-bold text-gray-900">{totalPages}</span>
                </p>

                <div className="flex flex-wrap items-center gap-2">{page > 1 && (
                    <Link
                      href={buildPageHref({ q: query || undefined, sort, page: Math.max(1, page - 1) })}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                    >
                      ← Trang trước
                    </Link>
                  )}

                  {page < totalPages && (
                    <Link
                      href={buildPageHref({ q: query || undefined, sort, page: page + 1 })}
                      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    >
                      Trang sau →
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white py-16 px-6 text-center">
              <span className="text-6xl">📭</span>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h3>
              <p className="mt-2 text-gray-600">
                {query ? `Không có bài viết nào khớp với "${query}"` : 'Hãy viết bài viết đầu tiên của bạn!'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {query && (
                  <Link href="/blog" className="inline-flex rounded-full bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300">
                    ✕ Xóa tìm kiếm
                  </Link>
                )}
                <Link href="/dashboard/new" className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition hover:shadow-lg">
                  ✍️ Viết Bài
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
