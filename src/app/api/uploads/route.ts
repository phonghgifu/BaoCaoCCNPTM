import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: { fileName, contentType, kind }
export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { fileName, contentType, kind = 'thumbnail' } = body || {}

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 })
    }

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

    const folder = kind === 'avatar' ? 'avatars' : 'thumbnails'
    const key = `${folder}/${user.id}/${Date.now()}-${fileName}`

    return NextResponse.json({ bucket: process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? 'blog-images', key })
  } catch (err) {
    console.error('POST /api/uploads error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
