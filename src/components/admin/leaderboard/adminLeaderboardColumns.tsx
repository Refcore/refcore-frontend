import React, { type ReactNode } from 'react';
import { ArrowUpRight, Medal, Trophy, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardParticipant } from '@/demo/leaderboarddata';
import LeaderboardActions from './AdminLeaderboardActions';

type LeaderboardRenderContext = {
  topReferrals: number;
};

export type LeaderboardColumn = {
  id: string;
  header: string;
  className?: string;
  mobileHidden?: boolean;
  render: (
    participant: LeaderboardParticipant,
    context: LeaderboardRenderContext,
  ) => ReactNode;
};

const maskPhone = (phone?: string) => {
  if (!phone) return 'No phone';

  const digits = phone.replace(/\s+/g, '');

  if (digits.length < 6) return phone;

  return `${digits.slice(0, 4)}****${digits.slice(-4)}`;
};

export const getProgressWidth = (referrals: number, topReferrals: number) => {
  if (!topReferrals || topReferrals <= 0) return 0;

  return Math.max(
    0,
    Math.min(100, Math.round((referrals / topReferrals) * 100)),
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
    return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black';
  }

  if (rank === 2) {
    return 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-black';
  }

  if (rank === 3) {
    return 'bg-gradient-to-br from-orange-400 to-orange-600 text-black';
  }

  return 'border border-white/10 bg-[#1c1c26] text-gray-300';
};

export const leaderboardColumns: LeaderboardColumn[] = [
  {
    id: 'rank',
    header: 'Rank',
    className: 'w-[3%]',
    render: (participant) => (
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          getRankBadgeClass(participant.rank),
        )}
      >
        {participant.rank}
      </div>
    ),
  },
  {
    id: 'participant',
    header: 'Participant',
    className: 'w-[4%] border',
    render: (participant) => (
      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:flex">
          <UserRound className="size-5 text-white/80" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {participant.displayName}
            </p>

            {participant.rank <= 3 ? (
              <span className="inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-1.5 text-[10px] text-white/70">
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

          <p className="truncate text-xs text-gray-500">
            {maskPhone(participant.phone)}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'referrals',
    header: 'Referrals',
    className: 'w-[140px] text-right',
    render: (participant) => (
      <div className="text-right">
        <div className="text-lg font-bold text-white">
          {participant.referrals}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">
          code: {participant.referralCode}
        </div>
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
        participant.referrals,
        context.topReferrals,
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
              <span className="inline-flex items-center gap-1 text-yellow-400">
                <ArrowUpRight className="size-3" />
                Leading
              </span>
            ) : (
              <span>
                {context.topReferrals - participant.referrals} behind #1
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    className: 'w-[72px] text-right',
    render: (participant) => (
      <div className="flex justify-end">
        <LeaderboardActions
          participantId={participant.id}
          referralCode={participant.referralCode}
          phone={participant.phone}
        />
      </div>
    ),
  },
];
