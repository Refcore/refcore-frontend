import { z } from 'zod';
import { ReferralRules } from '@/types/rule.type';

export const booleanRuleOptions = [
  { label: 'Enabled', value: 'true' },
  { label: 'Disabled', value: 'false' },
] as const;

export const referralRulesFieldMeta = {
  allow_self_referral: {
    label: 'Allow Self Referral',
    description: 'Decide whether participants can refer themselves.',
  },
  allow_duplicate_phone_numbers: {
    label: 'Allow Duplicate Phone Numbers',
    description:
      'Control whether the same phone number can be used more than once.',
  },
  require_whatsapp_join_message: {
    label: 'Require WhatsApp Join Message',
    description:
      'Require users to send the JOIN message before a referral can be processed.',
  },
  count_referral_only_after_join: {
    label: 'Count Referral Only After Join',
    description:
      'Only count a referral after the referred participant has successfully joined.',
  },
  manual_review_suspicious_referrals: {
    label: 'Manual Review Suspicious Referrals',
    description:
      'Flag suspicious referrals for manual review before accepting them.',
  },
  auto_block_suspicious_referrals: {
    label: 'Auto Block Suspicious Referrals',
    description:
      'Automatically block referrals that match suspicious patterns.',
  },
  max_referrals_per_user: {
    label: 'Maximum Referrals Per User',
    description:
      'Optional cap on how many referrals a single participant can make.',
  },
  rate_limit_per_phone_per_hour: {
    label: 'Rate Limit Per Phone Per Hour',
    description:
      'Optional limit on how many referral actions a phone number can make per hour.',
  },
  minimum_referral_interval_seconds: {
    label: 'Minimum Referral Interval (Seconds)',
    description: 'Optional minimum time required between referral attempts.',
  },
} as const;

export const referralRulesSchema = z.object({
  allow_self_referral: z.boolean(),

  allow_duplicate_phone_numbers: z.boolean(),

  require_whatsapp_join_message: z.boolean(),

  count_referral_only_after_join: z.boolean(),

  manual_review_suspicious_referrals: z.boolean(),

  auto_block_suspicious_referrals: z.boolean(),

  max_referrals_per_user: z.coerce
    .number({
      message: 'Maximum referrals per user must be a number',
    })
    .int('Maximum referrals per user must be a whole number')
    .min(1, 'Maximum referrals per user must be at least 1')
    .optional()
    .nullable(),

  rate_limit_per_phone_per_hour: z.coerce
    .number({
      message: 'Rate limit per phone per hour must be a number',
    })
    .int('Rate limit per phone per hour must be a whole number')
    .min(1, 'Rate limit per phone per hour must be at least 1')
    .optional()
    .nullable(),

  minimum_referral_interval_seconds: z.coerce
    .number({
      message: 'Minimum referral interval must be a number',
    })
    .int('Minimum referral interval must be a whole number')
    .min(0, 'Minimum referral interval cannot be negative')
    .optional()
    .nullable(),
});

export type ReferralRulesValues = z.infer<typeof referralRulesSchema>;

export const initialReferralRulesValues: ReferralRules = {
  allow_self_referral: false,
  allow_duplicate_phone_numbers: false,
  require_whatsapp_join_message: true,
  count_referral_only_after_join: true,
  manual_review_suspicious_referrals: true,
  auto_block_suspicious_referrals: false,
  max_referrals_per_user: null,
  rate_limit_per_phone_per_hour: null,
  minimum_referral_interval_seconds: null,
};

export const getInitialReferralRulesValues = (
  rules?: ReferralRules | null,
): ReferralRules => ({
  allow_self_referral:
    rules?.allow_self_referral ??
    initialReferralRulesValues.allow_self_referral,
  allow_duplicate_phone_numbers:
    rules?.allow_duplicate_phone_numbers ??
    initialReferralRulesValues.allow_duplicate_phone_numbers,
  require_whatsapp_join_message:
    rules?.require_whatsapp_join_message ??
    initialReferralRulesValues.require_whatsapp_join_message,
  count_referral_only_after_join:
    rules?.count_referral_only_after_join ??
    initialReferralRulesValues.count_referral_only_after_join,
  manual_review_suspicious_referrals:
    rules?.manual_review_suspicious_referrals ??
    initialReferralRulesValues.manual_review_suspicious_referrals,
  auto_block_suspicious_referrals:
    rules?.auto_block_suspicious_referrals ??
    initialReferralRulesValues.auto_block_suspicious_referrals,
  max_referrals_per_user:
    rules?.max_referrals_per_user ??
    initialReferralRulesValues.max_referrals_per_user,
  rate_limit_per_phone_per_hour:
    rules?.rate_limit_per_phone_per_hour ??
    initialReferralRulesValues.rate_limit_per_phone_per_hour,
  minimum_referral_interval_seconds:
    rules?.minimum_referral_interval_seconds ??
    initialReferralRulesValues.minimum_referral_interval_seconds,
});

export const toBooleanSelectValue = (value: boolean) =>
  value ? 'true' : 'false';

export const fromBooleanSelectValue = (value: string) => value === 'true';
