/**
 * BlogCardSkeleton Component
 * 
 * Displays a skeleton loading state that matches the BlogCard structure.
 * Uses Tailwind CSS pulse animation for a professional loading effect.
 */

export function BlogCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Category Badge Skeleton */}
        <div className="inline-flex w-24 h-6 bg-gray-200 rounded-full animate-pulse" />

        {/* Title Skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-full" />
          <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
        </div>

        {/* Description Skeleton - 3 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-full" />
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-full" />
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-2/3" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer with author and stats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-2 bg-gray-100 rounded w-16 animate-pulse" />
            </div>
          </div>

          {/* Stats */}
          <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/**
 * BlogCardSkeletonGrid Component
 * 
 * Displays multiple skeleton cards in a grid layout.
 * Useful for loading states while fetching blog posts.
 */
export function BlogCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}
