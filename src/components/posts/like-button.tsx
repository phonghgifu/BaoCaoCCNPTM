'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { reportError } from '@/lib/telemetry'

interface LikeButtonProps {
  postId: string
  userId: string | null
  initialLikeCount: number
}

export function LikeButton({ postId, userId, initialLikeCount }: LikeButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [optimisticState, setOptimisticState] = useState<{ isLiked: boolean; count: number } | null>(null)

  // Kiểm tra user đã like bài viết này chưa
  useEffect(() => {
    if (!userId) return

    const checkLike = async () => {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

      setIsLiked(!!data)
    }

    checkLike()
  }, [postId, userId, supabase])

  const handleLike = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    // Optimistic UI Update - Update state immediately
    const previousLiked = isLiked
    const previousCount = likeCount
    const newIsLiked = !isLiked
    const newCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1)

    setOptimisticState({ isLiked: newIsLiked, count: newCount })
    setIsLiked(newIsLiked)
    setLikeCount(newCount)
    setLoading(true)

    try {
      if (previousLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)

        if (error) throw error
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userId,
          })

        if (error) throw error
      }

      // Success - clear optimistic state
      setOptimisticState(null)
      router.refresh()
    } catch (error) {
      // Rollback on error
      console.error('Like action failed:', error)
      setIsLiked(previousLiked)
      setLikeCount(previousCount)
      setOptimisticState(null)

      reportError(error, { source: 'LikeButton.handleLike', postId })

      // Show error toast if available
      if (typeof window !== 'undefined') {
        const toastWindow = window as Window & {
          showToast?: (message: string, type?: 'error' | 'success' | 'info') => void
        }

        toastWindow.showToast?.('❌ Không thể cập nhật like. Vui lòng thử lại.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  // Use optimistic state if available
  const displayIsLiked = optimisticState ? optimisticState.isLiked : isLiked
  const displayCount = optimisticState ? optimisticState.count : likeCount

  return (
    <button
      onClick={handleLike}
      disabled={loading || !userId}
      className={`like-button flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
        displayIsLiked
          ? 'bg-red-100 text-red-600 hover:bg-red-200 shadow-sm hover:shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm hover:shadow-md'
      } disabled:opacity-50 disabled:cursor-not-allowed ${optimisticState ? 'scale-105' : 'scale-100'}`}
      title={!userId ? 'Đăng nhập để like' : displayIsLiked ? 'Bỏ thích bài viết' : 'Thích bài viết'}
      aria-pressed={displayIsLiked}
      aria-label={displayIsLiked ? 'Bỏ thích bài viết' : 'Thích bài viết'}
    >
      <span className={`text-xl transition-transform ${optimisticState ? 'animate-bounce' : ''}`}>
        {displayIsLiked ? '❤️' : '🤍'}
      </span>
      <span aria-live="polite" aria-atomic="true">
        {displayCount}
      </span>
    </button>
  )
}
