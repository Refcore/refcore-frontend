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
  channel_banner: string | null;
};

export const useUpdateChannel = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateChannel = async (
    payload: UpdateChannelPayload,
  ): Promise<AppResponse<UpdateChannelResponseData>> => {
    const supabase = createClient();

    try {
      setLoading(true);

      const { data: existing_channel, error: existing_channel_error } =
        await supabase
          .from('channels')
          .select('channel_banner')
          .eq('id', payload.channel_id)
          .single();

      if (existing_channel_error) {
        return {
          success: false,
          status_code: 400,
          message:
            existing_channel_error.message ||
            'Failed to fetch existing channel',
          data: null,
        };
      }

      const old_channel_banner = existing_channel?.channel_banner ?? null;

      let channel_banner = payload.channel_banner ?? null;

      if (channel_banner instanceof File) {
        const upload_result = await uploadChannelBanner({
          file: channel_banner,
          channel_id: payload.channel_id,
        });

        channel_banner = upload_result.file_path;
      }

      const update_payload = {
        tv_name: payload.tv_name,
        slug: payload.slug,
        whatsapp_number: payload.whatsapp_number,
        channel_members_limit: payload.channel_members_limit ?? null,
        channel_banner,
      };

      const { data, error } = await supabase
        .from('channels')
        .update(update_payload)
        .eq('id', payload.channel_id)
        .select('id, owner_id, channel_banner')
        .single();

      if (error) {
        return {
          success: false,
          status_code: 400,
          message: error.message || 'Failed to update channel',
          data: null,
        };
      }

      if (
        payload.channel_banner instanceof File &&
        old_channel_banner &&
        old_channel_banner !== channel_banner
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
        queryKey: queryKeys.channels.myChannel(data.owner_id),
      });

      toast.success('Channel updated successfully');

      return {
        success: true,
        status_code: 200,
        message: 'Channel updated successfully',
        data: {
          channel_id: data.id,
          channel_banner: data.channel_banner,
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
    updateChannel,
  };
};
