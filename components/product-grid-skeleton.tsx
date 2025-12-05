export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-lg bg-gray-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-1/4 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

