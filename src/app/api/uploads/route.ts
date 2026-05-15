import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: { fileName, contentType }
export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { fileName, contentType } = body || {}

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 })
    }

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

    const key = `projects/${user.id}/${Date.now()}-${fileName}`

    // Create signed upload URL (Supabase Storage uses upload APIs from client; here we return key to use with client JS)
    // We'll return the storage path and key; the client should use createClient().storage.from(bucket).upload(key, file)
    return NextResponse.json({ bucket: process.env.SUPABASE_PROJECTS_BUCKET ?? 'blog-images', key })
  } catch (err) {
    console.error('POST /api/uploads error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
