import StatCardSkeleton from "./StatCardSkeleton";
import Skeleton from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft p-5 shadow-card lg:col-span-2">
          <Skeleton className="h-6 w-40 mb-6" />

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {[...Array(18)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-16 rounded-xl"
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft p-5 shadow-card">
          <Skeleton className="h-6 w-40 mb-5" />

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="mb-5"
            >
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft p-5 shadow-card">
        <Skeleton className="h-6 w-40 mb-5" />

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 mb-5"
          >
            {[...Array(5)].map((_, j) => (
              <Skeleton
                key={j}
                className="h-4"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}