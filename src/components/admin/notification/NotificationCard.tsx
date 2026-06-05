'use client';

import React from 'react';
import { CheckCheck, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  fallbackNotificationTypeConfig,
  formatNotificationDateTime,
  formatNotificationRelativeTime,
  formatNotificationTypeLabel,
  notificationTypeMap,
} from '@/utils/notification.utils';
import type { NotificationItem } from '@/types/notification.type';

type NotificationCardProps = {
  notification: NotificationItem;
  isMarkingAsRead?: boolean;
  isDeleting?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
};

const NotificationCard = ({
  notification,
  isMarkingAsRead = false,
  isDeleting = false,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) => {
  const config =
    notificationTypeMap[
      notification.type as keyof typeof notificationTypeMap
    ] ?? fallbackNotificationTypeConfig;

  const Icon = config.icon;

  const relativeTime = formatNotificationRelativeTime(notification.created_at);
  const fullDateTime = formatNotificationDateTime(notification.created_at);
  const notificationTypeLabel = formatNotificationTypeLabel(notification.type);

  const isActionInProgress = isMarkingAsRead || isDeleting;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 transition-all duration-200',
        notification.is_read
          ? 'border-white/5 bg-[#13131a]/45 opacity-50'
          : 'border-white/10 bg-[#13131a]/85 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]',
        isActionInProgress && 'opacity-80',
        isDeleting && 'border-red-500/20 bg-red-500/5',
      )}
    >
      {isActionInProgress ? (
        <div
          className={cn(
            'mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
            isDeleting
              ? 'border-red-500/20 bg-red-500/10 text-red-300'
              : 'border-[#00d0ff]/20 bg-[#00d0ff]/10 text-[#00d0ff]',
          )}
        >
          <Loader2 className="size-3.5 animate-spin" />

          <span>
            {isDeleting
              ? 'Deleting notification...'
              : 'Marking notification as read...'}
          </span>
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            config.iconClassName,
          )}
        >
          <Icon className="size-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">
                  {notification.title}
                </p>

                {!notification.is_read ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#00d0ff]" />
                ) : null}
              </div>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {notification.description}
              </p>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5"
                  disabled={isActionInProgress}
                >
                  {isActionInProgress ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="size-4" />
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-52 rounded-xl border-white/10 bg-[#13131a] p-2"
              >
                <div className="flex flex-col gap-1">
                  {!notification.is_read ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="justify-start rounded-lg"
                      onClick={() => onMarkAsRead?.(notification.id)}
                      disabled={isActionInProgress}
                    >
                      {isMarkingAsRead ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCheck className="size-4" />
                      )}
                      {isMarkingAsRead ? 'Marking...' : 'Mark as read'}
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start rounded-lg text-red-400 hover:text-red-300"
                    onClick={() => onDelete?.(notification.id)}
                    disabled={isActionInProgress}
                  >
                    {isDeleting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Delete notification'}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55">
            <span title={fullDateTime}>{relativeTime}</span>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span>{notificationTypeLabel}</span>

            {notification.actor ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>{notification.actor}</span>
              </>
            ) : null}

            {notification.meta ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>{notification.meta}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;