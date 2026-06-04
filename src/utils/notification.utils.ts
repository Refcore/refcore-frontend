import {
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Gift,
  Link,
  Medal,
  Settings,
  ShieldAlert,
  Trophy,
  UserCheck,
  UserPlus,
  XCircle,
} from 'lucide-react';

import type { NotificationItem } from '@/types/notification.type';

export const getNotificationTimestamp = (item: NotificationItem) => {
  const timestamp = new Date(item.created_at).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const formatNotificationDate = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatNotificationTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatNotificationDateTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return `${formatNotificationDate(dateValue)} at ${formatNotificationTime(
    dateValue,
  )}`;
};

export const formatNotificationRelativeTime = (dateValue: string) => {
  const date = new Date(dateValue);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return 'Unknown time';
  }

  const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);

  if (secondsAgo < 60) {
    return 'Just now';
  }

  const minutesAgo = Math.floor(secondsAgo / 60);

  if (minutesAgo < 60) {
    return `${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);

  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);

  if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  }

  return formatNotificationDate(dateValue);
};

export const formatNotificationTypeLabel = (type: string) => {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const notificationTypeMap = {
  new_join: {
    icon: UserPlus,
    iconClassName: 'bg-[#00ff9d]/10 text-[#00ff9d]',
  },
  new_referral: {
    icon: Link,
    iconClassName: 'bg-[#00d0ff]/10 text-[#00d0ff]',
  },
  contest_started: {
    icon: Trophy,
    iconClassName: 'bg-[#00ff9d]/10 text-[#00ff9d]',
  },
  contest_ended: {
    icon: Clock,
    iconClassName: 'bg-orange-400/10 text-orange-400',
  },
  leaderboard_change: {
    icon: Medal,
    iconClassName: 'bg-purple-400/10 text-purple-400',
  },
  reward_unlocked: {
    icon: Gift,
    iconClassName: 'bg-yellow-400/10 text-yellow-400',
  },
  reward_claimed: {
    icon: Gift,
    iconClassName: 'bg-[#00ff9d]/10 text-[#00ff9d]',
  },
  milestone_reached: {
    icon: Trophy,
    iconClassName: 'bg-yellow-400/10 text-yellow-400',
  },
  channel_verified: {
    icon: CheckCircle2,
    iconClassName: 'bg-[#00ff9d]/10 text-[#00ff9d]',
  },
  otp_verified: {
    icon: UserCheck,
    iconClassName: 'bg-[#00d0ff]/10 text-[#00d0ff]',
  },
  participant_disqualified: {
    icon: XCircle,
    iconClassName: 'bg-red-500/10 text-red-400',
  },
  referral_rejected: {
    icon: XCircle,
    iconClassName: 'bg-red-500/10 text-red-400',
  },
  referral_approved: {
    icon: CheckCircle2,
    iconClassName: 'bg-[#00ff9d]/10 text-[#00ff9d]',
  },
  export_completed: {
    icon: Download,
    iconClassName: 'bg-[#00d0ff]/10 text-[#00d0ff]',
  },
  settings_updated: {
    icon: Settings,
    iconClassName: 'bg-white/10 text-white/70',
  },
  profile_updated: {
    icon: UserCheck,
    iconClassName: 'bg-[#00d0ff]/10 text-[#00d0ff]',
  },
  bonus_awarded: {
    icon: Gift,
    iconClassName: 'bg-yellow-400/10 text-yellow-400',
  },
  rank_lost: {
    icon: ShieldAlert,
    iconClassName: 'bg-orange-400/10 text-orange-400',
  },
  rank_gained: {
    icon: Medal,
    iconClassName: 'bg-[#00ff9d]/10 text-[#00ff9d]',
  },
  system_alert: {
    icon: ShieldAlert,
    iconClassName: 'bg-red-500/10 text-red-400',
  },
} as const;

export const fallbackNotificationTypeConfig = {
  icon: Bell,
  iconClassName: 'bg-white/10 text-white/70',
};