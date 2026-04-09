import React from 'react';
import { Crown, Medal, Trophy, UserRound, Link2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LeaderboardParticipant } from '@/demo/leaderboarddata';


type Place = 1 | 2 | 3;

type LeaderBoardCardProps = {
  participant: LeaderboardParticipant;
  place: Place;
  className?: string;
};

const placeConfig: Record<
  Place,
  {
    label: string;
    icon: React.ReactNode;
    badgeClass: string;
    cardClass: string;
    ringClass: string;
    refsDotClass: string;
    mobileOrder: string;
  }
> = {
  1: {
    label: '1st Place',
    icon: <Crown className="size-5" />,
    badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-300/30',
    cardClass: 'top-three-card top-three-card-gold',
    ringClass: 'ring-2 ring-amber-300/40',
    refsDotClass: 'bg-amber-400',
    mobileOrder: 'md:order-2',
  },
  2: {
    label: '2nd Place',
    icon: <Medal className="size-5" />,
    badgeClass: 'bg-slate-300/10 text-slate-200 border-slate-200/25',
    cardClass: 'top-three-card top-three-card-silver',
    ringClass: 'ring-2 ring-slate-200/25',
    refsDotClass: 'bg-slate-300',
    mobileOrder: 'md:order-1',
  },
  3: {
    label: '3rd Place',
    icon: <Trophy className="size-5" />,
    badgeClass: 'bg-orange-400/10 text-orange-300 border-orange-300/25',
    cardClass: 'top-three-card top-three-card-bronze',
    ringClass: 'ring-2 ring-orange-300/25',
    refsDotClass: 'bg-orange-400',
    mobileOrder: 'md:order-3',
  },
};

export default function LeaderBoardCard({
  participant,
  place,
  className,
}: LeaderBoardCardProps) {
  const config = placeConfig[place];

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[28px] p-5 sm:p-6',
        config.cardClass,
        config.mobileOrder,
        place === 1 ? 'md:translate-y-0' : 'md:translate-y-6',
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/6 to-transparent" />
      <div className="relative">
        <div
          className={cn(
            'mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
            config.badgeClass
          )}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div
            className={cn(
              'flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-white',
              config.ringClass
            )}
          >
            <UserRound className="size-7 text-white/80" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-white sm:text-xl">
              {participant.displayName}
            </h3>
            <p className="truncate text-sm text-gray-400">@{participant.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Referrals
            </p>
            <p className="mt-2 text-2xl font-extrabold text-white">
              {participant.referrals}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className={cn('size-2 rounded-full', config.refsDotClass)} />
              <span className="text-xs text-gray-400">Current total</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Referral Code
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {participant.referralCode}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <Link2 className="size-3.5" />
              <span>Share-ready code</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-400">Current Rank</span>
            <span className="text-base font-bold text-white">#{participant.rank}</span>
          </div>
        </div>
      </div>
    </article>
  );
}