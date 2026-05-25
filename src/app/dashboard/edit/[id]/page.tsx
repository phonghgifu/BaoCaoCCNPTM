import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PostForm } from '@/components/dashboard/post-form'
import { getEditablePostById } from '@/services/posts.service'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let post = null

  try {
    post = await getEditablePostById(supabase, id, user.id)
  } catch {
    notFound()
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="section-shell surface-card overflow-hidden">
        <div className="border-b border-(--surface-border) bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-6 py-8 text-slate-100 sm:px-8 lg:px-10">
          <p className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">Dashboard</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Chỉnh sửa bài viết</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Cập nhật nội dung bài viết trong cùng một layout thống nhất với trang tạo mới.
          </p>
        </div>

        <div className="bg-(--surface-solid) px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <PostForm post={post} />
        </div>
      </div>
    </main>
  )
}
