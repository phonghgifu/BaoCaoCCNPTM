import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: { project_id }
export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const project_id = body?.project_id

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 })
    }

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const { error } = await supabase.from('project_likes').insert({
      project_id,
      user_id: user.id,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/project-likes error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE: { project_id }
export async function DELETE(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const project_id = body?.project_id

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 })
    }

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const { error } = await supabase
      .from('project_likes')
      .delete()
      .eq('project_id', project_id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/project-likes error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET: /api/project-likes?project_id=123 -> { count }
export async function GET(req: Request) {
  const supabase = await createClient()
  try {
    const url = new URL(req.url)
    const project_id = url.searchParams.get('project_id')

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 })
    }

    const { data, error, count } = await supabase
      .from('project_likes')
      .select('*', { count: 'exact' })
      .eq('project_id', project_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ count: count ?? (Array.isArray(data) ? data.length : 0) })
  } catch (err) {
    console.error('GET /api/project-likes error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
