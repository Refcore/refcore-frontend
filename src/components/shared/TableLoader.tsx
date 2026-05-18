import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TableLoaderProps = {
  rowCount?: number;
  columnCount?: number;
  showHeader?: boolean;
  className?: string;
};

const TableLoader = ({
  rowCount = 6,
  columnCount = 5,
  showHeader = true,
  className,
}: TableLoaderProps) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl',
        className,
      )}
    >
      {showHeader && (
        <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 rounded-md bg-white/10" />
            <Skeleton className="h-4 w-56 rounded-md bg-white/10" />
          </div>

          <Skeleton className="h-10 w-40 rounded-lg bg-white/10" />
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full">
          <thead className="border-b border-white/5 bg-[#13131a]/80">
            <tr>
              {Array.from({ length: columnCount }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-4 text-left sm:px-6"
                >
                  <Skeleton className="h-3 w-20 rounded-md bg-white/10" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-4 py-4 align-middle sm:px-6"
                  >
                    {columnIndex === 0 ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 rounded-md bg-white/10" />
                          <Skeleton className="h-3 w-24 rounded-md bg-white/10" />
                        </div>
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-24 rounded-md bg-white/10" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/5 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-3 w-56 rounded-md bg-white/10" />
          <Skeleton className="h-3 w-32 rounded-md bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default TableLoader;