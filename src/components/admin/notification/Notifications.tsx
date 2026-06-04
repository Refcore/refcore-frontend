'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NotificationCard from './NotificationCard';
import { getNotificationTimestamp } from '@/utils/notification.utils';
import type { NotificationItem } from '@/types/notification.type';
import { useGetNotifications } from '@/hooks/admin/notifications/useGetNotifications';
import { useMarkNotificationAsRead } from '@/hooks/admin/notifications/useMarkNotificationAsRead';
import { useDeleteNotification } from '@/hooks/admin/notifications/useDeleteNotification';
import { useMarkAllNotificationsAsRead } from '@/hooks/admin/notifications/useMarkAllNotificationsAsRead';

const NOTIFICATIONS_LIMIT = 20;

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [markingNotificationId, setMarkingNotificationId] = useState<
    string | null
  >(null);
  const [deletingNotificationId, setDeletingNotificationId] = useState<
    string | null
  >(null);

  const { data, isLoading, isError, error, refetch } = useGetNotifications({
    scope: 'all',
    page: currentPage,
    limit: NOTIFICATIONS_LIMIT,
  });

  const { markNotificationAsRead, is_marking_notification_as_read } =
    useMarkNotificationAsRead();

  const { deleteNotification, is_deleting_notification } =
    useDeleteNotification();

  const { markAllNotificationsAsRead, is_marking_all_notifications_as_read } =
    useMarkAllNotificationsAsRead();

  const pagination = data?.pagination;
  const apiNotifications = useMemo(
    () => data?.notifications ?? [],
    [data?.notifications],
  );

  const totalNotifications = pagination?.total ?? 0;
  const unreadCount = data?.unread_count ?? 0;

  useEffect(() => {
    setNotifications(apiNotifications);
  }, [apiNotifications]);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a),
    );
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead({
      scope: 'all',
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    const targetNotification = notifications.find(
      (item) => item.id === notificationId,
    );

    if (!targetNotification || targetNotification.is_read) return;

    setMarkingNotificationId(notificationId);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              is_read: true,
            }
          : item,
      ),
    );

    markNotificationAsRead(notificationId, {
      onError: () => {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notificationId
              ? {
                  ...item,
                  is_read: targetNotification.is_read,
                }
              : item,
          ),
        );

        refetch();
      },

      onSettled: () => {
        setMarkingNotificationId(null);
      },
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    const targetNotification = notifications.find(
      (item) => item.id === notificationId,
    );

    if (!targetNotification) return;

    setDeletingNotificationId(notificationId);

    deleteNotification(notificationId, {
      onSuccess: () => {
        setNotifications((prev) =>
          prev.filter((item) => item.id !== notificationId),
        );
      },

      onError: () => {
        refetch();
      },

      onSettled: () => {
        setDeletingNotificationId(null);
      },
    });
  };

  const handlePreviousPage = () => {
    if (!pagination?.can_previous_page) return;

    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (!pagination?.can_next_page) return;

    setCurrentPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <section className="rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="flex min-h-55 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/45 px-6 text-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-r-[#00ff9d] border-t-[#00d0ff]" />

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Bell className="size-6 text-white/70" />
            </div>
          </div>

          <h3 className="text-base font-semibold text-white">
            Loading notifications...
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Please wait while your latest notifications are being fetched.
          </p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="flex min-h-55 flex-col items-center justify-center rounded-xl border border-dashed border-red-500/20 bg-[#13131a]/45 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <Bell className="size-6 text-red-400" />
          </div>

          <h3 className="text-base font-semibold text-white">
            Failed to load notifications
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {error?.message ||
              'Something went wrong while loading notifications.'}
          </p>

          <Button
            type="button"
            variant="ghost"
            className="mt-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

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

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span>{totalNotifications} total</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{unreadCount} unread</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={handleMarkAllAsRead}
            disabled={is_marking_all_notifications_as_read || unreadCount === 0}
            loading={is_marking_all_notifications_as_read}
          >
            <CheckCheck className="size-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      {sortedNotifications.length > 0 ? (
        <>
          <div className="space-y-3">
            {sortedNotifications.map((notification) => {
              const isMarkingThisNotification =
                is_marking_notification_as_read &&
                markingNotificationId === notification.id;

              const isDeletingThisNotification =
                is_deleting_notification &&
                deletingNotificationId === notification.id;

              return (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                  isMarkingAsRead={isMarkingThisNotification}
                  isDeleting={isDeletingThisNotification}
                />
              );
            })}
          </div>

          {pagination && pagination.total_pages > 1 ? (
            <div className="mt-6 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.total_pages}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                  onClick={handlePreviousPage}
                  disabled={!pagination.can_previous_page}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                  onClick={handleNextPage}
                  disabled={!pagination.can_next_page}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </>
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
