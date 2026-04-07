'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LeaderboardParticipant,
  RewardTier,
  WhatsAppTVLeaderboard,
} from '@/demo/leaderboarddata';
import { ADMIN_ROUTES } from '@/routes';

type TopPerformersProps = {
  leaderboard: WhatsAppTVLeaderboard;
  viewAllHref?: string;
  className?: string;
};

const rewardTierStyles: Record<
  RewardTier,
  {
    rowClassName: string;
    rankClassName: string;
    avatarClassName: string;
    referralsClassName: string;
  }
> = {
  gold: {
    rowClassName:
      'border-yellow-400/20 hover:border-yellow-400/40 bg-[#13131a]/80',
    rankClassName:
      'bg-gradient-to-br from-yellow-400 to-yellow-600 text-[#0a0a0f] shadow-[0_0_15px_rgba(250,204,21,0.4)]',
    avatarClassName: 'border-yellow-400',
    referralsClassName: 'text-yellow-400',
  },
  silver: {
    rowClassName: 'border-gray-300/20 hover:border-gray-300/40 bg-[#13131a]/80',
    rankClassName:
      'bg-gradient-to-br from-gray-300 to-gray-500 text-[#0a0a0f] shadow-[0_0_15px_rgba(192,192,192,0.4)]',
    avatarClassName: 'border-gray-300',
    referralsClassName: 'text-gray-300',
  },
  bronze: {
    rowClassName:
      'border-orange-400/20 hover:border-orange-400/40 bg-[#13131a]/80',
    rankClassName:
      'bg-gradient-to-br from-orange-400 to-orange-600 text-[#0a0a0f] shadow-[0_0_15px_rgba(205,127,50,0.4)]',
    avatarClassName: 'border-orange-400',
    referralsClassName: 'text-orange-400',
  },
  none: {
    rowClassName:
      'border-white/5 hover:border-white/10 bg-[#13131a]/40 hover:bg-[#13131a]/70',
    rankClassName: 'bg-[#1c1c26] text-gray-400 border border-white/10',
    avatarClassName: 'border-[#2a2a35]',
    referralsClassName: 'text-white',
  },
};

const maskPhone = (phone: string) => {
  const clean = phone.trim();
  if (clean.length <= 5) return clean;

  const firstPart = clean.slice(0, 5);
  const lastPart = clean.slice(-4);

  return `${firstPart}****${lastPart}`;
};

const TopPerformerRow = ({
  participant,
}: {
  participant: LeaderboardParticipant;
}) => {
  const styles = rewardTierStyles[participant.rewardTier];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 transition-all duration-200',
        styles.rowClassName,
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black',
          styles.rankClassName,
        )}
      >
        {participant.rank}
      </div>

      <div className="relative h-10 w-10 shrink-0">
        <Image
          src={participant.avatar}
          alt={participant.displayName}
          fill
          sizes="40px"
          className={cn(
            'rounded-full border-2 object-cover',
            styles.avatarClassName,
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-white">
            {participant.displayName}
          </p>

          {participant.isTopPerformer ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70">
              <Crown className="size-3 text-yellow-400" />
              Top
            </span>
          ) : null}
        </div>

        <p className="truncate text-xs text-muted-foreground">
          {maskPhone(participant.phone)}
        </p>
      </div>

      <div className="text-right">
        <p className={cn('text-lg font-black', styles.referralsClassName)}>
          {participant.referrals}
        </p>
        <p className="text-xs text-muted-foreground">refs</p>
      </div>
    </div>
  );
};

const TopPerformers = ({
  leaderboard,
  viewAllHref = ADMIN_ROUTES.LEADERBOARD,
  className,
}: TopPerformersProps) => {
  const topFive = useMemo(() => {
    return [...leaderboard.participants]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 5);
  }, [leaderboard.participants]);

  return (
    <section
      className={cn(
        'rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl',
        className,
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Top Performers</h2>

        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#00d0ff] transition-colors hover:text-[#00d0ff]/80"
        >
          View All
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {topFive.map((participant) => (
          <TopPerformerRow key={participant.id} participant={participant} />
        ))}
      </div>
    </section>
  );
};

export default TopPerformers;
