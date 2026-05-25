import type { SupabaseClient } from '@supabase/supabase-js'

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
    // CRUD operations
    select: function() { return this },
    insert: function() { return this },
    update: function() { return this },
    delete: function() { return this },

    // Filters
    eq: function() { return this },
    neq: function() { return this },
    gt: function() { return this },
    gte: function() { return this },
    lt: function() { return this },
    lte: function() { return this },
    like: function() { return this },
    ilike: function() { return this },
    in: function() { return this },
    contains: function() { return this },
    containedBy: function() { return this },
    textSearch: function() { return this },
    match: function() { return this },
    filter: function() { return this },
    or: function() { return this },
    and: function() { return this },
    not: function() { return this },
    is: function() { return this },

    // Ordering & Pagination
    order: function() { return this },
    limit: function() { return this },
    range: function() { return this },
    offset: function() { return this },

    // Modifiers
    abortSignal: function() { return this },
    count: function() { return this },
    maybeSingle: function() { return this },
    single: function() { return this },
    throwOnError: function() { return this },

    // Promise-like interface
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
  } as unknown as SupabaseClient
}
