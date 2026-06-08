'use client';

import React, { useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  TriangleAlert,
  UserCheck,
} from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import IconLoader from '@/components/shared/IconLoader';

type ReferralHealthProps = {
  isContestActive?: boolean;
  isLoading?: boolean;
  validReferrals?: number;
  becameParticipantReferrals?: number;
  flaggedReferrals?: number;
  blockedReferrals?: number;
  totalReferrals?: number;
};

type ReferralHealthItem = {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
};

const chartConfig = {
  valid_referrals: {
    label: 'Valid Referrals',
    color: '#00ff9d',
  },
  became_participant_referrals: {
    label: 'Became Participants',
    color: '#00d0ff',
  },
  flagged_referrals: {
    label: 'Flagged Referrals',
    color: '#f59e0b',
  },
  blocked_referrals: {
    label: 'Blocked Referrals',
    color: '#ef4444',
  },
} satisfies ChartConfig;

const ReferralHealthLoadingState = () => {
  return (
    <div className="flex min-h-65 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#13131a]/60 px-6 text-center">
      <IconLoader loadingText="Loading referral health">
        <ShieldCheck />
      </IconLoader>
    </div>
  );
};

const ReferralHealthEmptyState = () => {
  return (
    <div className="flex min-h-65 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/60 px-6 text-center">
      <div className="mb-4">
        <IconLoader loadingText="No referral data yet">
          <ShieldAlert />
        </IconLoader>
      </div>

      <h4 className="text-base font-semibold text-white">
        No referral health data yet
      </h4>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        Referral health will appear here once this contest starts receiving
        referral activity.
      </p>
    </div>
  );
};

const ReferralHealthInactiveState = () => {
  return (
    <div className="flex min-h-65 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/60 px-6 text-center">
      <div className="mb-4">
        <IconLoader loadingText="No active contest">
          <ShieldAlert />
        </IconLoader>
      </div>

      <h4 className="text-base font-semibold text-white">No active contest</h4>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        Referral health will appear here when a contest is live and referrals
        are being validated.
      </p>
    </div>
  );
};

const ReferralHealth = ({
  isContestActive = true,
  isLoading = false,
  validReferrals = 0,
  becameParticipantReferrals = 0,
  flaggedReferrals = 0,
  blockedReferrals = 0,
  totalReferrals = 0,
}: ReferralHealthProps) => {
  const referralHealthData = useMemo<ReferralHealthItem[]>(() => {
    return [
      {
        id: 'valid_referrals',
        label: 'Valid Referrals',
        value: validReferrals,
        color: '#00ff9d',
        description: 'Referrals that passed validation successfully and are not participants.',
      },
      {
        id: 'became_participant_referrals',
        label: 'Became Participants',
        value: becameParticipantReferrals,
        color: '#00d0ff',
        description:
          'Valid referrals that also became participants in the contest.',
      },
      {
        id: 'flagged_referrals',
        label: 'Flagged Referrals',
        value: flaggedReferrals,
        color: '#f59e0b',
        description: 'Referrals marked for review due to suspicious activity.',
      },
      {
        id: 'blocked_referrals',
        label: 'Blocked Referrals',
        value: blockedReferrals,
        color: '#ef4444',
        description: 'Referrals blocked because they failed validation rules.',
      },
    ];
  }, [
    validReferrals,
    becameParticipantReferrals,
    flaggedReferrals,
    blockedReferrals,
  ]);

  const total =
    totalReferrals ||
    referralHealthData.reduce((sum, item) => sum + item.value, 0);

  const validCount = validReferrals + becameParticipantReferrals;

  const validRate = total > 0 ? Math.round((validCount / total) * 100) : 0;

  const suspiciousCount = flaggedReferrals + blockedReferrals;

  const hasReferralHealthData = total > 0;

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white md:text-xl">
              Referral Health
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Validation quality and contest safety overview
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#00ff9d]">
            <ShieldCheck className="size-4" />
            {validRate}% valid {total}
          </div>
        </div>

        {isLoading ? (
          <ReferralHealthLoadingState />
        ) : !isContestActive ? (
          <ReferralHealthInactiveState />
        ) : !hasReferralHealthData ? (
          <ReferralHealthEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <ChartContainer config={chartConfig} className="h-65 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={referralHealthData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {referralHealthData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="space-y-3">
              {referralHealthData.map((item) => {
                const percentage =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-[#13131a]/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-sm font-semibold text-white">
                            {item.label}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-bold text-white">
                          {item.value.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <TriangleAlert className="size-5 text-[#f59e0b]" />
          <h3 className="text-lg font-bold text-white">Health Notes</h3>
        </div>

        {isLoading ? (
          <div className="flex min-h-55 items-center justify-center rounded-xl border border-white/10 bg-[#13131a]/60">
            <IconLoader loadingText="Loading notes">
              <TriangleAlert />
            </IconLoader>
          </div>
        ) : !isContestActive ? (
          <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-4">
            <p className="text-sm font-semibold text-white">
              No active contest
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Health notes will be generated when an active contest has referral
              activity.
            </p>
          </div>
        ) : !hasReferralHealthData ? (
          <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-4">
            <p className="text-sm font-semibold text-white">
              No referral activity yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              There is not enough referral data yet to evaluate contest health.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#00ff9d]/15 bg-[#00ff9d]/8 p-4">
              <div className="mb-2 flex items-center gap-2">
                <UserCheck className="size-4 text-[#00ff9d]" />
                <p className="text-sm font-semibold text-white">
                  {validRate >= 70
                    ? 'Strong validation quality'
                    : 'Validation quality needs review'}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {validCount.toLocaleString()} out of {total.toLocaleString()}{' '}
                referral records are currently valid or converted into
                participants.
              </p>
            </div>

            <div className="rounded-xl border border-[#f59e0b]/15 bg-[#f59e0b]/8 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TriangleAlert className="size-4 text-[#f59e0b]" />
                <p className="text-sm font-semibold text-white">
                  Flagged referrals need attention
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {flaggedReferrals.toLocaleString()} referral
                {flaggedReferrals === 1 ? ' is' : 's are'} currently flagged for
                review.
              </p>
            </div>

            <div className="rounded-xl border border-[#ef4444]/15 bg-[#ef4444]/8 p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldX className="size-4 text-[#ef4444]" />
                <p className="text-sm font-semibold text-white">
                  Blocked activity
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {blockedReferrals.toLocaleString()} referral
                {blockedReferrals === 1 ? ' has' : 's have'} been blocked. Total
                suspicious activity is {suspiciousCount.toLocaleString()}.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReferralHealth;
