'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import { ContestDefaults } from '@/types/contest.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';

type UpdateContestDefaultsResponseData = {
  channel_id: string;
  contest_defaults: ContestDefaults;
};

export const useUpdateContestDefaults = () => {
  const [loading, setLoading] = useState(false);
  const { myChannel } = useAuthContext();
  const queryClient = useQueryClient();

  const updateContestDefaults = async (
    contest_defaults: ContestDefaults,
  ): Promise<AppResponse<UpdateContestDefaultsResponseData>> => {
    const supabase = createClient();

    try {
      setLoading(true);

      if (!myChannel?.id) {
        return {
          success: false,
          status_code: 400,
          message: 'Channel not found',
          data: null,
        };
      }

      const { data, error } = await supabase
        .from('channels')
        .update({
          contest_defaults,
        })
        .eq('id', myChannel.id)
        .select('id, contest_defaults')
        .single();

      if (error) {
        return {
          success: false,
          status_code: 400,
          message: error.message || 'Failed to update contest defaults',
          data: null,
        };
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(myChannel.owner_id),
      });

      toast.success('Contest defaults updated successfully');

      return {
        success: true,
        status_code: 200,
        message: 'Contest defaults updated successfully',
        data: {
          channel_id: data.id,
          contest_defaults: data.contest_defaults,
        },
      };
    } catch (error) {
      return {
        success: false,
        status_code: 500,
        message:
          error instanceof Error ? error.message : 'Something went wrong',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateContestDefaults,
  };
};
