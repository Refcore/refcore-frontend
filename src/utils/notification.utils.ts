import {
  Bell,
  CheckCircle2,
  Download,
  Gift,
  Medal,
  OctagonAlert,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

import type {
  NotificationItem,
  NotificationType,
} from '@/demo/notificationsData';

export const notificationTypeMap: Record<
  NotificationType,
  {
    icon: LucideIcon;
    iconClassName: string;
  }
> = {
  new_join: {
    icon: UserPlus,
    iconClassName: 'text-green-400 bg-green-400/10',
  },
  new_referral: {
    icon: Sparkles,
    iconClassName: 'text-cyan-400 bg-cyan-400/10',
  },
  contest_started: {
    icon: Trophy,
    iconClassName: 'text-green-400 bg-green-400/10',
  },
  contest_ended: {
    icon: Trophy,
    iconClassName: 'text-red-400 bg-red-400/10',
  },
  leaderboard_change: {
    icon: Medal,
    iconClassName: 'text-yellow-400 bg-yellow-400/10',
  },
  reward_unlocked: {
    icon: Gift,
    iconClassName: 'text-purple-400 bg-purple-400/10',
  },
  reward_claimed: {
    icon: Gift,
    iconClassName: 'text-pink-400 bg-pink-400/10',
  },
  milestone_reached: {
    icon: Sparkles,
    iconClassName: 'text-blue-400 bg-blue-400/10',
  },
  channel_verified: {
    icon: ShieldCheck,
    iconClassName: 'text-emerald-400 bg-emerald-400/10',
  },
  otp_verified: {
    icon: CheckCircle2,
    iconClassName: 'text-emerald-400 bg-emerald-400/10',
  },
  participant_disqualified: {
    icon: UserMinus,
    iconClassName: 'text-red-400 bg-red-400/10',
  },
  referral_rejected: {
    icon: OctagonAlert,
    iconClassName: 'text-orange-400 bg-orange-400/10',
  },
  referral_approved: {
    icon: CheckCircle2,
    iconClassName: 'text-green-400 bg-green-400/10',
  },
  export_completed: {
    icon: Download,
    iconClassName: 'text-cyan-400 bg-cyan-400/10',
  },
  settings_updated: {
    icon: Settings,
    iconClassName: 'text-gray-300 bg-white/10',
  },
  profile_updated: {
    icon: Settings,
    iconClassName: 'text-gray-300 bg-white/10',
  },
  bonus_awarded: {
    icon: Gift,
    iconClassName: 'text-yellow-400 bg-yellow-400/10',
  },
  rank_lost: {
    icon: Medal,
    iconClassName: 'text-orange-400 bg-orange-400/10',
  },
  rank_gained: {
    icon: Medal,
    iconClassName: 'text-green-400 bg-green-400/10',
  },
  system_alert: {
    icon: Bell,
    iconClassName: 'text-red-400 bg-red-400/10',
  },
};

export const getNotificationTimestamp = (item: NotificationItem) => {
  return new Date(`${item.date} ${item.time}`).getTime();
};