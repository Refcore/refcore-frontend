'use client';

import { useGetParticipants } from './participants/useGetParticipants';
import { useGetReferrals } from './referrals/useGetReferrals';
import { useGetMyContests } from './contests/useGetMyContests';
import { useGetAllTimeLeaderboard } from './leaderboard/useGetAllTimeLeaderboard';

type AdminLoadingData = {
  total_participants: number;
  total_referrals: number;
  recent_participants_count: number;
  recent_referrals_count: number;
};

export const useAdminLoading = () => {
  const participantsQuery = useGetParticipants({
    page: 1,
    limit: 20,
  });

  const referralsQuery = useGetReferrals({
    page: 1,
    limit: 20,
  });

  const contestsQuery = useGetMyContests({
    status: 'active',
  });

  const allTimeLeaderboardQuery = useGetAllTimeLeaderboard({
    page: 1,
  });

  const active_contest = contestsQuery.data ?? contestsQuery.data?.[0] ?? null;

  const data: AdminLoadingData = {
    total_participants: participantsQuery.data?.pagination.total ?? 0,
    total_referrals: referralsQuery.data?.pagination.total ?? 0,

    recent_participants_count: participantsQuery.data?.participants.length ?? 0,

    recent_referrals_count: referralsQuery.data?.referrals.length ?? 0,
  };

  const isLoading =
    participantsQuery.isLoading ||
    referralsQuery.isLoading ||
    contestsQuery.isLoading ||
    allTimeLeaderboardQuery.isLoading;

  const isError =
    participantsQuery.isError ||
    referralsQuery.isError ||
    contestsQuery.isError ||
    allTimeLeaderboardQuery.isError;

  const error =
    participantsQuery.error ??
    referralsQuery.error ??
    contestsQuery.error ??
    allTimeLeaderboardQuery.error;

  const refetch = async () => {
    await Promise.all([
      participantsQuery.refetch(),
      referralsQuery.refetch(),
      contestsQuery.refetch(),
      allTimeLeaderboardQuery.refetch(),
    ]);
  };

  return {
    data,

    active_contest,

    participants: participantsQuery.data?.participants ?? [],
    referrals: referralsQuery.data?.referrals ?? [],

    participants_pagination: participantsQuery.data?.pagination,
    referrals_pagination: referralsQuery.data?.pagination,

    allTimeTopFive: allTimeLeaderboardQuery.data?.leaderboard ?? [],

    isLoading,
    isError,
    error,
    refetch,
  };
};
