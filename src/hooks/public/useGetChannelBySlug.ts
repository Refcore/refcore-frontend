'use client';

import { useQuery } from '@tanstack/react-query';
import { AppResponse } from '@/types/response.type';
import { PublicChannelBySlugResponse } from '@/types/public-channel.type';

const getChannelBySlug = async (
  slug: string,
): Promise<PublicChannelBySlugResponse> => {
  const clean_slug = slug.trim();

  const response = await fetch(
    `/api/public/channels/${encodeURIComponent(clean_slug)}`,
    {
      method: 'GET',
    },
  );

  const result =
    (await response.json()) as AppResponse<PublicChannelBySlugResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to fetch channel.');
  }

  if (!result.data) {
    throw new Error('Channel data was not returned.');
  }

  return result.data;
};

export const useGetChannelBySlug = (slug?: string | null) => {
  const clean_slug = slug?.trim() ?? '';

  return useQuery({
    queryKey: ['public', 'channels', 'by-slug', clean_slug],
    queryFn: () => getChannelBySlug(clean_slug),
    enabled: clean_slug.length > 0,
    staleTime: 1000 * 60 * 2,
  });
};
