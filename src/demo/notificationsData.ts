export type NotificationType =
  | 'new_join'
  | 'new_referral'
  | 'contest_started'
  | 'contest_ended'
  | 'leaderboard_change'
  | 'reward_unlocked'
  | 'reward_claimed'
  | 'milestone_reached'
  | 'channel_verified'
  | 'otp_verified'
  | 'participant_disqualified'
  | 'referral_rejected'
  | 'referral_approved'
  | 'export_completed'
  | 'settings_updated'
  | 'profile_updated'
  | 'bonus_awarded'
  | 'rank_lost'
  | 'rank_gained'
  | 'system_alert';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  time: string;
  actor?: string;
  meta?: string;
  isRead?: boolean;
};

export const notificationsData: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'new_join',
    title: 'New participant joined',
    description: 'Sarah K. joined the contest through your landing page.',
    date: '2026-04-07',
    time: '09:42 AM',
    actor: 'Sarah K.',
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'new_referral',
    title: 'New referral recorded',
    description: 'David M. referred a new participant successfully.',
    date: '2026-04-07',
    time: '08:15 AM',
    actor: 'David M.',
    meta: '+1 referral',
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'contest_started',
    title: 'Contest started',
    description: 'April Mega Growth Contest is now live.',
    date: '2026-04-06',
    time: '10:00 AM',
    meta: 'Contest event',
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'leaderboard_change',
    title: 'Leaderboard updated',
    description: 'Daniel O. moved into 2nd place.',
    date: '2026-04-06',
    time: '06:34 PM',
    actor: 'Daniel O.',
    meta: 'Rank #2',
    isRead: false,
  },
  {
    id: 'notif-5',
    type: 'reward_unlocked',
    title: 'Reward tier unlocked',
    description: 'A gold reward tier has been unlocked by Esther A.',
    date: '2026-04-05',
    time: '02:20 PM',
    actor: 'Esther A.',
    meta: 'Gold tier',
    isRead: true,
  },
  {
    id: 'notif-6',
    type: 'reward_claimed',
    title: 'Reward claimed',
    description: 'Michael T. claimed his referral reward.',
    date: '2026-04-05',
    time: '11:48 AM',
    actor: 'Michael T.',
    isRead: true,
  },
  {
    id: 'notif-7',
    type: 'milestone_reached',
    title: 'Milestone reached',
    description: 'Your contest crossed 500 total joins.',
    date: '2026-04-05',
    time: '09:10 AM',
    meta: '500 joins',
    isRead: false,
  },
  {
    id: 'notif-8',
    type: 'channel_verified',
    title: 'Channel verified',
    description: 'Your channel verification was completed successfully.',
    date: '2026-04-04',
    time: '04:30 PM',
    isRead: true,
  },
  {
    id: 'notif-9',
    type: 'otp_verified',
    title: 'WhatsApp verified',
    description: 'Your WhatsApp number has been verified successfully.',
    date: '2026-04-04',
    time: '08:42 AM',
    isRead: true,
  },
  {
    id: 'notif-10',
    type: 'participant_disqualified',
    title: 'Participant removed',
    description: 'One participant was removed due to invalid entry.',
    date: '2026-04-03',
    time: '07:18 PM',
    meta: 'Moderation',
    isRead: false,
  },
  {
    id: 'notif-11',
    type: 'referral_rejected',
    title: 'Referral rejected',
    description: 'A referral was rejected after duplicate review.',
    date: '2026-04-03',
    time: '01:15 PM',
    meta: 'Duplicate entry',
    isRead: true,
  },
  {
    id: 'notif-12',
    type: 'referral_approved',
    title: 'Referral approved',
    description: 'A pending referral has been approved.',
    date: '2026-04-03',
    time: '09:24 AM',
    meta: 'Approved',
    isRead: true,
  },
  {
    id: 'notif-13',
    type: 'export_completed',
    title: 'Export completed',
    description: 'Your participant report has been exported successfully.',
    date: '2026-04-02',
    time: '05:41 PM',
    meta: 'CSV ready',
    isRead: true,
  },
  {
    id: 'notif-14',
    type: 'settings_updated',
    title: 'Settings updated',
    description: 'Contest rules were updated successfully.',
    date: '2026-04-02',
    time: '12:12 PM',
    meta: 'Admin action',
    isRead: true,
  },
  {
    id: 'notif-15',
    type: 'profile_updated',
    title: 'Profile updated',
    description: 'Your admin profile information was updated.',
    date: '2026-04-01',
    time: '03:03 PM',
    isRead: true,
  },
  {
    id: 'notif-16',
    type: 'bonus_awarded',
    title: 'Bonus awarded',
    description: 'A bonus referral point was awarded to Grace U.',
    date: '2026-04-01',
    time: '09:55 AM',
    actor: 'Grace U.',
    meta: 'Bonus +1',
    isRead: false,
  },
  {
    id: 'notif-17',
    type: 'rank_lost',
    title: 'Rank changed',
    description: 'Daniel O. dropped from 2nd place to 3rd place.',
    date: '2026-03-31',
    time: '06:15 PM',
    actor: 'Daniel O.',
    meta: 'Rank #3',
    isRead: true,
  },
  {
    id: 'notif-18',
    type: 'rank_gained',
    title: 'Rank improved',
    description: 'Esther A. climbed into 1st place.',
    date: '2026-03-31',
    time: '11:10 AM',
    actor: 'Esther A.',
    meta: 'Rank #1',
    isRead: false,
  },
  {
    id: 'notif-19',
    type: 'system_alert',
    title: 'System alert',
    description: 'A brief sync delay was detected and resolved automatically.',
    date: '2026-03-30',
    time: '07:45 PM',
    meta: 'Resolved',
    isRead: true,
  },
  {
    id: 'notif-20',
    type: 'contest_ended',
    title: 'Contest ended',
    description: 'March Sprint Contest has ended successfully.',
    date: '2026-03-30',
    time: '05:00 PM',
    meta: 'Contest event',
    isRead: true,
  },
];