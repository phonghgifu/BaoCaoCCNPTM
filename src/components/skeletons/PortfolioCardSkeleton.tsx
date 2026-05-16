/**
 * PortfolioCardSkeleton Component
 * 
 * Skeleton loading state for Portfolio/Project cards
 */

export function PortfolioCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-full" />
          <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-2/3" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-full" />
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-5/6" />
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 bg-gray-100 rounded-full animate-pulse"
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function PortfolioCardSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PortfolioCardSkeleton key={i} />
      ))}
    </div>
  )
}
