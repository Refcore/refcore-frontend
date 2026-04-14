'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { referralHealthData } from '@/demo/refferralHealthData';


type ReferralHealthProps = {
  isContestActive?: boolean;
};

const chartConfig = {
  valid_referrals: {
    label: 'Valid Referrals',
    color: '#00ff9d',
  },
  blocked_referrals: {
    label: 'Blocked Referrals',
    color: '#ef4444',
  },
  duplicate_attempts: {
    label: 'Duplicate Attempts',
    color: '#f59e0b',
  },
  self_referrals: {
    label: 'Self Referrals',
    color: '#b700ff',
  },
} satisfies ChartConfig;

const ReferralHealth = ({
  isContestActive = true,
}: ReferralHealthProps) => {
  const total = referralHealthData.reduce((sum, item) => sum + item.value, 0);
  const validCount =
    referralHealthData.find((item) => item.id === 'valid_referrals')?.value ?? 0;

  const validRate = total > 0 ? Math.round((validCount / total) * 100) : 0;

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
            {validRate}% valid
          </div>
        </div>

        {isContestActive ? (
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
        ) : (
          <div className="flex min-h-65 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#13131a]/60 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <ShieldAlert className="size-6 text-white/70" />
            </div>

            <h4 className="text-base font-semibold text-white">
              No active contest
            </h4>
            <p className="mt-2 max-w-md text-sm text-gray-400">
              Referral health will appear here when a contest is live and
              referrals are being validated.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <TriangleAlert className="size-5 text-[#f59e0b]" />
          <h3 className="text-lg font-bold text-white">Health Notes</h3>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#00ff9d]/15 bg-[#00ff9d]/8 p-4">
            <p className="text-sm font-semibold text-white">Strong validation quality</p>
            <p className="mt-1 text-xs text-gray-400">
              Most referral activity is passing validation, which suggests the
              contest is operating cleanly.
            </p>
          </div>

          <div className="rounded-xl border border-[#f59e0b]/15 bg-[#f59e0b]/8 p-4">
            <p className="text-sm font-semibold text-white">Duplicate monitoring needed</p>
            <p className="mt-1 text-xs text-gray-400">
              Duplicate attempts should be watched closely because they can grow
              as the contest gains momentum.
            </p>
          </div>

          <div className="rounded-xl border border-[#ef4444]/15 bg-[#ef4444]/8 p-4">
            <p className="text-sm font-semibold text-white">Blocked activity remains low</p>
            <p className="mt-1 text-xs text-gray-400">
              Blocked and self-referral attempts are present but not yet high
              enough to suggest major abuse.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralHealth;