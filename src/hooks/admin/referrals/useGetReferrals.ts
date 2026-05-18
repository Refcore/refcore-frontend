'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import { GetReferralsResponse } from '@/types/referral.type';

type GetReferralsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

const getReferrals = async (
  access_token: string,
  channel_id: string,
  params?: GetReferralsParams,
): Promise<GetReferralsResponse> => {
  const search_params = new URLSearchParams();

  if (params?.page) {
    search_params.set('page', String(params.page));
  }

  if (params?.limit) {
    search_params.set('limit', String(params.limit));
  }

  if (params?.search) {
    search_params.set('search', params.search);
  }

  const query_string = search_params.toString();

  const response = await fetch(
    `/api/referrals/${channel_id}${query_string ? `?${query_string}` : ''}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result = (await response.json()) as AppResponse<GetReferralsResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch referrals.');
  }

  return (
    result.data ?? {
      referrals: [],
      pagination: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        total: 0,
        total_pages: 0,
      },
    }
  );
};

export const useGetReferrals = (params?: GetReferralsParams) => {
  const {
    myChannel,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  return useQuery({
    queryKey: [
      ...queryKeys.referrals.byChannel(myChannel?.id),
      params?.page ?? 1,
      params?.limit ?? 20,
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
        throw new Error('You must be signed in to fetch referrals.');
      }

      if (!myChannel?.id) {
        throw new Error('Channel not found.');
      }

      return getReferrals(session.access_token, myChannel.id, params);
    },
    enabled: isAuthenticated && !!myChannel?.id && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });
};
