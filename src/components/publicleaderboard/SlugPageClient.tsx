'use client';

import Footer from '@/components/home-sections/Footer';
import LeaderboardBannerFirst from '@/components/publicleaderboard/LeaderBoardBannerFirst';
import LeaderBoardConclusion from '@/components/publicleaderboard/LeaderBoardConclusion';
import LeaderboardSahre from '@/components/publicleaderboard/LeaderboardSahre';
import LeaderboardTable from '@/components/publicleaderboard/LeaderboardTable';
import TopThree from '@/components/publicleaderboard/TopThree';
import Navbar from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { useGetChannelBySlug } from '@/hooks/public/useGetChannelBySlug';
import { useGetPublicContestLeaderboard } from '@/hooks/public/useGetPublicContestLeaderboard';
import { PublicLeaderboardPayload } from '@/types/public-leaderboard';

import { getStorageFileUrl } from '@/utils/getStorageFileUrl';
import {
  AlertTriangle,
  //   Clock3,
  //   Link2,
  Loader2,
  RefreshCcw,
  Trophy,
  //   Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type SlugPageClientProps = {
  slug: string;
};

// const formatNumber = (value?: number | null) => {
//   return new Intl.NumberFormat('en-US').format(value ?? 0);
// };

// const formatDate = (value?: string | null) => {
//   if (!value) return 'Not set';

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return 'Not set';

//   return new Intl.DateTimeFormat('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   }).format(date);
// };

// const getTimeRemainingLabel = (end_date?: string | null) => {
//   if (!end_date) return 'No end date';

//   const endDate = new Date(end_date);
//   const now = new Date();

//   if (Number.isNaN(endDate.getTime())) return 'No end date';

//   const diff = endDate.getTime() - now.getTime();

//   if (diff <= 0) return 'Ending soon';

//   const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

//   if (days === 1) return '1 day left';

//   return `${days} days left`;
// };

const PageShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar disablenav />

      <div className="absolute right-0 top-0 h-screen w-full rotate-180 opacity-5">
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

      <div className="relative z-10 mx-auto min-h-screen w-full py-10 md:py-16">
        {children}
      </div>
    </div>
  );
};

const PageStateCard = ({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-3xl border border-white/10 bg-white/4 p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          {icon}
        </div>

        <h1 className="text-xl font-bold text-white md:text-2xl">{title}</h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
          {description}
        </p>

        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
};

// const ChannelContestHeader = ({
//   public_leaderboard,
// }: {
//   public_leaderboard: PublicLeaderboardPayload;
// }) => {
//   const { channel, active_contest } = public_leaderboard;

//   return (
//     <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-2 sm:px-6 lg:px-8">
//       <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
//         <div className="relative min-h-65 overflow-hidden">
//           {channel.channel_banner_url ? (
//             <>
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={channel.channel_banner_url}
//                 alt={channel.tv_name}
//                 className="absolute inset-0 size-full object-cover"
//               />
//               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,15,0.25),rgba(10,10,15,0.9))]" />
//               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,208,255,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(183,0,255,0.2),transparent_42%)]" />
//             </>
//           ) : (
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,208,255,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(183,0,255,0.22),transparent_42%),linear-gradient(135deg,rgba(28,28,38,0.9),rgba(10,10,15,0.98))]" />
//           )}

//           <div className="relative z-10 flex min-h-65 flex-col justify-end p-5 sm:p-8 lg:p-10">
//             <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#00ff9d]">
//               <span className="size-2 rounded-full bg-[#00ff9d] shadow-[0_0_12px_rgba(0,255,157,0.9)]" />
//               Live contest
//             </div>

//             <div className="max-w-3xl">
//               <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
//                 {channel.tv_name}
//               </h1>

//               <p className="mt-3 text-lg font-semibold text-white/85 sm:text-xl">
//                 {active_contest.title}
//               </p>

//               {active_contest.description ? (
//                 <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
//                   {active_contest.description}
//                 </p>
//               ) : null}
//             </div>

//             <div className="mt-6 flex flex-wrap gap-3 text-sm">
//               <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-white/75 backdrop-blur">
//                 <Users className="size-4 text-[#00d0ff]" />
//                 <span className="text-white/45">Participants:</span>
//                 <span className="font-bold text-white">
//                   {formatNumber(active_contest.participants_count)}
//                 </span>
//               </div>

//               <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-white/75 backdrop-blur">
//                 <Link2 className="size-4 text-[#00ff9d]" />
//                 <span className="text-white/45">Referrals:</span>
//                 <span className="font-bold text-white">
//                   {formatNumber(active_contest.referrals_count)}
//                 </span>
//               </div>

//               <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-white/75 backdrop-blur">
//                 <Clock3 className="size-4 text-[#b700ff]" />
//                 <span className="text-white/45">Ends:</span>
//                 <span className="font-bold text-white">
//                   {getTimeRemainingLabel(active_contest.end_date)}
//                 </span>
//               </div>
//             </div>

