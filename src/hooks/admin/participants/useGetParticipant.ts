'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import { ParticipantModel } from '@/types/participant.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type UseGetAlltimeParticipantParams = {
  participantId?: string | null;
  enabled?: boolean;
};

type ParticipantsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

type GetParticipantsResponse = {
  participants: ParticipantModel[];
  pagination: ParticipantsPagination;
};

const getAlltimeParticipant = async (
  access_token: string,
  channel_id: string,
  id: string,
): Promise<AppResponse<GetParticipantsResponse>> => {
  const search_params = new URLSearchParams();

  search_params.set('id', id);

  const response = await authFetch(
    `/api/participants/${channel_id}?${search_params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result =
    (await response.json()) as AppResponse<GetParticipantsResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch participant.');
  }

  return result;
};

export const useGetAlltimeParticipant = ({
  participantId,
  enabled = true,
}: UseGetAlltimeParticipantParams) => {
  const {
    myChannel,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  const query = useQuery({
    queryKey: [
      ...queryKeys.participants.byChannel(myChannel?.id),
      'single',
      participantId,
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

      if (!participantId) {
        throw new Error('Participant not found.');
      }

      return getAlltimeParticipant(
        session.access_token,
        myChannel.id,
        participantId,
      );
    },
    enabled:
      enabled &&
      isAuthenticated &&
      !!myChannel?.id &&
      !!participantId &&
      !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });

  const participant: ParticipantModel | null =
    query.data?.data?.participants?.[0] ?? null;

  return {
    ...query,
    participant,
    participantResponse: query.data,
    is_getting_alltime_participant: query.isLoading,
    is_fetching_alltime_participant: query.isFetching,
    is_get_alltime_participant_error: query.isError,
  };
};