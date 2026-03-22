import LeaderboardBannerFirst from '@/components/leaderboard/LeaderBoardBannerFirst';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import TopThree from '@/components/leaderboard/TopThree';
import {
  findLeaderboardByCodeOrName,
  mockLeaderboards,
} from '@/demo/leaderboarddata';
import Image from 'next/image';
import React from 'react';

type CodePageProps = {
  params: Promise<{
    code: string;
  }>;
};

const CodePage = async ({ params }: CodePageProps) => {
  const { code } = await params;

  const leaderboard = findLeaderboardByCodeOrName(code) ?? mockLeaderboards[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute top-0 right-0 h-screen w-full rotate-180 opacity-5">
        <Image
          src="/svg/bbblurry.svg"
          className="pointer-events-none h-full w-full select-none object-cover"
          alt="bg"
          fill
          priority
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,15,1)_0%,rgba(10,10,15,0.92)_18%,rgba(10,10,15,0.55)_42%,rgba(10,10,15,0.2)_68%,rgba(10,10,15,0.04)_88%,transparent_100%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,transparent_0%,transparent_72%,rgba(10,10,15,0.28)_88%,rgba(10,10,15,0.65)_96%,#0a0a0f_100%)]" />
      </div>

      <div className="mx-auto min-h-screen w-full max-w-(--breakpoint-2xl) px-0 py-6 sm:px-6 md:py-12 lg:px-8">
        <LeaderboardBannerFirst leaderboard={leaderboard} />
        <TopThree leaderboard={leaderboard} />
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
};

export default CodePage;
