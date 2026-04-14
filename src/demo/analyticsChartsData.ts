export type ReferralsOverTimeItem = {
  day: string;
  referrals: number;
};

export const referralsOverTimeData: ReferralsOverTimeItem[] = [
  { day: 'Mon', referrals: 1420 },
  { day: 'Tue', referrals: 1680 },
  { day: 'Wed', referrals: 1890 },
  { day: 'Thu', referrals: 2150 },
  { day: 'Fri', referrals: 2340 },
  { day: 'Sat', referrals: 2580 },
  { day: 'Sun', referrals: 2847 },
];

export type JoinsPerDayItem = {
  day: string;
  joins: number;
};

export const joinsPerDayData: JoinsPerDayItem[] = [
  { day: 'Mon', joins: 85 },
  { day: 'Tue', joins: 92 },
  { day: 'Wed', joins: 108 },
  { day: 'Thu', joins: 125 },
  { day: 'Fri', joins: 142 },
  { day: 'Sat', joins: 138 },
  { day: 'Sun', joins: 142 },
];