import { Trophy, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type {
  ParticipantModel,
  ParticipantBadge,
} from '@/model/participant.model';
import ParticipantActions from './ParticipantActions';

export type ParticipantsColumn = {
  id: string;
  header: string;
  className?: string;
  mobileHidden?: boolean;
  render: (participant: ParticipantModel) => ReactNode;
};

const maskPhone = (phone?: string) => {
  if (!phone) return 'No phone';
  const digits = phone.replace(/\s+/g, '');
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 4)}****${digits.slice(-4)}`;
};

const getBadgeClass = (badge: ParticipantBadge) => {
  if (badge === 'champion') {
    return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400';
  }

  if (badge === 'elite') {
    return 'border-[#b700ff]/30 bg-[#b700ff]/10 text-[#d78cff]';
  }

  if (badge === 'active') {
    return 'border-[#00d0ff]/30 bg-[#00d0ff]/10 text-[#7ae7ff]';
  }

  return 'border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[#00ff9d]';
};

const getStatusClass = (status: ParticipantModel['status']) => {
  return status === 'active'
    ? 'bg-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.35)]'
    : 'bg-white/30';
};

const formatAveragePosition = (value: number | null) => {
  if (value === null) return '—';
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

export const participantsColumns: ParticipantsColumn[] = [
  {
    id: 'user',
    header: 'User',
    render: (participant) => (
      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 md:flex">
          <UserRound className="size-5 text-white/80" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {participant.user_name}
            </p>

            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                getBadgeClass(participant.current_badge),
              )}
            >
              {participant.current_badge}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                'inline-block h-2 w-2 rounded-full',
                getStatusClass(participant.status),
              )}
            />

            <p className="truncate text-xs text-gray-500">
              {maskPhone(participant.phone)}
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'totalReferrals',
    header: 'Referrals',
    className: 'text-right',
    render: (participant) => (
      <div className="text-right">
        <div className="text-lg font-bold text-white">
          {participant.total_referrals.toLocaleString()}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">
          code: {participant.referral_code}
        </div>
      </div>
    ),
  },
  {
    id: 'contests',
    header: 'Contests',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-center">
        <div className="text-sm font-semibold text-white">
          {participant.total_contests_joined}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">joined</div>
      </div>
    ),
  },
  {
    id: 'averagePosition',
    header: 'Avg Pos.',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-center">
        <div className="text-sm font-semibold text-white">
          {formatAveragePosition(participant.average_position)}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">average</div>
      </div>
    ),
  },
  {
    id: 'bestPosition',
    header: 'Best',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white">
          {participant.best_position === 1 ? (
            <Trophy className="size-3.5 text-yellow-400" />
          ) : null}
          {participant.best_position ?? '—'}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">position</div>
      </div>
    ),
  },
  {
    id: 'wins',
    header: 'Wins',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-center">
        <div className="text-sm font-semibold text-white">
          {participant.total_contests_won}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">won</div>
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    className: 'text-right',
    render: (participant) => (
      <div className="flex justify-end">
        <ParticipantActions
          participantId={participant.id}
          userName={participant.user_name}
          referralCode={participant.referral_code}
          phone={participant.phone}
        />
      </div>
    ),
  },
];
