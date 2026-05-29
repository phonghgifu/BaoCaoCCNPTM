'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { reportError } from '@/lib/telemetry'
import { getSupabaseEnv } from '@/lib/supabase/env'
import type { User, AuthSession } from './types'

const AuthContext = createContext<AuthSession | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasSupabaseEnv = !!getSupabaseEnv()
  const forceAnonymous = process.env.NEXT_PUBLIC_FORCE_ANONYMOUS === '1'
  const initialAuth: AuthSession = {
    user: null,
    isLoading: hasSupabaseEnv && !forceAnonymous,
    isAuthenticated: false,
  }

  const [authSession, setAuthSession] = useState<AuthSession>(initialAuth)

  useEffect(() => {
    if (forceAnonymous) {
      // Dev mode: do nothing further — initial state already reflects anonymous mode
      return
    }
    let supabase: ReturnType<typeof createClient> | null = null

    try {
      supabase = createClient()
    } catch (error) {
      // If Supabase client fails to initialize (e.g., missing env vars during build)
      // we just disable auth
      console.warn('Supabase client not initialized:', error)
      return
    }

    // Lấy session hiện tại
    const getInitialSession = async () => {
      if (!supabase) return

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setAuthSession({
          user: session?.user as User | null,
          isLoading: false,
          isAuthenticated: !!session,
        })
      } catch (error) {
        reportError(error, { source: 'AuthProvider.getInitialSession' })
        setAuthSession({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    getInitialSession()

    // Lắng nghe thay đổi auth state
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthSession({
          user: session?.user as User | null,
          isLoading: false,
          isAuthenticated: !!session,
        })
      })

      return () => {
        subscription?.unsubscribe()
      }
    } catch (error) {
      console.warn('Failed to subscribe to auth changes:', error)
    }
  }, [forceAnonymous, hasSupabaseEnv])

  return (
    <AuthContext.Provider value={authSession}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================================
// CUSTOM HOOK: DÙNG AUTH CONTEXT
// ============================================================
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
