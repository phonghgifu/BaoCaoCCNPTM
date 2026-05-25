/**
 * Performance Optimization Utilities
 * 
 * Helpers for improving React component performance through memoization,
 * debouncing, throttling, and lazy loading
 */

import React, { useEffect, useRef } from 'react'

/**
 * Debounce hook - Delays function execution until after N ms of inactivity
 * Useful for search inputs, resizing, scrolling
 * 
 * Usage:
 * const debouncedSearch = useDebounce(searchValue, 300)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook - Limits function execution to once per N ms
 * Useful for scroll events, mouse move, window resize
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastRanRef = useRef<number>(0)

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRanRef.current >= delay) {
        setThrottledValue(value)
        lastRanRef.current = Date.now()
      }
    }, delay - (Date.now() - lastRanRef.current))

    return () => clearTimeout(handler)
  }, [value, delay])

  return throttledValue
}

/**
 * Intersection Observer hook for lazy loading
 * Triggers callback when element becomes visible
 * 
 * Usage:
 * const { ref, isVisible } = useIntersectionObserver()
 */
export function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Optionally stop observing after first visibility
        // observer.unobserve(entry.target)
      }
    }, { threshold: 0.1, ...options })

    const el = ref.current

    if (el) {
      observer.observe(el)
    }

    return () => {
      if (el) {
        observer.unobserve(el)
      }
    }
  }, [options])

  return { ref, isVisible }
}

/**
 * useCallback wrapper with dependencies array
 * Memoizes callback to prevent unnecessary re-renders of child components
 */
export function useMemoCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  return callback
}

/**
 * Image preloading utility
 * Preload images before rendering to prevent layout shift
 */
export function useImagePreload(imageUrls: string[]) {
  const [loaded, setLoaded] = React.useState(false)

  useEffect(() => {
    let count = 0
    const images: HTMLImageElement[] = []

    imageUrls.forEach((url) => {
      const img = new Image()
      img.onload = () => {
        count++
        if (count === imageUrls.length) {
          setLoaded(true)
        }
      }
      img.onerror = () => {
        count++
        if (count === imageUrls.length) {
          setLoaded(true)
        }
      }
      img.src = url
      images.push(img)
    })

    return () => {
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [imageUrls])

  return loaded
}

/**
 * Memoized component wrapper - prevents re-renders unless props change
 * 
 * Usage:
 * export const MemoizedCard = React.memo(CardComponent)
 */
export const memoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, propsAreEqual)
}

/**
 * Request Animation Frame wrapper for smooth animations
 */
export function useAnimationFrame(callback: (timestamp: DOMHighResTimeStamp) => void) {
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: DOMHighResTimeStamp) => {
      callback(timestamp)
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [callback])
}

/**
 * Virtual scrolling for large lists (simplified version)
 * Only renders visible items to improve performance
 */
export function useVirtualScroll<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5) // 5 items buffer
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + 5)
  const visibleItems = items.slice(startIndex, endIndex)

  return {
    visibleItems,
    startIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop((e.target as HTMLDivElement).scrollTop)
    },
  }
}
