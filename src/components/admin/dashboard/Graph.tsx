'use client';

import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import { cn } from '@/lib/utils';
import { GraphRange, referralGraphData } from '@/demo/refferalGraphData';

const chartConfig = {
  referrals: {
    label: 'Referrals',
    color: '#8b5cf6',
  },
} satisfies ChartConfig;

const rangeOptions: { label: string; value: GraphRange }[] = [
  { label: '7 Days', value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: 'All Time', value: 'allTime' },
];

const Graph = () => {
  const [range, setRange] = useState<GraphRange>('7days');

  const chartData = useMemo(() => {
    return referralGraphData[range];
  }, [range]);

  return (
    <Card className="border-white/10 bg-[#111118] text-white shadow-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Referral Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track referral performance across different time ranges.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {rangeOptions.map((item) => {
            const isActive = range === item.value;

            return (
              <Button
                key={item.value}
                type="button"
                variant="ghost"
                onClick={() => setRange(item.value)}
                className={cn(
                  'rounded-full border border-white/10 px-4 text-sm',
                  isActive
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-70 w-full sm:h-80 lg:h-90"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillReferrals" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-referrals)"
                  stopOpacity={0.32}
                />
                <stop
                  offset="45%"
                  stopColor="var(--color-referrals)"
                  stopOpacity={0.18}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-referrals)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              stroke="rgba(255,255,255,0.55)"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              stroke="rgba(255,255,255,0.55)"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />

            <ChartTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              type="monotone"
              dataKey="referrals"
              fill="url(#fillReferrals)"
              stroke="var(--color-referrals)"
              strokeWidth={1.2}
              dot={{
                r: 3,
                fill: 'var(--color-referrals)',
                strokeWidth: 0,
              }}
              activeDot={{
                r: 5,
                fill: 'var(--color-referrals)',
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Graph;