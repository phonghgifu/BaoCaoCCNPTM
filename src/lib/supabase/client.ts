import { createBrowserClient } from '@supabase/ssr'
import { createSupabaseDisabledClient, getSupabaseEnv } from './env'

export function createClient() {
  const env = getSupabaseEnv()

  if (!env) {
    const message =
      'Missing or invalid Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'See VERCEL_DEPLOYMENT_GUIDE.md for setup instructions.'

    if (typeof window !== 'undefined') {
      throw new Error(message)
    }

    console.warn(`⚠️ Supabase Client: ${message}`)
    return createSupabaseDisabledClient()
  }

  return createBrowserClient(env.url, env.anonKey)
}
