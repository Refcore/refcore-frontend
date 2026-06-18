'use client';

import React, { useMemo } from 'react';
import {
  Activity,
  ChartColumnBig,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

type HistoricalDataState = {
  has_any_data: boolean;
  has_recent_data: boolean;
  total_count: number;
  latest_activity_label: string | null;
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

const formatFullDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getValidDate = (date?: string | Date | null) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

const getLatestActivityLabel = (
  dates: Array<string | Date | null | undefined>,
) => {
  const latestDate = dates.reduce<Date | null>((latest, currentDate) => {
    const parsedDate = getValidDate(currentDate);

    if (!parsedDate) {
      return latest;
    }

    if (!latest || parsedDate.getTime() > latest.getTime()) {
      return parsedDate;
    }

    return latest;
  }, null);

  return latestDate ? formatFullDate(latestDate) : null;
};

const hasChartData = <T extends Record<string, string | number>>(
  data: T[],
  valueKey: keyof T,
) => {
  return data.some((item) => Number(item[valueKey]) > 0);
};

const buildReferralsChartData = (
  referrals: ReferralModel[],
): ReferralsChartItem[] => {
  const lastSevenDays = getLastSevenDays();

  const referralsByDay = referrals.reduce<Record<string, number>>(
    (accumulator, referral) => {
      const referralDate = getValidDate(referral.created_at);

      if (!referralDate) {
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
      const joinedDate = getValidDate(participant.joined_at);

      if (!joinedDate) {
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

/**
 * CHANGE ADDED:
 * This only checks whether referrals exist outside the 7-day chart window.
 * It does not change the chart UI.
 */
const getReferralHistoricalState = (
  referrals: ReferralModel[],
  chartData: ReferralsChartItem[],
): HistoricalDataState => {
  const validReferrals = referrals.filter((referral) => {
    return Boolean(getValidDate(referral.created_at));
  });

  return {
    has_any_data: validReferrals.length > 0,
    has_recent_data: hasChartData(chartData, 'referrals'),
    total_count: validReferrals.length,
    latest_activity_label: getLatestActivityLabel(
      validReferrals.map((referral) => referral.created_at),
    ),
  };
};

/**
 * CHANGE ADDED:
 * This only checks whether joins exist outside the 7-day chart window.
 * It does not change the joins chart type.
 */
const getJoinsHistoricalState = (
  participants: ContestParticipantChartItem[],
  chartData: JoinsChartItem[],
): HistoricalDataState => {
  const validParticipants = participants.filter((participant) => {
    return Boolean(getValidDate(participant.joined_at));
  });

  return {
    has_any_data: validParticipants.length > 0,
    has_recent_data: hasChartData(chartData, 'joins'),
    total_count: validParticipants.length,
    latest_activity_label: getLatestActivityLabel(
      validParticipants.map((participant) => participant.joined_at),
    ),
  };
};

const ChartEmptyState = ({
  title,
  description,
  historicalState,
  children,
}: {
  title: string;
  description: string;
  historicalState?: HistoricalDataState;
  children: React.ReactNode;
}) => {
  const hasOldDataOnly =
    historicalState?.has_any_data && !historicalState.has_recent_data;

  return (
    <div className="flex h-70 w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0a0a0f]/30 px-4 text-center">
      <div className="mb-4 flex items-center justify-center text-gray-500">
        {children}
      </div>

      <h4 className="text-sm font-semibold text-white">{title}</h4>

      <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
        {description}
      </p>

      {/* CHANGE ADDED: Only extra info. No new graph. No UI structure change. */}
      {hasOldDataOnly ? (
        <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-left">
          <div className="flex gap-2">
            <Activity className="mt-0.5 size-4 shrink-0 text-yellow-400" />

            <div>
              <p className="text-xs font-semibold text-yellow-100">
                Data exists, but not in the last 7 days.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-yellow-100/70">
                Total records: {historicalState.total_count}
                {historicalState.latest_activity_label
                  ? ` • Last activity: ${historicalState.latest_activity_label}`
                  : ''}
              </p>
            </div>
          </div>
        </div>
      ) : null}
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

  /**
   * CHANGE ADDED:
   * These are only used to improve empty-state text.
   * They do not add new graph fields or change the chart rendering.
   */
  const referralHistoricalState = useMemo(() => {
    return getReferralHistoricalState(referrals, referralsOverTimeData);
  }, [referrals, referralsOverTimeData]);

  const joinsHistoricalState = useMemo(() => {
    return getJoinsHistoricalState(participants, joinsPerDayData);
  }, [participants, joinsPerDayData]);

  const hasReferralChartData = referralHistoricalState.has_recent_data;
  const hasJoinsChartData = joinsHistoricalState.has_recent_data;

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white md:text-xl">
              Referrals Over Time
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Referral growth across the last 7 days
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
        ) : !hasReferralChartData ? (
          <ChartEmptyState
            title={
              referralHistoricalState.has_any_data
                ? 'No referrals in the last 7 days'
                : 'No referral data yet'
            }
            description={
              referralHistoricalState.has_any_data
                ? 'Referral history exists, but there has been no new referral activity within this 7-day chart window.'
                : 'Once referrals start coming in for this contest, the growth trend will appear here.'
            }
            historicalState={referralHistoricalState}
          >
            <ChartColumnBig />
          </ChartEmptyState>
        ) : (
          <ChartContainer config={referralsChartConfig} className="h-70 w-full">
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
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                  fill: '#9ca3af',
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                width={30}
                tick={{
                  fill: '#9ca3af',
                  fontSize: 12,
                }}
              />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Line
                type="monotone"
                dataKey="referrals"
                stroke="var(--color-referrals)"
                strokeWidth={2}
                dot={{
                  r: 3,
                }}
                activeDot={{
                  r: 5,
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
              Participant joins across the last 7 days
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#b700ff]">
            <UsersRound className="size-4" />
            Joins
          </div>
        </div>

        {isLoading ? (
          <ChartLoadingState text="Loading joins chart">
            <UsersRound />
          </ChartLoadingState>
        ) : !hasJoinsChartData ? (
          <ChartEmptyState
            title={
              joinsHistoricalState.has_any_data
                ? 'No joins in the last 7 days'
                : 'No join data yet'
            }
            description={
              joinsHistoricalState.has_any_data
                ? 'Participant history exists, but there have been no new joins within this 7-day chart window.'
                : 'Once participants join this contest, daily joins will appear here.'
            }
            historicalState={joinsHistoricalState}
          >
            <UsersRound />
          </ChartEmptyState>
        ) : (
          <ChartContainer config={joinsChartConfig} className="h-70 w-full">
            <BarChart
              accessibilityLayer
              data={joinsPerDayData}
              margin={{
                left: 8,
                right: 8,
                top: 8,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                  fill: '#9ca3af',
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                width={30}
                tick={{
                  fill: '#9ca3af',
                  fontSize: 12,
                }}
              />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar
                dataKey="joins"
                fill="var(--color-joins)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </section>
  );
};

export default AnalyticsCharts;
