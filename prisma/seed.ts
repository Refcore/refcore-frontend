import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

const ACTIVE_CONTEST_TITLE = 'REFCORE Mega Demo Contest';
const ACTIVE_CONTEST_SLUG = 'refcore-mega-demo-contest';
const ACTIVE_REFERRAL_CODE_PREFIX = 'MEGA';

const PAST_CONTEST_TITLE = 'REFCORE Past Legends Contest';
const PAST_CONTEST_SLUG = 'refcore-past-legends-contest';
const PAST_REFERRAL_CODE_PREFIX = 'PAST';

const ACTIVE_PARTICIPANT_COUNT = 520;
const PAST_ONLY_PARTICIPANT_COUNT = 260;
const SHARED_PAST_PARTICIPANT_COUNT = 360;

const ACTIVE_REFERRAL_ROWS = {
  became_participant: 360,
  valid: 560,
  flagged: 120,
  blocked: 60,
};

const PAST_REFERRAL_ROWS = {
  became_participant: 220,
  valid: 480,
  flagged: 70,
  blocked: 30,
};

const ACTIVE_EXTERNAL_PHONE_PREFIX = '+234709888';
const PAST_EXTERNAL_PHONE_PREFIX = '+234708777';

const firstNames = [
  'Ayo',
  'Tunde',
  'Amaka',
  'Chioma',
  'David',
  'Sarah',
  'Emeka',
  'Blessing',
  'Daniel',
  'Mary',
  'Ife',
  'Kemi',
  'Samuel',
  'Grace',
  'Victor',
  'Ada',
  'Michael',
  'Favour',
  'John',
  'Esther',
  'Mariam',
  'Tope',
  'Kelvin',
  'Ruth',
  'Peter',
  'Nnamdi',
  'Zainab',
  'Joy',
  'Collins',
  'Precious',
  'Chidera',
  'Temi',
  'Seyi',
  'Ugo',
  'Faith',
  'Mercy',
  'Abdul',
  'Halima',
  'Wale',
  'Bola',
  'Kwame',
  'Ama',
  'Kojo',
  'Nia',
  'Amina',
  'Fatou',
  'Sipho',
  'Thandi',
  'Arjun',
  'Priya',
  'Hiro',
  'Yuki',
  'Minseo',
  'Jisoo',
  'Carlos',
  'Sofia',
  'Liam',
  'Olivia',
  'Noah',
  'Mia',
];

const lastNames = [
  'Johnson',
  'Okafor',
  'Adebayo',
  'Williams',
  'Eze',
  'Brown',
  'Nwosu',
  'Smith',
  'Ogunleye',
  'Ibrahim',
  'Adeyemi',
  'Okoro',
  'Uche',
  'Balogun',
  'Musa',
  'Ojo',
  'Onyeka',
  'Bello',
  'Nwachukwu',
  'Lawal',
  'Mensah',
  'Boateng',
  'Kamara',
  'Diallo',
  'Dlamini',
  'Naidoo',
  'Patel',
  'Sharma',
  'Tanaka',
  'Sato',
  'Kim',
  'Park',
  'Garcia',
  'Martinez',
  'Wilson',
  'Taylor',
];

const phoneCountryPrefixes = [
  '+234801',
  '+234802',
  '+234803',
  '+234805',
  '+233240',
  '+254701',
  '+271101',
  '+447700',
  '+120255',
  '+918880',
];

const referralNotes = {
  became_participant:
    'Referral was validated and the referred contact completed participant registration.',
  valid:
    'Referral was validated, but the referred contact has not completed participant registration yet.',
  flagged:
    'Referral was flagged for manual review because the activity timing looked unusual.',
  blocked:
    'Referral was blocked because the phone activity matched a suspicious pattern.',
} as const;

type ReferralStatus = keyof typeof referralNotes;

type SeedParticipant = {
  id: string;
  phone_number: string;
  display_name: string | null;
  referral_code: string;
  first_joined_at: Date;
  created_at: Date;
};

