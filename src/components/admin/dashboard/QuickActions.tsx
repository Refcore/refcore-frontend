'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Download,
  FilePenLine,
  Play,
  Square,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_ROUTES } from '@/routes';
import { Contest } from '@/types/contest.type';
import DialogueTool from '@/components/shared/DialogueTool';
import EndContestModal from '@/components/modals/EndContestModal';

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
  activeContest?: Contest | null;
};

const formatContestDate = (date?: string | Date | null) => {
  if (!date) return 'Not set';

  const formattedDate = new Date(date);

  if (Number.isNaN(formattedDate.getTime())) {
    return 'Not set';
  }

  return formattedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
  activeContest,
}: {
  item: QuickActionItem;
  activeContest?: Contest | null;
}) => {
  const Icon = item.icon;

  const [isOpen, setIsOpen] = useState(false);

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
    'flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-200',
    getButtonClasses(item.variant),
  );

  if (item.href) {
    return (
      <Link href={item.href} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  if (item.label === 'End Contest') {
    return (
      <DialogueTool
        open={isOpen}
        onOpenChange={setIsOpen}
        content={
          <EndContestModal
            activeContest={activeContest || null}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        }
        title="Confirm End Contest"
        contentClassName="border-[1.5px]"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={sharedClassName}
        >
          {content}
        </button>
      </DialogueTool>
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
  activeContest,
}: QuickActionsProps) => {
  const hasActiveContest = Boolean(activeContest);

  const items = quickActions
    .filter((item) => {
      if (hasActiveContest) {
        return item.label !== 'Start Contest';
      }

      return item.label !== 'End Contest';
    })
    .map((item) => {
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

  const isAuto = activeContest?.start_date && activeContest?.end_date;

  return (
    <section
      className={cn(
        'rounded-xl border border-white/10 bg-[#1c1c26]/60 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6',
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        <p className="text-sm text-gray-400">
          Manage your contest actions from one place.
        </p>
      </div>

      {hasActiveContest ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-green-500/20 bg-green-500/6 p-4">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                <span className="size-2 rounded-full bg-green-500" />
                Active Contest
              </div>

              <h3 className="text-lg font-bold text-white">
                {activeContest?.title ?? 'Untitled contest'}
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                This contest is currently running. You can view the leaderboard,
                export data, or end the contest even before the set end date.
              </p>
            </div>

            <Trophy className="size-8 shrink-0 text-[#00ff9d]" />
          </div>

          {isAuto ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-3">
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                  <CalendarDays className="size-4 text-[#00d0ff]" />
                  Start Date
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatContestDate(activeContest?.start_date)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-3">
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                  <CalendarDays className="size-4 text-[#b700ff]" />
                  End Date
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatContestDate(activeContest?.end_date)}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-3">
              <p>Manual Contest</p>
              <p className="text-sm text-gray-400">
                This is a manually timed contest. End the contest
                whenever you want by using the button below.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-[#00d0ff]/20 bg-[#00d0ff]/6 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#00d0ff]/30 bg-[#00d0ff]/10 px-3 py-1 text-xs font-bold text-[#00d0ff]">
                No Active Contest
              </div>

              <h3 className="text-lg font-bold text-white">
                Create or continue a draft contest
              </h3>

              <p className="mt-1 max-w-xl text-sm text-gray-400">
                You do not have any contest running right now. Go to the
                contests page to create a new contest or edit one of your saved
                drafts.
              </p>
            </div>

            <Link
              href={ADMIN_ROUTES.CONTESTS}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#b700ff] to-[#00d0ff] px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02]"
            >
              <FilePenLine className="size-4" />
              Manage Contests
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <QuickActionButton
            key={item.label}
            item={item}
            activeContest={activeContest}
          />
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
