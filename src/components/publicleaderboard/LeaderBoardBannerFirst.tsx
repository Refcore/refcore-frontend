import React from 'react';
import Image from 'next/image';
import { CalendarDays, Clock3, Link2, Users, Wifi } from 'lucide-react';
import { PublicLeaderboardPayload } from '@/types/public-leaderboard';

type LeaderboardBannerFirstProps = {
  leaderboard: PublicLeaderboardPayload;
};

const formatNumber = (value?: number | null) => {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Not set';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not set';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const getTimeRemainingLabel = (end_date?: string | null) => {
  if (!end_date) return 'No end date';

  const endDate = new Date(end_date);
  const now = new Date();

  if (Number.isNaN(endDate.getTime())) return 'No end date';

  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Ending soon';

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days === 1) return '1 day left';

  return `${days} days left`;
};

export default function LeaderboardBannerFirst({
  leaderboard,
}: LeaderboardBannerFirstProps) {
  const { channel, active_contest } = leaderboard;

  const hasBanner = Boolean(channel.channel_banner_url);

  return (
    <section className="relative overflow-hidden py-8 sm:py-10 lg:py-14">
      <div className="bg-purple-glow pointer-events-none absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full blur-3xl md:h-96 md:w-96" />
      <div className="bg-green-glow pointer-events-none absolute right-1/4 bottom-0 -z-10 h-72 w-72 rounded-full blur-3xl md:h-96 md:w-96" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-90 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07070b] shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:min-h-107.5 lg:min-h-115">
          {hasBanner ? (
            <>
              <Image
                src={channel.channel_banner_url as string}
                alt={channel.tv_name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.35)_0%,rgba(5,5,8,0.72)_45%,rgba(5,5,8,0.96)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,8,0.92)_0%,rgba(5,5,8,0.7)_42%,rgba(5,5,8,0.5)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,208,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(183,0,255,0.14),transparent_40%)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,208,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(183,0,255,0.18),transparent_40%),linear-gradient(135deg,#101018,#07070b)]" />
          )}

          <div className="relative z-10 flex min-h-90 flex-col justify-end p-5 sm:min-h-107.5 sm:p-8 lg:min-h-115 lg:p-10">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--neon-green)/25 bg-black/45 px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--neon-green) opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-(--neon-green)" />
                </span>

                <Wifi className="size-3.5 text-(--neon-green) sm:size-4" />

                <span className="text-[10px] font-semibold tracking-[0.16em] text-(--neon-green) uppercase sm:text-xs">
                  Live Contest
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-6xl">
                {channel.tv_name}{' '}
                <span className="gradient-text inline-block">Leaderboard</span>
              </h1>

              <p className="mt-3 max-w-2xl text-base font-semibold text-white/90 drop-shadow sm:text-xl">
                {active_contest.title}
              </p>

              <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/65 sm:line-clamp-none sm:text-base">
                {active_contest.description ||
                  'Invite friends, grow your numbers, and climb the rankings to become the top performer.'}
              </p>

              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-left text-xs text-white/65 backdrop-blur-md sm:text-sm">
                <CalendarDays className="size-4 shrink-0 text-(--neon-blue)" />
                <span className="truncate">
                  {formatDate(active_contest.start_date)} —{' '}
                  {formatDate(active_contest.end_date)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Users className="size-4 text-(--neon-blue)" />
                    <span className="text-white/50">Participants:</span>
                    <span className="font-bold text-white">
                      {formatNumber(active_contest.participants_count)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Link2 className="size-4 text-(--neon-green)" />
                    <span className="text-white/50">Referrals:</span>
                    <span className="font-bold text-white">
                      {formatNumber(active_contest.referrals_count)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Clock3 className="size-4 text-(--neon-purple)" />
                    <span className="text-white/50">Ends in:</span>
                    <span className="font-bold text-white">
                      {getTimeRemainingLabel(active_contest.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,#07070b,transparent)]" />
        </div>
      </div>
    </section>
  );
}