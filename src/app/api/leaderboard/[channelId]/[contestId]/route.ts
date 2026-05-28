import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    channelId: string;
    contestId: string;
  }>;
};

type LeaderboardRange = 'top10' | 'bottom10' | 'top50' | 'all';
type LeaderboardSort = 'referrals_desc' | 'referrals_asc' | 'newest' | 'oldest';

type ContestLeaderboardRow = {
  id: string;
  participant_id: string;
  phone_number: string;
  display_name: string | null;
  referral_code: string | null;
  referral_count: number;
  created_at: Date;
  rank: number | bigint;
};

type CountRow = {
  total: number | bigint;
};

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

const getContestFinalOrderSql = (
  range: LeaderboardRange,
  sort: LeaderboardSort,
) => {
  if (range === 'bottom10' || sort === 'referrals_asc') {
    return Prisma.sql`referral_count ASC, created_at ASC`;
  }

  if (sort === 'newest') {
    return Prisma.sql`created_at DESC`;
  }

  if (sort === 'oldest') {
    return Prisma.sql`created_at ASC`;
  }

  return Prisma.sql`rank ASC`;
};

const getContestStatusSubtext = (endDate: Date | null) => {
  if (!endDate) return 'No end date set';

  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Contest ended';

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return `Ends in ${days} ${days === 1 ? 'day' : 'days'}`;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { channelId, contestId } = await params;

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

    const contest = await prisma.contests.findFirst({
      where: {
        id: contestId,
        channel_id: channelId,
      },
      select: {
        id: true,
        status: true,
        end_date: true,
      },
    });

    if (!contest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contest not found',
        },
        { status: 404 },
      );
    }

    const searchValue = `%${search}%`;

    const searchSql = search
      ? Prisma.sql`
          WHERE display_name ILIKE ${searchValue}
            OR phone_number ILIKE ${searchValue}
            OR referral_code ILIKE ${searchValue}
        `
      : Prisma.empty;

    const finalOrderSql = getContestFinalOrderSql(range, sort);

    const [
      contestParticipants,
      filteredCountRows,
      summaryCountRows,
      totalReferrals,
      leaderRow,
    ] = await Promise.all([
      prisma.$queryRaw<ContestLeaderboardRow[]>`
        WITH ranked_leaderboard AS (
          SELECT
            cp.id,
            cp.participant_id,
            cp.referral_count,
            cp.created_at,
            p.phone_number,
            p.display_name,
            p.referral_code,
            ROW_NUMBER() OVER (
              ORDER BY cp.referral_count DESC, cp.created_at ASC
            ) AS rank
          FROM public.contest_participants cp
          INNER JOIN public.participants p
            ON p.id = cp.participant_id
          WHERE cp.channel_id = ${channelId}::uuid
            AND cp.contest_id = ${contestId}::uuid
        ),
        filtered_leaderboard AS (
          SELECT *
          FROM ranked_leaderboard
          ${searchSql}
        )
        SELECT
          id,
          participant_id,
          phone_number,
          display_name,
          referral_code,
          referral_count,
          created_at,
          rank
        FROM filtered_leaderboard
        ORDER BY ${finalOrderSql}
        OFFSET ${skip}
        LIMIT ${safeLimit}
      `,

      prisma.$queryRaw<CountRow[]>`
        WITH ranked_leaderboard AS (
          SELECT
            cp.id,
            cp.participant_id,
            cp.referral_count,
            cp.created_at,
            p.phone_number,
            p.display_name,
            p.referral_code,
            ROW_NUMBER() OVER (
              ORDER BY cp.referral_count DESC, cp.created_at ASC
            ) AS rank
          FROM public.contest_participants cp
          INNER JOIN public.participants p
            ON p.id = cp.participant_id
          WHERE cp.channel_id = ${channelId}::uuid
            AND cp.contest_id = ${contestId}::uuid
        ),
        filtered_leaderboard AS (
          SELECT *
          FROM ranked_leaderboard
          ${searchSql}
        )
        SELECT COUNT(*)::int AS total
        FROM filtered_leaderboard
      `,

      prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::int AS total
        FROM public.contest_participants
        WHERE channel_id = ${channelId}::uuid
          AND contest_id = ${contestId}::uuid
      `,

      prisma.contest_participants.aggregate({
        where: {
          channel_id: channelId,
          contest_id: contestId,
        },
        _sum: {
          referral_count: true,
        },
      }),

      prisma.contest_participants.findFirst({
        where: {
          channel_id: channelId,
          contest_id: contestId,
        },
        orderBy: [
          {
            referral_count: 'desc',
          },
          {
            created_at: 'asc',
          },
        ],
        select: {
          participant_id: true,
          referral_count: true,
        },
      }),
    ]);

    const filteredTotal = Number(filteredCountRows[0]?.total ?? 0);
    const summaryParticipants = Number(summaryCountRows[0]?.total ?? 0);

    const leader = leaderRow
      ? await prisma.participants.findUnique({
          where: {
            id: leaderRow.participant_id,
          },
          select: {
            display_name: true,
            phone_number: true,
          },
        })
      : null;

    const leaderboard = contestParticipants.map((item) => {
      const fallbackName = item.phone_number
        ? `User ${item.phone_number.slice(-4)}`
        : 'Unknown participant';

      return {
        id: item.id,
        participant_id: item.participant_id,
        rank: Number(item.rank),
        user_name: item.display_name || fallbackName,
        phone_number: item.phone_number ?? '',
        referral_code: item.referral_code ?? null,
        referrals: item.referral_count,
        joined_at: item.created_at.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          current_leader: leader?.display_name ?? 'No leader yet',
          current_leader_referrals: leaderRow?.referral_count ?? 0,
          participants: summaryParticipants,
          total_referrals: totalReferrals._sum.referral_count ?? 0,
          contest_status: contest.status,
          contest_status_subtext: getContestStatusSubtext(contest.end_date),
        },
        leaderboard,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: filteredTotal,
          total_pages: Math.ceil(filteredTotal / safeLimit),
        },
      },
    });
  } catch (error) {
    console.error('FETCH_CONTEST_LEADERBOARD_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contest leaderboard',
      },
      { status: 500 },
    );
  }
}
