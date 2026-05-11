import { createClient } from '@/utils/supabase/client';

type UploadChannelBannerParams = {
  file: File;
  channel_id: string;
};

type UploadChannelBannerResponse = {
  file_path: string;
};

const getFileExtension = (file: File) => {
  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || 'jpg' : 'jpg';
};

export const uploadChannelBanner = async ({
  file,
  channel_id,
}: UploadChannelBannerParams): Promise<UploadChannelBannerResponse> => {
  const supabase = createClient();

  const file_extension = getFileExtension(file);
  const file_name = `banner-${Date.now()}.${file_extension}`;
  const file_path = `${channel_id}/${file_name}`;

  const { error } = await supabase.storage
    .from('channel_banners')
    .upload(file_path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message || 'Failed to upload channel banner');
  }

  return { file_path };
};
