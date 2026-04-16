import React from 'react';
import type { RecentExportItem } from '@/types/export.type';
import { exportTableColumns } from './exportTableColumns';

type RecentExportsTableProps = {
  data: RecentExportItem[];
};

const RecentExportsTable = ({ data }: RecentExportsTableProps) => {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Exports</h2>
          <p className="text-sm text-muted-foreground">
            Review recent generated files and download completed exports.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-215">
            <thead className="bg-black/20">
              <tr className="border-b border-white/10">
                {exportTableColumns.map((column) => (
                  <th
                    key={column.id}
                    className={[
                      'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400',
                      column.className ?? '',
                      column.mobileHidden ? 'hidden md:table-cell' : '',
                    ].join(' ')}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/10 last:border-b-0 transition hover:bg-white/3"
                >
                  {exportTableColumns.map((column) => (
                    <td
                      key={column.id}
                      className={[
                        'px-4 py-4 align-middle',
                        column.className ?? '',
                        column.mobileHidden ? 'hidden md:table-cell' : '',
                      ].join(' ')}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RecentExportsTable;
