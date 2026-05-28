'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import type { ReferralRules } from '@/types/rule.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type UpdateReferralRulePayload = {
  referral_rules: ReferralRules;
};

type UpdateReferralRuleResponseData = {
  channel_id: string;
  referral_rules: ReferralRules;
  owner_id: string;
};

export const useUpdateReferralRule = () => {
  const [loading, setLoading] = useState(false);
  const { myChannel } = useAuthContext();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const updateReferralRule = async (
    payload: UpdateReferralRulePayload,
  ): Promise<AppResponse<UpdateReferralRuleResponseData>> => {
    try {
      setLoading(true);

      if (!myChannel?.id) {
        const errorResponse: AppResponse<UpdateReferralRuleResponseData> = {
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

        const errorResponse: AppResponse<UpdateReferralRuleResponseData> = {
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

        const errorResponse: AppResponse<UpdateReferralRuleResponseData> = {
          success: false,
          status_code: 401,
          message: 'Your session has expired. Please sign in again.',
          data: null,
        };

        return errorResponse;
      }

      const response = await authFetch('/api/channels/referral-rules/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          channel_id: myChannel.id,
          referral_rules: payload.referral_rules,
        }),
      });

      const result =
        (await response.json()) as AppResponse<UpdateReferralRuleResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to update referral rule');
        return result;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(result.data?.owner_id),
      });

      toast.success(result.message || 'Referral rule updated successfully');

      return result;
    } catch (error) {
      console.error('Update referral rule hook error:', error);

      const errorResponse: AppResponse<UpdateReferralRuleResponseData> = {
        success: false,
        status_code: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while updating the referral rule.',
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
    updateReferralRule,
  };
};
