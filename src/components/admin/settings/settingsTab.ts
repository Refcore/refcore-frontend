export type SettingsTabItem = {
  label: string;
  value:
    | 'account'
    | 'channel'
    | 'contest_defaults'
    | 'referral_rules'
    | 'notifications'
    | 'security';
};

export const settingsTabs: SettingsTabItem[] = [
  {
    label: 'Account',
    value: 'account',
  },
  {
    label: 'Channel',
    value: 'channel',
  },
  {
    label: 'Contest Defaults',
    value: 'contest_defaults',
  },
  {
    label: 'Referral Rules',
    value: 'referral_rules',
  },
  {
    label: 'Notifications',
    value: 'notifications',
  },
  {
    label: 'Security',
    value: 'security',
  },
];