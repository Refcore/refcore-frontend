export type ContestTabItem = {
  label: string;
  value: string;
};

export const contestTabs: ContestTabItem[] = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
  },
  {
    label: 'Past',
    value: 'past',
  },
  {
    label: 'Drafts',
    value: 'drafts',
  },
];