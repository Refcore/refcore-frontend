import React from 'react';
import { CalendarDays, Eye, Pencil, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Contest } from '@/types/contest.type';
import { cn } from '@/lib/utils';

type ContestCardProps = {
  contest: Contest;
  onView?: (contest: Contest) => void;
  onEdit?: (contest: Contest) => void;
};

const statusStyles: Record<Contest['status'], string> = {
  active:
    'border-[color:var(--neon-green)]/25 bg-[color:var(--neon-green)]/10 text-[color:var(--neon-green)]',
  upcoming:
    'border-[color:var(--neon-blue)]/25 bg-[color:var(--neon-blue)]/10 text-[color:var(--neon-blue)]',
  past: 'border-border bg-white/5 text-muted-foreground',
  draft:
    'border-[color:var(--neon-purple)]/20 bg-[color:var(--neon-purple)]/10 text-[color:var(--neon-purple)]',
};

const ContestCard = ({ contest, onView, onEdit }: ContestCardProps) => {
  return (
    <div className="group space-y-3 rounded-xl border-2 bg-background/60 border-border/50 p-3 transition-colors duration-200 hover:border-(--neon-green)/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize',
              statusStyles[contest.status],
            )}
          >
            {contest.status}
          </div>

          <h3 className="truncate text-sm font-semibold text-white transition-colors duration-200 group-hover:text-(--neon-green)">
            {contest.title}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="size-4" />
        <span>
          {new Date(contest.start_date)?.toLocaleDateString()} -{' '}
          {contest.end_date
            ? new Date(contest.end_date)?.toLocaleDateString()
            : 'No end date'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-white/5 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="size-4" />
            Participants
          </div>
          <p className="text-sm font-semibold text-white">
            {contest.participants_count?.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white/5 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="size-4" />
            Referrals
          </div>
          <p className="text-sm font-semibold text-white">
            {contest.referrals_count?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl border-border bg-white/5 hover:bg-white/10"
          onClick={() => onView?.(contest)}
        >
          <Eye className="size-4" />
          View
        </Button>

        <Button
          type="button"
          className="flex-1 rounded-xl bg-(--neon-green) text-black hover:bg-(--neon-green)/90"
          onClick={() => onEdit?.(contest)}
        >
          <Pencil className="size-4" />
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ContestCard;
