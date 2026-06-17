'use client';

import { useQuery } from '@tanstack/react-query';
import { AppResponse } from '@/types/response.type';
import { PublicContestLeaderboardResponse } from '@/types/public-leaderboard';

const getPublicContestLeaderboard = async (
  contest_id: string,
): Promise<PublicContestLeaderboardResponse> => {
  const clean_contest_id = contest_id.trim();

  const response = await fetch(
    `/api/public/contests/${encodeURIComponent(clean_contest_id)}/leaderboard`,
    {
      method: 'GET',
    },
  );

  const result =
    (await response.json()) as AppResponse<PublicContestLeaderboardResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to fetch contest leaderboard.');
  }

  if (!result.data) {
    throw new Error('Contest leaderboard data was not returned.');
  }

  return result.data;
};

export const useGetPublicContestLeaderboard = (
  contest_id?: string | null,
) => {
  const clean_contest_id = contest_id?.trim() ?? '';

  return useQuery({
    queryKey: ['public', 'contests', clean_contest_id, 'leaderboard'],
    queryFn: () => getPublicContestLeaderboard(clean_contest_id),
    enabled: clean_contest_id.length > 0,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
};