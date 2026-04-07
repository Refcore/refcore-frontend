import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Trophy,
  Medal,
  Users,
  ChartPie,
  Bell,
  Download,
  Settings,
} from 'lucide-react';
import { ADMIN_ROUTES } from '@/routes';

export type NavConfigItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const nav_config: NavConfigItem[] = [
  {
    label: 'Dashboard',
    href: ADMIN_ROUTES.HOME,
    icon: LayoutDashboard,
  },
  {
    label: 'Contest',
    href: ADMIN_ROUTES.CONTESTS,
    icon: Trophy,
  },
  {
    label: 'Leaderboard',
    href: ADMIN_ROUTES.LEADERBOARD,
    icon: Medal,
  },
  {
    label: 'Participants',
    href: ADMIN_ROUTES.PARTICIPANTS,
    icon: Users,
  },
  {
    label: 'Analytics',
    href: ADMIN_ROUTES.ANALYTICS,
    icon: ChartPie,
  },
  {
    label: 'Notifications',
    href: ADMIN_ROUTES.NOTIFICATIONS,
    icon: Bell,
    badge: 3,
  },
  {
    label: 'Export',
    href: ADMIN_ROUTES.EXPORT,
    icon: Download,
  },
  {
    label: 'Settings',
    href: ADMIN_ROUTES.SETTINGS,
    icon: Settings,
  },
];
