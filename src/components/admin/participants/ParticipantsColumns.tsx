import { CalendarDays, Clock, Trophy, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type {
  ParticipantModel,
  ParticipantBadge,
} from '@/types/participant.type';
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

const getParticipantBadge = (participant: ParticipantModel): ParticipantBadge => {
  const totalReferrals = participant.total_referrals;

  if (totalReferrals >= 50) return 'champion';

  if (totalReferrals >= 25) return 'elite';

  if (totalReferrals >= 5) return 'active';

  return 'rising';
};

const getBadgeLabel = (badge: ParticipantBadge) => {
  if (badge === 'champion') return 'Champion';
  if (badge === 'elite') return 'Elite';
  if (badge === 'active') return 'Active';

  return 'Rising';
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

const formatDate = (value?: string | Date | null) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
};

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

export const participantsColumns: ParticipantsColumn[] = [
  {
    id: 'user',
    header: 'User',
    render: (participant) => {
      const badge = getParticipantBadge(participant);

      return (
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
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  getBadgeClass(badge),
                )}
              >
                {getBadgeLabel(badge)}
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
                {maskPhone(participant.phone_number)} 
              </p>
            </div>
          </div>
        </div>
      );
    },
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
    id: 'badge',
    header: 'Level',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => {
      const badge = getParticipantBadge(participant);

      return (
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white">
            {badge === 'champion' ? (
              <Trophy className="size-3.5 text-yellow-400" />
            ) : null}
            {getBadgeLabel(badge)}
          </div>
          <div className="mt-1 text-[11px] text-gray-500">based on referrals</div>
        </div>
      );
    },
  },
  {
    id: 'firstJoined',
    header: 'First Joined',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white">
          <CalendarDays className="size-3.5 text-[#00d0ff]" />
          {formatDate(participant.first_joined_at)}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">created</div>
      </div>
    ),
  },
  {
    id: 'lastActive',
    header: 'Last Active',
    className: 'text-center',
    mobileHidden: true,
    render: (participant) => (
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white">
          <Clock className="size-3.5 text-[#00ff9d]" />
          {formatDateTime(participant.last_active_at)}
        </div>
        <div className="mt-1 text-[11px] text-gray-500">activity</div>
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
          phone={participant.phone_number}
        />
      </div>
    ),
  },
];