export function CardSkeleton() {
  return (
    <div className="w-[150px] sm:w-[180px] lg:w-[200px] shrink-0">
      <div className="aspect-[2/3] shimmer-bg rounded-lg sm:rounded-xl" />
      <div className="mt-2 sm:mt-2.5 h-3 shimmer-bg rounded w-3/4" />
      <div className="mt-1 sm:mt-1.5 h-2.5 shimmer-bg rounded w-1/2" />
    </div>
  );
}

export function RowSkeleton({ count = 6 }) {
  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-5 sm:h-6 w-36 sm:w-48 shimmer-bg rounded" />
        <div className="h-4 w-14 sm:w-16 shimmer-bg rounded" />
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] shimmer-bg rounded-lg sm:rounded-xl" />
          <div className="mt-2 sm:mt-2.5 h-3 sm:h-3.5 shimmer-bg rounded w-3/4" />
          <div className="mt-1 sm:mt-1.5 h-2.5 sm:h-3 shimmer-bg rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-10 sm:space-y-14 pt-6 sm:pt-8">
      {[1, 2, 3, 4].map((i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div>
      {/* Banner skeleton */}
      <div className="h-[220px] sm:h-[320px] md:h-[380px] shimmer-bg" />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 -mt-20 sm:-mt-32">
        <div className="flex flex-col items-center sm:items-start md:flex-row gap-4 sm:gap-8">
          {/* Cover skeleton */}
          <div className="w-[140px] sm:w-[180px] md:w-[220px] aspect-[2/3] shimmer-bg rounded-xl sm:rounded-2xl shrink-0" />
          {/* Info skeleton */}
          <div className="flex-1 w-full pt-2 sm:pt-4 space-y-3 sm:space-y-4">
            <div className="h-8 sm:h-10 shimmer-bg rounded w-2/3 mx-auto sm:mx-0" />
            <div className="h-4 sm:h-5 shimmer-bg rounded w-1/3 mx-auto sm:mx-0" />
            <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
              <div className="h-8 w-20 shimmer-bg rounded-lg" />
              <div className="h-8 w-24 shimmer-bg rounded-lg" />
            </div>
            <div className="flex gap-2 justify-center sm:justify-start pt-1 sm:pt-2">
              <div className="h-6 w-16 shimmer-bg rounded-full" />
              <div className="h-6 w-20 shimmer-bg rounded-full" />
              <div className="h-6 w-14 shimmer-bg rounded-full" />
            </div>
          </div>
        </div>
        {/* Tabs skeleton */}
        <div className="mt-8 sm:mt-10 flex gap-4 sm:gap-6 border-b border-line pb-3 overflow-x-auto">
          {[70, 40, 55, 80].map((w, i) => (
            <div key={i} className="h-4 shimmer-bg rounded shrink-0" style={{ width: w }} />
          ))}
        </div>
        <div className="mt-5 sm:mt-6 space-y-3 pb-12">
          <div className="h-4 shimmer-bg rounded w-full" />
          <div className="h-4 shimmer-bg rounded w-5/6" />
          <div className="h-4 shimmer-bg rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-8 sm:py-12">
      <div className="w-7 sm:w-8 h-7 sm:h-8 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
    </div>
  );
}
