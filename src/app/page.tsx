import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'
import { ImageWithLQIP } from '@/components/image-with-lqip'
import { deriveCategory, deriveTags, estimateReadTime, type ContentPost } from '@/lib/content'

/* eslint-disable @next/next/no-img-element */

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

  const enrichedPosts: ExtendedPost[] = (posts ?? []).map((post: ContentPost & {
    profiles?: { display_name?: string | null; avatar_url?: string | null }
    likes?: { count: number }[]
    comments?: { count: number }[]
  }) => ({
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
  const stats = [
    { label: 'Bài viết', value: enrichedPosts.length.toString(), accent: 'from-blue-600 to-cyan-500', icon: '📝' },
    { label: 'Chủ đề', value: topTopics.length.toString(), accent: 'from-emerald-500 to-teal-500', icon: '🏷️' },
    { label: 'Tác giả', value: topAuthors.length.toString(), accent: 'from-violet-500 to-fuchsia-500', icon: '✍️' },
  ]

  return (
    <>
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden">
        {/* Background gradient with subtle animated blobs */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-white" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 -right-24 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob" />
          <div className="absolute -bottom-28 -left-24 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative section-shell py-10 sm:py-16 lg:py-20 xl:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="w-full lg:pr-8 space-y-6 lg:space-y-8">
                {/* Hero Label */}
                <div className="inline-flex items-center rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-lg shadow-blue-100/50 backdrop-blur">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  Sản phẩm mới nhất trong portfolio
                </div>

                {/* Main Headline */}
                <div className="space-y-3">
                  <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-5xl">
                    Blog & Portfolio
                    <br />
                    <span className="inline-block bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500">
                      Chuyên Nghiệp
                    </span>
                  </h1>
                </div>

                {/* Subheading */}
                <p className="max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl lg:text-2xl">
                  Nền tảng đầy đủ tính năng để chia sẻ kiến thức, quản lý dự án và xây dựng danh tiếng công nghệ của bạn.
                  <span className="mt-2 block text-sm font-semibold text-blue-600">Được xây dựng với Next.js 16, Supabase và Tailwind CSS.</span>
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/blog"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-xl shadow-blue-200/60 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-300/40 active:translate-y-0"
                  >
                    <span>🚀 Khám Phá Blog</span>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white/80 px-8 py-4 font-bold text-blue-700 shadow-lg shadow-blue-100/30 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-xl"
                  >
                    <span>👀 Portfolio</span>
                  </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 sm:gap-4 lg:gap-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="group rounded-3xl border border-white/80 bg-white/70 px-4 py-5 shadow-lg shadow-blue-100/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-2xl hover:shadow-blue-200/30"
                    >
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${stat.accent} text-xl font-bold text-white shadow-lg shadow-black/10 transition group-hover:scale-105`}>
                        {stat.icon}
                      </div>
                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">{stat.label}</div>
                      <div className="mt-2 text-3xl font-black text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-blue-50 to-purple-50 blur-2xl" />
                <div className="surface-card overflow-hidden border-white/70 bg-white/90 p-4 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-6 w-full">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-900/20 sm:p-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-rose-400" />
                        <span className="h-3 w-3 rounded-full bg-amber-300" />
                        <span className="h-3 w-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                        Live Preview
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4">
                      <div className="rounded-[1.25rem] border border-white/10 bg-linear-to-r from-blue-500 to-cyan-500 p-5 shadow-md w-full">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Dashboard Snapshot</p>
                        <h3 className="mt-3 text-2xl font-black leading-tight text-white">Nội dung rõ ràng, hierarchy mạnh, đọc nhanh trên mọi thiết bị.</h3>
                        <div className="mt-5 flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur" />
                          <div className="flex-1 rounded-2xl bg-white/15 px-4 py-3 text-sm text-white/90 backdrop-blur">Tìm bài viết, portfolio, search, dashboard</div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-900/95 p-4 shadow-lg shadow-slate-900/10">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bài viết</p>
                          <p className="mt-3 text-3xl font-black text-white">52</p>
                          <p className="mt-1 text-sm text-slate-400">đang hiển thị</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Chủ đề</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">6</p>
                          <p className="mt-1 text-sm text-slate-500">đã phân nhóm</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-lg shadow-slate-200/40">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phong cách</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">SaaS</p>
                          <p className="mt-1 text-sm text-slate-500">premium</p>
                        </div>
                      </div>

                      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/40">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Recent article flow</p>
                            <p className="text-xs text-slate-500">Hero → featured → latest posts</p>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Balanced</span>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div className="h-2.5 w-11/12 rounded-full bg-linear-to-r from-blue-500 to-cyan-400" />
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div className="h-2.5 w-4/5 rounded-full bg-linear-to-r from-cyan-500 to-emerald-400" />
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div className="h-2.5 w-3/5 rounded-full bg-linear-to-r from-purple-500 to-pink-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-shell py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-blue-200/50 bg-linear-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur px-6 py-8 sm:px-8 sm:py-10 shadow-lg shadow-blue-100/30">
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

            <article className="group overflow-hidden rounded-3xl post-card transition">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
                {/* Image */}
                {featuredPost.image_url ? (
                  <div className="relative overflow-hidden lg:h-auto">
                    <ImageWithLQIP
                      src={featuredPost.image_url}
                      alt={featuredPost.title || 'Featured Post'}
                      className="card-thumb transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-80 items-center justify-center bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 lg:h-auto">
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
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-3 font-bold text-white transition hover:shadow-lg hover:shadow-cyan-500/50"
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
                      className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-linear-to-r from-blue-50/80 to-cyan-50/80 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
                    <div key={author.authorId} className="flex items-center gap-3 rounded-2xl bg-linear-to-r from-blue-50/50 to-cyan-50/50 p-4 transition hover:shadow-md">
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
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Bài Viết Gần Đây</p>
                <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">Nội Dung Mới Nhất</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                  Một luồng bài viết được sắp theo độ nổi bật, giúp người đọc đi từ nội dung quan trọng nhất sang các bài liên quan một cách tự nhiên.
                </p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                Xem Tất Cả <span>→</span>
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              {restPosts[0] && (
                <article className="group overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_100px_rgba(37,99,235,0.14)]">
                  <div className="grid h-full lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative min-h-72 overflow-hidden bg-linear-to-br from-gray-100 to-gray-50 lg:min-h-full">
                      {restPosts[0].image_url ? (
                        <ImageWithLQIP
                          src={restPosts[0].image_url}
                          alt={restPosts[0].title || 'Post'}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full min-h-72 items-center justify-center bg-linear-to-br from-blue-500 via-cyan-500 to-purple-500 text-6xl opacity-30 lg:min-h-full">
                          ✦
                        </div>
                      )}

                      <div className="absolute left-5 top-5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                        Featured Now
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                            {restPosts[0].category}
                          </span>
                          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {restPosts[0].readTime} min
                          </span>
                        </div>

                        <Link href={`/posts/${restPosts[0].slug}`} className="mt-5 block group/link">
                          <h3 className="text-2xl font-black leading-tight text-gray-900 transition group-hover/link:text-blue-600 sm:text-3xl">
                            {restPosts[0].title}
                          </h3>
                        </Link>

                        {restPosts[0].excerpt && (
                          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                            {restPosts[0].excerpt}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {restPosts[0].tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              restPosts[0].profiles?.avatar_url ||
                              'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
                            }
                            alt={restPosts[0].profiles?.display_name || 'Author'}
                            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-blue-100"
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {restPosts[0].profiles?.display_name || 'Ẩn danh'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {restPosts[0].published_at
                                ? new Date(restPosts[0].published_at).toLocaleDateString('vi-VN', {
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/posts/${restPosts[0].slug}`}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50"
                        >
                          Đọc Bài <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {restPosts.slice(1).map((post) => (
                  <article
                    key={post.id}
                    className="group rounded-3xl border border-gray-200 bg-white p-4 shadow-lg transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-50">
                        {post.image_url ? (
                          <ImageWithLQIP
                            src={post.image_url}
                            alt={post.title || 'Post'}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-500 via-cyan-500 to-purple-500 text-3xl opacity-30">
                            ✦
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-block rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                            {post.category}
                          </span>
                          <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                            {post.readTime} min
                          </span>
                        </div>

                        <Link href={`/posts/${post.slug}`} className="mt-3 block">
                          <h3 className="line-clamp-2 text-lg font-black leading-snug text-gray-900 transition group-hover:text-blue-600">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {post.excerpt}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
                          <span>
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">Đọc thêm →</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {enrichedPosts.length === 0 && (
        <section className="section-shell py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-linear-to-b from-gray-50 to-white py-16 px-6 text-center sm:px-8">
              <span className="text-6xl">📝</span>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">Chưa có bài viết nào</h3>
              <p className="mt-2 text-gray-600">Hãy viết bài viết đầu tiên của bạn để chia sẻ kiến thức!</p>
              <Link
                href="/dashboard/new"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white transition hover:shadow-lg"
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
          <div className="rounded-3xl bg-linear-to-r from-blue-600 via-cyan-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl">
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
