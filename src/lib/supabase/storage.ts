import { createClient } from './client'

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? 'blog-images'

type UploadKind = 'avatar' | 'thumbnail'

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize('NFKC')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function getUploadFolder(kind: UploadKind) {
  return kind === 'avatar' ? 'avatars' : 'thumbnails'
}

async function uploadStorageImage(file: File, kind: UploadKind, userId?: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const ownerId = userId ?? user?.id

  if (!ownerId) {
    throw new Error('Bạn cần đăng nhập để upload ảnh')
  }

  const folder = getUploadFolder(kind)
  const safeName = sanitizeFileName(file.name || 'image')
  const storagePath = `${folder}/${ownerId}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage.from(DEFAULT_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw error

  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(storagePath)
  return {
    key: storagePath,
    publicUrl: data.publicUrl,
  }
}

export async function uploadAvatarImage(file: File, userId?: string) {
  return uploadStorageImage(file, 'avatar', userId)
}

export async function uploadThumbnailImage(file: File, userId?: string) {
  return uploadStorageImage(file, 'thumbnail', userId)
}

export async function uploadProjectImage(file: File, key?: string) {
  return uploadThumbnailImage(file, key)
}

export function getStorageImageUrl(key: string) {
  const supabase = createClient()
  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(key)
  return data.publicUrl
}

export function getPublicUrl(key: string) {
  return getStorageImageUrl(key)
}
