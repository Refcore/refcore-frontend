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

const PARTICIPANT_COUNT = 200;
const DEMO_CONTEST_SLUG = 'demo-participants-contest';

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
];

const getDisplayName = (index: number) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];

  return `${firstName} ${lastName} ${index + 1}`;
};

const getPhoneNumber = (index: number) => {
  return `+234800555${String(index + 1).padStart(4, '0')}`;
};

const getReferralCode = (index: number) => {
  return `REF${String(index + 1).padStart(5, '0')}`;
};

const main = async () => {
  const channel = await prisma.channels.findFirst({
    orderBy: {
      created_at: 'asc',
    },
  });

  if (!channel) {
    throw new Error(
      'No channel found. Create at least one channel before running this seed.',
    );
  }

  const contest = await prisma.contests.upsert({
    where: {
      channel_id_slug: {
        channel_id: channel.id,
        slug: DEMO_CONTEST_SLUG,
      },
    },
    update: {
      status: 'active',
      is_published: true,
      is_archived: false,
    },
    create: {
      channel_id: channel.id,
      title: 'Demo Participants Contest',
      slug: DEMO_CONTEST_SLUG,
      description:
        'Demo contest used for testing participants and leaderboard features.',
      status: 'active',
      visibility: 'public',
      referral_code_prefix: 'REF',
      reward_type: 'custom',
      reward_value: '',
      reward_description: 'Demo reward for testing.',
      winner_selection: 'highestReferrals',
      max_winners: 5,
      is_published: true,
      is_archived: false,
      start_date: new Date(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`Using channel: ${channel.tv_name}`);
  console.log(`Using contest: ${contest.title}`);

  const demoPhones = Array.from({ length: PARTICIPANT_COUNT }, (_, index) =>
    getPhoneNumber(index),
  );

  const existingDemoParticipants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
      phone_number: {
        in: demoPhones,
      },
    },
    select: {
      id: true,
    },
  });

  const existingDemoParticipantIds = existingDemoParticipants.map(
    (participant) => participant.id,
  );

  if (existingDemoParticipantIds.length > 0) {
    await prisma.referrals.deleteMany({
      where: {
        channel_id: channel.id,
        contest_id: contest.id,
        OR: [
          {
            referrer_participant_id: {
              in: existingDemoParticipantIds,
            },
          },
          {
            referee_participant_id: {
              in: existingDemoParticipantIds,
            },
          },
        ],
      },
    });

    await prisma.referral_attempts.deleteMany({
      where: {
        channel_id: channel.id,
        contest_id: contest.id,
        OR: [
          {
            referrer_participant_id: {
              in: existingDemoParticipantIds,
            },
          },
          {
            referee_participant_id: {
              in: existingDemoParticipantIds,
            },
          },
          {
            referee_phone_number: {
              in: demoPhones,
            },
          },
        ],
      },
    });

    await prisma.contest_participants.deleteMany({
      where: {
        channel_id: channel.id,
        contest_id: contest.id,
        participant_id: {
          in: existingDemoParticipantIds,
        },
      },
    });

    await prisma.participants.deleteMany({
      where: {
        id: {
          in: existingDemoParticipantIds,
        },
      },
    });
  }

  const participantsData = Array.from(
    { length: PARTICIPANT_COUNT },
    (_, index) => ({
      channel_id: channel.id,
      phone_number: getPhoneNumber(index),
      display_name: getDisplayName(index),
      referral_code: getReferralCode(index),
      total_referrals: 0,
      total_contests_joined: 1,
      first_joined_at: new Date(Date.now() - index * 60 * 60 * 1000),
      last_joined_at: new Date(Date.now() - index * 30 * 60 * 1000),
    }),
  );

  await prisma.participants.createMany({
    data: participantsData,
  });

  const participants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
      phone_number: {
        in: demoPhones,
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  const referralCounts = new Map<string, number>();

  const getReferrerIndex = (refereeIndex: number) => {
    if (refereeIndex === 0) return null;

    if (refereeIndex <= 40) return 0;
    if (refereeIndex <= 70) return 1;
    if (refereeIndex <= 95) return 2;
    if (refereeIndex <= 115) return 3;
    if (refereeIndex <= 130) return 4;

    return Math.floor(Math.random() * refereeIndex);
  };

  const referralAttemptsData = [];
  const referralsData = [];

  for (
    let refereeIndex = 1;
    refereeIndex < participants.length;
    refereeIndex += 1
  ) {
    const referrerIndex = getReferrerIndex(refereeIndex);

    if (referrerIndex === null) continue;

    const referrer = participants[referrerIndex];
    const referee = participants[refereeIndex];

    referralCounts.set(referrer.id, (referralCounts.get(referrer.id) ?? 0) + 1);

    referralAttemptsData.push({
      channel_id: channel.id,
      contest_id: contest.id,
      referrer_participant_id: referrer.id,
      referee_phone_number: referee.phone_number,
      referee_participant_id: referee.id,
      referral_code_used: referrer.referral_code,
      status: 'converted',
      first_seen_at: new Date(Date.now() - refereeIndex * 45 * 60 * 1000),
      converted_at: new Date(Date.now() - refereeIndex * 40 * 60 * 1000),
    });

    referralsData.push({
      channel_id: channel.id,
      contest_id: contest.id,
      referrer_participant_id: referrer.id,
      referee_participant_id: referee.id,
    });
  }

  await prisma.referral_attempts.createMany({
    data: referralAttemptsData,
  });

  const referralAttempts = await prisma.referral_attempts.findMany({
    where: {
      channel_id: channel.id,
      contest_id: contest.id,
    },
    select: {
      id: true,
      referee_participant_id: true,
    },
  });

  const attemptByRefereeId = new Map(
    referralAttempts
      .filter((attempt) => attempt.referee_participant_id)
      .map((attempt) => [attempt.referee_participant_id as string, attempt.id]),
  );

  await prisma.referrals.createMany({
    data: referralsData.map((referral) => ({
      ...referral,
      referral_attempt_id: attemptByRefereeId.get(
        referral.referee_participant_id,
      ),
    })),
  });

  await prisma.contest_participants.createMany({
    data: participants.map((participant) => ({
      channel_id: channel.id,
      contest_id: contest.id,
      participant_id: participant.id,
      referral_count: referralCounts.get(participant.id) ?? 0,
      status: 'active',
      joined_at: participant.first_joined_at,
    })),
  });

  const sortedParticipants = [...participants].sort((a, b) => {
    return (referralCounts.get(b.id) ?? 0) - (referralCounts.get(a.id) ?? 0);
  });

  await Promise.all(
    sortedParticipants.map((participant, index) =>
      prisma.contest_participants.update({
        where: {
          contest_id_participant_id: {
            contest_id: contest.id,
            participant_id: participant.id,
          },
        },
        data: {
          rank_cache: index + 1,
        },
      }),
    ),
  );

  await Promise.all(
    participants.map((participant) =>
      prisma.participants.update({
        where: {
          id: participant.id,
        },
        data: {
          total_referrals: referralCounts.get(participant.id) ?? 0,
        },
      }),
    ),
  );

  const topParticipant = sortedParticipants[0];
  const topParticipantReferrals = referralCounts.get(topParticipant.id) ?? 0;

  await prisma.contests.update({
    where: {
      id: contest.id,
    },
    data: {
      participants_count: PARTICIPANT_COUNT,
      referrals_count: referralsData.length,
      top_performer_name: topParticipant.display_name,
      top_performer_phone: topParticipant.phone_number,
      top_performer_referrals: topParticipantReferrals,
    },
  });

  console.log('Demo seed completed.');
  console.log(`Participants created: ${PARTICIPANT_COUNT}`);
  console.log(`Referral attempts created: ${referralAttemptsData.length}`);
  console.log(`Successful referrals created: ${referralsData.length}`);
};

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
