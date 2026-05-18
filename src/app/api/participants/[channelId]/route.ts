import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    channelId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { channelId } = await params;

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);
    const search = searchParams.get('search')?.trim() ?? '';

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit =
      Number.isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 100);

    const skip = (safePage - 1) * safeLimit;

    const where = {
      channel_id: channelId,
      ...(search
        ? {
            OR: [
              {
                display_name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                phone_number: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                referral_code: {
                  contains: search,
                  mode: 'insensitive' as const,
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
            total_referrals: 'desc',
          },
          {
            first_joined_at: 'asc',
          },
          {
            created_at: 'asc',
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
