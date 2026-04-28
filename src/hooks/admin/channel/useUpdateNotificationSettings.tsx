'use client';

import { useState } from 'react';
// import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import { NotificationSettings } from '@/types/notificationsettings.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';

type UpdateNotificationSettingsPayload = {
  notification_settings: NotificationSettings;
};

type UpdateNotificationSettingsResponseData = {
  channel_id: string;
  notification_settings: NotificationSettings;
  owner_id: string;
};

export const useUpdateNotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const { myChannel } = useAuthContext();
  const queryClient = useQueryClient();

  const updateNotificationSettings = async (
    payload: UpdateNotificationSettingsPayload,
  ): Promise<AppResponse<UpdateNotificationSettingsResponseData>> => {
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
          notification_settings: payload.notification_settings,
        })
        .eq('id', myChannel.id)
        .select('id, owner_id, notification_settings')
        .single();

      if (error) {
        return {
          success: false,
          status_code: 400,
          message: error.message || 'Failed to update notification settings',
          data: null,
        };
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(myChannel.owner_id),
      });

      // toast.success('Notification settings updated successfully');

      return {
        success: true,
        status_code: 200,
        message: 'Notification settings updated successfully',
        data: {
          channel_id: data.id,
          notification_settings: data.notification_settings,
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
    updateNotificationSettings,
  };
};
