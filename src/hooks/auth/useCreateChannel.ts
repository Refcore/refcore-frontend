import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import type { RegisterChannelFormData } from '@/schema/register.schema';
import { AppResponse } from '@/types/response.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

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

      if (sessionError) {
        await handleExpiredSession();

        const errorResponse: AppResponse<CreateChannelResponseData> = {
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

        const errorResponse: AppResponse<CreateChannelResponseData> = {
          success: false,
          status_code: 401,
          message: 'Your session has expired. Please sign in again.',
          data: null,
        };

        return errorResponse;
      }

      const response = await authFetch('/api/channels/create', {
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
    } catch (error) {
      console.error('Create channel hook error:', error);

      const errorResponse: AppResponse<CreateChannelResponseData> = {
        success: false,
        status_code: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while creating the channel.',
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
