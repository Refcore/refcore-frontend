import React from 'react';
import { Crown, Link2, Medal, Phone, Trophy, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PublicContestLeaderboardRow } from '@/types/public-leaderboard';

type Place = 1 | 2 | 3;

type LeaderBoardCardProps = {
  participant: PublicContestLeaderboardRow;
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
    avatarClass: string;
    refsDotClass: string;
    mobileOrder: string;
  }
> = {
  1: {
    label: '1st Place',
    icon: <Crown className="size-4" />,
    badgeClass: 'border-amber-300/25 bg-amber-400/10 text-amber-300',
    cardClass:
      'border-amber-300/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.10),rgba(255,255,255,0.035))] shadow-[0_12px_40px_rgba(251,191,36,0.10)]',
    avatarClass: 'ring-1 ring-amber-300/35',
    refsDotClass: 'bg-amber-400',
    mobileOrder: 'md:order-2',
  },
  2: {
    label: '2nd Place',
    icon: <Medal className="size-4" />,
    badgeClass: 'border-slate-200/20 bg-slate-300/10 text-slate-200',
    cardClass:
      'border-slate-200/15 bg-[linear-gradient(180deg,rgba(226,232,240,0.08),rgba(255,255,255,0.03))] shadow-[0_12px_34px_rgba(226,232,240,0.06)]',
    avatarClass: 'ring-1 ring-slate-200/25',
    refsDotClass: 'bg-slate-300',
    mobileOrder: 'md:order-1',
  },
  3: {
    label: '3rd Place',
    icon: <Trophy className="size-4" />,
    badgeClass: 'border-orange-300/20 bg-orange-400/10 text-orange-300',
    cardClass:
      'border-orange-300/15 bg-[linear-gradient(180deg,rgba(251,146,60,0.08),rgba(255,255,255,0.03))] shadow-[0_12px_34px_rgba(251,146,60,0.06)]',
    avatarClass: 'ring-1 ring-orange-300/25',
    refsDotClass: 'bg-orange-400',
    mobileOrder: 'md:order-3',
  },
};

const formatNumber = (value?: number | null) => {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
};

export default function LeaderBoardCard({
  participant,
  place,
  className,
}: LeaderBoardCardProps) {
  const config = placeConfig[place];

  const participant_details = participant.participant;

  const display_name =
    participant_details.display_name?.trim() || 'Anonymous participant';

  const masked_phone_number =
    participant_details.masked_phone_number || 'Phone hidden';

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl sm:rounded-[24px] sm:p-5',
        config.cardClass,
        config.mobileOrder,
        place === 1 ? 'md:translate-y-0' : 'md:translate-y-5',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/[0.07] to-transparent" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:text-xs',
              config.badgeClass,
            )}
          >
            {config.icon}
            <span>{config.label}</span>
          </div>

          <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-bold text-white">
            #{participant.rank}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white sm:size-12 sm:rounded-2xl',
              config.avatarClass,
            )}
          >
            <UserRound className="size-5 text-white/80 sm:size-6" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-white sm:text-lg">
              {display_name}
            </h3>

            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-400 sm:text-sm">
              <Phone className="size-3 shrink-0" />
              <span className="truncate">{masked_phone_number}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/8 bg-black/20 p-3 sm:rounded-2xl sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Referrals
            </p>

            <p className="mt-1.5 text-xl font-extrabold text-white sm:text-2xl">
              {formatNumber(participant.referral_count)}
            </p>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={cn('size-1.5 rounded-full', config.refsDotClass)}
              />
              <span className="text-[11px] text-gray-400">Total</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-black/20 p-3 sm:rounded-2xl sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Code
            </p>

            <p className="mt-1.5 truncate text-sm font-semibold text-white">
              {participant_details.referral_code}
            </p>

            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
              <Link2 className="size-3" />
              <span>Share code</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}