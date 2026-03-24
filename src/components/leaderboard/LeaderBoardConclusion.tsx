import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Trophy } from 'lucide-react';

type LeaderBoardConclusionProps = {
  leaderboardName?: string;
};

const LeaderBoardConclusion = ({
  leaderboardName = 'this contest',
}: LeaderBoardConclusionProps) => {
  return (
    <section className="py-20 md:py-24 px-6 md:px-12 relative">
      <div className="flex flex-col items-center gap-10 mx-auto w-full max-w-(--breakpoint-2xl)">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0c8]/20 bg-[#00f0c8]/8 px-4 py-2 text-sm text-[#00f0c8] backdrop-blur-sm">
          <Trophy className="size-4" />
          <span>Public Leaderboard</span>
        </div>

        <h3 className="text-center text-4xl font-bold md:text-6xl">
          Think You Can Top <br className="block" />
          <span className="bg-[linear-gradient(90deg,#a78bfa_0%,#60a5fa_50%,#22d3ee_100%)] bg-clip-text text-transparent">
            {leaderboardName}?
          </span>
        </h3>

        <p className="max-w-2xl text-center text-sm leading-7 text-muted-foreground md:text-base">
          Join the contest, share your referral link, and start climbing the
          rankings before the next update.
        </p>

        <Button className="rounded-full bg-foreground px-8 py-6 text-background hover:-translate-y-1 hover:shadow-[0_0_90px_rgba(96,165,250,0.18)]">
          Join This Contest
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(to_top,rgba(96,165,250,0.12)_0%,rgba(34,211,238,0.08)_28%,rgba(167,139,250,0.06)_48%,transparent_100%)] opacity-70" />
    </section>
  );
};

export default LeaderBoardConclusion;