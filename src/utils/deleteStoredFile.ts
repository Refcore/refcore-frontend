import { createClient } from '@/utils/supabase/client';

type DeleteStorageFileParams = {
  bucket: 'profile_pictures' | 'channel_banner';
  file_path: string;
};

export const deleteStorageFile = async ({
  bucket,
  file_path,
}: DeleteStorageFileParams) => {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([file_path]);

  if (error) {
    throw new Error(error.message || 'Failed to delete old file');
  }
};