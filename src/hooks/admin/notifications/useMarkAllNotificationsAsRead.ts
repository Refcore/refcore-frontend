'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';
import { queryKeys } from '@/lib/query_keys';

type MarkAllNotificationsAsReadPayload = {
  scope?: 'user' | 'channel' | 'all';
  channel_id?: string | null;
  contest_id?: string | null;
  type?: string | null;
};

type MarkAllNotificationsAsReadResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    updated_count: number;
  } | null;
  error_code?: string;
};

const getResponseJson = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    throw new Error(
      response.status === 404
        ? 'Notifications API route was not found. Please confirm the route path is correct.'
        : 'The server returned an invalid response. Please try again.',
    );
  }

  return response.json() as Promise<T>;
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (
      payload?: MarkAllNotificationsAsReadPayload,
    ): Promise<MarkAllNotificationsAsReadResponse> => {
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

      const response = await authFetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload ?? { scope: 'all' }),
      });

      const result =
        await getResponseJson<MarkAllNotificationsAsReadResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Failed to mark all notifications as read.',
        );
      }

      return result;
    },

    onSuccess: async (result) => {
      if (result.data?.updated_count) {
        toast.success(result.message || 'Notifications marked as read.');
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while marking all notifications as read.',
      );
    },
  });

  return {
    markAllNotificationsAsRead: mutate,
    markAllNotificationsAsReadAsync: mutateAsync,
    is_marking_all_notifications_as_read: isPending,
  };
};