import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { uploadProfilePicture } from '@/lib/storage/uploadProfilePicture';
import { deleteStorageFile } from '@/utils/deleteStoredFile';
import { AppResponse } from '@/types/response.type';

type UpdateProfilePayload = {
  user_id: string;
  user_name: string;
  profile_picture?: string | File | null;
};

type UpdateProfileResponseData = {
  user_id: string;
  profile_picture: string | null;
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<AppResponse<UpdateProfileResponseData>> => {
    const supabase = createClient();

    const { data: existing_user, error: existing_user_error } = await supabase
      .from('users')
      .select('profile_picture')
      .eq('id', payload.user_id)
      .single();

    if (existing_user_error) {
      return {
        success: false,
        status_code: 400,
        message:
          existing_user_error.message || 'Failed to fetch existing profile',
        data: null,
      };
    }

    const old_profile_picture = existing_user?.profile_picture ?? null;

    try {
      setLoading(true);

      let profile_picture = payload.profile_picture ?? null;

      if (profile_picture instanceof File) {
        const upload_result = await uploadProfilePicture({
          file: profile_picture,
          user_id: payload.user_id,
        });

        profile_picture = upload_result.file_path;
      }

      const update_payload = {
        user_name: payload.user_name,
        profile_picture,
      };

      const { data, error } = await supabase
        .from('users')
        .update(update_payload)
        .eq('id', payload.user_id)
        .select('id, profile_picture')
        .single();

      if (error) {
        return {
          success: false,
          status_code: 400,
          message: error.message || 'Failed to update profile',
          data: null,
        };
      }

      if (
        payload.profile_picture instanceof File &&
        old_profile_picture &&
        old_profile_picture !== profile_picture
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

      toast.success('Profile updated successfully');

      return {
        success: true,
        status_code: 200,
        message: 'Profile updated successfully',
        data: {
          user_id: data.id,
          profile_picture: data.profile_picture,
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
    updateProfile,
  };
};
