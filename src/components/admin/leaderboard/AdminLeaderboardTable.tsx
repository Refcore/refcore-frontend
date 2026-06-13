'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getProgressBarClass,
  getProgressWidth,
  leaderboardColumns,
} from './adminLeaderboardColumns';
import AppPagination from '@/components/shared/AppPagination';
import type {
  LeaderboardItem,
  LeaderboardSummary,
} from '@/types/leaderboard.type';

type AdminLeaderboardTableProps = {
  leaderboard: LeaderboardItem[];
  leaderboardInfo?: LeaderboardSummary;
  currentPage: number;
  totalPages: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  isLoading?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  contestId?: string | null;
};

const AdminLeaderboardTable = ({
  leaderboard,
  leaderboardInfo,
  currentPage,
  totalPages,
  canPreviousPage,
  canNextPage,
  isLoading = false,
  onPreviousPage,
  onNextPage,
  onPageChange,
  showPagination,
  contestId,
}: AdminLeaderboardTableProps) => {
  const participants = [...leaderboard].sort((a, b) => a.rank - b.rank);

  const topReferrals = leaderboardInfo?.current_leader_referrals ?? 0;

  return (
    <section className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Full Rankings</h2>

          <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--neon-green)" />
            {isLoading ? 'Loading rankings...' : 'Updated just now'}
          </p>
          {!showPagination ? (
            <p className="mt-2 text-xs text-gray-500">
              Pagination is only available when the filter range is set to All.
              Current range filters return a fixed result set.
            </p>
          ) : null}
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
          <Activity className="size-4 text-(--neon-green)" />

          <span className="text-gray-400">Showing</span>

          <span className="font-bold text-white">
            {participants.length} participants
          </span>
        </div>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
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
            {isLoading &&
              Array.from({ length: 5 }, (_, index) => (
                <tr key={index}>
                  <td
                    colSpan={leaderboardColumns.length}
                    className="px-4 py-4 sm:px-6"
                  >
                    <div className="h-12 animate-pulse rounded-xl bg-white/5" />
                  </td>
                </tr>
              ))}

            {!isLoading && participants.length === 0 && (
              <tr>
                <td
                  colSpan={leaderboardColumns.length}
                  className="px-4 py-12 text-center text-sm text-gray-400 sm:px-6"
                >
                  No leaderboard records found.
                </td>
              </tr>
            )}

            {!isLoading &&
              participants.map((participant) => {
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
                            'px-2 pb-2 pt-4 align-middle sm:px-6 md:px-4 md:py-4',
                            column.mobileHidden && 'hidden md:table-cell',
                          )}
                        >
                          {column.render(participant, { topReferrals, contestId: contestId ?? undefined })}
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
                                {Math.max(
                                  topReferrals - participant.referrals,
                                  0,
                                )}{' '}
                                behind
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
      {showPagination && (
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          onPageChange={onPageChange}
        />
      )}{' '}
    </section>
  );
};

export default AdminLeaderboardTable;
