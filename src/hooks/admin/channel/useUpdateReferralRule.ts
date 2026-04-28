'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import type { ReferralRules } from '@/types/rule.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';

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

  const updateReferralRule = async (
    payload: UpdateReferralRulePayload,
  ): Promise<AppResponse<UpdateReferralRuleResponseData>> => {
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
          referral_rules: payload.referral_rules,
        })
        .eq('id', myChannel.id)
        .select('id, owner_id, referral_rules')
        .single();

      if (error) {
        return {
          success: false,
          status_code: 400,
          message: error.message || 'Failed to update referral rule',
          data: null,
        };
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(myChannel.owner_id),
      });

      toast.success('Referral rule updated successfully');

      return {
        success: true,
        status_code: 200,
        message: 'Referral rule updated successfully',
        data: {
          channel_id: data.id,
          referral_rules: data.referral_rules,
          owner_id: data.owner_id,
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
    updateReferralRule,
  };
};
