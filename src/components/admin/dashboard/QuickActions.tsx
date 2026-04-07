'use client';

import React from 'react';
import Link from 'next/link';
import {
  Download,
  Play,
  Square,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_ROUTES } from '@/routes';

type QuickActionItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: 'success' | 'danger' | 'neutral';
};

type QuickActionsProps = {
  onStartContest?: () => void;
  onEndContest?: () => void;
  onExportData?: () => void;
  className?: string;
};

const quickActions: QuickActionItem[] = [
  {
    label: 'Start Contest',
    icon: Play,
    variant: 'success',
  },
  {
    label: 'End Contest',
    icon: Square,
    variant: 'danger',
  },
  {
    label: 'View Leaderboard',
    icon: Trophy,
    href: ADMIN_ROUTES.LEADERBOARD,
    variant: 'neutral',
  },
  {
    label: 'Export Data',
    icon: Download,
    variant: 'neutral',
  },
];

const getButtonClasses = (variant: QuickActionItem['variant']) => {
  switch (variant) {
    case 'success':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.3)]';
    case 'danger':
      return 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-[1.02] shadow-[0_0_20px_rgba(239,68,68,0.3)]';
    default:
      return 'border border-white/10 bg-[#13131a] text-white hover:bg-[#1c1c26]';
  }
};

const QuickActionButton = ({
  item,
}: {
  item: QuickActionItem;
}) => {
  const Icon = item.icon;

  const content = (
    <>
      <Icon
        className={cn(
          'size-5 shrink-0',
          item.variant === 'neutral' && item.label === 'View Leaderboard'
            ? 'text-[#b700ff]'
            : '',
          item.variant === 'neutral' && item.label === 'Export Data'
            ? 'text-[#00d0ff]'
            : '',
        )}
      />
      <span>{item.label}</span>
    </>
  );

  const sharedClassName = cn(
    'flex items-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-200',
    getButtonClasses(item.variant),
  );

  if (item.href) {
    return (
      <Link href={item.href} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className={sharedClassName}>
      {content}
    </button>
  );
};

const QuickActions = ({
  onStartContest,
  onEndContest,
  onExportData,
  className,
}: QuickActionsProps) => {
  const items = quickActions.map((item) => {
    if (item.label === 'Start Contest') {
      return { ...item, onClick: onStartContest };
    }

    if (item.label === 'End Contest') {
      return { ...item, onClick: onEndContest };
    }

    if (item.label === 'Export Data') {
      return { ...item, onClick: onExportData };
    }

    return item;
  });

  return (
    <section
      className={cn(
        'rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 md:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl',
        className,
      )}
    >
      <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <QuickActionButton key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
};

export default QuickActions;