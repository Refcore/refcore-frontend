'use client';

import { useGetParticipants } from "./participants/useGetParticipants";
import { useGetReferrals } from "./referrals/useGetReferrals";


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

  const data: AdminLoadingData = {
    total_participants: participantsQuery.data?.pagination.total ?? 0,
    total_referrals: referralsQuery.data?.pagination.total ?? 0,

    recent_participants_count:
      participantsQuery.data?.participants.length ?? 0,

    recent_referrals_count: referralsQuery.data?.referrals.length ?? 0,
  };

  const isLoading = participantsQuery.isLoading || referralsQuery.isLoading;

  const isError = participantsQuery.isError || referralsQuery.isError;

  const error = participantsQuery.error ?? referralsQuery.error;

  const refetch = async () => {
    await Promise.all([
      participantsQuery.refetch(),
      referralsQuery.refetch(),
    ]);
  };

  return {
    data,

    participants: participantsQuery.data?.participants ?? [],
    referrals: referralsQuery.data?.referrals ?? [],

    participants_pagination: participantsQuery.data?.pagination,
    referrals_pagination: referralsQuery.data?.pagination,

    isLoading,
    isError,
    error,
    refetch,
  };
};