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

const NOTIFICATION_COUNT = 200;
const SEED_ACTOR = 'REFCORE Demo Bot';

const notificationTypes = [
  'new_join',
  'new_referral',
  'contest_started',
  'contest_ended',
  'leaderboard_change',
  'reward_unlocked',
  'reward_claimed',
  'milestone_reached',
  'channel_verified',
  'otp_verified',
  'participant_disqualified',
  'referral_rejected',
  'referral_approved',
  'export_completed',
  'settings_updated',
  'profile_updated',
  'bonus_awarded',
  'rank_lost',
  'rank_gained',
  'system_alert',
] as const;

const names = [
  'Ayo Johnson',
  'Chioma Okafor',
  'Tunde Adebayo',
  'Sarah Williams',
  'Emeka Eze',
  'Blessing Nwosu',
  'David Brown',
  'Amaka Smith',
  'Daniel Ibrahim',
  'Kemi Ogunleye',
  'Victor Adeleke',
  'Grace Emenike',
  'Samuel Uche',
  'Mary Bello',
  'Favour Adams',
];

const subtractMinutes = (minutes: number) => {
  return new Date(Date.now() - minutes * 60 * 1000);
};

const getRandomName = (index: number) => {
  return names[index % names.length];
};

const getNotificationContent = (
  type: (typeof notificationTypes)[number],
  index: number,
) => {
  const name = getRandomName(index);
  const referralCount = (index % 25) + 1;
  const rank = (index % 20) + 1;

  switch (type) {
    case 'new_join':
      return {
        title: 'New participant joined',
        description: `${name} joined the referral contest.`,
      };

    case 'new_referral':
      return {
        title: 'New referral recorded',
        description: `${name} generated ${referralCount} new referral${referralCount === 1 ? '' : 's'}.`,
      };

    case 'contest_started':
      return {
        title: 'Contest started',
        description: 'Your referral contest is now active and accepting participants.',
      };

    case 'contest_ended':
      return {
        title: 'Contest ended',
        description: 'The referral contest has ended and referral tracking has been closed.',
      };

    case 'leaderboard_change':
      return {
        title: 'Leaderboard updated',
        description: `${name} moved to rank #${rank} on the leaderboard.`,
      };

    case 'reward_unlocked':
      return {
        title: 'Reward unlocked',
        description: `${name} unlocked a referral milestone reward.`,
      };

    case 'reward_claimed':
      return {
        title: 'Reward claimed',
        description: `${name} claimed an available contest reward.`,
      };

    case 'milestone_reached':
      return {
        title: 'Milestone reached',
        description: `${name} reached ${referralCount * 5} total referrals.`,
      };

    case 'channel_verified':
      return {
        title: 'Channel verified',
        description: 'Your channel verification was completed successfully.',
      };

    case 'otp_verified':
      return {
        title: 'OTP verified',
        description: 'A verification code was successfully confirmed.',
      };

    case 'participant_disqualified':
      return {
        title: 'Participant disqualified',
        description: `${name} was disqualified after a review of suspicious referral activity.`,
      };

    case 'referral_rejected':
      return {
        title: 'Referral rejected',
        description: `A referral from ${name} was rejected because it did not pass validation.`,
      };

    case 'referral_approved':
      return {
        title: 'Referral approved',
        description: `A referral from ${name} was approved and added to the contest count.`,
      };

    case 'export_completed':
      return {
        title: 'Export completed',
        description: 'Your contest export file is ready for download.',
      };

    case 'settings_updated':
      return {
        title: 'Settings updated',
        description: 'Contest settings were updated successfully.',
      };

    case 'profile_updated':
      return {
        title: 'Profile updated',
        description: 'Your profile information was updated successfully.',
      };

    case 'bonus_awarded':
      return {
        title: 'Bonus awarded',
        description: `${name} received a bonus referral credit.`,
      };

    case 'rank_lost':
      return {
        title: 'Rank dropped',
        description: `${name} dropped to rank #${rank} on the leaderboard.`,
      };

    case 'rank_gained':
      return {
        title: 'Rank improved',
        description: `${name} climbed to rank #${rank} on the leaderboard.`,
      };

    case 'system_alert':
      return {
        title: 'System alert',
        description: 'REFCORE detected unusual activity that may need admin review.',
      };

    default:
      return {
        title: 'Notification',
        description: 'A new notification was created.',
      };
  }
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

  const contest = await prisma.contests.findFirst({
    where: {
      channel_id: channel.id,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const users = await prisma.public_users.findMany({
    orderBy: {
      created_at: 'asc',
    },
    take: 20,
  });

  await prisma.notifications.deleteMany({
    where: {
      actor: SEED_ACTOR,
    },
  });

  const notificationsData = Array.from(
    { length: NOTIFICATION_COUNT },
    (_, index) => {
      const type = notificationTypes[index % notificationTypes.length];
      const content = getNotificationContent(type, index);

      const createdAt = subtractMinutes(index * 37 + (index % 9) * 11);
      const isRead = index % 4 === 0 || index % 7 === 0;
      const shouldAttachContest = Boolean(contest) && index % 3 !== 0;

      const user = users.length > 0 ? users[index % users.length] : null;

      const shouldCreateUserNotification = Boolean(user) && index % 2 === 0;

      return {
        user_id: shouldCreateUserNotification ? user?.id : null,
        channel_id: shouldCreateUserNotification ? null : channel.id,
        contest_id: shouldAttachContest ? contest?.id : null,

        type,
        title: content.title,
        description: content.description,

        actor: SEED_ACTOR,
        meta: `notification_seed_${String(index + 1).padStart(3, '0')}`,

        is_read: isRead,
        read_at: isRead ? new Date(createdAt.getTime() + 15 * 60 * 1000) : null,

        created_at: createdAt,
        updated_at: createdAt,
      };
    },
  );

  await prisma.notifications.createMany({
    data: notificationsData,
  });

  const unreadCount = notificationsData.filter(
    (notification) => !notification.is_read,
  ).length;

  const userNotificationCount = notificationsData.filter(
    (notification) => notification.user_id,
  ).length;

  const channelNotificationCount = notificationsData.filter(
    (notification) => notification.channel_id,
  ).length;

  const contestNotificationCount = notificationsData.filter(
    (notification) => notification.contest_id,
  ).length;

  const typeSummary = notificationsData.reduce<Record<string, number>>(
    (summary, notification) => {
      summary[notification.type] = (summary[notification.type] ?? 0) + 1;
      return summary;
    },
    {},
  );

  console.log('Notification seed completed.');
  console.log(`Channel used: ${channel.tv_name}`);
  console.log(`Contest used: ${contest?.title ?? 'No contest attached'}`);
  console.log(`Notifications created: ${notificationsData.length}`);
  console.log(`User notifications: ${userNotificationCount}`);
  console.log(`Channel notifications: ${channelNotificationCount}`);
  console.log(`Contest-linked notifications: ${contestNotificationCount}`);
  console.log(`Unread notifications: ${unreadCount}`);
  console.log('Notification type summary:', typeSummary);
};

main()
  .catch((error) => {
    console.error('Notification seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });