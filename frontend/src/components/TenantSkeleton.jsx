import Skeleton from "./Skeleton";

export default function TenantSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white dark:border-paper/10 dark:bg-ink-soft shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-ink/10">
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-5 py-4">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(6)].map((_, row) => (
                <tr key={row} className="border-b border-ink/5">
                  {/* Tenant */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </td>

                  {/* Room */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-7 w-20 rounded-full" />
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