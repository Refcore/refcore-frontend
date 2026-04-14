import React from 'react';
import { Clock3, Link2, Users, Wifi } from 'lucide-react';
import { WhatsAppTVLeaderboard } from '@/demo/leaderboarddata';

type LeaderboardBannerFirstProps = {
  leaderboard: WhatsAppTVLeaderboard;
};

export default function LeaderboardBannerFirst({
  leaderboard,
}: LeaderboardBannerFirstProps) {
  return (
    <section className="relative overflow-hidden py-12 lg:py-16">
      <div className="bg-purple-glow pointer-events-none absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full blur-3xl md:h-96 md:w-96" />
      <div className="bg-green-glow pointer-events-none absolute right-1/4 bottom-0 -z-10 h-72 w-72 rounded-full blur-3xl md:h-96 md:w-96" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--neon-green)/25 bg-(--neon-green)/10 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--neon-green) opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-(--neon-green)" />
            </span>
            <Wifi className="size-4 text-(--neon-green)" />
            <span className="text-xs font-semibold tracking-[0.18em] text-(--neon-green) uppercase sm:text-sm">
              Live Contest
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {leaderboard.name}{' '}
            <span className="gradient-text inline-block">Leaderboard</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Referral Contest — March Edition
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Invite friends, grow your numbers, and climb the rankings to become the
            top performer.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="glass rounded-xl border border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-(--neon-blue)" />
                <span className="text-gray-400">Total Participants:</span>
                <span className="font-bold text-white">
                  {leaderboard.total_participants.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="glass rounded-xl border border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Link2 className="size-4 text-(--neon-green)" />
                <span className="text-gray-400">Total Referrals:</span>
                <span className="font-bold text-white">
                  {leaderboard.total_referrals.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="glass rounded-xl border border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock3 className="size-4 text-(--neon-purple)" />
                <span className="text-gray-400">Ends in:</span>
                <span className="font-bold text-white">5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}