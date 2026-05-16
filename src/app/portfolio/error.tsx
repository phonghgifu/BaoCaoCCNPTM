'use client'

import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error Boundary for Portfolio/Projects
 * 
 * Handles errors when loading individual project details
 */
export default function PortfolioError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 px-4 py-12">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="text-6xl">🎯</div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-gray-900">
          Dự án không tìm thấy
        </h1>

        {/* Description */}
        <p className="text-gray-600">
          Dự án này không tồn tại hoặc đã bị xóa. Hãy xem các dự án khác hoặc quay trở về.
        </p>

        {/* Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-amber-600 hover:text-amber-700">
              Chi tiết lỗi
            </summary>
            <pre className="mt-2 p-3 text-xs bg-amber-50 rounded border border-amber-200 overflow-auto text-amber-700">
              {error.message}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={reset}
            className="rounded-full bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition"
          >
            Tải lại trang
          </button>

          <Link
            href="/portfolio"
            className="rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Xem Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
