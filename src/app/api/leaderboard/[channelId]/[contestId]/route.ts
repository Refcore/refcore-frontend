import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    channelId: string;
    contestId: string;
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
        referral_count: 'asc' as const,
      },
      {
        created_at: 'asc' as const,
      },
    ];
  }

  if (sort === 'referrals_asc') {
    return [
      {
        referral_count: 'asc' as const,
      },
      {
        created_at: 'asc' as const,
      },
    ];
  }

  if (sort === 'newest') {
    return [
      {
        created_at: 'desc' as const,
      },
    ];
  }

  if (sort === 'oldest') {
    return [
      {
        created_at: 'asc' as const,
      },
    ];
  }

  return [
    {
      referral_count: 'desc' as const,
    },
    {
      created_at: 'asc' as const,
    },
  ];
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

    const matchedParticipants = search
      ? await prisma.participants.findMany({
          where: {
            channel_id: channelId,
            OR: [
              {
                display_name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                phone_number: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                referral_code: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
          select: {
            id: true,
          },
        })
      : [];

    const matchedParticipantIds = matchedParticipants.map(
      (participant) => participant.id,
    );

    if (search && matchedParticipantIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          summary: {
            current_leader: 'No leader yet',
            current_leader_referrals: 0,
            participants: 0,
            total_referrals: 0,
            contest_status: contest.status,
            contest_status_subtext: getContestStatusSubtext(contest.end_date),
          },
          leaderboard: [],
          pagination: {
            page: safePage,
            limit: safeLimit,
            total: 0,
            total_pages: 0,
          },
        },
      });
    }

    const where = {
      channel_id: channelId,
      contest_id: contestId,
      ...(search
        ? {
            participant_id: {
              in: matchedParticipantIds,
            },
          }
        : {}),
    };

    const [contestParticipants, total, totalReferrals, leaderRow] =
      await Promise.all([
        prisma.contest_participants.findMany({
          where,
          orderBy: getOrderBy(range, sort),
          skip,
          take: safeLimit,
          select: {
            id: true,
            participant_id: true,
            referral_count: true,
            rank_cache: true,
            created_at: true,
          },
        }),

        prisma.contest_participants.count({
          where,
        }),

        prisma.contest_participants.aggregate({
          where,
          _sum: {
            referral_count: true,
          },
        }),

        prisma.contest_participants.findFirst({
          where,
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

    const participantIds = contestParticipants.map(
      (item) => item.participant_id,
    );

    const leaderParticipantId = leaderRow?.participant_id;

    const participants = await prisma.participants.findMany({
      where: {
        id: {
          in: leaderParticipantId
            ? Array.from(new Set([...participantIds, leaderParticipantId]))
            : participantIds,
        },
      },
      select: {
        id: true,
        phone_number: true,
        display_name: true,
        referral_code: true,
      },
    });

    const participantMap = new Map(
      participants.map((participant) => [participant.id, participant]),
    );

    const leader = leaderParticipantId
      ? participantMap.get(leaderParticipantId)
      : null;

    const leaderboard = contestParticipants.map((item, index) => {
      const participant = participantMap.get(item.participant_id);

      const fallbackName = participant?.phone_number
        ? `User ${participant.phone_number.slice(-4)}`
        : 'Unknown participant';

      return {
        id: item.id,
        participant_id: item.participant_id,
        rank: item.rank_cache ?? skip + index + 1,
        user_name: participant?.display_name || fallbackName,
        phone_number: participant?.phone_number ?? '',
        referral_code: participant?.referral_code ?? null,
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
          participants: total,
          total_referrals: totalReferrals._sum.referral_count ?? 0,
          contest_status: contest.status,
          contest_status_subtext: getContestStatusSubtext(contest.end_date),
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
