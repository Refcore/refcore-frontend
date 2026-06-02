'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { AppResponse } from '@/types/response.type';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';
import type { NotificationItem } from '@/types/notification.type';

type NotificationModel = NotificationItem;

type GetNotificationsParams = {
  scope?: 'user' | 'channel' | 'all';
  channel_id?: string;
  contest_id?: string;
  is_read?: boolean;
  type?: string;
  page?: number;
  limit?: number;
};

type NotificationsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  can_previous_page: boolean;
  can_next_page: boolean;
};

type GetNotificationsResponse = {
  notifications: NotificationModel[];
  pagination: NotificationsPagination;
  unread_count: number;
};

const getNotifications = async (
  access_token: string,
  params?: GetNotificationsParams,
): Promise<GetNotificationsResponse> => {
  const search_params = new URLSearchParams();

  if (params?.scope) {
    search_params.set('scope', params.scope);
  }

  if (
    (params?.scope === 'channel' || params?.scope === 'all') &&
    params.channel_id
  ) {
    search_params.set('channel_id', params.channel_id);
  }

  if (params?.contest_id) {
    search_params.set('contest_id', params.contest_id);
  }

  if (typeof params?.is_read === 'boolean') {
    search_params.set('is_read', String(params.is_read));
  }

  if (params?.type) {
    search_params.set('type', params.type);
  }

  if (params?.page) {
    search_params.set('page', String(params.page));
  }

  if (params?.limit) {
    search_params.set('limit', String(params.limit));
  }

  const query_string = search_params.toString();

  const response = await authFetch(
    `/api/notifications${query_string ? `?${query_string}` : ''}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const result =
    (await response.json()) as AppResponse<GetNotificationsResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to fetch notifications.');
  }

  return (
    result.data ?? {
      notifications: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 0,
        can_previous_page: false,
        can_next_page: false,
      },
      unread_count: 0,
    }
  );
};

export const useGetNotifications = (params?: GetNotificationsParams) => {
  const {
    myChannel,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  const scope = params?.scope ?? 'all';

  const channelId =
    scope === 'channel' || scope === 'all'
      ? (params?.channel_id ?? myChannel?.id)
      : undefined;

  const canRunQuery =
    isAuthenticated &&
    !isAuthLoading &&
    (scope === 'user' || Boolean(channelId));

  return useQuery({
    queryKey: [
      'notifications',
      scope,
      channelId ?? 'no-channel',
      params?.contest_id ?? 'all',
      typeof params?.is_read === 'boolean' ? String(params.is_read) : 'all',
      params?.type ?? 'all',
      params?.page ?? 1,
      params?.limit ?? 20,
    ],
    queryFn: async () => {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        await handleExpiredSession();
        throw new Error(sessionError.message);
      }

      if (!session?.access_token) {
        await handleExpiredSession();
        throw new Error('Your session has expired. Please sign in again.');
      }

      return getNotifications(session.access_token, {
        ...params,
        scope,
        channel_id: channelId,
      });
    },
    enabled: canRunQuery,
    staleTime: 1000 * 60 * 2,
  });
};