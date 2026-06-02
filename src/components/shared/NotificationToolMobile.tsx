'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetNotifications } from '@/hooks/admin/notifications/useGetNotifications';
import { ADMIN_ROUTES } from '@/routes';
import { useRouter } from 'next/navigation';

type NotificationToolProps = {
  className?: string;
  onClick?: () => void;
};

const NotificationToolMobile = ({ className }: NotificationToolProps) => {
  const { data, isLoading } = useGetNotifications({
    scope: 'all',
    page: 1,
    limit: 20,
  });

  const unreadCount = data?.unread_count ?? 0;

  const router = useRouter();

  const handleClick = () => {
    router.push(ADMIN_ROUTES.NOTIFICATIONS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white',
        className,
      )}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Bell className="h-5 w-5" />

      {!isLoading && unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-background">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : null}
    </button>
  );
};

export default NotificationToolMobile;
