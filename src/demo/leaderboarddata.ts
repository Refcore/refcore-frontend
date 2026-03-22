export type RewardTier = 'gold' | 'silver' | 'bronze' | 'none';

export type LeaderboardParticipant = {
  id: string;
  displayName: string;
  username: string;
  referralCode: string;
  referrals: number;
  rank: number;
  joinedAt: string;
  avatar: string;
  isTopPerformer: boolean;
  rewardTier: RewardTier;
  phone: string;
};

export type WhatsAppTVLeaderboard = {
  id: string;
  name: string;
  code: string;
  totalParticipants: number;
  totalReferrals: number;
  description: string;
  participants: LeaderboardParticipant[];
};

export const mockLeaderboards: WhatsAppTVLeaderboard[] = [
  {
    id: 'tv_001',
    name: 'Lagos Gist TV',
    code: 'LGTV2026',
    totalParticipants: 10,
    totalReferrals: 233,
    description: 'Entertainment, gist, and street trends from Lagos.',
    participants: [
      {
        id: 'lgtv_p1',
        displayName: 'Mide Johnson',
        username: 'midej',
        referralCode: 'MIDELG01',
        referrals: 41,
        rank: 1,
        joinedAt: '2026-03-01T09:15:00Z',
        avatar: '/images/avatars/avatar-1.png',
        isTopPerformer: true,
        rewardTier: 'gold',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p2',
        displayName: 'Sarah Bassey',
        username: 'sarahb',
        referralCode: 'SARALG02',
        referrals: 33,
        rank: 2,
        joinedAt: '2026-03-02T10:30:00Z',
        avatar: '/images/avatars/avatar-2.png',
        isTopPerformer: true,
        rewardTier: 'silver',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p3',
        displayName: 'David Kalu',
        username: 'davidk',
        referralCode: 'DAVLG03',
        referrals: 29,
        rank: 3,
        joinedAt: '2026-03-02T14:10:00Z',
        avatar: '/images/avatars/avatar-3.png',
        isTopPerformer: true,
        rewardTier: 'bronze',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p4',
        displayName: 'Esther Green',
        username: 'estherg',
        referralCode: 'ESTLG04',
        referrals: 26,
        rank: 4,
        joinedAt: '2026-03-03T08:45:00Z',
        avatar: '/images/avatars/avatar-4.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p5',
        displayName: 'Tobi Aina',
        username: 'tobia',
        referralCode: 'TOBLG05',
        referrals: 24,
        rank: 5,
        joinedAt: '2026-03-03T12:00:00Z',
        avatar: '/images/avatars/avatar-5.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p6',
        displayName: 'Chioma Peters',
        username: 'chiomap',
        referralCode: 'CHILG06',
        referrals: 21,
        rank: 6,
        joinedAt: '2026-03-04T11:20:00Z',
        avatar: '/images/avatars/avatar-6.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p7',
        displayName: 'Kelvin James',
        username: 'kelvinj',
        referralCode: 'KELLG07',
        referrals: 19,
        rank: 7,
        joinedAt: '2026-03-04T16:05:00Z',
        avatar: '/images/avatars/avatar-7.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p8',
        displayName: 'Ruth Daniel',
        username: 'ruthd',
        referralCode: 'RUTLG08',
        referrals: 16,
        rank: 8,
        joinedAt: '2026-03-05T09:50:00Z',
        avatar: '/images/avatars/avatar-8.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p9',
        displayName: 'Emeka Obi',
        username: 'emekao',
        referralCode: 'EMELG09',
        referrals: 13,
        rank: 9,
        joinedAt: '2026-03-05T13:40:00Z',
        avatar: '/images/avatars/avatar-9.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p10',
        displayName: 'Blessing Hope',
        username: 'blessingh',
        referralCode: 'BLELG10',
        referrals: 11,
        rank: 10,
        joinedAt: '2026-03-06T10:00:00Z',
        avatar: '/images/avatars/avatar-10.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
    ],
  },
  {
    id: 'tv_002',
    name: 'Naija Sports Hub',
    code: 'NSH2026',
    totalParticipants: 10,
    totalReferrals: 287,
    description:
      'Football updates, match banter, and sports community contests.',
    participants: [
      {
        id: 'nsh_p1',
        displayName: 'Samuel Crown',
        username: 'samuelc',
        referralCode: 'SAMNS01',
        referrals: 52,
        rank: 1,
        joinedAt: '2026-03-01T08:10:00Z',
        avatar: '/images/avatars/avatar-11.png',
        isTopPerformer: true,
        rewardTier: 'gold',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p2',
        displayName: 'Ifeanyi Moore',
        username: 'ifeanyim',
        referralCode: 'IFENS02',
        referrals: 39,
        rank: 2,
        joinedAt: '2026-03-01T12:15:00Z',
        avatar: '/images/avatars/avatar-12.png',
        isTopPerformer: true,
        rewardTier: 'silver',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p3',
        displayName: 'Jessica Paul',
        username: 'jessicap',
        referralCode: 'JESNS03',
        referrals: 34,
        rank: 3,
        joinedAt: '2026-03-02T09:05:00Z',
        avatar: '/images/avatars/avatar-13.png',
        isTopPerformer: true,
        rewardTier: 'bronze',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p4',
        displayName: 'Daniel Smart',
        username: 'daniels',
        referralCode: 'DANNS04',
        referrals: 30,
        rank: 4,
        joinedAt: '2026-03-02T11:45:00Z',
        avatar: '/images/avatars/avatar-14.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p5',
        displayName: 'Olaide Yusuf',
        username: 'olaidey',
        referralCode: 'OLANS05',
        referrals: 28,
        rank: 5,
        joinedAt: '2026-03-03T07:30:00Z',
        avatar: '/images/avatars/avatar-15.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p6',
        displayName: 'Victory Eze',
        username: 'victorye',
        referralCode: 'VICNS06',
        referrals: 25,
        rank: 6,
        joinedAt: '2026-03-03T14:20:00Z',
        avatar: '/images/avatars/avatar-16.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p7',
        displayName: 'Ahmed Bello',
        username: 'ahmedb',
        referralCode: 'AHMNS07',
        referrals: 23,
        rank: 7,
        joinedAt: '2026-03-04T10:40:00Z',
        avatar: '/images/avatars/avatar-17.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p8',
        displayName: 'Favour Nnaji',
        username: 'favn',
        referralCode: 'FAVNS08',
        referrals: 21,
        rank: 8,
        joinedAt: '2026-03-04T15:00:00Z',
        avatar: '/images/avatars/avatar-18.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p9',
        displayName: 'Grace Udo',
        username: 'graceu',
        referralCode: 'GRANS09',
        referrals: 18,
        rank: 9,
        joinedAt: '2026-03-05T09:25:00Z',
        avatar: '/images/avatars/avatar-19.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p10',
        displayName: 'Bright Etim',
        username: 'brighte',
        referralCode: 'BRINS10',
        referrals: 17,
        rank: 10,
        joinedAt: '2026-03-05T18:10:00Z',
        avatar: '/images/avatars/avatar-20.png',
        isTopPerformer: false,
        rewardTier: 'none',
        phone: '+234 901 234 5678',
      },
    ],
  },
];

export const findLeaderboardByCodeOrName = (value: string) => {
  const normalized = decodeURIComponent(value).trim().toLowerCase();

  return mockLeaderboards.find((item) => {
    return (
      item.code.toLowerCase() === normalized ||
      item.name.toLowerCase() === normalized
    );
  });
};

export const searchLeaderboards = (value: string) => {
  const normalized = decodeURIComponent(value).trim().toLowerCase();

  return mockLeaderboards.filter((item) => {
    return (
      item.code.toLowerCase().includes(normalized) ||
      item.name.toLowerCase().includes(normalized)
    );
  });
};
