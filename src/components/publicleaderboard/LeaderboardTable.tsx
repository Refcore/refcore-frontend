'use client';

import React from 'react';
import { Activity, Trophy } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { PublicLeaderboardPayload } from '@/types/public-leaderboard';
import {
  formatNumber,
  getProgressBarClass,
  getProgressWidth,
  publicLeaderboardColumns,
} from './publicLeaderboardColumns';

type LeaderboardTableProps = {
  leaderboard: PublicLeaderboardPayload;
};

export default function LeaderboardTable({
  leaderboard,
}: LeaderboardTableProps) {
  const participants = [
    ...(leaderboard.contest_leaderboard?.leaderboard ?? []),
  ].sort((a, b) => a.rank - b.rank);

  const topReferrals = participants[0]?.referral_count ?? 0;

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
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

          {participants.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Trophy className="size-6 text-white/60" />
              </div>

              <h3 className="text-lg font-bold text-white">No rankings yet</h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                Once participants start getting validated referrals, the top
                rankings will appear here.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-hidden md:custom-scrollbar md:overflow-x-auto">
              <table className="w-full table-fixed md:min-w-190 md:table-auto">
                <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#13131a]/80 backdrop-blur-md">
                  <tr>
                    {publicLeaderboardColumns.map((column) => (
                      <th
                        key={column.id}
                        className={cn(
                          'px-3 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 sm:px-6 sm:text-[11px]',
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
                      participant.referral_count,
                      topReferrals,
                    );

                    const referralsBehind = Math.max(
                      topReferrals - participant.referral_count,
                      0,
                    );

                    return (
                      <React.Fragment key={participant.id}>
                        <tr
                          className={cn(
                            'transition-all duration-200 hover:bg-white/4',
                            participant.rank <= 5
                              ? 'bg-white/2'
                              : 'bg-transparent',
                          )}
                        >
                          {publicLeaderboardColumns.map((column) => (
                            <td
                              key={column.id}
                              className={cn(
                                'px-3 pb-2 border-b-0 pt-4 align-middle sm:px-6 md:py-4',
                                column.mobileHidden && 'hidden md:table-cell',
                              )}
                            >
                              {column.render(participant, {
                                topReferrals,
                              })}
                            </td>
                          ))}
                        </tr>

                        <tr className="md:hidden">
                          <td
                            colSpan={publicLeaderboardColumns.length}
                            className="pb-4"
                          >
                            <div className="border border-t-0 border-white/6 p-3">
                              <div className="mb-1.5 flex items-center justify-between text-[10px] text-gray-500">
                                <span>{mobileWidth}% of leader</span>

                                {participant.rank === 1 ? (
                                  <span className="text-yellow-400">
                                    Leading
                                  </span>
                                ) : (
                                  <span>
                                    {formatNumber(referralsBehind)} behind
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
          )}

          <div className="border-t border-white/5 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Rankings are based on validated referral totals.</p>
              <p>{participants.length} participants listed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
