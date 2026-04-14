export type TopContributorItem = {
  id: string;
  user_name: string;
  phone: string;
  referral_code: string;
  total_referrals: number;
  contribution_rate: number;
  rank: number;
  badge: 'champion' | 'elite' | 'active' | 'rising';
};

export const topContributorsData: TopContributorItem[] = [
  {
    id: 'participant_001',
    user_name: 'sarah_j',
    phone: '+2349012345678',
    referral_code: 'SARAHJ01',
    total_referrals: 1240,
    contribution_rate: 10.0,
    rank: 1,
    badge: 'champion',
  },
  {
    id: 'participant_002',
    user_name: 'mike_w',
    phone: '+2349012345679',
    referral_code: 'MIKEW02',
    total_referrals: 985,
    contribution_rate: 7.9,
    rank: 2,
    badge: 'elite',
  },
  {
    id: 'participant_003',
    user_name: 'elena_r',
    phone: '+2349012345680',
    referral_code: 'ELENAR03',
    total_referrals: 842,
    contribution_rate: 6.8,
    rank: 3,
    badge: 'elite',
  },
  {
    id: 'participant_004',
    user_name: 'david_k',
    phone: '+2349012345681',
    referral_code: 'DAVIDK04',
    total_referrals: 721,
    contribution_rate: 5.8,
    rank: 4,
    badge: 'elite',
  },
  {
    id: 'participant_005',
    user_name: 'lisa_m',
    phone: '+2349012345682',
    referral_code: 'LISAM05',
    total_referrals: 698,
    contribution_rate: 5.6,
    rank: 5,
    badge: 'active',
  },
];