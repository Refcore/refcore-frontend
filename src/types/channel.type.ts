import { ContestDefaults } from './contest.type';
import { NotificationSettings } from './notificationsettings.type';
import { ReferralRules } from './rule.type';

export type MyChannel = {
  id: string;
  owner_id: string;
  tv_name: string;
  slug: string;
  whatsapp_number: string;
  whatsapp_verified: boolean;
  whatsapp_verified_at: string | null;
  status: 'pending_verification' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
  channel_members_limit: string | null;
  channel_banner: string | null;
  contest_defaults: ContestDefaults;
  referral_rules: ReferralRules;
  notification_settings: NotificationSettings;
};
