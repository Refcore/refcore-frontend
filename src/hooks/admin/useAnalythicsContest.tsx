'use client';

import { useGetMyContests } from './contests/useGetMyContests';

export const useAnalyticsContest = () => {
  const contestsQuery = useGetMyContests({
    status: 'active',
  });

  const active_contest = contestsQuery.data?.[0] ?? null;
  const active_contest_id = active_contest?.id ?? null;

  return {
    active_contest,
    active_contest_id,
    has_active_contest: !!active_contest_id,

    isLoading: contestsQuery.isLoading,
    isError: contestsQuery.isError,
    error: contestsQuery.error,
    refetch: contestsQuery.refetch,
  };
};
