'use client';

import { useGetReferrals } from './referrals/useGetReferrals';
import { useGetContestParticipants } from './contests/useGetContestParticipants';
import { useGetCurrentContestLeaderboard } from './leaderboard/useGetCurrentContestLeaderboard';

type AnalyticsLoadingData = {
  total_participants: number;
  total_referrals: number;
  valid_referrals: number;
  became_participant_referrals: number;
  suspicious_referrals: number;
  flagged_referrals: number;
  blocked_referrals: number;
  average_referrals_per_participant: number;
  conversion_rate: number;
};

export const useAnalyticsLoading = (contest_id: string) => {
  const contestParticipantsQuery = useGetContestParticipants(contest_id);

  const referralsQuery = useGetReferrals({
    contest_id,
  });

  const validReferralsQuery = useGetReferrals({
    contest_id,
    status: 'valid',
  });

  const becameParticipantReferralsQuery = useGetReferrals({
    contest_id,
    status: 'became_participant',
  });

  const flaggedReferralsQuery = useGetReferrals({
    contest_id,
    status: 'flagged',
  });

  const blockedReferralsQuery = useGetReferrals({
    contest_id,
    status: 'blocked',
  });

  const currentContestLeaderboardQuery = useGetCurrentContestLeaderboard(
    contest_id,
    {
      page: 1,
      limit: 5,
      range: 'top10',
      sort: 'referrals_desc',
    },
  );

  const total_participants =
    contestParticipantsQuery.data?.pagination.total ?? 0;

  const total_referrals = referralsQuery.data?.pagination.total ?? 0;

  const valid_referrals = validReferralsQuery.data?.pagination.total ?? 0;

  const became_participant_referrals =
    becameParticipantReferralsQuery.data?.pagination.total ?? 0;

  const flagged_referrals = flaggedReferralsQuery.data?.pagination.total ?? 0;

  const blocked_referrals = blockedReferralsQuery.data?.pagination.total ?? 0;

  const suspicious_referrals = flagged_referrals + blocked_referrals;

  const average_referrals_per_participant =
    total_participants > 0
      ? Number((total_referrals / total_participants).toFixed(1))
      : 0;

  const conversion_rate =
    total_referrals > 0
      ? Number(
          ((became_participant_referrals / total_referrals) * 100).toFixed(1),
        )
      : 0;

  const data: AnalyticsLoadingData = {
    total_participants,
    total_referrals,
    valid_referrals,
    became_participant_referrals,
    suspicious_referrals,
    flagged_referrals,
    blocked_referrals,
    average_referrals_per_participant,
    conversion_rate,
  };

  const isLoading =
    contestParticipantsQuery.isLoading ||
    referralsQuery.isLoading ||
    validReferralsQuery.isLoading ||
    becameParticipantReferralsQuery.isLoading ||
    flaggedReferralsQuery.isLoading ||
    blockedReferralsQuery.isLoading ||
    currentContestLeaderboardQuery.isLoading;

  const isError =
    contestParticipantsQuery.isError ||
    referralsQuery.isError ||
    validReferralsQuery.isError ||
    becameParticipantReferralsQuery.isError ||
    flaggedReferralsQuery.isError ||
    blockedReferralsQuery.isError ||
    currentContestLeaderboardQuery.isError;

  const error =
    contestParticipantsQuery.error ??
    referralsQuery.error ??
    validReferralsQuery.error ??
    becameParticipantReferralsQuery.error ??
    flaggedReferralsQuery.error ??
    blockedReferralsQuery.error ??
    currentContestLeaderboardQuery.error;

  const refetch = async () => {
    await Promise.all([
      contestParticipantsQuery.refetch(),
      referralsQuery.refetch(),
      validReferralsQuery.refetch(),
      becameParticipantReferralsQuery.refetch(),
      flaggedReferralsQuery.refetch(),
      blockedReferralsQuery.refetch(),
      currentContestLeaderboardQuery.refetch(),
    ]);
  };

  return {
    data,

    participants: contestParticipantsQuery.data?.participants ?? [],
    referrals: referralsQuery.data?.referrals ?? [],
    valid_referrals: validReferralsQuery.data?.referrals ?? [],
    became_participant_referrals:
      becameParticipantReferralsQuery.data?.referrals ?? [],
    flagged_referrals: flaggedReferralsQuery.data?.referrals ?? [],
    blocked_referrals: blockedReferralsQuery.data?.referrals ?? [],

    top_contributors: currentContestLeaderboardQuery.data?.leaderboard ?? [],
    leaderboard_summary: currentContestLeaderboardQuery.data?.summary ?? null,
    leaderboard_pagination:
      currentContestLeaderboardQuery.data?.pagination ?? null,

    participants_pagination: contestParticipantsQuery.data?.pagination,
    referrals_pagination: referralsQuery.data?.pagination,

    isLoading,
    isError,
    error,
    refetch,
  };
};
