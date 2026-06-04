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

const SOURCE_CONTEST_SLUG = 'demo-refcore-contest';

const NEW_CONTEST_TITLE = 'Demo June First Contest';
const NEW_CONTEST_SLUG = 'demo-june-first-contest';

const CONTEST_PARTICIPANT_COUNT = 260;
const REFERRAL_COUNT = 1200;

const EXTRA_PARTICIPANT_PHONE_PREFIX = '+234809444';
const EXTRA_REFERRAL_PHONE_PREFIX = '+234807777';
const EXTRA_REFERRAL_CODE_PREFIX = 'JUNE';

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
];

const getDisplayName = (index: number) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 7) % lastNames.length];

  return `${firstName} ${lastName} June ${index + 1}`;
};

const getParticipantPhoneNumber = (index: number) => {
  return `${EXTRA_PARTICIPANT_PHONE_PREFIX}${String(index + 1).padStart(4, '0')}`;
};

const getReferralContactPhoneNumber = (index: number) => {
  return `${EXTRA_REFERRAL_PHONE_PREFIX}${String(index + 1).padStart(4, '0')}`;
};

const getReferralCode = (index: number) => {
  return `${EXTRA_REFERRAL_CODE_PREFIX}${String(index + 1).padStart(5, '0')}`;
};

const subtractDays = (days: number) => {
  const date = new Date();

  date.setDate(date.getDate() - days);

  return date;
};

const addRealisticTime = (date: Date, seed: number) => {
  const nextDate = new Date(date);

  nextDate.setHours((seed * 5 + 8) % 24);
  nextDate.setMinutes((seed * 11) % 60);
  nextDate.setSeconds((seed * 17) % 60);
  nextDate.setMilliseconds(0);

  return nextDate;
};

const getContestJoinedDate = (index: number) => {
  if (index < 30) return subtractDays(index % 4);
  if (index < 80) return subtractDays(4 + (index % 7));
  if (index < 160) return subtractDays(11 + (index % 14));

  return subtractDays(25 + (index % 20));
};

const getReferralDayOffset = (index: number) => {
  const bucket = index % 100;

  if (bucket < 12) return index % 3;
  if (bucket < 30) return 3 + (index % 5);
  if (bucket < 58) return 8 + (index % 11);
  if (bucket < 82) return 19 + (index % 14);

  return 33 + (index % 20);
};

const getContestReferralCount = (index: number) => {
  if (index === 0) return 218;
  if (index === 1) return 184;
  if (index === 2) return 161;
  if (index === 3) return 139;
  if (index === 4) return 122;
  if (index === 5) return 107;
  if (index === 6) return 94;
  if (index === 7) return 86;
  if (index === 8) return 78;
  if (index === 9) return 71;
  if (index < 20) return 68 - index;
  if (index < 50) return 48 - Math.floor(index / 2);
  if (index < 100) return 27 - Math.floor(index / 5);
  if (index < 180) return 14 - Math.floor(index / 20);

  return index % 6;
};

const getReferralStatus = (index: number) => {
  if (index % 31 === 0) return 'blocked';
  if (index % 19 === 0) return 'flagged';
  if (index % 7 === 0) return 'valid';

  return 'became_participant';
};

const getReferralNote = (status: string) => {
  if (status === 'blocked') {
    return 'Referral blocked because the phone activity matched a suspicious pattern.';
  }

  if (status === 'flagged') {
    return 'Referral flagged for manual review because the timing looked unusual.';
  }

  if (status === 'valid') {
    return 'Referral was validated, but the contact has not completed participant registration.';
  }

  return 'Referral contact later joined the contest as a participant.';
};