type ReferralSeedRow = {
  channel_id: string;
  contest_id: string;
  referrer_participant_id: string;
  referee_phone_number: string;
  referee_participant_id: string | null;
  referral_code_used: string;
  status: ReferralStatus;
  notes: string;
  first_seen_at: Date;
  became_participant_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type ContestSeedConfig = {
  contestId: string;
  channelId: string;
  participants: SeedParticipant[];
  linkedBecameParticipantCount: number;
  validUnlinkedCount: number;
  flaggedCount: number;
  blockedCount: number;
  externalPhonePrefix: string;
  dateOffsetDays: number;
  referrerBias: 'active' | 'past';
};

const random = (() => {
  let seed = 987654321;

  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;

    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);

    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
})();

const getRandomInt = (min: number, max: number) => {
  return Math.floor(random() * (max - min + 1)) + min;
};

const shuffle = <T>(items: T[]) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));

    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

const subtractDays = (days: number) => {
  const date = new Date();

  date.setDate(date.getDate() - days);
  date.setMilliseconds(0);

  return date;
};

const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

const addRealisticTime = (date: Date, seed: number) => {
  const nextDate = new Date(date);

  nextDate.setHours((seed * 5 + 8) % 24);
  nextDate.setMinutes((seed * 11) % 60);
  nextDate.setSeconds((seed * 17) % 60);
  nextDate.setMilliseconds(0);

  return nextDate;
};

const getParticipantPhoneNumber = (index: number) => {
  const prefix = phoneCountryPrefixes[index % phoneCountryPrefixes.length];

  return `${prefix}${String(index + 1).padStart(5, '0')}`;
};

const getPastOnlyPhoneNumber = (index: number) => {
  return `+234806${String(index + 1).padStart(6, '0')}`;
};

const getExternalReferralPhoneNumber = (prefix: string, index: number) => {
  return `${prefix}${String(index + 1).padStart(5, '0')}`;
};

const getDisplayName = (index: number) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 9) % lastNames.length];

  return `${firstName} ${lastName}`;
};

const getReferralCode = (prefix: string, index: number) => {
  return `${prefix}${String(index + 1).padStart(5, '0')}`;
};

const getParticipantJoinDate = (index: number) => {
  if (index < 60) return addRealisticTime(subtractDays(index % 5), index);
  if (index < 180) return addRealisticTime(subtractDays(5 + (index % 10)), index);
  if (index < 340) return addRealisticTime(subtractDays(15 + (index % 20)), index);

  return addRealisticTime(subtractDays(35 + (index % 30)), index);
};

const getPastParticipantJoinDate = (index: number) => {
  return addRealisticTime(subtractDays(120 + (index % 50)), index);
};

const getReferralSeenDate = (index: number, dateOffsetDays: number) => {
  const bucket = index % 100;

  if (bucket < 15) {
    return addRealisticTime(subtractDays(dateOffsetDays + (index % 3)), index);
  }

  if (bucket < 42) {
    return addRealisticTime(
      subtractDays(dateOffsetDays + 3 + (index % 7)),
      index,
    );
  }

  if (bucket < 72) {
    return addRealisticTime(
      subtractDays(dateOffsetDays + 10 + (index % 15)),
      index,
    );
  }

  return addRealisticTime(
    subtractDays(dateOffsetDays + 25 + (index % 25)),
    index,
  );
};

const pickWeightedReferrer = (
  participants: SeedParticipant[],
  bias: 'active' | 'past',
) => {
  const topHeavyPool: SeedParticipant[] = [];

  participants.forEach((participant, index) => {
    let weight = 1;

    if (bias === 'active') {
      if (index === 0) weight = 95;
      else if (index === 1) weight = 82;
      else if (index === 2) weight = 74;
      else if (index < 10) weight = 55;
      else if (index < 30) weight = 32;
      else if (index < 80) weight = 15;
      else if (index < 180) weight = 6;
      else weight = 2;
    } else {
      /**
       * Past contest uses a different bias.
       * This is what makes all-time leaderboard different.
       * Some people who are not top performers in the active contest
       * become strong all-time leaders because of old referrals.
       */
      if (index >= 80 && index < 90) weight = 120;
      else if (index >= 90 && index < 110) weight = 85;
      else if (index >= 110 && index < 150) weight = 50;
      else if (index < 10) weight = 10;
      else if (index < 80) weight = 18;
      else if (index < 240) weight = 25;
      else weight = 4;
    }

    for (let count = 0; count < weight; count += 1) {
      topHeavyPool.push(participant);
    }
  });

  return topHeavyPool[getRandomInt(0, topHeavyPool.length - 1)];
};

