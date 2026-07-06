import Skeleton from "./Skeleton";

export default function TableSkeleton({
  rows = 6,
  cols = 5,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft shadow-card">
      <div className="p-5 space-y-5">
        {[...Array(rows)].map((_, row) => (
          <div
            key={row}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            }}
          >
            {[...Array(cols)].map((_, col) => (
              <Skeleton
                key={col}
                className="h-4"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}