import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return NextResponse.json({ user: data.user ?? null })
  } catch (err) {
    return NextResponse.json({ user: null, error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return GET(request)
}
