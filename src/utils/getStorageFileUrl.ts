import { createClient } from './supabase/client';

export const getStorageFileUrl = (
  bucket: 'profile_pictures' | 'channel_banners',
  path?: string | null,
) => {
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};