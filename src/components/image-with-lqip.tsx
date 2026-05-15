'use client'

import { useState } from 'react'

interface ImageWithLQIPProps {
  src: string
  alt: string
  className?: string
  onLoadComplete?: () => void
}

export function ImageWithLQIP({ src, alt, className = '', onLoadComplete }: ImageWithLQIPProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoadComplete?.()
  }

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleLoad}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'animate-blur-to-sharp' : 'opacity-50 blur-sm'
      } ${className}`}
      loading="lazy"
    />
  )
}
