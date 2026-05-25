'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadProjectImage } from '@/lib/supabase/storage'
import { reportError } from '@/lib/telemetry'

interface Props {
  onCreated?: () => void
}

export function ProjectForm({ onCreated }: Props) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Bạn cần đăng nhập để thêm dự án')

      let image_key: string | null = null

      if (file) {
        const res = await uploadProjectImage(file)
        image_key = res.key
      }

      const techs = technologies.split(',').map((t) => t.trim()).filter(Boolean)

      const { error } = await supabase.from('projects').insert({
        title,
        description,
        technologies: techs,
        image: image_key,
      })

      if (error) throw error

      setTitle('')
      setDescription('')
      setTechnologies('')
      setFile(null)

      onCreated?.()
    } catch (error: unknown) {
      reportError(error, { source: 'ProjectForm.handleSubmit' })
      setError(error instanceof Error ? error.message : 'Lỗi khi tạo dự án')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
        <input className="mt-1 block w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea className="mt-1 block w-full rounded border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Công nghệ (phân tách bằng dấu phẩy)</label>
        <input className="mt-1 block w-full rounded border px-3 py-2" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="React, Next.js, Supabase" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ảnh (tùy chọn)</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>

      <div className="flex justify-end">
        <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {loading ? 'Đang tạo...' : 'Tạo dự án'}
        </button>
      </div>
    </form>
  )
}
