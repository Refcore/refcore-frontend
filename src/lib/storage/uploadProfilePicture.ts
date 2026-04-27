import { createClient } from '@/utils/supabase/client';

type UploadProfilePictureParams = {
  file: File;
  user_id: string;
};

type UploadProfilePictureResponse = {
  file_path: string;
};

const getFileExtension = (file: File) => {
  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || 'jpg' : 'jpg';
};

export const uploadProfilePicture = async ({
  file,
  user_id,
}: UploadProfilePictureParams): Promise<UploadProfilePictureResponse> => {
  const supabase = createClient();

  const file_extension = getFileExtension(file);
  const file_name = `avatar-${Date.now()}.${file_extension}`;
  const file_path = `${user_id}/${file_name}`;

  const { error } = await supabase.storage
    .from('profile_pictures')
    .upload(file_path, file, {
      upsert: true,
    });

  if (error) {
    throw new Error(error.message || 'Failed to upload profile picture');
  }

  return { file_path };
};