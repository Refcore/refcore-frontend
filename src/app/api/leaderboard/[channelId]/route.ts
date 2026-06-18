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

type TotalReferralsAggregate = {
  _sum: {
    total_referrals: number | null;
  };
};

type LeaderRow = {
  display_name: string | null;
  phone_number: string;
  total_referrals: number;
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

    /**
     * CHANGE ADDED:
     * Use Promise.allSettled instead of Promise.all.
     *
     * Why:
     * - The leaderboard rows query is required.
     * - The count, total referrals, and leader queries are useful but should not crash
     *   the whole API if one of them times out.
     */
    const [
      participantsResult,
      countRowsResult,
      totalReferralsResult,
      leaderResult,
    ] = await Promise.allSettled([
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

    /**
     * CHANGE ADDED:
     * If the main leaderboard rows fail, then the endpoint should still fail.
     * This is the only query the UI cannot work without.
     */
    if (participantsResult.status === 'rejected') {
      throw participantsResult.reason;
    }

    const participants = participantsResult.value;

    /**
     * CHANGE ADDED:
     * If count times out, do not crash.
     * Fall back to participants.length so the UI can still render.
     */
    const countRows =
      countRowsResult.status === 'fulfilled' ? countRowsResult.value : [];

    if (countRowsResult.status === 'rejected') {
      console.error('ALL_TIME_LEADERBOARD_COUNT_ERROR', countRowsResult.reason);
    }

    const total = Number(countRows[0]?.total ?? participants.length);

    /**
     * CHANGE ADDED:
     * If total referrals aggregate times out, do not crash.
     * Fall back to the visible page referral total.
     */
    const totalReferrals =
      totalReferralsResult.status === 'fulfilled'
        ? (totalReferralsResult.value as TotalReferralsAggregate)
        : {
            _sum: {
              total_referrals: participants.reduce((sum, participant) => {
                return sum + participant.total_referrals;
              }, 0),
            },
          };

    if (totalReferralsResult.status === 'rejected') {
      console.error(
        'ALL_TIME_LEADERBOARD_TOTAL_REFERRALS_ERROR',
        totalReferralsResult.reason,
      );
    }

    /**
     * CHANGE ADDED:
     * If leader lookup times out, do not crash.
     * Fall back to the rank #1 participant if available.
     */
    const fallbackLeader = participants.find((participant) => {
      return Number(participant.rank) === 1;
    });

    const leader =
      leaderResult.status === 'fulfilled'
        ? (leaderResult.value as LeaderRow | null)
        : fallbackLeader
          ? {
              display_name: fallbackLeader.display_name,
              phone_number: fallbackLeader.phone_number,
              total_referrals: fallbackLeader.total_referrals,
            }
          : null;

    if (leaderResult.status === 'rejected') {
      console.error('ALL_TIME_LEADERBOARD_LEADER_ERROR', leaderResult.reason);
    }

    const leaderboard = participants.map((participant) => {
      return {
        id: participant.id,
        participant_id: participant.id,
        rank: Number(participant.rank),
        user_name:
          participant.display_name ||
          `User ${participant.phone_number.slice(-4)}`,
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
