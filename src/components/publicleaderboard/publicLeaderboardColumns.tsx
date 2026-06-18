import React, { type ReactNode } from 'react';
import { Crown, Link2, Medal, Phone, Trophy, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { PublicContestLeaderboardRow } from '@/types/public-leaderboard';

type PublicLeaderboardRenderContext = {
  topReferrals: number;
};

export type PublicLeaderboardColumn = {
  id: string;
  header: string;
  className?: string;
  mobileHidden?: boolean;
  render: (
    participant: PublicContestLeaderboardRow,
    context: PublicLeaderboardRenderContext,
  ) => ReactNode;
};

export const formatNumber = (value?: number | null) => {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
};

export const getProgressWidth = (
  referral_count: number,
  top_referrals: number,
) => {
  if (!top_referrals || top_referrals <= 0) return 0;

  return Math.max(
    0,
    Math.min(100, Math.round((referral_count / top_referrals) * 100)),
  );
};

export const getProgressBarClass = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
  if (rank === 2) return 'bg-gradient-to-r from-zinc-300 to-zinc-400';
  if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500';
  if (rank === 4) return 'bg-gradient-to-r from-[#b700ff] to-[#00d0ff]';
  if (rank === 5) return 'bg-gradient-to-r from-[#00ff9d] to-[#00d0ff]';

  return 'bg-white/30';
};

const getRankBadgeClass = (rank: number) => {
  if (rank === 1) {
    return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-[0_0_18px_rgba(250,204,21,0.35)]';
  }

  if (rank === 2) {
    return 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-black shadow-[0_0_18px_rgba(226,232,240,0.25)]';
  }

  if (rank === 3) {
    return 'bg-gradient-to-br from-orange-400 to-orange-600 text-black shadow-[0_0_18px_rgba(251,146,60,0.25)]';
  }

  return 'border border-white/10 bg-[#1c1c26] text-gray-300';
};

export const getDisplayName = (row: PublicContestLeaderboardRow) => {
  return row.participant.display_name?.trim() || 'Anonymous participant';
};

export const getMaskedPhoneNumber = (row: PublicContestLeaderboardRow) => {
  return row.participant.masked_phone_number || 'Phone hidden';
};

export const publicLeaderboardColumns: PublicLeaderboardColumn[] = [
  {
    id: 'rank',
    header: 'Rank',
    className: 'w-[64px] sm:w-[76px]',
    render: (participant) => (
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black sm:h-9 sm:w-9',
          getRankBadgeClass(participant.rank),
        )}
      >
        {participant.rank === 1 ? (
          <Crown className="size-4" />
        ) : (
          participant.rank
        )}
      </div>
    ),
  },
  {
    id: 'participant',
    header: 'Participant',
    className: 'min-w-0 w-full',
    render: (participant) => (
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:flex">
          <UserRound className="size-5 text-white/70" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-sm font-semibold text-white">
              {getDisplayName(participant)}
            </p>

            {participant.rank <= 3 ? (
              <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-1.5 text-[10px] text-white/70">
                {participant.rank === 1 ? (
                  <Trophy className="size-3 text-yellow-400" />
                ) : (
                  <Medal
                    className={cn(
                      'size-3',
                      participant.rank === 2
                        ? 'text-zinc-300'
                        : 'text-orange-400',
                    )}
                  />
                )}
              </span>
            ) : null}
          </div>

          <p className="mt-1 flex min-w-0 items-center gap-1 truncate text-xs text-gray-500">
            <Phone className="size-3 shrink-0" />
            <span className="truncate">
              {getMaskedPhoneNumber(participant)}
            </span>
          </p>

          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 md:hidden">
            <span className="rounded-full border border-[#00d0ff]/20 bg-[#00d0ff]/10 px-2 py-0.5 text-[11px] font-semibold text-[#00d0ff]">
              {formatNumber(participant.referral_count)} refs
            </span>

            <span className="min-w-0 truncate rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-400">
              code: {participant.participant.referral_code || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'referrals',
    header: 'Referrals',
    className: 'w-[150px] text-right',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-right">
        <div className="text-lg font-black text-white">
          {formatNumber(participant.referral_count)}
        </div>

        <div className="mt-1 text-[11px] text-gray-500">validated refs</div>
      </div>
    ),
  },
  {
    id: 'referral_code',
    header: 'Referral Code',
    className: 'w-[180px]',
    mobileHidden: true,
    render: (participant) => (
      <div className="inline-flex max-w-40 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white">
        <Link2 className="size-3.5 shrink-0 text-[#00d0ff]" />

        <span className="truncate font-semibold">
          {participant.participant.referral_code || 'N/A'}
        </span>
      </div>
    ),
  },
  {
    id: 'progress',
    header: 'Progress',
    className: 'min-w-[210px]',
    mobileHidden: true,
    render: (participant, context) => {
      const width = getProgressWidth(
        participant.referral_count,
        context.topReferrals,
      );

      const referralsBehind = Math.max(
        context.topReferrals - participant.referral_count,
        0,
      );

      return (
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-black/30">
            <div
              className={cn(
                'h-2 rounded-full',
                getProgressBarClass(participant.rank),
              )}
              style={{ width: `${width}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>{width}% of leader</span>

            {participant.rank === 1 ? (
              <span className="text-yellow-400">Leading</span>
            ) : (
              <span>{formatNumber(referralsBehind)} behind #1</span>
            )}
          </div>
        </div>
      );
    },
  },
];
