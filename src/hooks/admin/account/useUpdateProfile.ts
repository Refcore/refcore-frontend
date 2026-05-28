import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { uploadProfilePicture } from '@/lib/storage/uploadProfilePicture';
import { deleteStorageFile } from '@/utils/deleteStoredFile';
import { AppResponse } from '@/types/response.type';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query_keys';
import { authFetch, handleExpiredSession } from '@/lib/authFetch';

type UpdateProfilePayload = {
  user_id: string;
  user_name: string;
  profile_picture?: string | File | null;
};

type UpdateProfileResponseData = {
  user_id: string;
  profile_picture: string | null;
  old_profile_picture?: string | null;
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const updateProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<AppResponse<UpdateProfileResponseData>> => {
    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        await handleExpiredSession();

        const errorResponse: AppResponse<UpdateProfileResponseData> = {
          success: false,
          status_code: 401,
          message: sessionError.message,
          data: null,
          error_code: sessionError.code,
        };

        return errorResponse;
      }

      if (!session?.access_token || !session.user?.id) {
        await handleExpiredSession();

        const errorResponse: AppResponse<UpdateProfileResponseData> = {
          success: false,
          status_code: 401,
          message: 'Your session has expired. Please sign in again.',
          data: null,
        };

        return errorResponse;
      }

      let profile_picture = payload.profile_picture ?? null;

      if (profile_picture instanceof File) {
        const upload_result = await uploadProfilePicture({
          file: profile_picture,
          user_id: session.user.id,
        });

        profile_picture = upload_result.file_path;
      }

      const response = await authFetch('/api/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_name: payload.user_name,
          profile_picture,
        }),
      });

      const result =
        (await response.json()) as AppResponse<UpdateProfileResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Failed to update profile');
        return result;
      }

      const old_profile_picture = result.data?.old_profile_picture ?? null;
      const new_profile_picture = result.data?.profile_picture ?? null;

      if (
        payload.profile_picture instanceof File &&
        old_profile_picture &&
        old_profile_picture !== new_profile_picture
      ) {
        try {
          await deleteStorageFile({
            bucket: 'profile_pictures',
            file_path: old_profile_picture,
          });
        } catch (delete_error) {
          console.error('Failed to delete old profile picture:', delete_error);
        }
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });

      toast.success(result.message || 'Profile updated successfully');

      return result;
    } catch (error) {
      const errorResponse: AppResponse<UpdateProfileResponseData> = {
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
    updateProfile,
  };
};