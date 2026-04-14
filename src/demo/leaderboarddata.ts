export type RewardTier = 'gold' | 'silver' | 'bronze' | 'none';

export type LeaderboardParticipant = {
  id: string;
  display_name: string;
  username: string;
  referral_code: string;
  referrals: number;
  rank: number;
  joined_at: string;
  avatar: string;
  is_top_performer: boolean;
  reward_tier: RewardTier;
  phone: string;
};

export type WhatsAppTVLeaderboard = {
  id: string;
  name: string;
  code: string;
  total_participants: number;
  total_referrals: number;
  description: string;
  participants: LeaderboardParticipant[];
};

export const mockLeaderboards: WhatsAppTVLeaderboard[] = [
  {
    id: 'tv_001',
    name: 'Lagos Gist TV',
    code: 'LGTV2026',
    total_participants: 10,
    total_referrals: 233,
    description: 'Entertainment, gist, and street trends from Lagos.',
    participants: [
      {
        id: 'lgtv_p1',
        display_name: 'Mide Johnson',
        username: 'midej',
        referral_code: 'MIDELG01',
        referrals: 41,
        rank: 1,
        joined_at: '2026-03-01T09:15:00Z',
        avatar: '/images/avatars/avatar-1.png',
        is_top_performer: true,
        reward_tier: 'gold',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p2',
        display_name: 'Sarah Bassey',
        username: 'sarahb',
        referral_code: 'SARALG02',
        referrals: 33,
        rank: 2,
        joined_at: '2026-03-02T10:30:00Z',
        avatar: '/images/avatars/avatar-2.png',
        is_top_performer: true,
        reward_tier: 'silver',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p3',
        display_name: 'David Kalu',
        username: 'davidk',
        referral_code: 'DAVLG03',
        referrals: 29,
        rank: 3,
        joined_at: '2026-03-02T14:10:00Z',
        avatar: '/images/avatars/avatar-3.png',
        is_top_performer: true,
        reward_tier: 'bronze',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p4',
        display_name: 'Esther Green',
        username: 'estherg',
        referral_code: 'ESTLG04',
        referrals: 26,
        rank: 4,
        joined_at: '2026-03-03T08:45:00Z',
        avatar: '/images/avatars/avatar-4.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p5',
        display_name: 'Tobi Aina',
        username: 'tobia',
        referral_code: 'TOBLG05',
        referrals: 24,
        rank: 5,
        joined_at: '2026-03-03T12:00:00Z',
        avatar: '/images/avatars/avatar-5.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p6',
        display_name: 'Chioma Peters',
        username: 'chiomap',
        referral_code: 'CHILG06',
        referrals: 21,
        rank: 6,
        joined_at: '2026-03-04T11:20:00Z',
        avatar: '/images/avatars/avatar-6.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p7',
        display_name: 'Kelvin James',
        username: 'kelvinj',
        referral_code: 'KELLG07',
        referrals: 19,
        rank: 7,
        joined_at: '2026-03-04T16:05:00Z',
        avatar: '/images/avatars/avatar-7.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p8',
        display_name: 'Ruth Daniel',
        username: 'ruthd',
        referral_code: 'RUTLG08',
        referrals: 16,
        rank: 8,
        joined_at: '2026-03-05T09:50:00Z',
        avatar: '/images/avatars/avatar-8.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p9',
        display_name: 'Emeka Obi',
        username: 'emekao',
        referral_code: 'EMELG09',
        referrals: 13,
        rank: 9,
        joined_at: '2026-03-05T13:40:00Z',
        avatar: '/images/avatars/avatar-9.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'lgtv_p10',
        display_name: 'Blessing Hope',
        username: 'blessingh',
        referral_code: 'BLELG10',
        referrals: 11,
        rank: 10,
        joined_at: '2026-03-06T10:00:00Z',
        avatar: '/images/avatars/avatar-10.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
    ],
  },
  {
    id: 'tv_002',
    name: 'Naija Sports Hub',
    code: 'NSH2026',
    total_participants: 10,
    total_referrals: 287,
    description:
      'Football updates, match banter, and sports community contests.',
    participants: [
      {
        id: 'nsh_p1',
        display_name: 'Samuel Crown',
        username: 'samuelc',
        referral_code: 'SAMNS01',
        referrals: 52,
        rank: 1,
        joined_at: '2026-03-01T08:10:00Z',
        avatar: '/images/avatars/avatar-11.png',
        is_top_performer: true,
        reward_tier: 'gold',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p2',
        display_name: 'Ifeanyi Moore',
        username: 'ifeanyim',
        referral_code: 'IFENS02',
        referrals: 39,
        rank: 2,
        joined_at: '2026-03-01T12:15:00Z',
        avatar: '/images/avatars/avatar-12.png',
        is_top_performer: true,
        reward_tier: 'silver',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p3',
        display_name: 'Jessica Paul',
        username: 'jessicap',
        referral_code: 'JESNS03',
        referrals: 34,
        rank: 3,
        joined_at: '2026-03-02T09:05:00Z',
        avatar: '/images/avatars/avatar-13.png',
        is_top_performer: true,
        reward_tier: 'bronze',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p4',
        display_name: 'Daniel Smart',
        username: 'daniels',
        referral_code: 'DANNS04',
        referrals: 30,
        rank: 4,
        joined_at: '2026-03-02T11:45:00Z',
        avatar: '/images/avatars/avatar-14.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p5',
        display_name: 'Olaide Yusuf',
        username: 'olaidey',
        referral_code: 'OLANS05',
        referrals: 28,
        rank: 5,
        joined_at: '2026-03-03T07:30:00Z',
        avatar: '/images/avatars/avatar-15.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p6',
        display_name: 'Victory Eze',
        username: 'victorye',
        referral_code: 'VICNS06',
        referrals: 25,
        rank: 6,
        joined_at: '2026-03-03T14:20:00Z',
        avatar: '/images/avatars/avatar-16.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p7',
        display_name: 'Ahmed Bello',
        username: 'ahmedb',
        referral_code: 'AHMNS07',
        referrals: 23,
        rank: 7,
        joined_at: '2026-03-04T10:40:00Z',
        avatar: '/images/avatars/avatar-17.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p8',
        display_name: 'Favour Nnaji',
        username: 'favn',
        referral_code: 'FAVNS08',
        referrals: 21,
        rank: 8,
        joined_at: '2026-03-04T15:00:00Z',
        avatar: '/images/avatars/avatar-18.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p9',
        display_name: 'Grace Udo',
        username: 'graceu',
        referral_code: 'GRANS09',
        referrals: 18,
        rank: 9,
        joined_at: '2026-03-05T09:25:00Z',
        avatar: '/images/avatars/avatar-19.png',
        is_top_performer: false,
        reward_tier: 'none',
        phone: '+234 901 234 5678',
      },
      {
        id: 'nsh_p10',
        display_name: 'Bright Etim',
        username: 'brighte',
        referral_code: 'BRINS10',
        referrals: 17,
        rank: 10,
        joined_at: '2026-03-05T18:10:00Z',
        avatar: '/images/avatars/avatar-20.png',
        is_top_performer: false,
        reward_tier: 'none',
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