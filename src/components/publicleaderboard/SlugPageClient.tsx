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
  CalendarDays,
  Gift,
  Loader2,
  LockKeyhole,
  RefreshCcw,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type SlugPageClientProps = {
  slug: string;
};

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

      <div className="relative z-10 mx-auto min-h-screen w-full py-20 md:py-16">
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

const formatDate = (date?: string | Date | null) => {
  if (!date) return 'Not set';

  const formattedDate = new Date(date);

  if (Number.isNaN(formattedDate.getTime())) {
    return 'Not set';
  }

  return formattedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getWinnerText = (maxWinners?: number | null) => {
  if (!maxWinners || maxWinners < 1) {
    return 'Winners not set';
  }

  if (maxWinners === 1) {
    return 'The first 1 participant will be selected as winner.';
  }

  return `The first ${maxWinners} participants will be selected as winners.`;
};

const ContestInfoSection = ({
  leaderboard,
}: {
  leaderboard: PublicLeaderboardPayload;
}) => {
  const { active_contest } = leaderboard;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:col-span-2">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[#00d0ff]/20 bg-[#00d0ff]/10">
              <Trophy className="size-5 text-[#00d0ff]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Contest details
              </h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/45">
                <CalendarDays className="size-4 text-[#00d0ff]" />
                Contest Period
              </div>

              <p className="text-sm font-semibold text-white">
                {formatDate(active_contest.start_date)} -{' '}
                {formatDate(active_contest.end_date)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/45">
                <Trophy className="size-4 text-yellow-400" />
                Winners
              </div>

              <p className="text-sm font-semibold text-white">
                {getWinnerText(active_contest.max_winners)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[#00ff9d]/20 bg-[#00ff9d]/10">
              <Gift className="size-5 text-[#00ff9d]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Reward</h2>

              <p className="mt-1 text-sm leading-6 text-white/55">
                {active_contest.reward_description ||
                  'Reward details have not been added yet.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/45">
                <Users className="size-4 text-[#00d0ff]" />
                Participants
              </div>

              <p className="text-lg font-black text-white">
                {active_contest.participants_count?.toLocaleString() ?? '0'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/45">
                <Zap className="size-4 text-[#00ff9d]" />
                Referrals
              </div>

              <p className="text-lg font-black text-white">
                {active_contest.referrals_count?.toLocaleString() ?? '0'}
              </p>
            </div>
          </div>
        </div>
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

  const active_contest = channel_data?.active_contest ?? null;
  const is_public_contest = active_contest?.visibility === 'public';
  const active_contest_id =
    active_contest && is_public_contest ? active_contest.id : null;

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
      if (!channel_data || !active_contest || !is_public_contest) return null;

      const { channel } = channel_data;

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
    }, [channel_data, active_contest, is_public_contest, contest_leaderboard]);

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

  if (!active_contest) {
    return (
      <PageShell>
        <PageStateCard
          icon={<Trophy className="size-6 text-white/70" />}
          title="No active contest found"
          description="This channel does not currently have an active contest with a public leaderboard."
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

  if (!is_public_contest) {
    return (
      <PageShell>
        <PageStateCard
          icon={<LockKeyhole className="size-6 text-yellow-400" />}
          title="This leaderboard is private"
          description="This contest is active, but it is not publicly visible. Only public contests can be viewed from this leaderboard page."
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
                Check again
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
          description="We could not find a live public leaderboard for this channel."
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
      <LeaderboardBannerFirst leaderboard={public_leaderboard} />

      <ContestInfoSection leaderboard={public_leaderboard} />

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