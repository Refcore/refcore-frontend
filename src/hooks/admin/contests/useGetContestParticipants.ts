'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';
import { GetContestParticipantsResponse } from '@/types/contest-participant.type';

type GetContestParticipantsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

const getContestParticipants = async (
  access_token: string,
  contestId: string,
  params?: GetContestParticipantsParams,
): Promise<GetContestParticipantsResponse> => {
  const search_params = new URLSearchParams();

  if (params?.page && params.page > 0) {
    search_params.set('page', String(params.page));
  }

  if (params?.limit && params.limit > 0) {
    search_params.set('limit', String(params.limit));
  }

  if (params?.search?.trim()) {
    search_params.set('search', params.search.trim());
  }

  const query_string = search_params.toString();

  const response = await authFetch(
    `/api/contests/${contestId}/participants${
      query_string ? `?${query_string}` : ''
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result =
    (await response.json()) as AppResponse<GetContestParticipantsResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch contest participants.');
  }

  return (
    result.data ?? {
      participants: [],
      pagination: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        total: 0,
        total_pages: 0,
      },
    }
  );
};

export const useGetContestParticipants = (
  contest_id?: string | null,
  params?: GetContestParticipantsParams,
) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const search = params?.search?.trim() ?? '';

  return useQuery({
    queryKey: [
      ...queryKeys.contestParticipants.byContest(contest_id),
      page,
      limit,
      search,
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

      if (!contest_id) {
        throw new Error('Contest not found.');
      }

      return getContestParticipants(session.access_token, contest_id, {
        ...params,
        page,
        limit,
        search,
      });
    },
    enabled: !!contest_id,
    staleTime: 1000 * 60 * 5,
  });
};