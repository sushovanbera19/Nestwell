import Skeleton from "./Skeleton";

export default function ComplaintSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-2 w-24 rounded-full"
          />
        ))}
      </div>

      {/* Complaint Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft p-5 shadow-card"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Skeleton className="h-2 w-2 rounded-full mt-2" />

                <div>
                  <Skeleton className="h-2 w-28 mb-3" />
                  <Skeleton className="h-2 w-48" />
                </div>
              </div>

              <Skeleton className="h-7 w-20 rounded-full" />
            </div>

            {/* Footer */}
            <div className="mt-5 border-t border-dashed border-ink/10 pt-4">
              <Skeleton className="h-4 w-48 mb-3" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}