'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import type { Contest } from '@/types/contest.type';
import { queryKeys } from '@/lib/query_keys';

type EndContestResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: Contest | null;
  error_code?: string;
};

type EndContestPayload = {
  contest_id: string;
};

export const useEndContest = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      contest_id,
    }: EndContestPayload): Promise<EndContestResponse> => {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('You must be logged in to end this contest.');
      }

      const response = await fetch(`/api/contests/${contest_id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = (await response.json()) as EndContestResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to end contest.');
      }

      return result;
    },

    onSuccess: async (result) => {
      toast.success(result.message || 'Contest ended successfully.');

      await queryClient.invalidateQueries({
        queryKey: queryKeys.contests.all,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.all,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.allTime(),
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while ending the contest.',
      );
    },
  });

  return {
    endContest: mutate,
    endContestAsync: mutateAsync,
    is_ending_contest: isPending,
  };
};