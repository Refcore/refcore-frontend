import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';
import { Contest } from '@/types/contest.type';
import { updateContestApiSchema } from '@/schema/contest.schema';

type ApiResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
  error_code?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteParams = {
  params: Promise<{
    contestId: string;
  }>;
};

const getContestTimingMode = (
  startDate?: Date | string | null,
  endDate?: Date | string | null,
) => {
  return startDate && endDate ? 'automatic' : 'manual';
};

const normalizeDateValue = (date?: Date | string | null) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
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

    if (!UUID_REGEX.test(contestId)) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest ID format.',
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

    const update_result = await prisma.contests.updateMany({
      where: {
        id: contestId,
        status: 'active',
      },
      data: {
        status: 'past',
      },
    });

    if (update_result.count === 0) {
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

    const ended_contest = await prisma.contests.findUnique({
      where: {
        id: contestId,
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

export async function POST(request: Request, { params }: RouteParams) {
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

    if (!UUID_REGEX.test(contestId)) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest ID format.',
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
          message: 'You are not allowed to start this contest.',
          data: null,
        },
        { status: 403 },
      );
    }

    if (contest.status !== 'draft') {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message: 'Only a draft contest can be started.',
          data: null,
          error_code: 'CONTEST_NOT_DRAFT',
        },
        { status: 409 },
      );
    }

    const active_contest = await prisma.contests.findFirst({
      where: {
        channel_id: contest.channel_id,
        status: 'active',
        NOT: {
          id: contestId,
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (active_contest) {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message: `You already have an active contest: ${active_contest.title}. End it before starting another contest.`,
          data: null,
          error_code: 'ACTIVE_CONTEST_EXISTS',
        },
        { status: 409 },
      );
    }

    const update_result = await prisma.contests.updateMany({
      where: {
        id: contestId,
        status: 'draft',
      },
      data: {
        status: 'active',
        is_published: true,
        start_date: new Date(),
        updated_at: new Date(),
      },
    });

    if (update_result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message: 'Only a draft contest can be started.',
          data: null,
          error_code: 'CONTEST_NOT_DRAFT',
        },
        { status: 409 },
      );
    }

    const started_contest = await prisma.contests.findUnique({
      where: {
        id: contestId,
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
        message: 'Contest started successfully.',
        data: started_contest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Start contest API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while starting the contest.',
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { contestId } = await params;

    if (!contestId) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 400,
          message: 'Contest ID is missing from the request URL.',
          data: null,
          error_code: 'MISSING_CONTEST_ID',
        },
        { status: 400 },
      );
    }

    if (!UUID_REGEX.test(contestId)) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest ID format.',
          data: null,
          error_code: 'INVALID_CONTEST_ID',
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
        channels: {
          select: {
            id: true,
            owner_id: true,
          },
        },
      },
    });

    if (!contest) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 404,
          message: 'Contest not found.',
          data: null,
          error_code: 'CONTEST_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    if (contest.channels.owner_id !== user.id) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 403,
          message: 'You are not allowed to view this contest.',
          data: null,
          error_code: 'FORBIDDEN_CONTEST_ACCESS',
        },
        { status: 403 },
      );
    }

    const formatted_contest: Contest = {
      id: contest.id,
      title: contest.title,
      slug: contest.slug,
      description: contest.description,
      status: contest.status as Contest['status'],
      visibility: contest.visibility as Contest['visibility'],
      referral_code_prefix: contest.referral_code_prefix,
      start_date: contest.start_date?.toISOString() ?? null,
      end_date: contest.end_date?.toISOString() ?? null,
      reward_type: contest.reward_type as Contest['reward_type'],
      reward_value: contest.reward_value,
      reward_description: contest.reward_description,
      winner_selection: contest.winner_selection as Contest['winner_selection'],
      max_winners: contest.max_winners,
      participants_count: contest.participants_count,
      referrals_count: contest.referrals_count,
      views_count: contest.views_count,
      top_performer_name: contest.top_performer_name,
      top_performer_phone: contest.top_performer_phone,
      top_performer_referrals: contest.top_performer_referrals,
      is_published: contest.is_published,
      is_archived: contest.is_archived,
      created_at: contest.created_at.toISOString(),
      updated_at: contest.updated_at.toISOString(),
    };

    return NextResponse.json<ApiResponse<Contest>>(
      {
        success: true,
        status_code: 200,
        message: 'Contest fetched successfully.',
        data: formatted_contest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Get contest by ID API error:', error);

    return NextResponse.json<ApiResponse<Contest>>(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching the contest.',
        data: null,
        error_code: 'GET_CONTEST_BY_ID_ERROR',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { contestId } = await params;

    if (!contestId) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 400,
          message: 'Contest ID is missing from the request URL.',
          data: null,
          error_code: 'MISSING_CONTEST_ID',
        },
        { status: 400 },
      );
    }

    if (!UUID_REGEX.test(contestId)) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest ID format.',
          data: null,
          error_code: 'INVALID_CONTEST_ID',
        },
        { status: 400 },
      );
    }

    let rawBody: unknown;

    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 400,
          message: 'Invalid JSON request body.',
          data: null,
          error_code: 'INVALID_PAYLOAD',
        },
        { status: 400 },
      );
    }

    const parsedBody = updateContestApiSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 400,
          message:
            parsedBody.error.issues[0]?.message ??
            'Invalid contest update payload.',
          data: null,
          error_code: 'INVALID_PAYLOAD',
        },
        { status: 400 },
      );
    }

    const body = parsedBody.data;

    const existingContest = await prisma.contests.findUnique({
      where: {
        id: contestId,
      },
      select: {
        id: true,
        channel_id: true,
        status: true,
        slug: true,
        visibility: true,
        referral_code_prefix: true,
        start_date: true,
        end_date: true,
        channels: {
          select: {
            owner_id: true,
          },
        },
      },
    });

    if (!existingContest) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 404,
          message: 'Contest not found.',
          data: null,
          error_code: 'CONTEST_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    if (existingContest.channels.owner_id !== user.id) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 403,
          message: 'You are not allowed to update this contest.',
          data: null,
          error_code: 'FORBIDDEN_CONTEST_UPDATE',
        },
        { status: 403 },
      );
    }

    if (existingContest.status === 'active') {
      const existingTimingMode = getContestTimingMode(
        existingContest.start_date,
        existingContest.end_date,
      );

      const lockedFieldChanges: string[] = [];

      if (body.slug.trim() !== existingContest.slug) {
        lockedFieldChanges.push('contest slug');
      }

      if (body.visibility !== existingContest.visibility) {
        lockedFieldChanges.push('visibility');
      }

      if (
        body.referral_code_prefix.toUpperCase() !==
        existingContest.referral_code_prefix
      ) {
        lockedFieldChanges.push('referral code prefix');
      }

      if (body.contest_timing_mode !== existingTimingMode) {
        lockedFieldChanges.push('timing mode');
      }

      if (
        normalizeDateValue(body.start_date) !==
        normalizeDateValue(existingContest.start_date)
      ) {
        lockedFieldChanges.push('start date');
      }

      if (lockedFieldChanges.length > 0) {
        return NextResponse.json<ApiResponse<Contest>>(
          {
            success: false,
            status_code: 409,
            message: `This contest is live, so ${lockedFieldChanges.join(
              ', ',
            )} cannot be changed. These fields are locked to protect existing referral links, participant access, and contest history.`,
            data: null,
            error_code: 'LIVE_CONTEST_LOCKED_FIELDS',
          },
          { status: 409 },
        );
      }
    }

    const isAutomaticContest = body.contest_timing_mode === 'automatic';

    const startDate =
      isAutomaticContest && body.start_date ? new Date(body.start_date) : null;

    const endDate =
      isAutomaticContest && body.end_date ? new Date(body.end_date) : null;

    const duplicateSlugContest = await prisma.contests.findFirst({
      where: {
        channel_id: existingContest.channel_id,
        slug: body.slug.trim(),
        NOT: {
          id: contestId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateSlugContest) {
      return NextResponse.json<ApiResponse<Contest>>(
        {
          success: false,
          status_code: 409,
          message: 'Another contest already uses this slug.',
          data: null,
          error_code: 'DUPLICATE_CONTEST_SLUG',
        },
        { status: 409 },
      );
    }

    const updatedContest = await prisma.contests.update({
      where: {
        id: contestId,
      },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        visibility: body.visibility,
        referral_code_prefix: body.referral_code_prefix.toUpperCase(),
        start_date: startDate,
        end_date: endDate,
        reward_description: body.reward_description,
        max_winners: body.max_winners,
        updated_at: new Date(),
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

    const formatted_contest: Contest = {
      id: updatedContest.id,
      title: updatedContest.title,
      slug: updatedContest.slug,
      description: updatedContest.description,
      status: updatedContest.status as Contest['status'],
      visibility: updatedContest.visibility as Contest['visibility'],
      referral_code_prefix: updatedContest.referral_code_prefix,
      start_date: updatedContest.start_date?.toISOString() ?? null,
      end_date: updatedContest.end_date?.toISOString() ?? null,
      reward_type: updatedContest.reward_type as Contest['reward_type'],
      reward_value: updatedContest.reward_value,
      reward_description: updatedContest.reward_description,
      winner_selection:
        updatedContest.winner_selection as Contest['winner_selection'],
      max_winners: updatedContest.max_winners,
      participants_count: updatedContest.participants_count,
      referrals_count: updatedContest.referrals_count,
      views_count: updatedContest.views_count,
      top_performer_name: updatedContest.top_performer_name,
      top_performer_phone: updatedContest.top_performer_phone,
      top_performer_referrals: updatedContest.top_performer_referrals,
      is_published: updatedContest.is_published,
      is_archived: updatedContest.is_archived,
      created_at: updatedContest.created_at.toISOString(),
      updated_at: updatedContest.updated_at.toISOString(),
    };

    return NextResponse.json<ApiResponse<Contest>>(
      {
        success: true,
        status_code: 200,
        message: 'Contest updated successfully.',
        data: formatted_contest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Update contest API error:', error);

    return NextResponse.json<ApiResponse<Contest>>(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while updating the contest.',
        data: null,
        error_code: 'UPDATE_CONTEST_ERROR',
      },
      { status: 500 },
    );
  }
}
