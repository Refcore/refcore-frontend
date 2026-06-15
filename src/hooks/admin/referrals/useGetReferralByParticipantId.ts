'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import { GetReferralsResponse, ReferralStatus } from '@/types/referral.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type GetReferralByParticipantIdParams = {
  page?: number;
  limit?: number;
  search?: string;
  contest_id?: string | null;
  status?: ReferralStatus;
};

const getReferralByParticipantId = async (
  access_token: string,
  channel_id: string,
  participant_id: string,
  params?: GetReferralByParticipantIdParams,
): Promise<GetReferralsResponse> => {
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

  if (params?.contest_id?.trim()) {
    search_params.set('contest_id', params.contest_id.trim());
  }

  if (params?.status?.trim()) {
    search_params.set('status', params.status.trim());
  }

  search_params.set('referrer_participant_id', participant_id);

  const query_string = search_params.toString();

  const response = await authFetch(
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
    throw new Error(result.message || 'Failed to fetch participant referrals.');
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

export const useGetReferralByParticipantId = (
  participant_id?: string | null,
  params?: GetReferralByParticipantIdParams,
) => {
  const {
    myChannel,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  const safe_participant_id = participant_id?.trim() ?? '';
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const search = params?.search?.trim() ?? '';
  const contest_id = params?.contest_id?.trim() ?? '';
  const status = params?.status;

  return useQuery({
    queryKey: [
      ...queryKeys.referrals.byChannel(myChannel?.id),
      'by-participant',
      safe_participant_id,
      page,
      limit,
      search,
      contest_id,
      status,
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

      if (!safe_participant_id) {
        throw new Error('Participant id is required.');
      }

      return getReferralByParticipantId(
        session.access_token,
        myChannel.id,
        safe_participant_id,
        {
          ...params,
          page,
          limit,
          search,
          contest_id,
          status,
        },
      );
    },
    enabled:
      isAuthenticated &&
      !!myChannel?.id &&
      !!safe_participant_id &&
      !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });
};
