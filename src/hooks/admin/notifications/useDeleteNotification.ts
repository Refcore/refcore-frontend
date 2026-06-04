'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';
import { queryKeys } from '@/lib/query_keys';

type DeleteNotificationResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    deleted_id: string;
  } | null;
  error_code?: string;
};

const getResponseJson = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    throw new Error(
      response.status === 404
        ? 'Notification API route was not found. Please confirm the route path is correct.'
        : 'The server returned an invalid response. Please try again.',
    );
  }

  return response.json() as Promise<T>;
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (
      notification_id: string,
    ): Promise<DeleteNotificationResponse> => {
      if (!notification_id) {
        throw new Error('Notification ID is required.');
      }

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

      const response = await authFetch(
        `/api/notifications/${notification_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const result =
        await getResponseJson<DeleteNotificationResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete notification.');
      }

      return result;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while deleting notification.',
      );
    },
  });

  return {
    deleteNotification: mutate,
    deleteNotificationAsync: mutateAsync,
    is_deleting_notification: isPending,
  };
};
