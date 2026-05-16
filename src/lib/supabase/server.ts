import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createSupabaseDisabledClient, getSupabaseEnv } from './env'

export async function createClient() {
  const env = getSupabaseEnv()

  if (!env) {
    const message =
      'Missing or invalid Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'See VERCEL_DEPLOYMENT_GUIDE.md for setup instructions.'

    console.warn(`⚠️ Supabase Server: ${message}`)
    return createSupabaseDisabledClient()
  }

  const cookieStore = await cookies()

  return createServerClient(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
