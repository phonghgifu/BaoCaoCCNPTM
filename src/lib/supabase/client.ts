import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if variables are missing or are placeholders
  const isMissing = !url || !key
  const isPlaceholder = (val: string) => val?.includes('your-') || val?.includes('your_')

  if (isMissing || isPlaceholder(url) || isPlaceholder(key)) {
    const message = 
      'Missing or invalid Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'See VERCEL_DEPLOYMENT_GUIDE.md for setup instructions.'
    
    // Only throw in browser context (client-side)
    if (typeof window !== 'undefined') {
      throw new Error(message)
    }
    
    // In build/server context, log warning but don't crash
    console.warn(`⚠️ Supabase Client: ${message}`)
    
    // Return a mock client to prevent build failure
    return {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        signIn: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
    } as any
  }

  return createBrowserClient(url, key)
}
