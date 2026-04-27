export type NotificationChannelPreference = {
  in_app: boolean;
  whatsapp: boolean;
};

export type AdminNotificationSettings = {
  new_participant_joined: NotificationChannelPreference;
  referral_recorded: NotificationChannelPreference;
  leaderboard_position_changed: NotificationChannelPreference;
  new_top_performer: NotificationChannelPreference;
  suspicious_referral_detected: NotificationChannelPreference;
  contest_started: NotificationChannelPreference;
  contest_ended: NotificationChannelPreference;
};

export type ParticipantNotificationSettings = {
  join_confirmed: NotificationChannelPreference;
  referral_successful: NotificationChannelPreference;
  leaderboard_position_changed: NotificationChannelPreference;
  became_top_performer: NotificationChannelPreference;
  reward_qualified: NotificationChannelPreference;
  contest_ending_soon: NotificationChannelPreference;
  contest_ended: NotificationChannelPreference;
};

export type NotificationSettings = {
  admin_notifications: AdminNotificationSettings;
  participant_notifications: ParticipantNotificationSettings;
};