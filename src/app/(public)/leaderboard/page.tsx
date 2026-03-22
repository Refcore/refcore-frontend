import Image from 'next/image';
import React from 'react';
import { Trophy, SearchCheck, ShieldCheck, ArrowLeft } from 'lucide-react';

import LeaderboardSearch from '@/components/leaderboard/LeaderboardSearch';

const LeaderboardPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.14),transparent_32%),radial-gradient(circle_at_right,rgba(11,158,202,0.14),transparent_28%)]" />

      <div className="absolute top-0 right-0 h-full w-full rotate-180 opacity-10">
        <Image
          src="/svg/bbblurry.svg"
          className="pointer-events-none h-full w-full select-none object-cover"
          alt="bg"
          fill
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,15,1)_0%,rgba(10,10,15,0.9)_18%,rgba(10,10,15,0.45)_45%,rgba(10,10,15,0.12)_70%,transparent_100%)]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-(--breakpoint-2xl) items-center px-0 py-6 md:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-[32px] md:border-2 md:border-white/5 md:bg-white/1 p-6 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:p-10">
            <ArrowLeft className='w-5 text-muted-foreground hover:text-foreground hover:-translate-x-1 transition-all'/>{' '}
            <div className="mb-6 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <Trophy className="size-4 text-[#0b9eca]" />
                Public Contest Leaderboard
              </div>
            </div>
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Find any WhatsApp TV
                <span className="block bg-[linear-gradient(90deg,#a78bfa_0%,#60a5fa_50%,#22d3ee_100%)] bg-clip-text text-transparent">
                  leaderboard instantly
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Enter the WhatsApp TV name to search available leaderboards, or
                paste a channel code directly if you already have one.
              </p>
            </div>
            <div className="mt-8">
              <LeaderboardSearch />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <SearchCheck className="mb-3 size-5 text-[#8b5cf6]" />
                <h3 className="text-sm font-semibold">Fast lookup</h3>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  Search by channel name or jump straight in with a code.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Trophy className="mb-3 size-5 text-[#0b9eca]" />
                <h3 className="text-sm font-semibold">Live ranking</h3>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  See contest positions and top performers in real time.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ShieldCheck className="mb-3 size-5 text-emerald-400" />
                <h3 className="text-sm font-semibold">Reliable results</h3>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  Search results should connect directly to validated contest
                  records.
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-white/40">
              Tip: If you have a referral or contest code already, paste it
              directly into the search box.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
