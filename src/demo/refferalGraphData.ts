export type GraphRange = '7days' | '30days' | 'allTime';

export type ReferralGraphItem = {
  label: string;
  referrals: number;
};

export const referralGraphData: Record<GraphRange, ReferralGraphItem[]> = {
  '7days': [
    { label: 'Mon', referrals: 24 },
    { label: 'Tue', referrals: 38 },
    { label: 'Wed', referrals: 31 },
    { label: 'Thu', referrals: 52 },
    { label: 'Fri', referrals: 44 },
  ],
  '30days': [
    { label: 'Week 1', referrals: 120 },
    { label: 'Week 2', referrals: 168 },
    { label: 'Week 3', referrals: 143 },
    { label: 'Week 4', referrals: 201 },
  ],
  'allTime': [
    { label: 'Jan', referrals: 240 },
    { label: 'Feb', referrals: 310 },
    { label: 'Mar', referrals: 420 },
    { label: 'Apr', referrals: 390 },
    { label: 'May', referrals: 510 },
    { label: 'Jun', referrals: 620 },
    { label: 'Jul', referrals: 710 },
    { label: 'Aug', referrals: 680 },
    { label: 'Sep', referrals: 760 },
    { label: 'Oct', referrals: 810 },
    { label: 'Nov', referrals: 940 },
    { label: 'Dec', referrals: 1020 },
  ],
};