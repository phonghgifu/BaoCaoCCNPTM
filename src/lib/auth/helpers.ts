import { createClient } from '@/lib/supabase/client'
import type { SignUpData, LoginData } from './types'

function getSupabaseClient() {
  return createClient()
}

// ============================================================
// ĐĂNG KÝ TÀI KHOẢN
// ============================================================
export async function signUp(data: SignUpData) {
  try {
    const supabase = getSupabaseClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.display_name || '',
          role: data.role || 'user',
        },
      },
    })

    if (error) throw error

    return {
      success: true,
      user: authData.user,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi đăng ký',
    }
  }
}

// ============================================================
// ĐĂNG NHẬP
// ============================================================
export async function login(data: LoginData) {
  try {
    const supabase = getSupabaseClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error

    return {
      success: true,
      user: authData.user,
      message: 'Đăng nhập thành công!',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi đăng nhập',
    }
  }
}

// ============================================================
// ĐĂNG XUẤT
// ============================================================
export async function logout() {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return {
      success: true,
      message: 'Đăng xuất thành công!',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi đăng xuất',
    }
  }
}

// ============================================================
// OAUTH: ĐĂNG NHẬP BẰNG GITHUB
// ============================================================
export async function signInWithGitHub() {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error

    return {
      success: true,
      message: 'Chuyển hướng đến GitHub...',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi OAuth',
    }
  }
}

// ============================================================
// LẤY SESSION HIỆN TẠI
// ============================================================
export async function getSession() {
  try {
    const supabase = getSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    return {
      success: true,
      session,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi lấy session',
    }
  }
}
