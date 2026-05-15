import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PostList } from '@/components/dashboard/post-list'
import { deriveCategory } from '@/lib/content'

type CommentWithPost = {
  id: string
  content: string
  created_at: string
  posts?: Array<{
    id: string
    title: string
    slug: string
    author_id: string
  }>
  profiles?: Array<{
    display_name: string | null
    avatar_url: string | null
  }>
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const { data: recentComments } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      posts!inner (
        id,
        title,
        slug,
        author_id
      ),
      profiles (
        display_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const ownedPosts = posts || []
  const publishedCount = ownedPosts.filter((post) => post.status === 'published').length
  const draftCount = ownedPosts.filter((post) => post.status === 'draft').length
  const typedComments = (recentComments || []) as unknown as CommentWithPost[]
  const ownedComments = typedComments.filter((comment) => comment.posts?.[0]?.author_id === user.id)
  const totalComments = ownedComments.length
  const latestActivity = ownedComments.slice(0, 3)

  const categoryHighlights = ownedPosts.reduce<Record<string, number>>((accumulator, post) => {
    const category = deriveCategory(post)
    accumulator[category] = (accumulator[category] || 0) + 1
    return accumulator
  }, {})

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="section-shell py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 p-8 sm:p-10 lg:p-12 text-white shadow-2xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-100">
                  <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                  Dashboard cá nhân
                </div>
                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  Bài Viết Của Tôi
                </h1>
                <p className="mt-3 max-w-2xl text-lg text-blue-100">
                  Quản lý, xuất bản, và theo dõi hiệu suất bài viết của bạn.
                </p>
              </div>

              <Link
                href="/dashboard/new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-blue-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span>✍️ Viết Bài Mới</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-shell py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Tổng Bài', value: ownedPosts.length, icon: '📝', color: 'blue' },
              { label: 'Đã Xuất Bản', value: publishedCount, icon: '✓', color: 'emerald' },
              { label: 'Bản Nháp', value: draftCount, icon: '📋', color: 'amber' },
              { label: 'Bình Luận', value: totalComments, icon: '💬', color: 'purple' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600">{stat.label}</p>
                <p className="mt-3 text-4xl font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-shell py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Posts Section */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Quản Lý</p>
                    <h2 className="mt-2 text-2xl font-black text-gray-900">Nội Dung Của Bạn</h2>
                  </div>
                  <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                    {Object.keys(categoryHighlights).length} chủ đề
                  </div>
                </div>

                {/* Category Tags */}
                {Object.entries(categoryHighlights).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                    {Object.entries(categoryHighlights).map(([category, count]) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                      >
                        <span>{category}</span>
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                          {count}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Posts List */}
                {ownedPosts.length > 0 ? (
                  <PostList posts={ownedPosts} />
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white py-12 px-6 text-center">
                    <span className="text-5xl">📭</span>
                    <h3 className="mt-4 text-xl font-bold text-gray-900">Chưa có bài viết nào</h3>
                    <p className="mt-2 text-gray-600">Hãy viết bài viết đầu tiên để bắt đầu!  </p>
                    <Link
                      href="/dashboard/new"
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white transition hover:shadow-lg"
                    >
                      ✍️ Viết Bài Đầu Tiên
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Activity Section */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">📱 Hoạt Động</p>
                <h3 className="mt-3 text-xl font-black text-gray-900">Bình Luận Gần Đây</h3>

                <div className="mt-6 space-y-3">
                  {latestActivity.length > 0 ? (
                    latestActivity.map((activity) => (
                      <Link
                        key={activity.id}
                        href={`/posts/${activity.posts?.[0]?.slug || '#'}`}
                        className="block group rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-4 transition hover:border-blue-300 hover:shadow-md"
                      >
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                          {activity.profiles?.[0]?.display_name || 'Ẩn danh'}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-700 font-medium">
                          {activity.content}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                          Xem bài →
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                      <p className="text-sm text-gray-600">Chưa có bình luận mới</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">⚡ Hành Động</p>
                <h3 className="mt-3 text-xl font-black text-gray-900">Nhanh</h3>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/dashboard/new"
                    className="block w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-center font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    ✍️ Viết Bài Mới
                  </Link>
                  <Link
                    href="/blog"
                    className="block w-full rounded-2xl border border-gray-200 px-4 py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    📖 Xem Blog
                  </Link>
                  <Link
                    href="/profile"
                    className="block w-full rounded-2xl border border-gray-200 px-4 py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    👤 Hồ Sơ
                  </Link>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wider text-purple-700">💡 Mẹo</p>
                <h3 className="mt-3 text-lg font-black text-gray-900">Tăng Lượt Xem</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li>✓ Viết tiêu đề hấp dẫn</li>
                  <li>✓ Thêm ảnh đại diện đẹp</li>
                  <li>✓ Sử dụng tags phù hợp</li>
                  <li>✓ Xuất bản thường xuyên</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
