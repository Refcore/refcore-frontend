export type perksType = {
  label: string;
  disabled: boolean;
};

export type Plans = {
  title: string;
  description: string;
  price: string;
  perks: perksType[];
  buttonText: string;
  mostpopular?: boolean;
};

export const plans: Plans[] = [
  {
    title: 'Starter',
    description: 'Perfect for small channels testing the waters.',
    price: '29',
    perks: [
      {
        label: 'Up to 1,000 participants',
        disabled: false,
      },
      {
        label: 'Basic Leaderboard',
        disabled: false,
      },
      {
        label: 'Standard Support',
        disabled: false,
      },
      {
        label: 'Anti-Cheat System',
        disabled: true,
      },
    ],
    buttonText: 'Get Started',
  },
  {
    title: 'Growth',
    description: 'For serious channels ready to go viral.',
    price: '79',
    perks: [
      {
        label: 'Up to 10,000 participants',
        disabled: false,
      },
      {
        label: 'Real-time Leaderboard',
        disabled: false,
      },
      {
        label: 'Advanced Anti-Cheat',
        disabled: false,
      },
      {
        label: 'Deep Analytics',
        disabled: false,
      },
    ],
    buttonText: 'Start 14-Day Free Trial',
    mostpopular: true,
  },
  {
    title: 'Pro',
    description: 'For agencies and massive networks.',
    price: '199',
    perks: [
      {
        label: 'Unlimited participants',
        disabled: false,
      },
      {
        label: 'Multiple Active Contests',
        disabled: false,
      },
      {
        label: 'Custom Branding',
        disabled: false,
      },
      {
        label: 'Priority 24/7 Support',
        disabled: false,
      },
    ],
    buttonText: 'Contact Sales',
  },
];
