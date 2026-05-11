import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import type { RegisterChannelFormData } from '@/schema/register.schema';
import { AppResponse } from '@/types/response.type';

type CreateChannelResponseData = {
  channel_id: string;
  owner_id: string;
  slug: string;
  whatsapp_verified: boolean;
  status: string;
};

export const useCreateChannel = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const createChannel = async (
    payload: RegisterChannelFormData,
  ): Promise<AppResponse<CreateChannelResponseData>> => {
    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        const errorResponse: AppResponse<CreateChannelResponseData> = {
          success: false,
          status_code: 401,
          message: 'You must be signed in to create a channel.',
          data: null,
          error_code: sessionError?.code,
        };

        toast.error(errorResponse.message);
        return errorResponse;
      }

      const response = await fetch('/api/channels/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result =
        (await response.json()) as AppResponse<CreateChannelResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Unable to create channel.');
        return result;
      }

      toast.success(result.message || 'Channel created successfully.');

      return result;
    } catch {
      const errorResponse: AppResponse<CreateChannelResponseData> = {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the channel.',
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
    createChannel,
  };
};
