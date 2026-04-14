'use client';

import React from 'react';
import { Medal, Trophy, TrendingUp, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { topContributorsData } from '@/demo/topContributorsData';

type TopContributorsProps = {
  isContestActive?: boolean;
};

const maskPhone = (phone?: string) => {
  if (!phone) return 'No phone';
  const digits = phone.replace(/\s+/g, '');
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 4)}****${digits.slice(-4)}`;
};

const getRankBadgeClass = (rank: number) => {
  if (rank === 1) {
    return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-[0_0_12px_rgba(250,204,21,0.35)]';
  }

  if (rank === 2) {
    return 'bg-gradient-to-br from-zinc-200 to-zinc-400 text-black shadow-[0_0_12px_rgba(192,192,192,0.25)]';
  }

  if (rank === 3) {
    return 'bg-gradient-to-br from-orange-400 to-orange-600 text-black shadow-[0_0_12px_rgba(205,127,50,0.28)]';
  }

  return 'border border-white/10 bg-[#1c1c26] text-gray-300';
};

const getBadgeClass = (badge: string) => {
  if (badge === 'champion') {
    return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400';
  }

  if (badge === 'elite') {
    return 'border-[#b700ff]/30 bg-[#b700ff]/10 text-[#d78cff]';
  }

  if (badge === 'active') {
    return 'border-[#00d0ff]/30 bg-[#00d0ff]/10 text-[#7ae7ff]';
  }

  return 'border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[#00ff9d]';
};

const getContributionBarClass = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
  if (rank === 2) return 'bg-gradient-to-r from-zinc-300 to-zinc-400';
  if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500';
  if (rank === 4) return 'bg-gradient-to-r from-[#b700ff] to-[#00d0ff]';
  return 'bg-gradient-to-r from-[#00ff9d] to-[#00d0ff]';
};

const TopContributors = ({
  isContestActive = true,
}: TopContributorsProps) => {
  const totalContribution = topContributorsData.reduce(
    (sum, item) => sum + item.contribution_rate,
    0,
  );

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white md:text-xl">
              Top Contributors
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Participants driving the strongest referral output
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#00d0ff]">
            <TrendingUp className="size-4" />
            Leader focus
          </div>
        </div>

        {isContestActive ? (
          <div className="space-y-3">
            {topContributorsData.map((participant) => (
              <div
                key={participant.id}
                className="rounded-xl border border-white/10 bg-[#13131a]/70 p-4 transition-all hover:bg-white/5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      getRankBadgeClass(participant.rank),
                    )}
                  >
                    {participant.rank}
                  </div>

                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 md:flex">
                    <UserRound className="size-5 text-white/80" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {participant.user_name}
                      </p>

                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                          getBadgeClass(participant.badge),
                        )}
                      >
                        {participant.badge}
                      </span>

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

                    <p className="mt-1 text-xs text-gray-500">
                      {maskPhone(participant.phone)} · code:{' '}
                      {participant.referral_code}
                    </p>

                    <div className="mt-3">
                      <div className="mb-1.5 flex items-center justify-between text-[11px] text-gray-400">
                        <span>
                          {participant.total_referrals.toLocaleString()} referrals
                        </span>
                        <span>{participant.contribution_rate.toFixed(1)}%</span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-black/30">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            getContributionBarClass(participant.rank),
                          )}
                          style={{
                            width: `${Math.max(
                              participant.contribution_rate,
                              6,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-70 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/60 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <TrendingUp className="size-6 text-white/70" />
            </div>

            <h4 className="text-base font-semibold text-white">
              No active contest
            </h4>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Top contributor insights will appear here when a contest is live
              and referral activity starts coming in.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Trophy className="size-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Contribution Summary</h3>
        </div>

        {isContestActive ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#00d0ff]/15 bg-[#00d0ff]/8 p-4">
              <p className="text-sm font-semibold text-white">
                Top 5 contribution share
              </p>
              <p className="mt-1 text-2xl font-black text-white">
                {totalContribution.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Portion of total referrals driven by the top five participants.
              </p>
            </div>

            <div className="rounded-xl border border-[#b700ff]/15 bg-[#b700ff]/8 p-4">
              <p className="text-sm font-semibold text-white">
                Strongest contributor
              </p>
              <p className="mt-1 text-base font-bold text-white">
                {topContributorsData[0]?.user_name}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Leading this contest with{' '}
                {topContributorsData[0]?.total_referrals.toLocaleString()}{' '}
                referrals.
              </p>
            </div>

            <div className="rounded-xl border border-[#00ff9d]/15 bg-[#00ff9d]/8 p-4">
              <p className="text-sm font-semibold text-white">
                Leadership concentration
              </p>
              <p className="mt-1 text-xs text-gray-400">
                This helps show whether growth is being carried by a few top
                participants or spread more evenly across the contest.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-70 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/60 px-6 text-center">
            <h4 className="text-base font-semibold text-white">
              No contribution summary yet
            </h4>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Start a contest to see who is driving referral growth and how much
              of the total activity is coming from your leading participants.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopContributors;