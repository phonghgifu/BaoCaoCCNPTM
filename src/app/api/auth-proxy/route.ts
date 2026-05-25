import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user ?? null

    if (!user) {
      return NextResponse.json({ user: null, profile: null, role: 'user' })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, role')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user,
      profile: profile ?? null,
      role: profile?.role ?? 'user',
    })
  } catch (err) {
    return NextResponse.json({ user: null, profile: null, role: 'user', error: String(err) }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
