'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import { Contest } from '@/types/contest.type';

type GetMyContestsParams = {
  status?: string;
  search?: string;
};

const getMyContests = async (
  access_token: string,
  params?: GetMyContestsParams,
): Promise<Contest[]> => {
  const search_params = new URLSearchParams();

  if (params?.status) {
    search_params.set('status', params.status);
  }

  if (params?.search) {
    search_params.set('search', params.search);
  }

  const query_string = search_params.toString();

  const response = await fetch(
    `/api/contests/my-contests${query_string ? `?${query_string}` : ''}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result = (await response.json()) as AppResponse<Contest[]>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch contests.');
  }

  return result.data ?? [];
};

export const useGetMyContests = (params?: GetMyContestsParams) => {
  const { myChannel, isAuthenticated, isLoading: isAuthLoading } =
    useAuthContext();

  return useQuery({
    queryKey: [
      ...queryKeys.contests.byChannel(myChannel?.id),
      params?.status ?? 'all',
      params?.search ?? '',
    ],
    queryFn: async () => {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (!session?.access_token) {
        throw new Error('You must be signed in to fetch contests.');
      }

      return getMyContests(session.access_token, params);
    },
    enabled: isAuthenticated && !!myChannel?.id && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });
};