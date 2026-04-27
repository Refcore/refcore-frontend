export type ReferralRules = {
  allow_self_referral: boolean;
  allow_duplicate_phone_numbers: boolean;
  require_whatsapp_join_message: boolean;
  count_referral_only_after_join: boolean;
  manual_review_suspicious_referrals: boolean;
  auto_block_suspicious_referrals: boolean;
  max_referrals_per_user: number | null;
  rate_limit_per_phone_per_hour: number | null;
  minimum_referral_interval_seconds: number | null;
};