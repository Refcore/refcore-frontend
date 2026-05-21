import { LeaderboardQueryParams } from '@/types/leaderboard.type';

export const buildLeaderboardQueryString = ({
  page = 1,
  limit = 20,
  search = '',
  range = 'top10',
  sort = 'referrals_desc',
}: LeaderboardQueryParams) => {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('range', range);
  params.set('sort', sort);

  if (search.trim()) {
    params.set('search', search.trim());
  }

  return params.toString();
};