'use client';

import React from 'react';
import {
  AlertTriangle,
  Clock3,
  Phone,
  Settings2,
  ShieldCheck,
  UserRoundX,
  Users,
  MessageSquareShare,
} from 'lucide-react';
import type { ReferralRules } from '@/types/rule.type';
import SoloNumberInput from '@/components/shared/SoloNumberInput';
import {
  booleanRuleOptions,
  fromBooleanSelectValue,
  getInitialReferralRulesValues,
  referralRulesFieldMeta,
  toBooleanSelectValue,
} from '@/schema/refferalRules.schema';
import SoloDropDownInput from '@/components/shared/SoloDropDownInput';

type RefferalRulesSectionProps = {
  rules?: ReferralRules | null;
};

const RefferalRulesSection = ({ rules }: RefferalRulesSectionProps) => {
  const initialRules = React.useMemo(
    () => getInitialReferralRulesValues(rules),
    [rules],
  );

  const [ruleValues, setRuleValues] = React.useState(initialRules);
  const [loadingField, setLoadingField] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRuleValues(initialRules);
  }, [initialRules]);

  const handleBooleanRuleChange =
    (
      field: keyof Pick<
        ReferralRules,
        | 'allow_self_referral'
        | 'allow_duplicate_phone_numbers'
        | 'require_whatsapp_join_message'
        | 'count_referral_only_after_join'
        | 'manual_review_suspicious_referrals'
        | 'auto_block_suspicious_referrals'
      >,
    ) =>
    async (value: string) => {
      const nextValue = fromBooleanSelectValue(value);

      setRuleValues((prev) => ({
        ...prev,
        [field]: nextValue,
      }));

      setLoadingField(field);

      try {
        console.log({
          [field]: nextValue,
        });
      } finally {
        setLoadingField(null);
      }
    };

  const handleNumberRuleChange =
    (
      field: keyof Pick<
        ReferralRules,
        | 'max_referrals_per_user'
        | 'rate_limit_per_phone_per_hour'
        | 'minimum_referral_interval_seconds'
      >,
    ) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;

      const nextValue = rawValue === '' ? null : Number(rawValue);

      setRuleValues((prev) => ({
        ...prev,
        [field]: nextValue,
      }));

      setLoadingField(field);

      try {
        console.log({
          [field]: nextValue,
        });
      } finally {
        setLoadingField(null);
      }
    };

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings2 className="size-5 text-neon-green" />
            Referral Rules
          </h3>
          <p className="text-xs text-white/55 md:text-sm">
            Configure how referrals are counted, reviewed, and protected against
            abuse. Each setting updates independently when changed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Self Referral</p>
            <p className="mt-2 text-sm font-medium text-white">
              {ruleValues.allow_self_referral ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Duplicate Phone Numbers</p>
            <p className="mt-2 text-sm font-medium text-white">
              {ruleValues.allow_duplicate_phone_numbers ? 'Allowed' : 'Blocked'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Suspicious Referrals</p>
            <p className="mt-2 text-sm font-medium text-white">
              {ruleValues.auto_block_suspicious_referrals
                ? 'Auto Block'
                : ruleValues.manual_review_suspicious_referrals
                  ? 'Manual Review'
                  : 'No Special Action'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/50 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Core Referral Logic
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Define the basic rules for how users can create and earn referrals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SoloDropDownInput
            label={referralRulesFieldMeta.allow_self_referral.label}
            description={referralRulesFieldMeta.allow_self_referral.description}
            value={toBooleanSelectValue(ruleValues.allow_self_referral)}
            options={booleanRuleOptions}
            loading={loadingField === 'allow_self_referral'}
            leftAdornment={<UserRoundX className="size-4" />}
            onChange={handleBooleanRuleChange('allow_self_referral')}
          />

          <SoloDropDownInput
            label={referralRulesFieldMeta.allow_duplicate_phone_numbers.label}
            description={
              referralRulesFieldMeta.allow_duplicate_phone_numbers.description
            }
            value={toBooleanSelectValue(
              ruleValues.allow_duplicate_phone_numbers,
            )}
            options={booleanRuleOptions}
            loading={loadingField === 'allow_duplicate_phone_numbers'}
            leftAdornment={<Phone className="size-4" />}
            onChange={handleBooleanRuleChange('allow_duplicate_phone_numbers')}
          />

          <SoloDropDownInput
            label={referralRulesFieldMeta.require_whatsapp_join_message.label}
            description={
              referralRulesFieldMeta.require_whatsapp_join_message.description
            }
            value={toBooleanSelectValue(
              ruleValues.require_whatsapp_join_message,
            )}
            options={booleanRuleOptions}
            loading={loadingField === 'require_whatsapp_join_message'}
            leftAdornment={<MessageSquareShare className="size-4" />}
            onChange={handleBooleanRuleChange('require_whatsapp_join_message')}
          />

          <SoloDropDownInput
            label={referralRulesFieldMeta.count_referral_only_after_join.label}
            description={
              referralRulesFieldMeta.count_referral_only_after_join.description
            }
            value={toBooleanSelectValue(
              ruleValues.count_referral_only_after_join,
            )}
            options={booleanRuleOptions}
            loading={loadingField === 'count_referral_only_after_join'}
            leftAdornment={<Users className="size-4" />}
            onChange={handleBooleanRuleChange('count_referral_only_after_join')}
          />
        </div>
      </div>

      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/50 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Fraud Review & Protection
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Choose how suspicious referral activity should be reviewed or
            blocked.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SoloDropDownInput
            label={
              referralRulesFieldMeta.manual_review_suspicious_referrals.label
            }
            description={
              referralRulesFieldMeta.manual_review_suspicious_referrals
                .description
            }
            value={toBooleanSelectValue(
              ruleValues.manual_review_suspicious_referrals,
            )}
            options={booleanRuleOptions}
            loading={loadingField === 'manual_review_suspicious_referrals'}
            leftAdornment={<ShieldCheck className="size-4" />}
            onChange={handleBooleanRuleChange(
              'manual_review_suspicious_referrals',
            )}
          />

          <SoloDropDownInput
            label={referralRulesFieldMeta.auto_block_suspicious_referrals.label}
            description={
              referralRulesFieldMeta.auto_block_suspicious_referrals.description
            }
            value={toBooleanSelectValue(
              ruleValues.auto_block_suspicious_referrals,
            )}
            options={booleanRuleOptions}
            loading={loadingField === 'auto_block_suspicious_referrals'}
            leftAdornment={<AlertTriangle className="size-4" />}
            onChange={handleBooleanRuleChange(
              'auto_block_suspicious_referrals',
            )}
          />
        </div>
      </div>

      <div className="space-y-4 md:rounded-xl md:border md:border-white/10 md:bg-overbg/50 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Limits & Rate Controls
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Add optional limits to reduce spam and keep referral activity under
            control.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="w-full space-y-2">
            <SoloNumberInput
              label={referralRulesFieldMeta.max_referrals_per_user.label}
              placeholder="No limit"
              description={
                referralRulesFieldMeta.max_referrals_per_user.description
              }
              value={ruleValues.max_referrals_per_user ?? ''}
              loading={loadingField === 'max_referrals_per_user'}
              onChange={handleNumberRuleChange('max_referrals_per_user')}
              leftAdornment={<Users className="size-4" />}
            />
          </div>

          <div className="w-full space-y-2">
            <SoloNumberInput
              label={referralRulesFieldMeta.rate_limit_per_phone_per_hour.label}
              placeholder="No limit"
              description={
                referralRulesFieldMeta.rate_limit_per_phone_per_hour.description
              }
              value={ruleValues.rate_limit_per_phone_per_hour ?? ''}
              loading={loadingField === 'rate_limit_per_phone_per_hour'}
              onChange={handleNumberRuleChange('rate_limit_per_phone_per_hour')}
              leftAdornment={<Phone className="size-4" />}
            />
          </div>

          <div className="w-full space-y-2">
            <SoloNumberInput
              label={
                referralRulesFieldMeta.minimum_referral_interval_seconds.label
              }
              placeholder="0"
              description={
                referralRulesFieldMeta.minimum_referral_interval_seconds
                  .description
              }
              value={ruleValues.minimum_referral_interval_seconds ?? ''}
              loading={loadingField === 'minimum_referral_interval_seconds'}
              onChange={handleNumberRuleChange(
                'minimum_referral_interval_seconds',
              )}
              leftAdornment={<Clock3 className="size-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefferalRulesSection;
