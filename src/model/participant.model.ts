export type ParticipantBadge = 'champion' | 'elite' | 'active' | 'rising';

export type ParticipantStatus = 'active' | 'inactive';

export type ParticipantModel = {
  id: string;
  user_name: string;
  phone: string;
  avatar: string | null;
  referral_code: string;

  total_referrals: number;
  total_contests_joined: number;
  total_contests_won: number;
  best_position: number | null;
  average_position: number | null;
  current_badge: ParticipantBadge;

  first_joined_at: string;
  last_active_at: string;
  status: ParticipantStatus;
};