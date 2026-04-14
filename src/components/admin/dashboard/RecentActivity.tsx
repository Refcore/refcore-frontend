'use client';

import { notificationsData } from '@/demo/notificationsData';
import { cn } from '@/lib/utils';
import { getNotificationTimestamp, notificationTypeMap } from '@/utils/notification.utils';
import React, { useMemo } from 'react';



const RecentActivity = () => {
  const latestNotifications = useMemo(() => {
    return [...notificationsData]
.sort((a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a))
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