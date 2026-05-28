'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import {
  GetLeaderboardResponse,
  LeaderboardQueryParams,
} from '@/types/leaderboard.type';
import { buildLeaderboardQueryString } from '@/utils/buildLeaderboardQuerryString';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

const getAllTimeLeaderboard = async (
  access_token: string,
  channel_id: string,
  queryParams: LeaderboardQueryParams,
): Promise<GetLeaderboardResponse> => {
  const queryString = buildLeaderboardQueryString(queryParams);

  const response = await authFetch(
    `/api/leaderboard/${channel_id}?${queryString}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result = (await response.json()) as AppResponse<GetLeaderboardResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch all-time leaderboard.');
  }

  return (
    result.data ?? {
      summary: {
        current_leader: 'No leader yet',
        current_leader_referrals: 0,
        participants: 0,
        total_referrals: 0,
      },
      leaderboard: [],
      pagination: {
        page: queryParams.page ?? 1,
        limit: queryParams.limit ?? 20,
        total: 0,
        total_pages: 0,
      },
    }
  );
};

export const useGetAllTimeLeaderboard = (
  queryParams: LeaderboardQueryParams = {},
) => {
  const {
    myChannel,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  return useQuery({
    queryKey: [
      ...queryKeys.leaderboard.allTime(myChannel?.id),
      queryParams.page ?? 1,
      queryParams.limit ?? 20,
      queryParams.search ?? '',
      queryParams.range ?? 'top10',
      queryParams.sort ?? 'referrals_desc',
    ],
    queryFn: async () => {
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

      if (!myChannel?.id) {
        throw new Error('Channel not found.');
      }

      return getAllTimeLeaderboard(
        session.access_token,
        myChannel.id,
        queryParams,
      );
    },
    enabled: isAuthenticated && !!myChannel?.id && !isAuthLoading,
    staleTime: 1000 * 60 * 2,
  });
};