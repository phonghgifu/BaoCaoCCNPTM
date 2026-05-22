import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'
import { ImageWithLQIP } from '@/components/image-with-lqip'
import { deriveCategory, deriveTags, estimateReadTime, type ContentPost } from '@/lib/content'

interface ExtendedPost extends ContentPost {
  category: string
  tags: string[]
  readTime: number
  likes_count?: number
  comments_count?: number
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch posts dengan join untuk likes dan comments count
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      ),
      likes(count),
      comments(count)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const enrichedPosts: ExtendedPost[] = (posts ?? []).map((post: any) => ({
    ...post,
    category: deriveCategory(post),
    tags: deriveTags(post),
    readTime: estimateReadTime(post),
    likes_count: post.likes?.[0]?.count ?? 0,
    comments_count: post.comments?.[0]?.count ?? 0,
  }))

  // Separate featured post (most liked or latest) from others
  const featuredPost = enrichedPosts.length > 0 
    ? enrichedPosts.reduce((prev, curr) => 
        ((curr.likes_count ?? 0) > (prev.likes_count ?? 0)) ? curr : prev
      )
    : null

  // Get featured posts (exclude main featured if exists)
  const restPosts = featuredPost 
    ? enrichedPosts.filter(p => p.id !== featuredPost.id).slice(0, 5)
    : enrichedPosts.slice(0, 5)

  // Calculate topic statistics
  const topicCounts = enrichedPosts.reduce<Record<string, number>>((accumulator, post) => {
    post.tags.forEach((tag) => {
      accumulator[tag] = (accumulator[tag] || 0) + 1
    })
    return accumulator
  }, {})

  const topTopics = Object.entries(topicCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)

  // Get unique authors with detailed stats
  const authorMap = new Map<string, { name: string; avatar: string; posts: string[] }>()
  
  enrichedPosts.forEach((post) => {
    if (!post.author_id) return
    
    const authorName = post.profiles?.display_name || 'Ẩn danh'
    const authorAvatar = post.profiles?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    
    if (!authorMap.has(post.author_id)) {
      authorMap.set(post.author_id, {
        name: authorName,
        avatar: authorAvatar,
        posts: [],
      })
    }
    
    const author = authorMap.get(post.author_id)!
    author.posts.push(post.id)
  })

  const topAuthors = Array.from(authorMap.entries())
    .map(([authorId, info]) => ({ authorId, ...info, postsCount: info.posts.length }))
    .sort((a, b) => b.postsCount - a.postsCount)
    .slice(0, 4)

  // Calculate statistics
  const totalEngagement = enrichedPosts.reduce((sum, post) => sum + (post.likes_count ?? 0) + (post.comments_count ?? 0), 0)
  const stats = [
    { label: 'Bài viết', value: enrichedPosts.length.toString(), accent: 'from-blue-600 to-cyan-500', icon: '📝' },
    { label: 'Chủ đề', value: topTopics.length.toString(), accent: 'from-emerald-500 to-teal-500', icon: '🏷️' },
    { label: 'Tác giả', value: topAuthors.length.toString(), accent: 'from-violet-500 to-fuchsia-500', icon: '✍️' },
  ]

  return (
    <>
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden">
        {/* Background gradient with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative section-shell py-12 sm:py-20 lg:py-28 xl:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-8 lg:space-y-10">
              {/* Hero Label */}
              <div className="inline-flex items-center rounded-full border border-blue-200/80 bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-lg shadow-blue-100/50">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Sản phẩm mới nhất trong portfolio
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl xl:text-8xl">
                  Blog & Portfolio
                  <br />
                  <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                    Chuyên Nghiệp
                  </span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl lg:text-2xl">
                Nền tảng đầy đủ tính năng để chia sẻ kiến thức, quản lý dự án và xây dựng danh tiếng công nghệ của bạn.
                <span className="block mt-2 text-sm font-semibold text-blue-600">Được xây dựng với Next.js 16, Supabase và Tailwind CSS.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/blog"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-xl hover:shadow-blue-300 hover:scale-105 active:scale-95"
                >
                  <span>🚀 Khám Phá Blog</span>
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-600 px-8 py-4 font-bold text-blue-600 transition hover:bg-blue-50"
                >
                  <span>👀 Portfolio</span>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 pt-6 sm:gap-4 lg:gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-white/80 bg-white/60 backdrop-blur px-4 py-5 sm:px-6 sm:py-7 shadow-lg shadow-blue-100/20 transition hover:shadow-xl hover:border-blue-200/80"
                  >
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-lg font-bold text-white shadow-md`}>
                      {stat.icon}
                    </div>
                    <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-600">{stat.label}</div>
                    <div className="mt-2 text-3xl font-black text-gray-900">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur px-6 py-8 sm:px-8 sm:py-10 shadow-lg shadow-blue-100/30">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">🔍 Tìm kiếm thông minh</h2>
                <p className="mt-2 text-gray-600">Khám phá bài viết, tag và tác giả yêu thích</p>
              </div>
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Mở Tìm Kiếm <span>→</span>
              </Link>
            </div>

            {/* Popular searches */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Web Design', 'Tutorial'].map((query) => (
                <Link
                  key={query}
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-blue-600 hover:shadow-md"
                >
                  <span className="mr-2">#{query}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article - If exists */}
      {featuredPost && (
        <section className="section-shell py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Bài viết nổi bật</span>
            </div>

            <article className="group overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl transition hover:shadow-3xl">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
                {/* Image */}
                {featuredPost.image_url ? (
                  <div className="relative h-80 overflow-hidden lg:h-auto">
                    <ImageWithLQIP
                      src={featuredPost.image_url}
                      alt={featuredPost.title || 'Featured Post'}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-80 items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 lg:h-auto">
                    <span className="text-8xl opacity-30">✦</span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase text-red-400 tracking-wide">⭐ Featured</span>
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">{featuredPost.category}</span>
                  </div>

                  <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">
                    {featuredPost.title}
                  </h2>

                  {featuredPost.excerpt && (
                    <p className="mt-4 text-lg leading-relaxed text-gray-300 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredPost.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.profiles?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={featuredPost.profiles?.display_name || 'Author'}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-white/30"
                      />
                      <div>
                        <p className="font-semibold text-white">{featuredPost.profiles?.display_name || 'Ẩn danh'}</p>
                        <p className="text-sm text-gray-400">
                          {featuredPost.published_at
                            ? new Date(featuredPost.published_at).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'} • {featuredPost.readTime} phút
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/posts/${featuredPost.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-bold text-white transition hover:shadow-lg hover:shadow-cyan-500/50"
                    >
                      Đọc Bài <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Topics & Authors Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Topics */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">Chủ Đề Nổi Bật</h3>
                  <p className="mt-2 text-2xl font-black text-gray-900">Khám Phá Theo Tag</p>
                </div>
                <Link href="/blog" className="font-bold text-blue-600 transition hover:text-blue-700">
                  Tất cả →
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {topTopics.length > 0 ? (
                  topTopics.map(([topic, count]) => (
                    <Link
                      key={topic}
                      href={`/search?q=${encodeURIComponent(topic)}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="text-base">🏷️</span>
                      <span>{topic}</span>
                      <span className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {count}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có tag.</p>
                )}
              </div>
            </div>

            {/* Top Authors */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">Tác Giả Hàng Đầu</h3>
              <p className="mt-2 text-2xl font-black text-gray-900">Những Người Đóng Góp</p>

              <div className="mt-6 space-y-3">
                {topAuthors.length > 0 ? (
                  topAuthors.map((author) => (
                    <div key={author.authorId} className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-4 transition hover:shadow-md">
                      <img
                        src={author.avatar}
                        alt={author.name || 'Author'}
                        className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{author.name}</p>
                        <p className="text-sm text-gray-600">{author.postsCount} bài viết</p>
                      </div>
                      <span className="inline-block text-lg">📝</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có tác giả.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Grid */}
      {restPosts.length > 0 && (
        <section className="section-shell py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Bài Viết Gần Đây</p>
                <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">Nội Dung Mới Nhất</h2>
              </div>
              <Link href="/blog" className="font-bold text-blue-600 transition hover:text-blue-700">
                Xem Tất Cả →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl hover:border-blue-300"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    {post.image_url ? (
                      <ImageWithLQIP
                        src={post.image_url}
                        alt={post.title || 'Post'}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 text-5xl opacity-30">
                        ✦
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700 tracking-wide">
                        {post.category}
                      </span>
                      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {post.readTime} min
                      </span>
                    </div>

                    <Link href={`/posts/${post.slug}`} className="mt-4 block group/link">
                      <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition group-hover/link:text-blue-600">
                        {post.title}
                      </h3>
                    </Link>

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Engagement */}
                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            post.profiles?.avatar_url ||
                            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
                          }
                          alt={post.profiles?.display_name || 'Author'}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-900">
                            {post.profiles?.display_name || 'Ẩn danh'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Engagement Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        {(post.likes_count ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1">
                            👍 {post.likes_count}
                          </span>
                        )}
                        {(post.comments_count ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1">
                            💬 {post.comments_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {enrichedPosts.length === 0 && (
        <section className="section-shell py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white py-16 px-6 text-center sm:px-8">
              <span className="text-6xl">📝</span>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Chưa có bài viết nào</h3>
              <p className="mt-2 text-gray-600">Hãy viết bài viết đầu tiên của bạn để chia sẻ kiến thức!</p>
              <Link
                href="/dashboard/new"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white transition hover:shadow-lg"
              >
                ✍️ Viết Bài Đầu Tiên
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl">
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">Sẵn sàng bắt đầu?</h2>
                <p className="mt-3 text-lg text-blue-50 max-w-xl">
                  Tham gia cộng đồng và chia sẻ kiến thức, kinh nghiệm của bạn với những người yêu công nghệ.
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
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  Tìm Hiểu Thêm
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
