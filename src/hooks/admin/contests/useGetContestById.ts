'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import type { Contest } from '@/types/contest.type';
import { queryKeys } from '@/lib/query_keys';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type GetContestByIdResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: Contest | null;
  error_code?: string;
  not_found?: boolean;
};

export const useGetContestById = (contestId?: string) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: contestId
      ? queryKeys.contests.single(contestId)
      : queryKeys.contests.single(''),

    enabled: Boolean(contestId),

    queryFn: async (): Promise<GetContestByIdResponse> => {
      if (!contestId) {
        throw new Error('Contest ID is required.');
      }

      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        await handleExpiredSession();
        throw new Error(sessionError.message);
      }

      if (!session?.access_token) {
        await handleExpiredSession();
        throw new Error('Your session has expired. Please sign in again.');
      }

      const response = await authFetch(`/api/contests/${contestId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = (await response.json()) as GetContestByIdResponse;

      if (response.status === 404) {
        return {
          success: false,
          status_code: 404,
          message: result.message || 'Contest not found.',
          data: null,
          error_code: result.error_code ?? 'CONTEST_NOT_FOUND',
          not_found: true,
        };
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch contest.');
      }

      return result;
    },
  });

  return {
    contest: data?.data ?? null,
    is_contest_not_found: data?.not_found ?? false,
    is_getting_contest: isLoading,
    is_refetching_contest: isFetching && !isLoading,
    is_getting_contest_error: isError,
    get_contest_error: error,
    refetchContest: refetch,
  };
};
