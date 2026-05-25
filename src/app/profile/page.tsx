import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'

/* eslint-disable @next/next/no-img-element */

type OwnedPost = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  created_at: string
  published_at: string | null
  image_url: string | null
}

export const metadata = {
  title: 'Hồ sơ cá nhân',
  description: 'Xem và chỉnh sửa hồ sơ cá nhân',
}

export default async function ProfilePage() {
  const supabase = await createClient()

  // Kiểm tra user đã đăng nhập chưa
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Lấy profile của user
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: ownedPosts } = await supabase
    .from('posts')
    .select('id, title, slug, status, created_at, published_at, image_url')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            <p className="font-semibold">⚠️ Lỗi</p>
            <p>Không tìm thấy hồ sơ của bạn</p>
          </div>
        </div>
      </main>
    )
  }

  const posts = (ownedPosts || []) as OwnedPost[]
  const publishedCount = posts.filter((post) => post.status === 'published').length
  const draftCount = posts.filter((post) => post.status === 'draft').length
  const latestPosts = posts.slice(0, 3)

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin tài khoản */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin tài khoản</h2>
              
              <div className="space-y-6">
                {/* Avatar Preview */}
                {profile.avatar_url && (
                  <div className="text-center pb-6 border-b border-gray-200">
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-100 shadow-md"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</p>
                  <p className="text-sm text-gray-900 font-medium break-all">{user.email}</p>
                </div>

                {/* User ID */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ID</p>
                  <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-2 rounded border border-gray-200">{user.id}</p>
                </div>

                {/* Member Since */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thành viên từ</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {new Date(user.created_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form chỉnh sửa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Chỉnh sửa thông tin</h2>
              <ProfileForm profile={profile} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tổng bài viết</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{posts.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Đã xuất bản</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{publishedCount}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Bản nháp</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{draftCount}</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bài viết gần đây</h2>
              <p className="text-sm text-gray-500">Các bài viết mới nhất của bạn hiển thị ở đây để quản lý nhanh hơn.</p>
            </div>
            <a href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Tới Dashboard →
            </a>
          </div>

          <div className="mt-6 space-y-4">
            {latestPosts.length > 0 ? latestPosts.map((post) => (
              <a
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="h-20 w-28 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-20 w-28 rounded-lg bg-linear-to-br from-blue-500 via-cyan-500 to-violet-500 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
                    <span className={`rounded-full px-2 py-1 font-semibold ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                  <h3 className="mt-2 line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-blue-700">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : new Date(post.created_at || '').toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </a>
            )) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                Bạn chưa có bài viết nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