const main = async () => {
  const sourceContest = await prisma.contests.findFirst({
    where: {
      slug: SOURCE_CONTEST_SLUG,
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  if (!sourceContest) {
    throw new Error(
      `No source contest found with slug "${SOURCE_CONTEST_SLUG}". Run your original seed first.`,
    );
  }

  const channel = await prisma.channels.findUnique({
    where: {
      id: sourceContest.channel_id,
    },
  });

  if (!channel) {
    throw new Error('Channel for source contest was not found.');
  }

  console.log(`Using existing channel: ${channel.tv_name}`);

  const existingContest = await prisma.contests.findFirst({
    where: {
      channel_id: channel.id,
      slug: NEW_CONTEST_SLUG,
    },
    select: {
      id: true,
    },
  });

  const contest = existingContest
    ? await prisma.contests.update({
        where: {
          id: existingContest.id,
        },
        data: {
          title: NEW_CONTEST_TITLE,
          description:
            'Manual demo contest seeded with larger referral activity for June testing.',
          status: 'active',
          visibility: 'public',
          referral_code_prefix: 'JUNE',
          start_date: null,
          end_date: null,
          reward_type: 'cash',
          reward_value: '100000',
          reward_description: '₦100,000 prize pool for top referrers.',
          winner_selection: 'highestReferrals',
          max_winners: 10,
          is_published: true,
          is_archived: false,
          updated_at: new Date(),
        },
      })
    : await prisma.contests.create({
        data: {
          channel_id: channel.id,
          title: NEW_CONTEST_TITLE,
          slug: NEW_CONTEST_SLUG,
          description:
            'Manual demo contest seeded with larger referral activity for June testing.',
          status: 'active',
          visibility: 'public',
          referral_code_prefix: 'JUNE',
          start_date: null,
          end_date: null,
          reward_type: 'cash',
          reward_value: '100000',
          reward_description: '₦100,000 prize pool for top referrers.',
          winner_selection: 'highestReferrals',
          max_winners: 10,
          participants_count: 0,
          referrals_count: 0,
          views_count: 0,
          top_performer_name: null,
          top_performer_phone: null,
          top_performer_referrals: 0,
          is_published: true,
          is_archived: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

  console.log(`Using contest: ${contest.title}`);

  await prisma.referrals.deleteMany({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
    },
  });

  await prisma.contest_participants.deleteMany({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
    },
  });

  const existingParticipants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  const missingParticipantCount = Math.max(
    CONTEST_PARTICIPANT_COUNT - existingParticipants.length,
    0,
  );

  if (missingParticipantCount > 0) {
    const extraParticipantsData = Array.from(
      { length: missingParticipantCount },
      (_, index) => {
        const joinedAt = addRealisticTime(
          subtractDays(60 + (index % 30)),
          index,
        );

        return {
          channel_id: channel.id,
          phone_number: getParticipantPhoneNumber(index),
          display_name: getDisplayName(index),
          referral_code: getReferralCode(index),
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
      data: extraParticipantsData,
      skipDuplicates: true,
    });
  }

  const availableParticipants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
    },
    orderBy: {
      created_at: 'asc',
    },
    take: CONTEST_PARTICIPANT_COUNT,
  });

  if (availableParticipants.length < CONTEST_PARTICIPANT_COUNT) {
    throw new Error('Not enough participants available for this contest seed.');
  }

  const contestParticipantsData = availableParticipants.map(
    (participant, index) => {
      const joinedAt = addRealisticTime(getContestJoinedDate(index), index + 5);

      return {
        channel_id: channel.id,
        contest_id: contest.id,
        participant_id: participant.id,
        referral_count: getContestReferralCount(index),
        rank_cache: 0,
        joined_at: joinedAt,
        created_at: joinedAt,
        updated_at: new Date(),
      };
    },
  );

  await prisma.contest_participants.createMany({
    data: contestParticipantsData,
    skipDuplicates: true,
  });

  const contestParticipantRows = await prisma.contest_participants.findMany({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
    },
    orderBy: [
      {
        referral_count: 'desc',
      },
      {
        joined_at: 'asc',
      },
    ],
  });

  await Promise.all(
    contestParticipantRows.map((row, index) =>
      prisma.contest_participants.update({
        where: {
          contest_id_participant_id: {
            contest_id: contest.id,
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

  const referrerPool = [...availableParticipants].sort((a, b) => {
    const aIndex = availableParticipants.findIndex(
      (participant) => participant.id === a.id,
    );
    const bIndex = availableParticipants.findIndex(
      (participant) => participant.id === b.id,
    );

    return getContestReferralCount(bIndex) - getContestReferralCount(aIndex);
  });

  const referralsData = [];

  for (let index = 0; index < REFERRAL_COUNT; index += 1) {
    const referrer =
      index < 550
        ? referrerPool[index % 40]
        : referrerPool[index % referrerPool.length];

    const status = getReferralStatus(index);

    const firstSeenAt = addRealisticTime(
      subtractDays(getReferralDayOffset(index)),
      index,
    );

    const shouldLinkToExistingParticipant =
      status === 'became_participant' &&
      index % 4 !== 0 &&
      index + 1 < availableParticipants.length;

    const refereeParticipant = shouldLinkToExistingParticipant
      ? availableParticipants[(index + 1) % availableParticipants.length]
      : null;

    const becameParticipantAt = refereeParticipant
      ? new Date(firstSeenAt.getTime() + ((index % 8) + 1) * 42 * 60 * 1000)
      : null;

    referralsData.push({
      channel_id: channel.id,
      contest_id: contest.id,
      referrer_participant_id: referrer.id,
      referee_phone_number: getReferralContactPhoneNumber(index),
      referee_participant_id: null,
      referral_code_used: referrer.referral_code,
      status,
      notes: getReferralNote(status),
      first_seen_at: firstSeenAt,
      became_participant_at: becameParticipantAt,
      created_at: firstSeenAt,
      updated_at: becameParticipantAt ?? firstSeenAt,
    });
  }

  await prisma.referrals.createMany({
    data: referralsData,
    skipDuplicates: true,
  });

  const validReferralCount = await prisma.referrals.count({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
      status: {
        in: ['valid', 'became_participant'],
      },
    },
  });

  const totalContestParticipants = await prisma.contest_participants.count({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
    },
  });

  const topContestParticipant = await prisma.contest_participants.findFirst({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
    },
    orderBy: [
      {
        referral_count: 'desc',
      },
      {
        joined_at: 'asc',
      },
    ],
  });

  const topParticipant = topContestParticipant
    ? await prisma.participants.findUnique({
        where: {
          id: topContestParticipant.participant_id,
        },
      })
    : null;

  await prisma.contests.update({
    where: {
      id: contest.id,
    },
    data: {
      participants_count: totalContestParticipants,
      referrals_count: validReferralCount,
      top_performer_name: topParticipant?.display_name ?? null,
      top_performer_phone: topParticipant?.phone_number ?? null,
      top_performer_referrals: topContestParticipant?.referral_count ?? 0,
      updated_at: new Date(),
    },
  });

  const referralCountByParticipant = new Map<string, number>();

  referralsData.forEach((referral) => {
    if (
      referral.status !== 'valid' &&
      referral.status !== 'became_participant'
    ) {
      return;
    }

    referralCountByParticipant.set(
      referral.referrer_participant_id,
      (referralCountByParticipant.get(referral.referrer_participant_id) ?? 0) +
        1,
    );
  });

  await Promise.all(
    Array.from(referralCountByParticipant.entries()).map(
      ([participantId, referralCount]) =>
        prisma.participants.update({
          where: {
            id: participantId,
          },
          data: {
            total_referrals: {
              increment: referralCount,
            },
            total_contests_joined: {
              increment: 1,
            },
            last_joined_at: new Date(),
            updated_at: new Date(),
          },
        }),
    ),
  );

  const statusSummary = referralsData.reduce<Record<string, number>>(
    (summary, referral) => {
      summary[referral.status] = (summary[referral.status] ?? 0) + 1;
      return summary;
    },
    {},
  );

  console.log('Demo June First Contest seed completed.');
  console.log(`Contest title: ${NEW_CONTEST_TITLE}`);
  console.log(`Contest slug: ${NEW_CONTEST_SLUG}`);
  console.log(`Contest participants created: ${totalContestParticipants}`);
  console.log(`Referrals created: ${REFERRAL_COUNT}`);
  console.log(`Valid referral count stored on contest: ${validReferralCount}`);
  console.log('Referral status summary:', statusSummary);
};

main()
  .catch((error) => {
    console.error('Demo June First Contest seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
