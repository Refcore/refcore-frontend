'use client';

import { useQuery } from '@tanstack/react-query';
import { AppResponse } from '@/types/response.type';
import { SearchPublicChannelsResponse } from '@/types/public-channel.type';

type SearchPublicChannelsParams = {
  search?: string;
  limit?: number;
};

const searchPublicChannels = async (
  params?: SearchPublicChannelsParams,
): Promise<SearchPublicChannelsResponse> => {
  const search_params = new URLSearchParams();

  const search = params?.search?.trim() ?? '';
  const limit = params?.limit ?? 10;

  if (search) {
    search_params.set('search', search);
  }

  if (limit > 0) {
    search_params.set('limit', String(limit));
  }

  const query_string = search_params.toString();

  const response = await fetch(
    `/api/public/channels${query_string ? `?${query_string}` : ''}`,
    {
      method: 'GET',
    },
  );

  const result =
    (await response.json()) as AppResponse<SearchPublicChannelsResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to search channels.');
  }

  return (
    result.data ?? {
      channels: [],
      match_type: null,
    }
  );
};

export const useSearchPublicChannels = (
  params?: SearchPublicChannelsParams,
) => {
  const search = params?.search?.trim() ?? '';
  const limit = params?.limit ?? 10;

  return useQuery({
    queryKey: ['public', 'channels', 'search', search, limit],
    queryFn: () =>
      searchPublicChannels({
        search,
        limit,
      }),
    enabled: search.length > 0,
    staleTime: 1000 * 60 * 2,
  });
};