export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-card ${className}`}>
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-24" />
      <Skeleton className="mt-2 h-6 w-32" />
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-3/4" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      <div className="flex gap-4 border-b border-gray-100 px-5 py-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-gray-50 px-5 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={`h-3 flex-1 ${c === 0 ? 'max-w-[8rem]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Skeleton