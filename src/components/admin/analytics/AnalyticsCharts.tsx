'use client';

import React, { useMemo } from 'react';
import {
  Activity,
  ChartColumnBig,
  Radar,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar as RechartsRadar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import type { ReferralModel } from '@/types/referral.type';
import IconLoader from '@/components/shared/IconLoader';

type ContestParticipantChartItem = {
  joined_at: string;
};

type AnalyticsChartsProps = {
  referrals?: ReferralModel[];
  participants?: ContestParticipantChartItem[];
  isLoading?: boolean;
};

type ReferralsChartItem = {
  day: string;
  referrals: number;
};

type JoinsChartItem = {
  day: string;
  joins: number;
};

const referralsChartConfig = {
  referrals: {
    label: 'Referrals',
    color: '#00d0ff',
  },
} satisfies ChartConfig;

const joinsChartConfig = {
  joins: {
    label: 'Joins',
    color: '#b700ff',
  },
} satisfies ChartConfig;

const getLastSevenDays = () => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    date.setHours(0, 0, 0, 0);

    return date;
  });
};

const getDayKey = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const getDayLabel = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
  });
};

const isValidDate = (date: Date) => {
  return !Number.isNaN(date.getTime());
};

const buildReferralsChartData = (
  referrals: ReferralModel[],
): ReferralsChartItem[] => {
  const lastSevenDays = getLastSevenDays();

  const referralsByDay = referrals.reduce<Record<string, number>>(
    (accumulator, referral) => {
      const referralDate = new Date(referral.created_at);

      if (!isValidDate(referralDate)) {
        return accumulator;
      }

      referralDate.setHours(0, 0, 0, 0);

      const dayKey = getDayKey(referralDate);
      accumulator[dayKey] = (accumulator[dayKey] ?? 0) + 1;

      return accumulator;
    },
    {},
  );

  return lastSevenDays.map((date) => {
    const dayKey = getDayKey(date);

    return {
      day: getDayLabel(date),
      referrals: referralsByDay[dayKey] ?? 0,
    };
  });
};

const buildJoinsChartData = (
  participants: ContestParticipantChartItem[],
): JoinsChartItem[] => {
  const lastSevenDays = getLastSevenDays();

  const joinsByDay = participants.reduce<Record<string, number>>(
    (accumulator, participant) => {
      const joinedDate = new Date(participant.joined_at);

      if (!isValidDate(joinedDate)) {
        return accumulator;
      }

      joinedDate.setHours(0, 0, 0, 0);

      const dayKey = getDayKey(joinedDate);
      accumulator[dayKey] = (accumulator[dayKey] ?? 0) + 1;

      return accumulator;
    },
    {},
  );

  return lastSevenDays.map((date) => {
    const dayKey = getDayKey(date);

    return {
      day: getDayLabel(date),
      joins: joinsByDay[dayKey] ?? 0,
    };
  });
};

const hasChartData = <T extends Record<string, string | number>>(
  data: T[],
  valueKey: keyof T,
) => {
  return data.some((item) => Number(item[valueKey]) > 0);
};

const ChartEmptyState = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-70 w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0a0a0f]/30 px-4 text-center">
      <div className="mb-4 flex items-center justify-center">{children}</div>

      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
};

const ChartLoadingState = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-70 w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0f]/30">
      <IconLoader loadingText={text}>{children}</IconLoader>
    </div>
  );
};

const AnalyticsCharts = ({
  referrals = [],
  participants = [],
  isLoading = false,
}: AnalyticsChartsProps) => {
  const referralsOverTimeData = useMemo(() => {
    return buildReferralsChartData(referrals);
  }, [referrals]);

  const joinsPerDayData = useMemo(() => {
    return buildJoinsChartData(participants);
  }, [participants]);

  const hasReferralsData = hasChartData(
    referralsOverTimeData,
    'referrals',
  );

  const hasJoinsData = hasChartData(joinsPerDayData, 'joins');

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white md:text-xl">
              Referrals Over Time
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Referral growth across the current contest
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#00d0ff]">
            <TrendingUp className="size-4" />
            Trend
          </div>
        </div>

        {isLoading ? (
          <ChartLoadingState text="Loading referral chart">
            <ChartColumnBig />
          </ChartLoadingState>
        ) : !hasReferralsData ? (
          <ChartEmptyState
            title="No referral data yet"
            description="Once referrals start coming in for this contest, the growth trend will appear here."
          >
            <IconLoader loadingText="No referrals yet">
              <ChartColumnBig />
            </IconLoader>
          </ChartEmptyState>
        ) : (
          <ChartContainer
            config={referralsChartConfig}
            className="h-70 w-full"
          >
            <LineChart
              accessibilityLayer
              data={referralsOverTimeData}
              margin={{
                left: 8,
                right: 8,
                top: 8,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <ChartTooltip
                cursor={{
                  stroke: 'rgba(255,255,255,0.12)',
                  strokeWidth: 1,
                }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="referrals"
                stroke="var(--color-referrals)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: 'var(--color-referrals)',
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                  fill: 'var(--color-referrals)',
                  stroke: '#0a0a0f',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white md:text-xl">
              Joins Per Day
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Daily join distribution for this contest
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#b700ff]">
            <Radar className="size-4" />
            Pattern
          </div>
        </div>

        {isLoading ? (
          <ChartLoadingState text="Loading join chart">
            <UsersRound />
          </ChartLoadingState>
        ) : !hasJoinsData ? (
          <ChartEmptyState
            title="No join data yet"
            description="Once participants join this contest, the daily join pattern will appear here."
          >
            <IconLoader loadingText="No joins yet">
              <UsersRound />
            </IconLoader>
          </ChartEmptyState>
        ) : (
          <ChartContainer config={joinsChartConfig} className="h-70 w-full">
            <RadarChart
              accessibilityLayer
              data={joinsPerDayData}
              margin={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
              }}
            >
              <ChartTooltip content={<ChartTooltipContent />} />
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="day"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <RechartsRadar
                dataKey="joins"
                fill="var(--color-joins)"
                fillOpacity={0.3}
                stroke="var(--color-joins)"
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#13131a]/70 px-4 py-3 backdrop-blur-md md:px-6 xl:col-span-2">
        <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <Activity className="size-4 text-[#00ff9d]" />
            These charts reflect current contest activity only.
          </p>

          <p>
            Referrals show growth trend, while joins reveal the weekly entry
            pattern.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsCharts;