import type { participants } from '@/generated/prisma/client';

export type ParticipantBadge = 'champion' | 'elite' | 'active' | 'rising';

export type ParticipantStatus = 'active' | 'inactive';

type ParticipantBase = Pick<
  participants,
  | 'id'
  | 'referral_code'
  | 'total_referrals'
  | 'total_contests_joined'
  | 'first_joined_at'
>;

export type ParticipantModel = ParticipantBase & {
  user_name: string;
  phone_number: string;
  avatar: string | null;

  total_contests_won: number;
  best_position: number | null;
  average_position: number | null;
  current_badge: ParticipantBadge;

  last_active_at: string;
  status: ParticipantStatus;

  // override Date from Prisma into string for API/UI
  first_joined_at: string;
};