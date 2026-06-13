import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';
import {
  ContestParticipantModel,
  GetContestParticipantsResponse,
} from '@/types/contest-participant.type';
import type { Prisma } from '@/generated/prisma/client';

type ApiResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
  error_code?: string;
};

type RouteParams = {
  params: Promise<{
    contestId: string;
  }>;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const parsePositiveInteger = (
  value: string | null,
  fallback: number,
  max?: number,
) => {
  const parsed_value = Number(value);

  if (!Number.isInteger(parsed_value) || parsed_value < 1) {
    return fallback;
  }

  if (max) {
    return Math.min(parsed_value, max);
  }

  return parsed_value;
};

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
      return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
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
      return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
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

    const { searchParams } = new URL(request.url);

    const safePage = parsePositiveInteger(searchParams.get('page'), 1);
    const safeLimit = parsePositiveInteger(searchParams.get('limit'), 20, 100);
    const search = searchParams.get('search')?.trim() ?? '';
    const participantId = searchParams.get('participantId')?.trim() ?? '';

    if (participantId && !UUID_REGEX.test(participantId)) {
      return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
        {
          success: false,
          status_code: 400,
          message: 'Invalid participant ID format.',
          data: null,
          error_code: 'INVALID_PARTICIPANT_ID',
        },
        { status: 400 },
      );
    }

    const isSingleParticipantLookup = Boolean(participantId);

    const page = isSingleParticipantLookup ? 1 : safePage;
    const limit = isSingleParticipantLookup ? 1 : safeLimit;
    const skip = isSingleParticipantLookup ? 0 : (safePage - 1) * safeLimit;

    const contest = await prisma.contests.findUnique({
      where: {
        id: contestId,
      },
      select: {
        id: true,
        channel_id: true,
        channels: {
          select: {
            id: true,
            owner_id: true,
          },
        },
      },
    });

    if (!contest) {
      return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
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
      return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
        {
          success: false,
          status_code: 403,
          message: 'You are not allowed to view participants for this contest.',
          data: null,
          error_code: 'FORBIDDEN_CONTEST_ACCESS',
        },
        { status: 403 },
      );
    }

    const where: Prisma.contest_participantsWhereInput = {
      contest_id: contest.id,
      channel_id: contest.channel_id,

      ...(participantId
        ? {
            id: participantId,
          }
        : {}),

      ...(!participantId && search
        ? {
            OR: [
              {
                status: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                participants: {
                  is: {
                    display_name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                participants: {
                  is: {
                    phone_number: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                participants: {
                  is: {
                    referral_code: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [contest_participants_data, total] = await Promise.all([
      prisma.contest_participants.findMany({
        where,
        orderBy: {
          joined_at: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          channel_id: true,
          contest_id: true,
          participant_id: true,
          referral_count: true,
          rank_cache: true,
          joined_at: true,
          status: true,
          created_at: true,
          updated_at: true,
          participants: {
            select: {
              id: true,
              channel_id: true,
              phone_number: true,
              display_name: true,
              referral_code: true,
              total_referrals: true,
              total_contests_joined: true,
              first_joined_at: true,
              last_joined_at: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
      }),

      prisma.contest_participants.count({
        where,
      }),
    ]);

    if (participantId && total === 0) {
      return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
        {
          success: false,
          status_code: 404,
          message: 'Participant was not found in this contest.',
          data: null,
          error_code: 'CONTEST_PARTICIPANT_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    const participants: ContestParticipantModel[] =
      contest_participants_data.map((item) => ({
        id: item.id,
        channel_id: item.channel_id,
        contest_id: item.contest_id,
        participant_id: item.participant_id,
        referral_count: item.referral_count,
        rank_cache: item.rank_cache,
        joined_at: item.joined_at.toISOString(),
        status: item.status,
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
        participant: {
          id: item.participants.id,
          channel_id: item.participants.channel_id,
          phone_number: item.participants.phone_number,
          display_name: item.participants.display_name,
          referral_code: item.participants.referral_code,
          total_referrals: item.participants.total_referrals,
          total_contests_joined: item.participants.total_contests_joined,
          first_joined_at: item.participants.first_joined_at.toISOString(),
          last_joined_at:
            item.participants.last_joined_at?.toISOString() ?? null,
          created_at: item.participants.created_at.toISOString(),
          updated_at: item.participants.updated_at.toISOString(),
        },
      }));

    const data: GetContestParticipantsResponse = {
      participants,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
      {
        success: true,
        status_code: 200,
        message: participantId
          ? 'Contest participant fetched successfully.'
          : 'Contest participants fetched successfully.',
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Get contest participants API error:', error);

    return NextResponse.json<ApiResponse<GetContestParticipantsResponse>>(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching contest participants.',
        data: null,
        error_code: 'GET_CONTEST_PARTICIPANTS_ERROR',
      },
      { status: 500 },
    );
  }
}
