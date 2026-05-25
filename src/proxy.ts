import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  const protectedPaths = ['/dashboard', '/posts/create', '/posts/edit', '/profile']
  const authPaths = ['/login', '/register']
  const adminOnlyPaths = ['/dashboard/admin']
  const editorOnlyPaths = ['/dashboard/editor']

  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname === path)
  const isAdminOnlyPath = adminOnlyPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isEditorOnlyPath = editorOnlyPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (!isProtectedPath && !isAuthPath && !isAdminOnlyPath && !isEditorOnlyPath) {
    return NextResponse.next()
  }

  try {
    const origin = request.nextUrl.origin
    const res = await fetch(`${origin}/api/auth-proxy`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      cache: 'no-store',
    })

    const json = await res.json()
    const user = json?.user ?? null
    const role = json?.role ?? 'user'

    if (isProtectedPath && !user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (isAdminOnlyPath && role !== 'admin') {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (isEditorOnlyPath && role === 'user') {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (isAuthPath && user) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/:path*', '/profile', '/login', '/register'],
}
