'use client';

import React, { useMemo, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { NotificationItem } from '@/demo/notificationsData';
import { notificationsData } from '@/demo/notificationsData';
import NotificationCard from './NotificationCard';
import { getNotificationTimestamp } from '@/utils/notification.utils';

const Notifications = () => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(notificationsData);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a),
    );
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead).length;
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              isRead: true,
            }
          : item,
      ),
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId),
    );
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-[#00d0ff]" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            All updates across your contests, referrals, and admin activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span>{notifications.length} total</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{unreadCount} unread</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      {sortedNotifications.length > 0 ? (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-55 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/45 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Bell className="size-6 text-white/70" />
          </div>

          <h3 className="text-base font-semibold text-white">
            No notifications yet
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            New contest, referral, leaderboard, and system updates will appear
            here when they happen.
          </p>
        </div>
      )}
    </section>
  );
};

export default Notifications;