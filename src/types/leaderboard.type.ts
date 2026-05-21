export type LeaderboardRange = 'top10' | 'bottom10' | 'top50' | 'all';

export type LeaderboardSort =
  | 'referrals_desc'
  | 'referrals_asc'
  | 'newest'
  | 'oldest';

export type LeaderboardSummary = {
  current_leader: string;
  current_leader_referrals: number;
  participants: number;
  total_referrals: number;
  contest_status?: string;
  contest_status_subtext?: string;
};

export type LeaderboardItem = {
  id: string;
  participant_id: string;
  rank: number;
  user_name: string;
  phone_number: string;
  referral_code: string | null;
  referrals: number;
  contests_joined?: number;
  joined_at: string | null;
};

export type LeaderboardPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type GetLeaderboardResponse = {
  summary: LeaderboardSummary;
  leaderboard: LeaderboardItem[];
  pagination: LeaderboardPagination;
};

export type LeaderboardQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  range?: LeaderboardRange;
  sort?: LeaderboardSort;
};