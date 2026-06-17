import React from 'react';
import LeaderBoardCard from '@/components/publicleaderboard/LeaderBoardCard';
import { PublicLeaderboardPayload } from '@/types/public-leaderboard';

type TopThreeProps = {
  leaderboard: PublicLeaderboardPayload;
};

export default function TopThree({ leaderboard }: TopThreeProps) {
  const leaderboard_rows = leaderboard.contest_leaderboard?.leaderboard ?? [];

  const sortedTopThree = [...leaderboard_rows]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3);

  const first = sortedTopThree.find((item) => item.rank === 1);
  const second = sortedTopThree.find((item) => item.rank === 2);
  const third = sortedTopThree.find((item) => item.rank === 3);

  const orderedTopThree = [second, first, third].filter(Boolean);

  if (orderedTopThree.length === 0) {
    return null;
  }

  return (
    <section className="relative py-10 lg:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Top <span className="gradient-text">Performers</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            The current top participants leading this contest right now.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">
          {orderedTopThree.map((participant) => {
            if (!participant) return null;

            return (
              <LeaderBoardCard
                key={participant.id}
                participant={participant}
                place={participant.rank as 1 | 2 | 3}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
