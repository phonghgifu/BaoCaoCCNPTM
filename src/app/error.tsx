'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error Boundary Component
 * 
 * Catches and displays errors gracefully when data fails to load
 * Shows user-friendly message with recovery options
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="text-7xl animate-bounce">😞</div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-black text-gray-900">
          Oops! Đã có lỗi xảy ra
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed">
          Chúng tôi rất xin lỗi. Có vấn đề khi tải trang. Vui lòng thử lại hoặc quay trở về trang chủ.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-left">
            <p className="text-sm font-semibold text-red-700 mb-2">🔧 Chi tiết lỗi (Development):</p>
            <p className="text-xs text-red-600 font-mono break-words whitespace-pre-wrap">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 font-bold text-white shadow-lg shadow-red-200 transition hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 font-bold text-gray-700 shadow-lg transition hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 0H9m6 0h6" />
            </svg>
            Trang Chủ
          </Link>
        </div>

        {/* Support Message */}
        <p className="text-sm text-gray-500 pt-4">
          Nếu vấn đề vẫn tiếp tục, vui lòng{' '}
          <a href="mailto:support@example.com" className="font-semibold text-red-600 hover:underline">
            liên hệ với chúng tôi
          </a>
        </p>
      </div>
    </div>
  )
}
