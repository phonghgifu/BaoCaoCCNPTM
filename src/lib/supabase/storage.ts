import { createClient } from '@/lib/supabase/client'

export async function uploadProjectImage(file: File, key?: string) {
  const supabase = createClient()
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_PROJECTS_BUCKET ?? 'blog-images'
  const fileName = key ?? `projects/${Date.now()}-${file.name}`

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { key: fileName, publicUrl: data.publicUrl }
}

export function getPublicUrl(key: string) {
  const supabase = createClient()
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_PROJECTS_BUCKET ?? 'blog-images'
  const { data } = supabase.storage.from(bucket).getPublicUrl(key)
  return data.publicUrl
}
