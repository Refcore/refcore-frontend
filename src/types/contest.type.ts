export type ContestStatus = 'active' | 'upcoming' | 'past' | 'draft';

export type ContestVisibility = 'public' | 'private';

export type ContestRewardType = 'cash' | 'gift' | 'custom';

export type ContestWinnerSelection = 'highestReferrals' | 'manual';

export type Contest = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ContestStatus;
  visibility: ContestVisibility;

  referral_code_prefix: string;

  start_date: string;
  end_date: string | null;

  reward_type: ContestRewardType;
  reward_value: string;
  reward_description: string;

  winner_selection: ContestWinnerSelection;
  max_winners: number;

  participants_count: number;
  referrals_count: number;
  views_count: number;

  top_performer_name: string | null;
  top_performer_phone: string | null;
  top_performer_referrals: number;

  is_published: boolean;
  is_archived: boolean;

  created_at: string;
  updated_at: string;
};