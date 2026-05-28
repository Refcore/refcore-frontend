'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import { ContestDefaults } from '@/types/contest.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type UpdateContestDefaultsResponseData = {
  channel_id: string;
  owner_id: string;
  contest_defaults: ContestDefaults;
};

export const useUpdateContestDefaults = () => {
  const [loading, setLoading] = useState(false);
  const { myChannel } = useAuthContext();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const updateContestDefaults = async (
    contest_defaults: ContestDefaults,
  ): Promise<AppResponse<UpdateContestDefaultsResponseData>> => {
    try {
      setLoading(true);

      if (!myChannel?.id) {
        const errorResponse: AppResponse<UpdateContestDefaultsResponseData> = {
          success: false,
          status_code: 400,
          message: 'Channel not found',
          data: null,
        };

        toast.error(errorResponse.message);
        return errorResponse;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        await handleExpiredSession();

        const errorResponse: AppResponse<UpdateContestDefaultsResponseData> = {
          success: false,
          status_code: 401,
          message: sessionError.message,
          data: null,
          error_code: sessionError.code,
        };

        return errorResponse;
      }

      if (!session?.access_token) {
        await handleExpiredSession();

        const errorResponse: AppResponse<UpdateContestDefaultsResponseData> = {
          success: false,
          status_code: 401,
          message: 'Your session has expired. Please sign in again.',
          data: null,
        };

        return errorResponse;
      }

      const response = await authFetch(
        '/api/channels/contest-defaults/update',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            channel_id: myChannel.id,
            contest_defaults,
          }),
        },
      );

      const result =
        (await response.json()) as AppResponse<UpdateContestDefaultsResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to update contest defaults');
        return result;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(result.data?.owner_id),
      });

      toast.success(result.message || 'Contest defaults updated successfully');

      return result;
    } catch (error) {
      const errorResponse: AppResponse<UpdateContestDefaultsResponseData> = {
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
    updateContestDefaults,
  };
};
