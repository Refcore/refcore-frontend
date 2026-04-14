'use client';

import React from 'react';
import { CheckCheck, MoreHorizontal, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/demo/notificationsData';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { notificationTypeMap } from '@/utils/notification.utils';

type NotificationCardProps = {
  notification: NotificationItem;
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) => {
  const config = notificationTypeMap[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-200',
        notification.isRead
          ? 'border-white/5 bg-[#13131a]/45'
          : 'border-white/10 bg-[#13131a]/85 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]',
      )}
    >
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

                {!notification.isRead ? (
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
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-48 rounded-xl border-white/10 bg-[#13131a] p-2"
              >
                <div className="flex flex-col gap-1">
                  {!notification.isRead ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="justify-start rounded-lg"
                      onClick={() => onMarkAsRead?.(notification.id)}
                    >
                      <CheckCheck className="size-4" />
                      Mark as read
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start rounded-lg text-red-400 hover:text-red-300"
                    onClick={() => onDelete?.(notification.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete notification
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55">
            <span>
              {notification.date} • {notification.time}
            </span>

            {notification.actor ? <span>{notification.actor}</span> : null}

            {notification.meta ? <span>{notification.meta}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;