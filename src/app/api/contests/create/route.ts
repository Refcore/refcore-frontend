import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';
import { createContestSchema } from '@/schema/contest.schema';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const body = await request.json();

    const channel_id = body.channel_id as string;
    const parsed = createContestSchema.safeParse(body);

    if (!channel_id) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Channel ID is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest details.',
          data: null,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    const channel = await prisma.channels.findUnique({
      where: {
        id: channel_id,
      },
      select: {
        id: true,
        owner_id: true,
      },
    });

    if (!channel) {
      return NextResponse.json(
        {
          success: false,
          status_code: 404,
          message: 'Channel not found.',
          data: null,
        },
        { status: 404 },
      );
    }

    if (channel.owner_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          status_code: 403,
          message: 'You are not allowed to create a contest for this channel.',
          data: null,
        },
        { status: 403 },
      );
    }

    const existing_contest = await prisma.contests.findFirst({
      where: {
        channel_id,
        slug: payload.slug,
      },
      select: {
        id: true,
      },
    });

    if (existing_contest) {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message: 'Contest slug already exists for this channel.',
          data: null,
          error_code: 'CONTEST_SLUG_ALREADY_EXISTS',
        },
        { status: 409 },
      );
    }

    const contest = await prisma.contests.create({
      data: {
        channel_id,
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        visibility: payload.visibility,
        referral_code_prefix: payload.referral_code_prefix,
        start_date: payload.start_date ? new Date(payload.start_date) : null,
        end_date: payload.end_date ? new Date(payload.end_date) : null,
        reward_description: payload.reward_description,
        max_winners: payload.max_winners,
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
        status_code: 201,
        message: 'Contest created successfully.',
        data: contest,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create contest API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the contest.',
        data: null,
      },
      { status: 500 },
    );
  }
}