const buildReferralRows = ({
  contestId,
  channelId,
  participants,
  linkedBecameParticipantCount,
  validUnlinkedCount,
  flaggedCount,
  blockedCount,
  externalPhonePrefix,
  dateOffsetDays,
  referrerBias,
}: ContestSeedConfig) => {
  const referralRows: ReferralSeedRow[] = [];
  const shuffledPossibleReferees = shuffle(participants.slice(1));
  const usedRefereePhones = new Set<string>();

  let globalReferralIndex = 0;
  let externalPhoneIndex = 0;

  const addReferral = ({
    status,
    refereeParticipant,
  }: {
    status: ReferralStatus;
    refereeParticipant?: SeedParticipant | null;
  }) => {
    let referrer = pickWeightedReferrer(participants, referrerBias);

    if (refereeParticipant && referrer.id === refereeParticipant.id) {
      referrer =
        participants.find((participant) => participant.id !== refereeParticipant.id) ??
        referrer;
    }

    const firstSeenAt = getReferralSeenDate(globalReferralIndex, dateOffsetDays);

    let refereePhoneNumber: string;
    let refereeParticipantId: string | null = null;
    let becameParticipantAt: Date | null = null;

    if (refereeParticipant) {
      refereePhoneNumber = refereeParticipant.phone_number;
      refereeParticipantId = refereeParticipant.id;
      becameParticipantAt = addMinutes(firstSeenAt, getRandomInt(12, 720));
    } else {
      do {
        refereePhoneNumber = getExternalReferralPhoneNumber(
          externalPhonePrefix,
          externalPhoneIndex,
        );
        externalPhoneIndex += 1;
      } while (usedRefereePhones.has(refereePhoneNumber));
    }

    if (usedRefereePhones.has(refereePhoneNumber)) {
      globalReferralIndex += 1;
      return;
    }

    usedRefereePhones.add(refereePhoneNumber);

    referralRows.push({
      channel_id: channelId,
      contest_id: contestId,
      referrer_participant_id: referrer.id,
      referee_phone_number: refereePhoneNumber,
      referee_participant_id: refereeParticipantId,
      referral_code_used: referrer.referral_code,
      status,
      notes: referralNotes[status],
      first_seen_at: firstSeenAt,
      became_participant_at: becameParticipantAt,
      created_at: firstSeenAt,
      updated_at: becameParticipantAt ?? firstSeenAt,
    });

    globalReferralIndex += 1;
  };

  for (let index = 0; index < linkedBecameParticipantCount; index += 1) {
    const refereeParticipant = shuffledPossibleReferees[index];

    if (!refereeParticipant) break;

    addReferral({
      status: 'became_participant',
      refereeParticipant,
    });
  }

  for (let index = 0; index < validUnlinkedCount; index += 1) {
    addReferral({
      status: 'valid',
      refereeParticipant: null,
    });
  }

  for (let index = 0; index < flaggedCount; index += 1) {
    addReferral({
      status: 'flagged',
      refereeParticipant: null,
    });
  }

  for (let index = 0; index < blockedCount; index += 1) {
    addReferral({
      status: 'blocked',
      refereeParticipant: null,
    });
  }

  return shuffle(referralRows);
};

const getChannel = async () => {
  const channelId = process.env.CHANNEL_ID?.trim();

  if (channelId) {
    const channel = await prisma.channels.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new Error(`No channel found with CHANNEL_ID "${channelId}".`);
    }

    return channel;
  }

  const channel = await prisma.channels.findFirst({
    orderBy: {
      created_at: 'asc',
    },
  });

  if (!channel) {
    throw new Error(
      'No channel found. Create a channel first or pass CHANNEL_ID in your env command.',
    );
  }

  return channel;
};

