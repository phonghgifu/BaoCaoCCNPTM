import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseEnv } from '@/lib/supabase/env'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const response = NextResponse.redirect(`${origin}/`)
  const env = getSupabaseEnv()

  if (code && env) {
    const supabase = createServerClient(
      env.url,
      env.anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  if (code && !env) {
    console.warn('Supabase env vars are missing in /auth/callback')
  }

  // Redirect về dashboard sau khi đăng nhập thành công
  return response
}
