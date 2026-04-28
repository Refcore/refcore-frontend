'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import { NotificationSettings } from '@/types/notificationsettings.type';


type UpdateNotificationSettingsPayload = {
  notification_settings: NotificationSettings;
};

type UpdateNotificationSettingsResponseData = {
  channel_id: string;
  notification_settings: NotificationSettings;
};

export const useUpdateNotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const { myChannel } = useAuthContext();

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
        .select('id, notification_settings')
        .single();

      if (error) {
        return {
          success: false,
          status_code: 400,
          message: error.message || 'Failed to update notification settings',
          data: null,
        };
      }

      toast.success('Notification settings updated successfully');

      return {
        success: true,
        status_code: 200,
        message: 'Notification settings updated successfully',
        data: {
          channel_id: data.id,
          notification_settings: data.notification_settings,
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