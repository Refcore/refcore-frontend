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

const DEMO_CONTEST_SLUG = 'demo-refcore-contest';

const EXTRA_PARTICIPANT_COUNT = 900;
const EXTRA_CONTEST_PARTICIPANT_COUNT = 320;
const EXTRA_REFERRAL_COUNT = 1450;

const EXTRA_PARTICIPANT_PHONE_PREFIX = '+234809333';
const EXTRA_REFERRAL_PHONE_PREFIX = '+234809777';
const EXTRA_REFERRAL_CODE_PREFIX = 'MORE';

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

  return `${firstName} ${lastName} Plus ${index + 1}`;
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

const getParticipantJoinedDate = (index: number) => {
  if (index < 100) return subtractDays(index % 10);
  if (index < 300) return subtractDays(10 + (index % 20));
  if (index < 600) return subtractDays(30 + (index % 35));

  return subtractDays(65 + (index % 80));
};

const getContestJoinedDate = (index: number) => {
  if (index < 30) return subtractDays(index % 4);
  if (index < 100) return subtractDays(4 + (index % 8));
  if (index < 220) return subtractDays(12 + (index % 18));

  return subtractDays(30 + (index % 15));
};

const getCurrentContestReferralCount = (index: number) => {
  if (index === 0) return 188;
  if (index === 1) return 147;
  if (index === 2) return 119;
  if (index === 3) return 96;
  if (index === 4) return 82;
  if (index === 5) return 74;
  if (index < 15) return 62 - index * 2;
  if (index < 40) return 35 - Math.floor(index / 3);
  if (index < 95) return 21 - Math.floor(index / 8);
  if (index < 180) return 10 - Math.floor(index / 35);

  return index % 5;
};

const getLifetimeReferralCount = (
  index: number,
  currentContestReferralCount: number,
) => {
  let lifetimeExtra = 0;

  if (index % 71 === 0) lifetimeExtra += 260;
  if (index % 53 === 0) lifetimeExtra += 180;
  if (index % 37 === 0) lifetimeExtra += 105;
  if (index % 19 === 0) lifetimeExtra += 55;
  if (index % 11 === 0) lifetimeExtra += 25;

  lifetimeExtra += index % 17;

  return currentContestReferralCount + lifetimeExtra;
};

