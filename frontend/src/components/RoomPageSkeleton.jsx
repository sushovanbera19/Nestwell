import Skeleton from "./Skeleton";

export default function RoomPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-xs rounded-lg" />

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            <Skeleton className="h-4 w-28 mb-3 rounded" />
            <Skeleton className="h-4 w-20 mb-6 rounded" />

            <div className="flex justify-between">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}