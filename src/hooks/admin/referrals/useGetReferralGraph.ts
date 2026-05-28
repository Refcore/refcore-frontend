'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import {
  GetReferralGraphResponse,
  ReferralGraphRange,
} from '@/types/referral.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

const getReferralGraph = async (
  access_token: string,
  channel_id: string,
  range: ReferralGraphRange,
): Promise<GetReferralGraphResponse> => {
  const response = await authFetch(
    `/api/referrals/${channel_id}/graph?range=${range}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result =
    (await response.json()) as AppResponse<GetReferralGraphResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch referral graph data.');
  }

  return (
    result.data ?? {
      range,
      graph_data: [],
      joins_per_day: [],
    }
  );
};

export const useGetReferralGraph = (range: ReferralGraphRange) => {
  const {
    myChannel,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  return useQuery({
    queryKey: [...queryKeys.referrals.byChannel(myChannel?.id), 'graph', range],
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

      return getReferralGraph(session.access_token, myChannel.id, range);
    },
    enabled: isAuthenticated && !!myChannel?.id && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });
};