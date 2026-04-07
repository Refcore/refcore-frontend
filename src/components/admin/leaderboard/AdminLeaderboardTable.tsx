import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WhatsAppTVLeaderboard } from '@/demo/leaderboarddata';
import { getProgressBarClass, getProgressWidth, leaderboardColumns } from './adminLeaderboardColumns';

type LeaderboardTableProps = {
  leaderboard: WhatsAppTVLeaderboard;
};

const LeaderboardTable = ({ leaderboard }: LeaderboardTableProps) => {
  const participants = [...leaderboard.participants].sort(
    (a, b) => a.rank - b.rank,
  );

  const topReferrals = participants[0]?.referrals ?? 0;

  return (
    <section className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Full Rankings</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--neon-green)" />
            Updated just now
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
          <Activity className="size-4 text-(--neon-green)" />
          <span className="text-gray-400">Showing</span>
          <span className="font-bold text-white">
            Top {participants.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full">
          <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#13131a]/80 backdrop-blur-md">
            <tr>
              {leaderboardColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:px-6',
                    column.className,
                    column.mobileHidden && 'hidden md:table-cell',
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {participants.map((participant) => {
              const mobileWidth = getProgressWidth(
                participant.referrals,
                topReferrals,
              );

              return (
                <React.Fragment key={participant.id}>
                  <tr className="transition-all duration-200 hover:bg-white/4">
                    {leaderboardColumns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'px-2 pb-2 pt-4 align-middle md:px-4 md:py-4 sm:px-6',
                          column.mobileHidden && 'hidden md:table-cell',
                        )}
                      >
                        {column.render(participant, { topReferrals })}
                      </td>
                    ))}
                  </tr>

                  <tr className="md:hidden">
                    <td
                      colSpan={leaderboardColumns.length}
                      className="px-2 pb-4"
                    >
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-[10px] text-gray-500">
                          <span>{mobileWidth}%</span>

                          {participant.rank === 1 ? (
                            <span className="text-yellow-400">Leading</span>
                          ) : (
                            <span>
                              {topReferrals - participant.referrals} behind
                            </span>
                          )}
                        </div>

                        <div className="h-1.5 w-full rounded-full bg-black/30">
                          <div
                            className={cn(
                              'h-1.5 rounded-full',
                              getProgressBarClass(participant.rank),
                            )}
                            style={{ width: `${mobileWidth}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/5 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Rankings are based on validated referral totals.</p>
          <p>{participants.length} participants listed</p>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardTable;