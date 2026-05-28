import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

type AllTimeLeaderboardRow = {
  id: string;
  phone_number: string;
  display_name: string | null;
  referral_code: string;
  total_referrals: number;
  total_contests_joined: number;
  first_joined_at: Date | null;
  rank: number | bigint;
};

type CountRow = {
  total: number | bigint;
};

const getAllTimeFinalOrderSql = (
  range: LeaderboardRange,
  sort: LeaderboardSort,
) => {
  if (range === 'bottom10' || sort === 'referrals_asc') {
    return Prisma.sql`total_referrals ASC, first_joined_at ASC`;
  }

  if (sort === 'newest') {
    return Prisma.sql`last_joined_at DESC NULLS LAST, created_at DESC`;
  }

  if (sort === 'oldest') {
    return Prisma.sql`first_joined_at ASC, created_at ASC`;
  }

  return Prisma.sql`rank ASC`;
};

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

    const searchValue = `%${search}%`;

const searchSql = search
  ? Prisma.sql`
      WHERE display_name ILIKE ${searchValue}
        OR phone_number ILIKE ${searchValue}
        OR referral_code ILIKE ${searchValue}
    `
  : Prisma.empty;

const finalOrderSql = getAllTimeFinalOrderSql(range, sort);

const [participants, countRows, totalReferrals, leader] = await Promise.all([
  prisma.$queryRaw<AllTimeLeaderboardRow[]>`
    WITH ranked_leaderboard AS (
      SELECT
        id,
        phone_number,
        display_name,
        referral_code,
        total_referrals,
        total_contests_joined,
        first_joined_at,
        last_joined_at,
        created_at,
        ROW_NUMBER() OVER (
          ORDER BY total_referrals DESC, first_joined_at ASC
        ) AS rank
      FROM participants
      WHERE channel_id = ${channelId}::uuid
    ),
    filtered_leaderboard AS (
      SELECT *
      FROM ranked_leaderboard
      ${searchSql}
    )
    SELECT
      id,
      phone_number,
      display_name,
      referral_code,
      total_referrals,
      total_contests_joined,
      first_joined_at,
      rank
    FROM filtered_leaderboard
    ORDER BY ${finalOrderSql}
    OFFSET ${skip}
    LIMIT ${safeLimit}
  `,

  prisma.$queryRaw<CountRow[]>`
    WITH ranked_leaderboard AS (
      SELECT
        id,
        phone_number,
        display_name,
        referral_code,
        total_referrals,
        total_contests_joined,
        first_joined_at,
        last_joined_at,
        created_at,
        ROW_NUMBER() OVER (
          ORDER BY total_referrals DESC, first_joined_at ASC
        ) AS rank
      FROM participants
      WHERE channel_id = ${channelId}::uuid
    ),
    filtered_leaderboard AS (
      SELECT *
      FROM ranked_leaderboard
      ${searchSql}
    )
    SELECT COUNT(*)::int AS total
    FROM filtered_leaderboard
  `,

  prisma.participants.aggregate({
    where: {
      channel_id: channelId,
    },
    _sum: {
      total_referrals: true,
    },
  }),

  prisma.participants.findFirst({
    where: {
      channel_id: channelId,
    },
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

const total = Number(countRows[0]?.total ?? 0);

    const leaderboard = participants.map((participant) => {
      return {
        id: participant.id,
        participant_id: participant.id,
        rank: Number(participant.rank),
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