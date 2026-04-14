export type ReferralHealthItem = {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
};

export const referralHealthData: ReferralHealthItem[] = [
  {
    id: 'valid_referrals',
    label: 'Valid Referrals',
    value: 11892,
    color: '#00ff9d',
    description: 'Referrals that passed validation successfully.',
  },
  {
    id: 'blocked_referrals',
    label: 'Blocked Referrals',
    value: 291,
    color: '#ef4444',
    description: 'Referrals blocked by validation rules.',
  },
  {
    id: 'duplicate_attempts',
    label: 'Duplicate Attempts',
    value: 143,
    color: '#f59e0b',
    description: 'Repeated joins or duplicate referral attempts.',
  },
  {
    id: 'self_referrals',
    label: 'Self Referrals',
    value: 52,
    color: '#b700ff',
    description: 'Attempts where a participant tried to refer themselves.',
  },
];