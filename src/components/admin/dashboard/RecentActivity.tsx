'use client';

import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';
import {
  fallbackNotificationTypeConfig,
  formatNotificationDateTime,
  formatNotificationRelativeTime,
  getNotificationTimestamp,
  notificationTypeMap,
} from '@/utils/notification.utils';
import type { NotificationItem } from '@/types/notification.type';

type RecentActivityProps = {
  notifications: NotificationItem[];
};

const RecentActivity = ({ notifications }: RecentActivityProps) => {
  const latestNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a))
      .slice(0, 5);
  }, [notifications]);

  return (
    <section className="rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest updates across your contest and referrals
        </p>
      </div>

      {latestNotifications.length > 0 ? (
        <div className="space-y-3">
          {latestNotifications.map((item) => {
            const config =
              notificationTypeMap[
                item.type as keyof typeof notificationTypeMap
              ] ?? fallbackNotificationTypeConfig;

            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3 transition-colors',
                  item.is_read
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

                    {!item.is_read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#00d0ff]" />
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55">
                    <span title={formatNotificationDateTime(item.created_at)}>
                      {formatNotificationRelativeTime(item.created_at)}
                    </span>

                    {item.actor ? <span>{item.actor}</span> : null}

                    {item.meta ? <span>{item.meta}</span> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#13131a]/45 px-4 py-8 text-center">
          <p className="text-sm font-medium text-white">No recent activity</p>
          <p className="mt-1 text-xs text-muted-foreground">
            New contest and referral updates will appear here.
          </p>
        </div>
      )}
    </section>
  );
};

export default RecentActivity;