//             <p className="mt-4 text-xs text-white/40">
//               Contest period: {formatDate(active_contest.start_date)} -{' '}
//               {formatDate(active_contest.end_date)}
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

const LeaderboardLoadingState = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-white/4 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Loader2 className="size-5 animate-spin text-[#00d0ff]" />
        </div>

        <h2 className="text-lg font-bold text-white">
          Loading contest rankings
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
          The channel and contest are ready. We are now fetching the top 20
          participants with the highest referrals.
        </p>
      </div>
    </section>
  );
};

const LeaderboardErrorState = ({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/4 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10">
          <AlertTriangle className="size-5 text-yellow-400" />
        </div>

        <h2 className="text-lg font-bold text-white">
          Leaderboard rankings unavailable
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
          {message}
        </p>

        <Button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-6 rounded-xl bg-white text-black hover:bg-white/90"
        >
          {isRetrying ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Try again
        </Button>
      </div>
    </section>
  );
};

const SlugPageClient = ({ slug }: SlugPageClientProps) => {
  const clean_slug = slug.trim();

  const {
    data: channel_data,
    isLoading: isChannelLoading,
    isFetching: isChannelFetching,
    isError: isChannelError,
    error: channelError,
    refetch: refetchChannel,
  } = useGetChannelBySlug(clean_slug);

  const active_contest_id = channel_data?.active_contest.id ?? null;

  const {
    data: contest_leaderboard,
    isLoading: isContestLeaderboardLoading,
    isFetching: isContestLeaderboardFetching,
    isError: isContestLeaderboardError,
    error: contestLeaderboardError,
    refetch: refetchContestLeaderboard,
  } = useGetPublicContestLeaderboard(active_contest_id);

  const channelErrorMessage =
    channelError instanceof Error
      ? channelError.message
      : 'Unable to fetch this leaderboard.';

  const contestLeaderboardErrorMessage =
    contestLeaderboardError instanceof Error
      ? contestLeaderboardError.message
      : 'Unable to fetch contest rankings.';

  const public_leaderboard =
    React.useMemo<PublicLeaderboardPayload | null>(() => {
      if (!channel_data) return null;

      const { channel, active_contest } = channel_data;

      const channel_banner_url = getStorageFileUrl(
        'channel_banners',
        channel.channel_banner,
      );

      return {
        channel: {
          ...channel,
          channel_banner_url,
        },
        active_contest,
        active_contest_id: active_contest.id,
        contest_leaderboard: contest_leaderboard ?? null,
      };
    }, [channel_data, contest_leaderboard]);

  if (isChannelLoading) {
    return (
      <PageShell>
        <PageStateCard
          icon={<Loader2 className="size-6 animate-spin text-[#00d0ff]" />}
          title="Loading leaderboard"
          description="We are checking this WhatsApp TV and fetching the live contest details."
        />
      </PageShell>
    );
  }

  if (isChannelError) {
    return (
      <PageShell>
        <PageStateCard
          icon={<AlertTriangle className="size-6 text-yellow-400" />}
          title="Leaderboard not available"
          description={channelErrorMessage}
          action={
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => refetchChannel()}
                disabled={isChannelFetching}
                className="rounded-xl bg-white text-black hover:bg-white/90"
              >
                {isChannelFetching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCcw className="size-4" />
                )}
                Try again
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/">Go home</Link>
              </Button>
            </div>
          }
        />
      </PageShell>
    );
  }

  if (!public_leaderboard) {
    return (
      <PageShell>
        <PageStateCard
          icon={<Trophy className="size-6 text-white/70" />}
          title="No leaderboard found"
          description="We could not find a live leaderboard for this channel."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/">Go home</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  const shouldShowLeaderboardLoading =
    isContestLeaderboardLoading && !contest_leaderboard;

  const shouldShowLeaderboardError =
    isContestLeaderboardError && !contest_leaderboard;

  return (
    <PageShell>
      {/* <ChannelContestHeader public_leaderboard={public_leaderboard} /> */}

      <LeaderboardBannerFirst leaderboard={public_leaderboard} />

      {shouldShowLeaderboardLoading ? (
        <LeaderboardLoadingState />
      ) : shouldShowLeaderboardError ? (
        <LeaderboardErrorState
          message={contestLeaderboardErrorMessage}
          onRetry={() => refetchContestLeaderboard()}
          isRetrying={isContestLeaderboardFetching}
        />
      ) : (
        <>
          <TopThree leaderboard={public_leaderboard} />

          <LeaderboardTable leaderboard={public_leaderboard} />
        </>
      )}

      <LeaderboardSahre
        leaderboardName={public_leaderboard.channel.tv_name}
        leaderboardCode={public_leaderboard.channel.slug}
      />

      <LeaderBoardConclusion
        leaderboardName={public_leaderboard.channel.tv_name}
      />

      <Footer />
    </PageShell>
  );
};

export default SlugPageClient;
