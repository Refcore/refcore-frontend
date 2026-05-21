import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    channelId: string;
  }>;
};

type LeaderboardRange = 'top10' | 'bottom10' | 'top50' | 'all';
type LeaderboardSort = 'referrals_desc' | 'referrals_asc' | 'newest' | 'oldest';

const allowedRanges: LeaderboardRange[] = ['top10', 'bottom10', 'top50', 'all'];

const allowedSorts: LeaderboardSort[] = [
  'referrals_desc',
  'referrals_asc',
  'newest',
  'oldest',
];

const getSafeLimit = (range: LeaderboardRange, limit: number) => {
  if (range === 'top10' || range === 'bottom10') return 10;
  if (range === 'top50') return 50;

  if (Number.isNaN(limit) || limit < 1) return 20;

  return Math.min(limit, 100);
};

const getOrderBy = (range: LeaderboardRange, sort: LeaderboardSort) => {
  if (range === 'bottom10') {
    return [
      {
        total_referrals: 'asc' as const,
      },
      {
        first_joined_at: 'asc' as const,
      },
    ];
  }

  if (sort === 'referrals_asc') {
    return [
      {
        total_referrals: 'asc' as const,
      },
      {
        first_joined_at: 'asc' as const,
      },
    ];
  }

  if (sort === 'newest') {
    return [
      {
        last_joined_at: 'desc' as const,
      },
      {
        created_at: 'desc' as const,
      },
    ];
  }

  if (sort === 'oldest') {
    return [
      {
        first_joined_at: 'asc' as const,
      },
      {
        created_at: 'asc' as const,
      },
    ];
  }

  return [
    {
      total_referrals: 'desc' as const,
    },
    {
      first_joined_at: 'asc' as const,
    },
  ];
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { channelId } = await params;

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);
    const search = searchParams.get('search')?.trim() ?? '';

    const rangeParam = searchParams.get('range') ?? 'top10';
    const sortParam = searchParams.get('sort') ?? 'referrals_desc';

    const range: LeaderboardRange = allowedRanges.includes(
      rangeParam as LeaderboardRange,
    )
      ? (rangeParam as LeaderboardRange)
      : 'top10';

    const sort: LeaderboardSort = allowedSorts.includes(
      sortParam as LeaderboardSort,
    )
      ? (sortParam as LeaderboardSort)
      : 'referrals_desc';

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = getSafeLimit(range, limit);
    const skip = range === 'all' ? (safePage - 1) * safeLimit : 0;

    const where = {
      channel_id: channelId,
      ...(search
        ? {
            OR: [
              {
                display_name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                phone_number: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                referral_code: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [participants, total, totalReferrals, leader] = await Promise.all([
      prisma.participants.findMany({
        where,
        orderBy: getOrderBy(range, sort),
        skip,
        take: safeLimit,
        select: {
          id: true,
          phone_number: true,
          display_name: true,
          referral_code: true,
          total_referrals: true,
          total_contests_joined: true,
          first_joined_at: true,
          last_joined_at: true,
          created_at: true,
        },
      }),

      prisma.participants.count({
        where,
      }),

      prisma.participants.aggregate({
        where,
        _sum: {
          total_referrals: true,
        },
      }),

      prisma.participants.findFirst({
        where,
        orderBy: [
          {
            total_referrals: 'desc',
          },
          {
            first_joined_at: 'asc',
          },
        ],
        select: {
          display_name: true,
          phone_number: true,
          total_referrals: true,
        },
      }),
    ]);

    const leaderboard = participants.map((participant, index) => {
      return {
        id: participant.id,
        participant_id: participant.id,
        rank: skip + index + 1,
        user_name:
          participant.display_name || `User ${participant.phone_number.slice(-4)}`,
        phone_number: participant.phone_number,
        referral_code: participant.referral_code,
        referrals: participant.total_referrals,
        contests_joined: participant.total_contests_joined,
        joined_at: participant.first_joined_at?.toISOString() ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          current_leader: leader?.display_name ?? 'No leader yet',
          current_leader_referrals: leader?.total_referrals ?? 0,
          participants: total,
          total_referrals: totalReferrals._sum.total_referrals ?? 0,
        },
        leaderboard,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          total_pages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    console.error('FETCH_ALL_TIME_LEADERBOARD_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch all-time leaderboard',
      },
      { status: 500 },
    );
  }
}