const getOrCreateActiveContest = async (channelId: string) => {
  await prisma.contests.updateMany({
    where: {
      channel_id: channelId,
      status: 'active',
      slug: {
        not: ACTIVE_CONTEST_SLUG,
      },
    },
    data: {
      status: 'past',
      is_archived: true,
      updated_at: new Date(),
    },
  });

  const existingContest = await prisma.contests.findFirst({
    where: {
      channel_id: channelId,
      slug: ACTIVE_CONTEST_SLUG,
    },
  });

  if (existingContest) {
    return prisma.contests.update({
      where: {
        id: existingContest.id,
      },
      data: {
        title: ACTIVE_CONTEST_TITLE,
        description:
          'Large synced active demo contest with hundreds of participants and over one thousand referral events.',
        status: 'active',
        visibility: 'public',
        referral_code_prefix: ACTIVE_REFERRAL_CODE_PREFIX,
        start_date: subtractDays(45),
        end_date: addMinutes(new Date(), 14 * 24 * 60),
        reward_type: 'cash',
        reward_value: '250000',
        reward_description:
          '₦250,000 prize pool for the highest verified referrers.',
        winner_selection: 'highestReferrals',
        max_winners: 10,
        participants_count: 0,
        referrals_count: 0,
        views_count: 18420,
        top_performer_name: null,
        top_performer_phone: null,
        top_performer_referrals: 0,
        is_published: true,
        is_archived: false,
        updated_at: new Date(),
      },
    });
  }

  return prisma.contests.create({
    data: {
      channel_id: channelId,
      title: ACTIVE_CONTEST_TITLE,
      slug: ACTIVE_CONTEST_SLUG,
      description:
        'Large synced active demo contest with hundreds of participants and over one thousand referral events.',
      status: 'active',
      visibility: 'public',
      referral_code_prefix: ACTIVE_REFERRAL_CODE_PREFIX,
      start_date: subtractDays(45),
      end_date: addMinutes(new Date(), 14 * 24 * 60),
      reward_type: 'cash',
      reward_value: '250000',
      reward_description:
        '₦250,000 prize pool for the highest verified referrers.',
      winner_selection: 'highestReferrals',
      max_winners: 10,
      participants_count: 0,
      referrals_count: 0,
      views_count: 18420,
      top_performer_name: null,
      top_performer_phone: null,
      top_performer_referrals: 0,
      is_published: true,
      is_archived: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

const getOrCreatePastContest = async (channelId: string) => {
  const existingContest = await prisma.contests.findFirst({
    where: {
      channel_id: channelId,
      slug: PAST_CONTEST_SLUG,
    },
  });

  if (existingContest) {
    return prisma.contests.update({
      where: {
        id: existingContest.id,
      },
      data: {
        title: PAST_CONTEST_TITLE,
        description:
          'Past demo contest used to create all-time leaderboard differences.',
        status: 'past',
        visibility: 'public',
        referral_code_prefix: PAST_REFERRAL_CODE_PREFIX,
        start_date: subtractDays(150),
        end_date: subtractDays(90),
        reward_type: 'cash',
        reward_value: '150000',
        reward_description:
          '₦150,000 prize pool from a previous completed contest.',
        winner_selection: 'highestReferrals',
        max_winners: 5,
        participants_count: 0,
        referrals_count: 0,
        views_count: 9630,
        top_performer_name: null,
        top_performer_phone: null,
        top_performer_referrals: 0,
        is_published: true,
        is_archived: true,
        updated_at: new Date(),
      },
    });
  }

  return prisma.contests.create({
    data: {
      channel_id: channelId,
      title: PAST_CONTEST_TITLE,
      slug: PAST_CONTEST_SLUG,
      description:
        'Past demo contest used to create all-time leaderboard differences.',
      status: 'past',
      visibility: 'public',
      referral_code_prefix: PAST_REFERRAL_CODE_PREFIX,
      start_date: subtractDays(150),
      end_date: subtractDays(90),
      reward_type: 'cash',
      reward_value: '150000',
      reward_description:
        '₦150,000 prize pool from a previous completed contest.',
      winner_selection: 'highestReferrals',
      max_winners: 5,
      participants_count: 0,
      referrals_count: 0,
      views_count: 9630,
      top_performer_name: null,
      top_performer_phone: null,
      top_performer_referrals: 0,
      is_published: true,
      is_archived: true,
      created_at: subtractDays(155),
      updated_at: new Date(),
    },
  });
};

const deleteExistingSeedData = async ({
  channelId,
  activeContestId,
  pastContestId,
}: {
  channelId: string;
  activeContestId: string;
  pastContestId: string;
}) => {
  await prisma.referrals.deleteMany({
    where: {
      channel_id: channelId,
      contest_id: {
        in: [activeContestId, pastContestId],
      },
    },
  });

  await prisma.contest_participants.deleteMany({
    where: {
      channel_id: channelId,
      contest_id: {
        in: [activeContestId, pastContestId],
      },
    },
  });

  await prisma.participants.deleteMany({
    where: {
      channel_id: channelId,
      OR: [
        {
          referral_code: {
            startsWith: ACTIVE_REFERRAL_CODE_PREFIX,
          },
        },
        {
          referral_code: {
            startsWith: PAST_REFERRAL_CODE_PREFIX,
          },
        },
      ],
    },
  });
};

const createActiveParticipants = async (channelId: string) => {
  const participantData = Array.from(
    { length: ACTIVE_PARTICIPANT_COUNT },
    (_, index) => {
      const joinedAt = getParticipantJoinDate(index);

      return {
        channel_id: channelId,
        phone_number: getParticipantPhoneNumber(index),
        display_name: getDisplayName(index),
        referral_code: getReferralCode(ACTIVE_REFERRAL_CODE_PREFIX, index),
        total_referrals: 0,
        total_contests_joined: 1,
        first_joined_at: joinedAt,
        last_joined_at: joinedAt,
        created_at: joinedAt,
        updated_at: new Date(),
      };
    },
  );

  await prisma.participants.createMany({
    data: participantData,
    skipDuplicates: true,
  });

  return prisma.participants.findMany({
    where: {
      channel_id: channelId,
      referral_code: {
        startsWith: ACTIVE_REFERRAL_CODE_PREFIX,
      },
    },
    orderBy: {
      referral_code: 'asc',
    },
    select: {
      id: true,
      phone_number: true,
      display_name: true,
      referral_code: true,
      first_joined_at: true,
      created_at: true,
    },
  });
};

const createPastOnlyParticipants = async (channelId: string) => {
  const participantData = Array.from(
    { length: PAST_ONLY_PARTICIPANT_COUNT },
    (_, index) => {
      const joinedAt = getPastParticipantJoinDate(index);

      return {
        channel_id: channelId,
        phone_number: getPastOnlyPhoneNumber(index),
        display_name: getDisplayName(index + ACTIVE_PARTICIPANT_COUNT),
        referral_code: getReferralCode(PAST_REFERRAL_CODE_PREFIX, index),
        total_referrals: 0,
        total_contests_joined: 1,
        first_joined_at: joinedAt,
        last_joined_at: joinedAt,
        created_at: joinedAt,
        updated_at: new Date(),
      };
    },
  );

  await prisma.participants.createMany({
    data: participantData,
    skipDuplicates: true,
  });

  return prisma.participants.findMany({
    where: {
      channel_id: channelId,
      referral_code: {
        startsWith: PAST_REFERRAL_CODE_PREFIX,
      },
    },
    orderBy: {
      referral_code: 'asc',
    },
    select: {
      id: true,
      phone_number: true,
      display_name: true,
      referral_code: true,
      first_joined_at: true,
      created_at: true,
    },
  });
};

const createContestParticipants = async ({
  channelId,
  contestId,
  participants,
}: {
  channelId: string;
  contestId: string;
  participants: SeedParticipant[];
}) => {
  await prisma.contest_participants.createMany({
    data: participants.map((participant) => ({
      channel_id: channelId,
      contest_id: contestId,
      participant_id: participant.id,
      referral_count: 0,
      rank_cache: null,
      joined_at: participant.first_joined_at,
      status: 'active',
      created_at: participant.created_at,
      updated_at: new Date(),
    })),
    skipDuplicates: true,
  });
};

const syncContestCachedCounts = async ({
  channelId,
  contestId,
}: {
  channelId: string;
  contestId: string;
}) => {
  const referralGroups = await prisma.referrals.groupBy({
    by: ['referrer_participant_id'],
    where: {
      channel_id: channelId,
      contest_id: contestId,
      status: {
        in: ['valid', 'became_participant'],
      },
    },
    _count: {
      id: true,
    },
  });

  const referralCountByParticipantId = new Map<string, number>();

  referralGroups.forEach((group) => {
    referralCountByParticipantId.set(
      group.referrer_participant_id,
      group._count.id,
    );
  });

  const contestParticipants = await prisma.contest_participants.findMany({
    where: {
      channel_id: channelId,
      contest_id: contestId,
    },
    select: {
      participant_id: true,
    },
  });

  await Promise.all(
    contestParticipants.map((contestParticipant) => {
      const referralCount =
        referralCountByParticipantId.get(contestParticipant.participant_id) ?? 0;

      return prisma.contest_participants.update({
        where: {
          contest_id_participant_id: {
            contest_id: contestId,
            participant_id: contestParticipant.participant_id,
          },
        },
        data: {
          referral_count: referralCount,
          updated_at: new Date(),
        },
      });
    }),
  );

  const rankedRows = await prisma.contest_participants.findMany({
    where: {
      channel_id: channelId,
      contest_id: contestId,
    },
    orderBy: [
      {
        referral_count: 'desc',
      },
      {
        joined_at: 'asc',
      },
    ],
    select: {
      participant_id: true,
      referral_count: true,
    },
  });

  await Promise.all(
    rankedRows.map((row, index) =>
      prisma.contest_participants.update({
        where: {
          contest_id_participant_id: {
            contest_id: contestId,
            participant_id: row.participant_id,
          },
        },
        data: {
          rank_cache: index + 1,
          updated_at: new Date(),
        },
      }),
    ),
  );

  const topRankedRow = rankedRows[0];

  const topParticipant = topRankedRow
    ? await prisma.participants.findUnique({
        where: {
          id: topRankedRow.participant_id,
        },
        select: {
          display_name: true,
          phone_number: true,
        },
      })
    : null;

  const participantsCount = await prisma.contest_participants.count({
    where: {
      channel_id: channelId,
      contest_id: contestId,
    },
  });

  const validReferralCount = await prisma.referrals.count({
    where: {
      channel_id: channelId,
      contest_id: contestId,
      status: {
        in: ['valid', 'became_participant'],
      },
    },
  });

  const allReferralCount = await prisma.referrals.count({
    where: {
      channel_id: channelId,
      contest_id: contestId,
    },
  });

  await prisma.contests.update({
    where: {
      id: contestId,
    },
    data: {
      participants_count: participantsCount,
      referrals_count: validReferralCount,
      top_performer_name: topParticipant?.display_name ?? null,
      top_performer_phone: topParticipant?.phone_number ?? null,
      top_performer_referrals: topRankedRow?.referral_count ?? 0,
      updated_at: new Date(),
    },
  });

  return {
    participantsCount,
    validReferralCount,
    allReferralCount,
    topParticipant,
    topReferrals: topRankedRow?.referral_count ?? 0,
  };
};

const syncAllTimeParticipantCounts = async (channelId: string) => {
  const participants = await prisma.participants.findMany({
    where: {
      channel_id: channelId,
      OR: [
        {
          referral_code: {
            startsWith: ACTIVE_REFERRAL_CODE_PREFIX,
          },
        },
        {
          referral_code: {
            startsWith: PAST_REFERRAL_CODE_PREFIX,
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const participantIds = participants.map((participant) => participant.id);

  const allTimeReferralGroups = await prisma.referrals.groupBy({
    by: ['referrer_participant_id'],
    where: {
      channel_id: channelId,
      referrer_participant_id: {
        in: participantIds,
      },
      status: {
        in: ['valid', 'became_participant'],
      },
    },
    _count: {
      id: true,
    },
  });

  const allTimeCountByParticipantId = new Map<string, number>();

  allTimeReferralGroups.forEach((group) => {
    allTimeCountByParticipantId.set(
      group.referrer_participant_id,
      group._count.id,
    );
  });

  const contestJoinedGroups = await prisma.contest_participants.groupBy({
    by: ['participant_id'],
    where: {
      channel_id: channelId,
      participant_id: {
        in: participantIds,
      },
    },
    _count: {
      contest_id: true,
    },
    _min: {
      joined_at: true,
    },
    _max: {
      joined_at: true,
    },
  });

  const contestStatsByParticipantId = new Map<
    string,
    {
      contestsJoined: number;
      firstJoinedAt: Date | null;
      lastJoinedAt: Date | null;
    }
  >();

  contestJoinedGroups.forEach((group) => {
    contestStatsByParticipantId.set(group.participant_id, {
      contestsJoined: group._count.contest_id,
      firstJoinedAt: group._min.joined_at,
      lastJoinedAt: group._max.joined_at,
    });
  });

  await Promise.all(
    participants.map((participant) => {
      const stats = contestStatsByParticipantId.get(participant.id);

      return prisma.participants.update({
        where: {
          id: participant.id,
        },
        data: {
          total_referrals: allTimeCountByParticipantId.get(participant.id) ?? 0,
          total_contests_joined: stats?.contestsJoined ?? 0,
          first_joined_at: stats?.firstJoinedAt ?? undefined,
          last_joined_at: stats?.lastJoinedAt ?? null,
          updated_at: new Date(),
        },
      });
    }),
  );
};

const getStatusSummary = async ({
  channelId,
  contestId,
}: {
  channelId: string;
  contestId: string;
}) => {
  const statusSummary = await prisma.referrals.groupBy({
    by: ['status'],
    where: {
      channel_id: channelId,
      contest_id: contestId,
    },
    _count: {
      id: true,
    },
    orderBy: {
      status: 'asc',
    },
  });

  return statusSummary.reduce<Record<string, number>>((summary, item) => {
    summary[item.status] = item._count.id;
    return summary;
  }, {});
};

const main = async () => {
  const activeTotal =
    ACTIVE_REFERRAL_ROWS.became_participant +
    ACTIVE_REFERRAL_ROWS.valid +
    ACTIVE_REFERRAL_ROWS.flagged +
    ACTIVE_REFERRAL_ROWS.blocked;

  const pastTotal =
    PAST_REFERRAL_ROWS.became_participant +
    PAST_REFERRAL_ROWS.valid +
    PAST_REFERRAL_ROWS.flagged +
    PAST_REFERRAL_ROWS.blocked;

  console.log({
    active_referral_rows_expected: activeTotal,
    past_referral_rows_expected: pastTotal,
  });

  const channel = await getChannel();

  console.log(`Using channel: ${channel.tv_name}`);
  console.log(`Channel id: ${channel.id}`);

  const activeContest = await getOrCreateActiveContest(channel.id);
  const pastContest = await getOrCreatePastContest(channel.id);

  console.log(`Using active contest: ${activeContest.title}`);
  console.log(`Active contest id: ${activeContest.id}`);

  console.log(`Using past contest: ${pastContest.title}`);
  console.log(`Past contest id: ${pastContest.id}`);

  await deleteExistingSeedData({
    channelId: channel.id,
    activeContestId: activeContest.id,
    pastContestId: pastContest.id,
  });

  const activeParticipants = await createActiveParticipants(channel.id);
  const pastOnlyParticipants = await createPastOnlyParticipants(channel.id);

  console.log(`Active participants created: ${activeParticipants.length}`);
  console.log(`Past-only participants created: ${pastOnlyParticipants.length}`);

  const sharedPastParticipants = activeParticipants.slice(
    0,
    SHARED_PAST_PARTICIPANT_COUNT,
  );

  const pastContestParticipants = [
    ...sharedPastParticipants,
    ...pastOnlyParticipants,
  ];

  await createContestParticipants({
    channelId: channel.id,
    contestId: activeContest.id,
    participants: activeParticipants,
  });

  await createContestParticipants({
    channelId: channel.id,
    contestId: pastContest.id,
    participants: pastContestParticipants,
  });

  console.log(
    `Active contest participants created: ${activeParticipants.length}`,
  );
  console.log(
    `Past contest participants created: ${pastContestParticipants.length}`,
  );

  const activeReferralRows = buildReferralRows({
    channelId: channel.id,
    contestId: activeContest.id,
    participants: activeParticipants,
    linkedBecameParticipantCount: ACTIVE_REFERRAL_ROWS.became_participant,
    validUnlinkedCount: ACTIVE_REFERRAL_ROWS.valid,
    flaggedCount: ACTIVE_REFERRAL_ROWS.flagged,
    blockedCount: ACTIVE_REFERRAL_ROWS.blocked,
    externalPhonePrefix: ACTIVE_EXTERNAL_PHONE_PREFIX,
    dateOffsetDays: 0,
    referrerBias: 'active',
  });

  const pastReferralRows = buildReferralRows({
    channelId: channel.id,
    contestId: pastContest.id,
    participants: pastContestParticipants,
    linkedBecameParticipantCount: PAST_REFERRAL_ROWS.became_participant,
    validUnlinkedCount: PAST_REFERRAL_ROWS.valid,
    flaggedCount: PAST_REFERRAL_ROWS.flagged,
    blockedCount: PAST_REFERRAL_ROWS.blocked,
    externalPhonePrefix: PAST_EXTERNAL_PHONE_PREFIX,
    dateOffsetDays: 95,
    referrerBias: 'past',
  });

  await prisma.referrals.createMany({
    data: activeReferralRows,
    skipDuplicates: true,
  });

  await prisma.referrals.createMany({
    data: pastReferralRows,
    skipDuplicates: true,
  });

  console.log(`Active referral rows created: ${activeReferralRows.length}`);
  console.log(`Past referral rows created: ${pastReferralRows.length}`);

  const activeSyncSummary = await syncContestCachedCounts({
    channelId: channel.id,
    contestId: activeContest.id,
  });

  const pastSyncSummary = await syncContestCachedCounts({
    channelId: channel.id,
    contestId: pastContest.id,
  });

  await syncAllTimeParticipantCounts(channel.id);

  const activeStatusSummary = await getStatusSummary({
    channelId: channel.id,
    contestId: activeContest.id,
  });

  const pastStatusSummary = await getStatusSummary({
    channelId: channel.id,
    contestId: pastContest.id,
  });

  const allTimeLeader = await prisma.participants.findFirst({
    where: {
      channel_id: channel.id,
    },
    orderBy: [
      {
        total_referrals: 'desc',
      },
      {
        first_joined_at: 'asc',
      },
    ],
    select: {
      display_name: true,
      phone_number: true,
      total_referrals: true,
      total_contests_joined: true,
    },
  });

  const totalParticipants = await prisma.participants.count({
    where: {
      channel_id: channel.id,
      OR: [
        {
          referral_code: {
            startsWith: ACTIVE_REFERRAL_CODE_PREFIX,
          },
        },
        {
          referral_code: {
            startsWith: PAST_REFERRAL_CODE_PREFIX,
          },
        },
      ],
    },
  });

  const totalValidAllTimeReferrals = await prisma.referrals.count({
    where: {
      channel_id: channel.id,
      status: {
        in: ['valid', 'became_participant'],
      },
    },
  });

  console.log('Seed completed successfully.');

  console.log({
    total_seeded_participants: totalParticipants,
    total_valid_all_time_referrals: totalValidAllTimeReferrals,

    active_contest: {
      title: ACTIVE_CONTEST_TITLE,
      status: 'active',
      participants: activeSyncSummary.participantsCount,
      all_referral_rows: activeSyncSummary.allReferralCount,
      valid_referrals_counted_for_leaderboard:
        activeSyncSummary.validReferralCount,
      top_performer: activeSyncSummary.topParticipant?.display_name ?? 'No leader',
      top_performer_referrals: activeSyncSummary.topReferrals,
      status_summary: activeStatusSummary,
    },

    past_contest: {
      title: PAST_CONTEST_TITLE,
      status: 'past',
      participants: pastSyncSummary.participantsCount,
      all_referral_rows: pastSyncSummary.allReferralCount,
      valid_referrals_counted_for_leaderboard:
        pastSyncSummary.validReferralCount,
      top_performer: pastSyncSummary.topParticipant?.display_name ?? 'No leader',
      top_performer_referrals: pastSyncSummary.topReferrals,
      status_summary: pastStatusSummary,
    },

    all_time_leader: {
      name: allTimeLeader?.display_name ?? 'No leader',
      phone: allTimeLeader?.phone_number ?? null,
      total_referrals: allTimeLeader?.total_referrals ?? 0,
      total_contests_joined: allTimeLeader?.total_contests_joined ?? 0,
    },
  });
};

main()
  .catch((error) => {
    console.error('SEED_ERROR', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });