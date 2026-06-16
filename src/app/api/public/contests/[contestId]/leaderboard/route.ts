import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    contestId: string;
  }>;
};

const LEADERBOARD_LIMIT = 20;

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const maskPhoneNumber = (phone_number?: string | null) => {
  if (!phone_number) return null;

  const clean_phone_number = phone_number.replace(/\s+/g, '');

  if (clean_phone_number.length <= 6) {
    return `${clean_phone_number.slice(0, 2)}****`;
  }

  const start = clean_phone_number.slice(0, 4);
  const end = clean_phone_number.slice(-4);

  return `${start}****${end}`;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { contestId } = await params;
    const contest_id = contestId?.trim();

    if (!contest_id || !uuidRegex.test(contest_id)) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Valid contest id is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    const contest = await prisma.contests.findUnique({
      where: {
        id: contest_id,
      },
      select: {
        id: true,
        channel_id: true,
        title: true,
        slug: true,
        status: true,
        visibility: true,
        participants_count: true,
        referrals_count: true,
        top_performer_name: true,
        top_performer_phone: true,
        top_performer_referrals: true,
        updated_at: true,
      },
    });

    if (!contest) {
      return NextResponse.json(
        {
          success: false,
          status_code: 404,
          message: 'Contest not found.',
          data: null,
        },
        { status: 404 },
      );
    }

    if (contest.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message: 'This contest is not active at the moment.',
          data: null,
        },
        { status: 409 },
      );
    }

    if (contest.visibility !== 'public') {
      return NextResponse.json(
        {
          success: false,
          status_code: 403,
          message: 'This contest leaderboard is not public.',
          data: null,
        },
        { status: 403 },
      );
    }

    const leaderboard = await prisma.contest_participants.findMany({
      where: {
        contest_id,
        status: 'active',
      },
      orderBy: [
        {
          referral_count: 'desc',
        },
        {
          joined_at: 'asc',
        },
      ],
      take: LEADERBOARD_LIMIT,
      select: {
        id: true,
        channel_id: true,
        contest_id: true,
        participant_id: true,
        referral_count: true,
        rank_cache: true,
        joined_at: true,
        status: true,
        participants: {
          select: {
            id: true,
            display_name: true,
            phone_number: true,
            referral_code: true,
            total_referrals: true,
            total_contests_joined: true,
            first_joined_at: true,
          },
        },
      },
    });

    const leaderboard_rows = leaderboard.map((row, index) => {
      const participant = row.participants;

      return {
        id: row.id,
        channel_id: row.channel_id,
        contest_id: row.contest_id,
        participant_id: row.participant_id,
        rank: index + 1,
        referral_count: row.referral_count,
        rank_cache: row.rank_cache,
        joined_at: row.joined_at.toISOString(),
        status: row.status,
        participant: {
          id: participant.id,
          display_name: participant.display_name,
          masked_phone_number: maskPhoneNumber(participant.phone_number),
          referral_code: participant.referral_code,
          total_referrals: participant.total_referrals,
          total_contests_joined: participant.total_contests_joined,
          first_joined_at: participant.first_joined_at.toISOString(),
        },
      };
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Contest leaderboard fetched successfully.',
      data: {
        contest: {
          ...contest,
          top_performer_phone: maskPhoneNumber(contest.top_performer_phone),
          updated_at: contest.updated_at.toISOString(),
        },
        leaderboard: leaderboard_rows,
        pagination: {
          limit: LEADERBOARD_LIMIT,
          returned: leaderboard_rows.length,
          has_more: contest.participants_count > leaderboard_rows.length,
        },
      },
    });
  } catch (error) {
    console.error('PUBLIC_GET_CONTEST_LEADERBOARD_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching the leaderboard.',
        data: null,
      },
      { status: 500 },
    );
  }
}