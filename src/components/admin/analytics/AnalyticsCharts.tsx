'use client';

import React from 'react';
import { Activity, Radar, TrendingUp } from 'lucide-react';
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

import {
  joinsPerDayData,
  referralsOverTimeData,
} from '@/demo/analyticsChartsData';

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

const AnalyticsCharts = () => {
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
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
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
      </div>

      <div className="xl:col-span-2 rounded-xl border border-white/10 bg-[#13131a]/70 px-4 py-3 backdrop-blur-md md:px-6">
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