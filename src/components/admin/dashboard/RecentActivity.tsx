'use client';

import React, { useMemo } from 'react';
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
import { cn } from '@/lib/utils';
import {
  notificationsData,
  type NotificationItem,
  type NotificationType,
} from '@/demo/notificationsData';

const notificationTypeMap: Record<
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

const getTimestamp = (item: NotificationItem) => {
  return new Date(`${item.date} ${item.time}`).getTime();
};

const RecentActivity = () => {
  const latestNotifications = useMemo(() => {
    return [...notificationsData]
      .sort((a, b) => getTimestamp(b) - getTimestamp(a))
      .slice(0, 5);
  }, []);

  return (
    <section className="rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest updates across your contest and referrals
        </p>
      </div>

      <div className="space-y-3">
        {latestNotifications.map((item) => {
          const config = notificationTypeMap[item.type];
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-3 transition-colors',
                item.isRead
                  ? 'border-white/5 bg-[#13131a]/40'
                  : 'border-white/10 bg-[#13131a]/80',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  config.iconClassName,
                )}
              >
                <Icon className="size-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>

                  {!item.isRead ? (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#00d0ff]" />
                  ) : null}
                </div>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55">
                  <span>
                    {item.date} • {item.time}
                  </span>

                  {item.actor ? <span>{item.actor}</span> : null}

                  {item.meta ? <span>{item.meta}</span> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivity;