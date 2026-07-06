import Skeleton from "./Skeleton";

export default function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft p-5 shadow-card">
      <Skeleton className="h-4 w-24 mb-5" />

      <Skeleton className="h-10 w-32 mb-4" />

      <Skeleton className="h-3 w-20" />
    </div>
  );
}