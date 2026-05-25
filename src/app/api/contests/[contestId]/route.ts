import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';

type RouteParams = {
  params: Promise<{
    contestId: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { contestId } = await params;

    if (!contestId) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Contest ID is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    const contest = await prisma.contests.findUnique({
      where: {
        id: contestId,
      },
      select: {
        id: true,
        channel_id: true,
        title: true,
        status: true,
        channels: {
          select: {
            id: true,
            owner_id: true,
          },
        },
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

    if (contest.channels.owner_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          status_code: 403,
          message: 'You are not allowed to end this contest.',
          data: null,
        },
        { status: 403 },
      );
    }

    if (contest.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message: 'Only an active contest can be ended.',
          data: null,
          error_code: 'CONTEST_NOT_ACTIVE',
        },
        { status: 409 },
      );
    }

    const ended_contest = await prisma.contests.update({
      where: {
        id: contestId,
      },
      data: {
        status: 'past',
      },
      select: {
        id: true,
        channel_id: true,
        title: true,
        slug: true,
        description: true,
        status: true,
        visibility: true,
        referral_code_prefix: true,
        start_date: true,
        end_date: true,
        reward_type: true,
        reward_value: true,
        reward_description: true,
        winner_selection: true,
        max_winners: true,
        participants_count: true,
        referrals_count: true,
        views_count: true,
        top_performer_name: true,
        top_performer_phone: true,
        top_performer_referrals: true,
        is_published: true,
        is_archived: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        status_code: 200,
        message: 'Contest ended successfully.',
        data: ended_contest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('End contest API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while ending the contest.',
        data: null,
      },
      { status: 500 },
    );
  }
}