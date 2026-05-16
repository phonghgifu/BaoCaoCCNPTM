export interface SupabaseEnv {
  url: string
  anonKey: string
}

function isValidSupabaseValue(value?: string | null) {
  return Boolean(value && !value.includes('your-') && !value.includes('your_'))
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!isValidSupabaseValue(url) || !isValidSupabaseValue(anonKey)) {
    return null
  }

  return { url: url as string, anonKey: anonKey as string }
}

export function createSupabaseDisabledClient() {
  // Mock query builder that supports method chaining
  const mockQueryBuilder = {
    select: function() { return this },
    insert: function() { return this },
    update: function() { return this },
    delete: function() { return this },
    eq: function() { return this },
    or: function() { return this },
    order: function() { return this },
    limit: function() { return this },
    range: function() { return this },
    count: function() { return this },
    maybeSingle: function() { return this },
    single: function() { return this },
    then: async function() { return { data: null, error: null } },
  }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signIn: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      }),
    },
    from: () => mockQueryBuilder,
    rpc: async () => ({ data: null, error: null }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any
}