const getReferralStatus = (index: number) => {
  if (index % 29 === 0) return 'blocked';
  if (index % 17 === 0) return 'flagged';
  if (index % 6 === 0) return 'valid';

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

const getReferralDayOffset = (index: number) => {
  const bucket = index % 100;

  if (bucket < 12) return index % 3;
  if (bucket < 30) return 3 + (index % 5);
  if (bucket < 58) return 8 + (index % 11);
  if (bucket < 82) return 19 + (index % 14);

  return 33 + (index % 12);
};

const main = async () => {
  const contest = await prisma.contests.findFirst({
    where: {
      slug: DEMO_CONTEST_SLUG,
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  if (!contest) {
    throw new Error(
      `No contest found with slug "${DEMO_CONTEST_SLUG}". Run your first seed before this extra seed.`,
    );
  }

  const channel = await prisma.channels.findUnique({
    where: {
      id: contest.channel_id,
    },
  });

  if (!channel) {
    throw new Error('Channel for demo contest was not found.');
  }

  console.log(`Using existing channel: ${channel.tv_name}`);
  console.log(`Using existing contest: ${contest.title}`);

  const extraParticipantPhones = Array.from(
    { length: EXTRA_PARTICIPANT_COUNT },
    (_, index) => getParticipantPhoneNumber(index),
  );

  const existingExtraParticipants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
      OR: [
        {
          phone_number: {
            in: extraParticipantPhones,
          },
        },
        {
          referral_code: {
            startsWith: EXTRA_REFERRAL_CODE_PREFIX,
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const existingExtraParticipantIds = existingExtraParticipants.map(
    (participant) => participant.id,
  );

  await prisma.referrals.deleteMany({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
      OR: [
        {
          referee_phone_number: {
            startsWith: EXTRA_REFERRAL_PHONE_PREFIX,
          },
        },
        {
          referral_code_used: {
            startsWith: EXTRA_REFERRAL_CODE_PREFIX,
          },
        },
        ...(existingExtraParticipantIds.length > 0
          ? [
              {
                referrer_participant_id: {
                  in: existingExtraParticipantIds,
                },
              },
              {
                referee_participant_id: {
                  in: existingExtraParticipantIds,
                },
              },
            ]
          : []),
      ],
    },
  });

  if (existingExtraParticipantIds.length > 0) {
    await prisma.contest_participants.deleteMany({
      where: {
        channel_id: channel.id,
        contest_id: contest.id,
        participant_id: {
          in: existingExtraParticipantIds,
        },
      },
    });

    await prisma.participants.deleteMany({
      where: {
        id: {
          in: existingExtraParticipantIds,
        },
      },
    });
  }

  const participantsData = Array.from(
    { length: EXTRA_PARTICIPANT_COUNT },
    (_, index) => {
      const isCurrentContestParticipant =
        index < EXTRA_CONTEST_PARTICIPANT_COUNT;

      const contestReferralCount = isCurrentContestParticipant
        ? getCurrentContestReferralCount(index)
        : 0;

      const totalReferrals = getLifetimeReferralCount(
        index,
        contestReferralCount,
      );

      const firstJoinedAt = addRealisticTime(
        getParticipantJoinedDate(index),
        index,
      );

      const lastJoinedAt = isCurrentContestParticipant
        ? addRealisticTime(getContestJoinedDate(index), index + 9)
        : addRealisticTime(getParticipantJoinedDate(index), index + 11);

      return {
        channel_id: channel.id,
        phone_number: getParticipantPhoneNumber(index),
        display_name: getDisplayName(index),
        referral_code: getReferralCode(index),
        total_referrals: totalReferrals,
        total_contests_joined:
          index % 9 === 0 ? 5 : index % 6 === 0 ? 4 : index % 3 === 0 ? 2 : 1,
        first_joined_at: firstJoinedAt,
        last_joined_at: lastJoinedAt,
        created_at: firstJoinedAt,
        updated_at: new Date(),
      };
    },
  );

  await prisma.participants.createMany({
    data: participantsData,
  });

  const extraParticipants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
      phone_number: {
        in: extraParticipantPhones,
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  const extraCurrentContestParticipants = extraParticipants.slice(
    0,
    EXTRA_CONTEST_PARTICIPANT_COUNT,
  );

  const contestParticipantsData = extraCurrentContestParticipants.map(
    (participant, index) => {
      return {
        channel_id: channel.id,
        contest_id: contest.id,
        participant_id: participant.id,
        referral_count: getCurrentContestReferralCount(index),
        joined_at: addRealisticTime(getContestJoinedDate(index), index + 3),
        created_at: addRealisticTime(getContestJoinedDate(index), index + 3),
        updated_at: new Date(),
      };
    },
  );

  await prisma.contest_participants.createMany({
    data: contestParticipantsData,
  });

  const contestParticipantRows = await prisma.contest_participants.findMany({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
      participant_id: {
        in: extraCurrentContestParticipants.map((participant) => participant.id),
      },
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

  const referralsData = [];

  const referrerPool = [...extraCurrentContestParticipants].sort((a, b) => {
    const aIndex = extraCurrentContestParticipants.findIndex(
      (participant) => participant.id === a.id,
    );
    const bIndex = extraCurrentContestParticipants.findIndex(
      (participant) => participant.id === b.id,
    );

    return getCurrentContestReferralCount(bIndex) - getCurrentContestReferralCount(aIndex);
  });

  for (let index = 0; index < EXTRA_REFERRAL_COUNT; index += 1) {
    const referrer =
      index < 500
        ? referrerPool[index % 35]
        : referrerPool[index % referrerPool.length];

    const status = getReferralStatus(index);

    const firstSeenAt = addRealisticTime(
      subtractDays(getReferralDayOffset(index)),
      index,
    );

    const shouldLinkToExistingParticipant =
      status === 'became_participant' &&
      index % 4 !== 0 &&
      index + 1 < extraCurrentContestParticipants.length;

    const refereeParticipant = shouldLinkToExistingParticipant
      ? extraCurrentContestParticipants[
          (index + 1) % extraCurrentContestParticipants.length
        ]
      : null;

    const becameParticipantAt = refereeParticipant
      ? new Date(firstSeenAt.getTime() + ((index % 8) + 1) * 42 * 60 * 1000)
      : null;

    referralsData.push({
      channel_id: channel.id,
      contest_id: contest.id,
      referrer_participant_id: referrer.id,
      referee_phone_number:
        refereeParticipant?.phone_number ?? getReferralContactPhoneNumber(index),
      referee_participant_id: refereeParticipant?.id ?? null,
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
  });

  const allContestParticipants = await prisma.contest_participants.findMany({
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
    allContestParticipants.map((row, index) =>
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

  const statusSummary = referralsData.reduce<Record<string, number>>(
    (summary, referral) => {
      summary[referral.status] = (summary[referral.status] ?? 0) + 1;
      return summary;
    },
    {},
  );

  console.log('More demo data seed completed.');
  console.log(`Extra participants created: ${EXTRA_PARTICIPANT_COUNT}`);
  console.log(
    `Extra contest participants created: ${EXTRA_CONTEST_PARTICIPANT_COUNT}`,
  );
  console.log(`Extra referrals created: ${EXTRA_REFERRAL_COUNT}`);
  console.log('Extra referral status summary:', statusSummary);
};

main()
  .catch((error) => {
    console.error('More demo seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });