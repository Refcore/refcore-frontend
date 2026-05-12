import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { uploadChannelBanner } from '@/lib/storage/uploadChannelBanner';
import { deleteStorageFile } from '@/utils/deleteStoredFile';
import { AppResponse } from '@/types/response.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';

type UpdateChannelPayload = {
  channel_id: string;
  tv_name: string;
  slug: string;
  whatsapp_number: string;
  channel_members_limit?: number | null;
  channel_banner?: string | File | null;
};

type UpdateChannelResponseData = {
  channel_id: string;
  owner_id: string;
  channel_banner: string | null;
  old_channel_banner?: string | null;
};

export const useUpdateChannel = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const updateChannel = async (
    payload: UpdateChannelPayload,
  ): Promise<AppResponse<UpdateChannelResponseData>> => {
    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        const errorResponse: AppResponse<UpdateChannelResponseData> = {
          success: false,
          status_code: 401,
          message: 'You must be signed in to update your channel.',
          data: null,
          error_code: sessionError?.code,
        };

        toast.error(errorResponse.message);
        return errorResponse;
      }

      let channel_banner = payload.channel_banner ?? null;

      if (channel_banner instanceof File) {
        const upload_result = await uploadChannelBanner({
          file: channel_banner,
          channel_id: payload.channel_id,
        });

        channel_banner = upload_result.file_path;
      }

      const response = await fetch('/api/channels/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          channel_id: payload.channel_id,
          tv_name: payload.tv_name,
          slug: payload.slug,
          whatsapp_number: payload.whatsapp_number,
          channel_members_limit: payload.channel_members_limit ?? null,
          channel_banner,
        }),
      });

      const result =
        (await response.json()) as AppResponse<UpdateChannelResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to update channel');
        return result;
      }

      const old_channel_banner = result.data?.old_channel_banner ?? null;
      const new_channel_banner = result.data?.channel_banner ?? null;

      if (
        payload.channel_banner instanceof File &&
        old_channel_banner &&
        old_channel_banner !== new_channel_banner
      ) {
        try {
          await deleteStorageFile({
            bucket: 'channel_banner',
            file_path: old_channel_banner,
          });
        } catch (delete_error) {
          console.error('Failed to delete old channel banner:', delete_error);
        }
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(result.data?.owner_id),
      });

      toast.success(result.message || 'Channel updated successfully');

      return result;
    } catch (error) {
      const errorResponse: AppResponse<UpdateChannelResponseData> = {
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
    updateChannel,
  };
};
