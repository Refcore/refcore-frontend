import React from 'react';
import { Activity, Crown, Link2, Phone, Trophy, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  PublicContestLeaderboardRow,
  PublicLeaderboardPayload,
} from '@/types/public-leaderboard';

type LeaderboardTableProps = {
  leaderboard: PublicLeaderboardPayload;
};

const formatNumber = (value?: number | null) => {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
};

const getProgressWidth = (referral_count: number, top_referrals: number) => {
  if (!top_referrals) return 0;

  return Math.max(
    4,
    Math.min(100, Math.round((referral_count / top_referrals) * 100)),
  );
};

const getProgressBarClass = (rank: number) => {
  if (rank === 1) return 'from-yellow-400 to-yellow-600';
  if (rank === 2) return 'from-slate-200 to-slate-500';
  if (rank === 3) return 'from-orange-400 to-orange-600';

  return 'from-[#00ff9d] to-[#00d0ff]';
};

const getRankBadgeClass = (rank: number) => {
  if (rank === 1) {
    return 'bg-yellow-400 text-black shadow-[0_0_18px_rgba(250,204,21,0.35)]';
  }

  if (rank === 2) {
    return 'bg-slate-200 text-black shadow-[0_0_18px_rgba(226,232,240,0.25)]';
  }

  if (rank === 3) {
    return 'bg-orange-400 text-black shadow-[0_0_18px_rgba(251,146,60,0.25)]';
  }

  if (rank <= 5) {
    return 'border border-white/10 bg-white/10 text-white';
  }

  return 'border border-white/10 bg-black/20 text-gray-300';
};

const getDisplayName = (row: PublicContestLeaderboardRow) => {
  return row.participant.display_name?.trim() || 'Anonymous participant';
};

const getMaskedPhoneNumber = (row: PublicContestLeaderboardRow) => {
  return row.participant.masked_phone_number || 'Phone hidden';
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Full Rankings</h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
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

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[rgba(28,28,38,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          {participants.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Trophy className="size-6 text-white/60" />
              </div>

              <h3 className="text-lg font-bold text-white">No rankings yet</h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                Once participants start getting validated referrals, the top 20
                rankings will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full">
                <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#13131a]/80 backdrop-blur-md">
                  <tr>
                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:px-6">
                      Rank
                    </th>

                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:px-6">
                      Participant
                    </th>

                    <th className="px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:px-6">
                      Referrals
                    </th>

                    <th className="hidden px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 md:table-cell sm:px-6">
                      Referral Code
                    </th>

                    <th className="hidden px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 md:table-cell sm:px-6">
                      Progress
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {participants.map((participant) => {
                    const highlighted = participant.rank <= 5;
                    const progressWidth = getProgressWidth(
                      participant.referral_count,
                      topReferrals,
                    );

                    return (
                      <React.Fragment key={participant.id}>
                        <tr
                          className={cn(
                            'group transition-all duration-200 hover:bg-white/4',
                            highlighted ? 'bg-white/2' : 'bg-transparent',
                          )}
                        >
                          <td className="px-4 py-4 align-middle sm:px-6">
                            <div
                              className={cn(
                                'flex size-9 items-center justify-center rounded-full text-sm font-black',
                                getRankBadgeClass(participant.rank),
                              )}
                            >
                              {participant.rank === 1 ? (
                                <Crown className="size-4" />
                              ) : (
                                participant.rank
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 align-middle sm:px-6">
                            <div className="flex min-w-52 items-center gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                <UserRound className="size-5 text-white/70" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {getDisplayName(participant)}
                                </p>

                                <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                                  <Phone className="size-3 shrink-0" />
                                  <span className="truncate">
                                    {getMaskedPhoneNumber(participant)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right align-middle sm:px-6">
                            <p className="text-lg font-black text-white">
                              {formatNumber(participant.referral_count)}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              validated refs
                            </p>
                          </td>

                          <td className="hidden px-4 py-4 align-middle md:table-cell sm:px-6">
                            <div className="inline-flex max-w-40 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white">
                              <Link2 className="size-3.5 shrink-0 text-(--neon-blue)" />
                              <span className="truncate font-semibold">
                                {participant.participant.referral_code}
                              </span>
                            </div>
                          </td>

                          <td className="hidden px-4 py-4 align-middle md:table-cell sm:px-6">
                            <div className="min-w-40">
                              <div className="mb-1.5 flex items-center justify-between text-[10px] text-gray-500">
                                <span>{progressWidth}%</span>

                                {participant.rank === 1 ? (
                                  <span className="text-yellow-400">
                                    Leading
                                  </span>
                                ) : (
                                  <span>
                                    {formatNumber(
                                      topReferrals - participant.referral_count,
                                    )}{' '}
                                    behind
                                  </span>
                                )}
                              </div>

                              <div className="h-1.5 w-full rounded-full bg-black/30">
                                <div
                                  className={cn(
                                    'h-1.5 rounded-full bg-linear-to-r',
                                    getProgressBarClass(participant.rank),
                                  )}
                                  style={{ width: `${progressWidth}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>

                        <tr className="md:hidden">
                          <td colSpan={5} className="px-4 pb-4">
                            <div className="rounded-2xl border border-white/6 bg-black/15 p-3">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <div className="min-w-0 text-xs text-gray-400">
                                  Code:{' '}
                                  <span className="font-semibold text-white">
                                    {participant.participant.referral_code}
                                  </span>
                                </div>

                                <span className="shrink-0 text-[10px] text-gray-500">
                                  {progressWidth}%
                                </span>
                              </div>

                              <div className="mb-1.5 flex items-center justify-between text-[10px] text-gray-500">
                                {participant.rank === 1 ? (
                                  <span className="text-yellow-400">
                                    Leading
                                  </span>
                                ) : (
                                  <span>
                                    {formatNumber(
                                      topReferrals - participant.referral_count,
                                    )}{' '}
                                    behind
                                  </span>
                                )}
                              </div>

                              <div className="h-1.5 w-full rounded-full bg-black/30">
                                <div
                                  className={cn(
                                    'h-1.5 rounded-full bg-linear-to-r',
                                    getProgressBarClass(participant.rank),
                                  )}
                                  style={{ width: `${progressWidth}%` }}
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
              <p>
                Rankings are based on validated referral totals for this
                contest.
              </p>

              <p>{participants.length} participants listed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
