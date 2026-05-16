'use client'

import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error Boundary for Posts
 * 
 * Handles errors specific to post/article detail pages
 */
export default function PostError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="text-6xl">📄</div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-gray-900">
          Không thể tải bài viết
        </h1>

        {/* Description */}
        <p className="text-gray-600">
          Bài viết này không tồn tại hoặc đã bị xóa. Vui lòng quay trở về hoặc thử bài viết khác.
        </p>

        {/* Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-700">
              Chi tiết lỗi
            </summary>
            <pre className="mt-2 p-3 text-xs bg-red-50 rounded border border-red-200 overflow-auto text-red-700">
              {error.message}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={reset}
            className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Tải lại trang
          </button>

          <Link
            href="/blog"
            className="rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Quay lại Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
