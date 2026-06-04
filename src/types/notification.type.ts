export type NotificationType =
  | 'new_join'
  | 'new_referral'
  | 'contest_started'
  | 'contest_ended'
  | 'leaderboard_change'
  | 'reward_unlocked'
  | 'reward_claimed'
  | 'milestone_reached'
  | 'channel_verified'
  | 'otp_verified'
  | 'participant_disqualified'
  | 'referral_rejected'
  | 'referral_approved'
  | 'export_completed'
  | 'settings_updated'
  | 'profile_updated'
  | 'bonus_awarded'
  | 'rank_lost'
  | 'rank_gained'
  | 'system_alert';

export type NotificationItem = {
  id: string;
  user_id: string | null;
  channel_id: string | null;
  contest_id: string | null;
  type: NotificationType;
  title: string;
  description: string;
  actor: string | null;
  meta: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};