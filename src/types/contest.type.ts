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

  referralCodePrefix: string;

  startDate: string;
  endDate: string | null;

  rewardType: ContestRewardType;
  rewardValue: string;
  rewardDescription: string;

  winnerSelection: ContestWinnerSelection;
  maxWinners: number;

  participantsCount: number;
  referralsCount: number;
  viewsCount: number;

  topPerformerName: string | null;
  topPerformerPhone: string | null;
  topPerformerReferrals: number;

  isPublished: boolean;
  isArchived: boolean;

  createdAt: string;
  updatedAt: string;
};