import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

type RouteParams = {
  params: Promise<{
    channelId: string;
  }>;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { channelId } = await params;

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);
    const search = searchParams.get('search')?.trim() ?? '';
    const id = searchParams.get('id')?.trim() ?? '';

    if (id && !UUID_REGEX.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid participant ID format.',
          error_code: 'INVALID_PARTICIPANT_ID',
        },
        { status: 400 },
      );
    }

    const isSingleParticipantLookup = Boolean(id);

    const safePage =
      isSingleParticipantLookup || Number.isNaN(page) || page < 1 ? 1 : page;

    const safeLimit = isSingleParticipantLookup
      ? 1
      : Number.isNaN(limit) || limit < 1
        ? 20
        : Math.min(limit, 100);

    const skip = isSingleParticipantLookup ? 0 : (safePage - 1) * safeLimit;

    const where: Prisma.participantsWhereInput = {
      channel_id: channelId,

      ...(id
        ? {
            id,
          }
        : {}),

      ...(!id && search
        ? {
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
          }
        : {}),
    };

    const [participants, total] = await Promise.all([
      prisma.participants.findMany({
        where,
        orderBy: [
          {
            last_joined_at: 'desc',
          },
          {
            created_at: 'desc',
          },
        ],
        skip,
        take: safeLimit,
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
      }),

      prisma.participants.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        participants,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          total_pages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    console.error('FETCH_PARTICIPANTS_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch participants',
      },
      { status: 500 },
    );
  }
}