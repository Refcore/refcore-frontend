'use client';

import { useState } from 'react';
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
  const supabase = createClient();

  const updateNotificationSettings = async (
    payload: UpdateNotificationSettingsPayload,
  ): Promise<AppResponse<UpdateNotificationSettingsResponseData>> => {
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

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        return {
          success: false,
          status_code: 401,
          message: 'You must be signed in to update notification settings.',
          data: null,
          error_code: sessionError?.code,
        };
      }

      const response = await fetch('/api/channels/notification-settings/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          channel_id: myChannel.id,
          notification_settings: payload.notification_settings,
        }),
      });

      const result =
        (await response.json()) as AppResponse<UpdateNotificationSettingsResponseData>;

      if (!response.ok || !result.success) {
        return result;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.channels.myChannel(result.data?.owner_id),
      });

      return result;
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