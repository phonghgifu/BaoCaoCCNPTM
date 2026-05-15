import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Paths we want to protect
  const protectedPaths = ['/dashboard', '/posts/create', '/posts/edit']
  const authPaths = ['/login', '/register']

  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname === path)

  if (!isProtectedPath && !isAuthPath) {
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

    if (isProtectedPath && !user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (isAuthPath && user) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (err) {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/posts/:path*', '/login', '/register'],
}
