import React from 'react';
import LeaderBoardCard from '@/components/publicleaderboard/LeaderBoardCard';
import { WhatsAppTVLeaderboard } from '@/demo/leaderboarddata';

type TopThreeProps = {
  leaderboard: WhatsAppTVLeaderboard;
};

export default function TopThree({ leaderboard }: TopThreeProps) {
  const sortedTopThree = [...leaderboard.participants]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3);

  const first = sortedTopThree.find((item) => item.rank === 1);
  const second = sortedTopThree.find((item) => item.rank === 2);
  const third = sortedTopThree.find((item) => item.rank === 3);

  if (!first || !second || !third) return null;

  return (
    <section className="relative py-10 lg:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Top <span className="gradient-text">Performers</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            The current top three participants leading this contest right now.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">
          <LeaderBoardCard participant={second} place={2} />
          <LeaderBoardCard participant={first} place={1} />
          <LeaderBoardCard participant={third} place={3} />
        </div>
      </div>
    </section>
  );
}