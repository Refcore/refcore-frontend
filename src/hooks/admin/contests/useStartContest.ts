'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import type { Contest } from '@/types/contest.type';
import { queryKeys } from '@/lib/query_keys';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type StartContestResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: Contest | null;
  error_code?: string;
};

type StartContestPayload = {
  contest_id: string;
};

export const useStartContest = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      contest_id,
    }: StartContestPayload): Promise<StartContestResponse> => {
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
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = (await response.json()) as StartContestResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to start contest.');
      }

      return result;
    },

    onSuccess: async (result) => {
      toast.success(result.message || 'Contest started successfully.');

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
          : 'Something went wrong while starting the contest.',
      );
    },
  });

  return {
    startContest: mutate,
    startContestAsync: mutateAsync,
    is_starting_contest: isPending,
  };
};