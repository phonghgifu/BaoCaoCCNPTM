'use client'

import React from 'react'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

/**
 * Enhanced Button Component with Loading State
 * 
 * Shows spinner and disabled state during async operations
 * 
 * Usage:
 * <LoadingButton isLoading={isSubmitting} loadingText="Đang gửi...">
 *   Gửi bài viết
 * </LoadingButton>
 */
export function LoadingButton({
  isLoading = false,
  loadingText = 'Đang xử lý...',
  children,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg text-white',
  }

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
        font-semibold transition-all duration-200
        ${variants[variant]}
        disabled:opacity-70 disabled:cursor-not-allowed
        hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
