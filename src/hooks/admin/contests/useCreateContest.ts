'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import { Contest } from '@/types/contest.type';
import { CreateContestFormValues } from '@/schema/contest.schema';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';

type CreateContestResponseData = Contest & {
  channel_id: string;
};

export const useCreateContest = () => {
  const [loading, setLoading] = useState(false);
  const { myChannel } = useAuthContext();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const createContest = async (
    payload: CreateContestFormValues,
  ): Promise<AppResponse<CreateContestResponseData>> => {
    try {
      setLoading(true);

      if (!myChannel?.id) {
        const errorResponse: AppResponse<CreateContestResponseData> = {
          success: false,
          status_code: 400,
          message: 'Channel not found.',
          data: null,
        };

        toast.error(errorResponse.message);
        return errorResponse;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        const errorResponse: AppResponse<CreateContestResponseData> = {
          success: false,
          status_code: 401,
          message: 'You must be signed in to create a contest.',
          data: null,
          error_code: sessionError?.code,
        };

        toast.error(errorResponse.message);
        return errorResponse;
      }

      const response = await fetch('/api/contests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...payload,
          channel_id: myChannel.id,
        }),
      });

      const result =
        (await response.json()) as AppResponse<CreateContestResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to create contest.');
        return result;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.contests.byChannel(myChannel.id),
      });

      toast.success(result.message || 'Contest created successfully.');

      return result;
    } catch (error) {
      const errorResponse: AppResponse<CreateContestResponseData> = {
        success: false,
        status_code: 500,
        message:
          error instanceof Error ? error.message : 'Something went wrong',
        data: null,
      };

      toast.error(errorResponse.message);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createContest,
  };
};
