'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type RectangleProps,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { joinsPerDayData } from '@/demo/joinsPerDayData';

const chartConfig = {
  joins: {
    label: 'Joins',
    color: '#00d0ff',
  },
} satisfies ChartConfig;

const CustomBarShape = (props: RectangleProps) => {
  return (
    <Rectangle
      {...props}
      radius={[10, 10, 6, 6]}
      fill="rgba(0, 208, 255, 0.82)"
    />
  );
};

const JoinsPerDayGraph = () => {
  return (
    <Card className="rounded-2xl border border-white/10 bg-[#1c1c26]/60 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="mb-1 text-xl font-bold text-white">
            Joins Per Day
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily participation trend
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-62.5 w-full sm:h-70 lg:h-75"
        >
          <BarChart
            accessibilityLayer
            data={joinsPerDayData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            barCategoryGap="22%"
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              stroke="rgba(156,163,175,0.9)"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              stroke="rgba(156,163,175,0.9)"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />

            <ChartTooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Bar
              dataKey="joins"
              maxBarSize={42}
              shape={<CustomBarShape />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default JoinsPerDayGraph;