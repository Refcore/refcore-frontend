'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import type { Contest } from '@/types/contest.type';
import type { CreateContestFormValues } from '@/schema/contest.schema';
import { queryKeys } from '@/lib/query_keys';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type UpdateContestResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: Contest | null;
  error_code?: string;
};

type UpdateContestPayload = CreateContestFormValues & {
  contest_id: string;
};

const getResponseJson = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    throw new Error(
      response.status === 404
        ? 'Contest API route was not found. Please confirm the route path is correct.'
        : 'The server returned an invalid response. Please try again.',
    );
  }

  return response.json() as Promise<T>;
};

export const useUpdateContest = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      contest_id,
      ...payload
    }: UpdateContestPayload): Promise<UpdateContestResponse> => {
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

      const response = await authFetch(`/api/contests/${contest_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await getResponseJson<UpdateContestResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update contest.');
      }

      return result;
    },

    onSuccess: async (result) => {
      toast.success(result.message || 'Contest updated successfully.');

      if (result.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.contests.single(result.data.id),
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.contests.all,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.all,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.allTime(),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.currentContest(),
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while updating the contest.',
      );
    },
  });

  return {
    updateContest: mutate,
    updateContestAsync: mutateAsync,
    is_updating_contest: isPending,
  };
};