'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Post, PostStatus } from '@/types/database'
import { ImageUpload } from '@/components/posts/image-upload'
import { savePost } from '@/services/posts.service'

interface PostFormProps {
  post?: Post
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [imageUrl, setImageUrl] = useState(post?.image_url || '')
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await savePost(supabase, {
        title,
        content,
        image_url: imageUrl || null,
        excerpt,
        status,
      }, post?.id)

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Nhập tiêu đề bài viết"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Tóm tắt
        </label>
        <input
          id="excerpt"
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Mô tả ngắn về bài viết (hiển thị trong danh sách)"
        />
      </div>

      <div>
        <ImageUpload
          kind="thumbnail"
          label="Thumbnail bài viết"
          description="Upload thumbnail cho bài viết từ Supabase Storage."
          onImageUploaded={setImageUrl}
          disabled={loading}
        />
      </div>

      {imageUrl && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Hình ảnh đã chọn:</p>
          <Image
            src={imageUrl}
            alt="Post image"
            width={640}
            height={360}
            unoptimized
            className="max-w-xs h-auto rounded-2xl border border-slate-200 shadow-sm"
          />
        </div>
      )}

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Nội dung
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Viết nội dung bài viết của bạn..."
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Hỗ trợ Markdown
        </p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Trạng thái
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
          className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="draft">Bản nháp</option>
          <option value="published">Xuất bản</option>
        </select>
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-slate-900"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo bài viết'}
        </button>
      </div>
    </form>
  )
}
