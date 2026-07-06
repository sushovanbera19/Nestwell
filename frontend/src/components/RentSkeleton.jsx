import Skeleton from "./Skeleton";
import StatCardSkeleton from "./StatCardSkeleton";

export default function RentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-xs rounded-lg" />

        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-20 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-ink/10">
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="px-5 py-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(6)].map((_, row) => (
                <tr key={row} className="border-b border-ink/5">
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-14" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>

                  <td className="px-5 py-4">
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}