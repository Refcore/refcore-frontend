import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GetReferralsResponse, ReferralModel } from '@/types/referral.type';

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
                referrer_participant: {
                  is: {
                    display_name: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
              {
                referrer_participant: {
                  is: {
                    phone_number: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
              {
                referrer_participant: {
                  is: {
                    referral_code: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
              {
                referee_participant: {
                  is: {
                    display_name: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
              {
                referee_participant: {
                  is: {
                    phone_number: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
              {
                referee_participant: {
                  is: {
                    referral_code: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [referrals_data, total] = await Promise.all([
      prisma.referrals.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: safeLimit,
        select: {
          id: true,
          channel_id: true,
          contest_id: true,
          referral_attempt_id: true,
          referrer_participant_id: true,
          referee_participant_id: true,
          created_at: true,

          referrer_participant: {
            select: {
              id: true,
              display_name: true,
              phone_number: true,
              referral_code: true,
            },
          },

          referee_participant: {
            select: {
              id: true,
              display_name: true,
              phone_number: true,
              referral_code: true,
            },
          },
        },
      }),

      prisma.referrals.count({
        where,
      }),
    ]);

    const referrals: ReferralModel[] = referrals_data.map((referral) => ({
      id: referral.id,
      channel_id: referral.channel_id,
      contest_id: referral.contest_id,
      referral_attempt_id: referral.referral_attempt_id,

      referrer_participant_id: referral.referrer_participant_id,
      referee_participant_id: referral.referee_participant_id,

      referrer: {
        id: referral.referrer_participant.id,
        user_name:
          referral.referrer_participant.display_name ?? 'Unknown Participant',
        phone: referral.referrer_participant.phone_number,
        referral_code: referral.referrer_participant.referral_code,
      },

      referee: {
        id: referral.referee_participant.id,
        user_name:
          referral.referee_participant.display_name ?? 'Unknown Participant',
        phone: referral.referee_participant.phone_number,
        referral_code: referral.referee_participant.referral_code,
      },

      created_at: referral.created_at.toISOString(),
    }));

    const data: GetReferralsResponse = {
      referrals,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        total_pages: Math.ceil(total / safeLimit),
      },
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('FETCH_REFERRALS_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch referrals',
      },
      { status: 500 },
    );
  }
}