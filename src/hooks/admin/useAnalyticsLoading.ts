'use client';

import { useGetMyContests } from './contests/useGetMyContests';
import { useGetReferrals } from './referrals/useGetReferrals';
import { useGetContestParticipants } from './contests/useGetContestParticipants';

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

export const useAnalyticsLoading = () => {
  const contestsQuery = useGetMyContests({
    status: 'active',
  });

  const active_contest = contestsQuery.data?.[0] ?? null;
  const active_contest_id = active_contest?.id ?? null;

  const contestParticipantsQuery = useGetContestParticipants(active_contest_id);

  const referralsQuery = useGetReferrals({
    contest_id: active_contest_id,
  });

  const validReferralsQuery = useGetReferrals({
    contest_id: active_contest_id,
    status: 'valid',
  });

  const becameParticipantReferralsQuery = useGetReferrals({
    contest_id: active_contest_id,
    status: 'became_participant',
  });

  const flaggedReferralsQuery = useGetReferrals({
    contest_id: active_contest_id,
    status: 'flagged',
  });

  const blockedReferralsQuery = useGetReferrals({
    contest_id: active_contest_id,
    status: 'blocked',
  });

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
    contestsQuery.isLoading ||
    contestParticipantsQuery.isLoading ||
    referralsQuery.isLoading ||
    validReferralsQuery.isLoading ||
    becameParticipantReferralsQuery.isLoading ||
    flaggedReferralsQuery.isLoading ||
    blockedReferralsQuery.isLoading;

  const isError =
    contestsQuery.isError ||
    contestParticipantsQuery.isError ||
    referralsQuery.isError ||
    validReferralsQuery.isError ||
    becameParticipantReferralsQuery.isError ||
    flaggedReferralsQuery.isError ||
    blockedReferralsQuery.isError;

  const error =
    contestsQuery.error ??
    contestParticipantsQuery.error ??
    referralsQuery.error ??
    validReferralsQuery.error ??
    becameParticipantReferralsQuery.error ??
    flaggedReferralsQuery.error ??
    blockedReferralsQuery.error;

  const refetch = async () => {
    await Promise.all([
      contestsQuery.refetch(),
      contestParticipantsQuery.refetch(),
      referralsQuery.refetch(),
      validReferralsQuery.refetch(),
      becameParticipantReferralsQuery.refetch(),
      flaggedReferralsQuery.refetch(),
      blockedReferralsQuery.refetch(),
    ]);
  };

  return {
    data,

    active_contest,
    active_contest_id,

    participants: contestParticipantsQuery.data?.participants ?? [],
    referrals: referralsQuery.data?.referrals ?? [],
    valid_referrals: validReferralsQuery.data?.referrals ?? [],
    became_participant_referrals:
      becameParticipantReferralsQuery.data?.referrals ?? [],
    flagged_referrals: flaggedReferralsQuery.data?.referrals ?? [],
    blocked_referrals: blockedReferralsQuery.data?.referrals ?? [],

    participants_pagination: contestParticipantsQuery.data?.pagination,
    referrals_pagination: referralsQuery.data?.pagination,

    is_contest_active: !!active_contest,

    isLoading,
    isError,
    error,
    refetch,
  };
};
