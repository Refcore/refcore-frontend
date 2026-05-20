import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type GraphRange = '7days' | '30days' | 'allTime';

type RouteParams = {
  params: Promise<{
    channelId: string;
  }>;
};

const allowedRanges: GraphRange[] = ['7days', '30days', 'allTime'];

const getStartDateByRange = (range: GraphRange) => {
  const now = new Date();

  if (range === '7days') {
    const date = new Date(now);
    date.setDate(date.getDate() - 6);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  if (range === '30days') {
    const date = new Date(now);
    date.setDate(date.getDate() - 29);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  return null;
};

const formatLabel = (date: Date, range: GraphRange) => {
  if (range === '7days') {
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
    });
  }

  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    ...(range === 'allTime' ? { year: 'numeric' } : {}),
  });
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { channelId } = await params;

    const { searchParams } = new URL(request.url);

    const rangeParam = searchParams.get('range') ?? '7days';

    const range: GraphRange = allowedRanges.includes(rangeParam as GraphRange)
      ? (rangeParam as GraphRange)
      : '7days';

    const startDate = getStartDateByRange(range);

    const referrals = await prisma.referrals.findMany({
      where: {
        channel_id: channelId,
        status: {
          in: ['valid', 'became_participant'],
        },
        ...(startDate
          ? {
              first_seen_at: {
                gte: startDate,
              },
            }
          : {}),
      },
      select: {
        first_seen_at: true,
      },
      orderBy: {
        first_seen_at: 'asc',
      },
    });

    const groupedReferrals = referrals.reduce<Record<string, number>>(
      (acc, referral) => {
       const key = referral.first_seen_at.toISOString().slice(0, 10);

        acc[key] = (acc[key] ?? 0) + 1;

        return acc;
      },
      {},
    );

    let graph_data: { label: string; referrals: number }[] = [];

    if (range === 'allTime') {
      graph_data = Object.entries(groupedReferrals).map(([date, referrals]) => {
        return {
          label: formatLabel(new Date(date), range),
          referrals,
        };
      });
    } else {
      const daysToShow = range === '7days' ? 7 : 30;

      graph_data = Array.from({ length: daysToShow }, (_, index) => {
        const date = new Date();

        date.setDate(date.getDate() - (daysToShow - 1 - index));
        date.setHours(0, 0, 0, 0);

        const key = date.toISOString().slice(0, 10);

        return {
          label: formatLabel(date, range),
          referrals: groupedReferrals[key] ?? 0,
        };
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        range,
        graph_data,
      },
    });
  } catch (error) {
    console.error('FETCH_REFERRAL_GRAPH_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch referral graph data',
      },
      { status: 500 },
    );
  }
}