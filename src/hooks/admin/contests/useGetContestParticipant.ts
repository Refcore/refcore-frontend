'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { AppResponse } from '@/types/response.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';
import {
  ContestParticipantModel,
  GetContestParticipantsResponse,
} from '@/types/contest-participant.type';

type UseGetContestParticipantParams = {
  contestId?: string | null;
  participantId?: string | null;
  enabled?: boolean;
};

const getContestParticipant = async (
  access_token: string,
  contest_id: string,
  participant_id: string,
): Promise<AppResponse<GetContestParticipantsResponse>> => {
  const search_params = new URLSearchParams();

  search_params.set('participantId', participant_id);

  const response = await authFetch(
    `/api/contests/${contest_id}/participants?${search_params.toString()}`,
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
    throw new Error(result.message || 'Failed to fetch contest participant.');
  }

  return result;
};

export const useGetContestParticipant = ({
  contestId,
  participantId,
  enabled = true,
}: UseGetContestParticipantParams) => {
  const query = useQuery({
    queryKey: [
      ...queryKeys.contestParticipants.byContest(contestId),
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

      if (!contestId) {
        throw new Error('Contest not found.');
      }

      if (!participantId) {
        throw new Error('Participant not found.');
      }

      return getContestParticipant(
        session.access_token,
        contestId,
        participantId,
      );
    },
    enabled: enabled && Boolean(contestId) && Boolean(participantId),
    staleTime: 1000 * 60 * 5,
  });

  const contestParticipant: ContestParticipantModel | null =
    query.data?.data?.participants?.[0] ?? null;

  return {
    ...query,
    contestParticipant,
    contestParticipantResponse: query.data,
    is_getting_contest_participant: query.isLoading,
    is_fetching_contest_participant: query.isFetching,
    is_get_contest_participant_error: query.isError,
  };
};
