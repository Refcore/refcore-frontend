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

const PARTICIPANT_COUNT = 351;
const EXTRA_REFERRAL_CONTACT_COUNT = 137;
const DEMO_CONTEST_SLUG = 'demo-refcore-contest';

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

const getParticipantPhoneNumber = (index: number) => {
  return `+234800555${String(index + 1).padStart(4, '0')}`;
};

const getReferralContactPhoneNumber = (index: number) => {
  return `+234801777${String(index + 1).padStart(4, '0')}`;
};

const getReferralCode = (index: number) => {
  return `REF${String(index + 1).padStart(5, '0')}`;
};

const subtractMinutes = (minutes: number) => {
  return new Date(Date.now() - minutes * 60 * 1000);
};

const subtractDays = (days: number) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

const addDays = (days: number) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

const getReferrerIndex = (refereeIndex: number) => {
  if (refereeIndex === 0) return null;

  if (refereeIndex <= 55) return 0;
  if (refereeIndex <= 98) return 1;
  if (refereeIndex <= 135) return 2;
  if (refereeIndex <= 165) return 3;
  if (refereeIndex <= 190) return 4;
  if (refereeIndex <= 212) return 5;
  if (refereeIndex <= 230) return 6;
  if (refereeIndex <= 245) return 7;

  return Math.max(0, Math.floor(refereeIndex / 3) - 1);
};

const getExtraReferralReferrerIndex = (index: number) => {
  if (index < 35) return 0;
  if (index < 62) return 1;
  if (index < 85) return 2;
  if (index < 103) return 3;
  if (index < 118) return 4;

  return index % 40;
};

const getExtraReferralStatus = (index: number) => {
  if (index % 17 === 0) return 'blocked';
  if (index % 9 === 0) return 'flagged';

  return 'valid';
};

const getReferralNote = (status: string) => {
  if (status === 'blocked') {
    return 'Referral blocked because the contact matched a duplicate or suspicious pattern.';
  }

  if (status === 'flagged') {
    return 'Referral flagged for manual review because the contact activity looked unusual.';
  }

  return null;
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
      start_date: subtractDays(45),
      end_date: addDays(14),
      updated_at: new Date(),
    },
    create: {
      channel_id: channel.id,
      title: 'Demo REFCORE Contest',
      slug: DEMO_CONTEST_SLUG,
      description:
        'Demo contest used for testing participants, referrals, leaderboard, and dashboard graph features.',
      status: 'active',
      visibility: 'public',
      referral_code_prefix: 'REF',
      reward_type: 'custom',
      reward_value: '',
      reward_description: 'Demo reward for testing REFCORE.',
      winner_selection: 'highestReferrals',
      max_winners: 5,
      is_published: true,
      is_archived: false,
      start_date: subtractDays(45),
      end_date: addDays(14),
    },
  });

  console.log(`Using channel: ${channel.tv_name}`);
  console.log(`Using contest: ${contest.title}`);

  const demoParticipantPhones = Array.from(
    { length: PARTICIPANT_COUNT },
    (_, index) => getParticipantPhoneNumber(index),
  );

  // const demoReferralContactPhones = Array.from(
  //   { length: EXTRA_REFERRAL_CONTACT_COUNT },
  //   (_, index) => getReferralContactPhoneNumber(index),
  // );

  const existingDemoParticipants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
      OR: [
        {
          phone_number: {
            in: demoParticipantPhones,
          },
        },
        {
          referral_code: {
            startsWith: 'REF',
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const existingDemoParticipantIds = existingDemoParticipants.map(
    (participant) => participant.id,
  );

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

  if (existingDemoParticipantIds.length > 0) {
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
    (_, index) => {
      const joinedAt = subtractMinutes(index * 185 + (index % 11) * 27);

      return {
        channel_id: channel.id,
        phone_number: getParticipantPhoneNumber(index),
        display_name: getDisplayName(index),
        referral_code: getReferralCode(index),
        total_referrals: 0,
        total_contests_joined: 1,
        first_joined_at: joinedAt,
        last_joined_at: subtractMinutes(index * 91 + (index % 7) * 13),
        created_at: joinedAt,
        updated_at: joinedAt,
      };
    },
  );

  await prisma.participants.createMany({
    data: participantsData,
  });

  const participants = await prisma.participants.findMany({
    where: {
      channel_id: channel.id,
      phone_number: {
        in: demoParticipantPhones,
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  const referralCounts = new Map<string, number>();
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

    const firstSeenAt = subtractMinutes(
      refereeIndex * 145 + (refereeIndex % 13) * 31,
    );

    const becameParticipantAt = new Date(
      firstSeenAt.getTime() + 25 * 60 * 1000,
    );

    referralCounts.set(referrer.id, (referralCounts.get(referrer.id) ?? 0) + 1);

    referralsData.push({
      channel_id: channel.id,
      contest_id: contest.id,
      referrer_participant_id: referrer.id,
      referee_phone_number: referee.phone_number,
      referee_participant_id: referee.id,
      referral_code_used: referrer.referral_code,
      status: 'became_participant',
      notes: 'Referral contact later joined the contest as a participant.',
      first_seen_at: firstSeenAt,
      became_participant_at: becameParticipantAt,
      created_at: firstSeenAt,
      updated_at: becameParticipantAt,
    });
  }

  for (let index = 0; index < EXTRA_REFERRAL_CONTACT_COUNT; index += 1) {
    const referrerIndex = getExtraReferralReferrerIndex(index);
    const referrer = participants[referrerIndex];

    const status = getExtraReferralStatus(index);
    const firstSeenAt = subtractMinutes(index * 223 + (index % 19) * 37);

    const shouldCountReferral = status === 'valid';

    if (shouldCountReferral) {
      referralCounts.set(
        referrer.id,
        (referralCounts.get(referrer.id) ?? 0) + 1,
      );
    }

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
      became_participant_at: null,
      created_at: firstSeenAt,
      updated_at: firstSeenAt,
    });
  }

  await prisma.referrals.createMany({
    data: referralsData,
  });

  await prisma.contest_participants.createMany({
    data: participants.map((participant) => ({
      channel_id: channel.id,
      contest_id: contest.id,
      participant_id: participant.id,
      referral_count: referralCounts.get(participant.id) ?? 0,
      status: 'active',
      joined_at: participant.first_joined_at,
      created_at: participant.first_joined_at,
      updated_at: participant.first_joined_at,
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
          updated_at: new Date(),
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
          updated_at: new Date(),
        },
      }),
    ),
  );

  const topParticipant = sortedParticipants[0];
  const topParticipantReferrals = referralCounts.get(topParticipant.id) ?? 0;

  const validReferralCount = referralsData.filter((referral) => {
    return referral.status === 'valid' || referral.status === 'became_participant';
  }).length;

  await prisma.contests.update({
    where: {
      id: contest.id,
    },
    data: {
      participants_count: PARTICIPANT_COUNT,
      referrals_count: validReferralCount,
      top_performer_name: topParticipant.display_name,
      top_performer_phone: topParticipant.phone_number,
      top_performer_referrals: topParticipantReferrals,
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

  console.log('Demo seed completed.');
  console.log(`Participants created: ${PARTICIPANT_COUNT}`);
  console.log(`Contest participants created: ${PARTICIPANT_COUNT}`);
  console.log(`Referrals created: ${referralsData.length}`);
  console.log(`Counted referrals: ${validReferralCount}`);
  console.log('Referral status summary:', statusSummary);
};

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });