import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  GetReferralsResponse,
  ReferralModel,
  ReferralStatus,
} from '@/types/referral.type';
import { getApiAuthUser } from '@/lib/api-auth';

type RouteParams = {
  params: Promise<{
    channelId: string;
  }>;
};

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

const getTrimmedSearchParam = (
  searchParams: URLSearchParams,
  keys: string[],
) => {
  for (const key of keys) {
    const value = searchParams.get(key)?.trim();

    if (value) {
      return value;
    }
  }

  return '';
};

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value: string) => {
  return uuidRegex.test(value);
};

const referralStatuses: ReferralStatus[] = [
  'valid',
  'became_participant',
  'flagged',
  'blocked',
];

const isReferralStatus = (status: string): status is ReferralStatus => {
  return referralStatuses.includes(status as ReferralStatus);
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(
        authError ?? {
          success: false,
          message: 'Unauthorized.',
        },
        { status: authError?.status_code ?? 401 },
      );
    }

    const { channelId } = await params;
    const channel_id = channelId?.trim();

    if (!channel_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Channel id is required.',
        },
        { status: 400 },
      );
    }

    if (!isUuid(channel_id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid channel id.',
        },
        { status: 400 },
      );
    }

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
          message: 'Channel not found.',
        },
        { status: 404 },
      );
    }

    if (channel.owner_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden.',
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);

    const safePage = parsePositiveInteger(searchParams.get('page'), 1);
    const safeLimit = parsePositiveInteger(searchParams.get('limit'), 20, 100);

    const search = searchParams.get('search')?.trim() ?? '';
    const status = searchParams.get('status')?.trim() ?? '';

    const contest_id = getTrimmedSearchParam(searchParams, [
      'contest_id',
      'contestId',
    ]);

    const referrer_participant_id = getTrimmedSearchParam(searchParams, [
      'referrer_participant_id',
      'referrerParticipantId',
    ]);

    const skip = (safePage - 1) * safeLimit;

    if (status && !isReferralStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid referral status.',
        },
        { status: 400 },
      );
    }

    if (contest_id && !isUuid(contest_id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid contest id.',
        },
        { status: 400 },
      );
    }

    if (referrer_participant_id && !isUuid(referrer_participant_id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid referrer participant id.',
        },
        { status: 400 },
      );
    }

    const where = {
      channel_id,
      ...(contest_id
        ? {
            contest_id,
          }
        : {}),
      ...(referrer_participant_id
        ? {
            referrer_participant_id,
          }
        : {}),
      ...(status
        ? {
            status,
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                referral_code_used: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                referee_phone_number: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                status: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                notes: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
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

          referrer_participant_id: true,
          referee_participant_id: true,

          referee_phone_number: true,
          referral_code_used: true,
          status: true,
          notes: true,

          first_seen_at: true,
          became_participant_at: true,
          created_at: true,
          updated_at: true,

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

      referrer_participant_id: referral.referrer_participant_id,
      referee_participant_id: referral.referee_participant_id,

      referee_phone_number: referral.referee_phone_number,
      referral_code_used: referral.referral_code_used,
      status: isReferralStatus(referral.status) ? referral.status : 'flagged',
      notes: referral.notes,

      referrer: {
        id: referral.referrer_participant.id,
        user_name:
          referral.referrer_participant.display_name ?? 'Unknown Participant',
        phone: referral.referrer_participant.phone_number,
        referral_code: referral.referrer_participant.referral_code,
      },

      referee: referral.referee_participant
        ? {
            id: referral.referee_participant.id,
            user_name:
              referral.referee_participant.display_name ??
              'Unknown Participant',
            phone: referral.referee_participant.phone_number,
            referral_code: referral.referee_participant.referral_code,
          }
        : {
            id: null,
            user_name: 'Not a participant yet',
            phone: referral.referee_phone_number,
            referral_code: null,
          },

      first_seen_at: referral.first_seen_at.toISOString(),
      became_participant_at:
        referral.became_participant_at?.toISOString() ?? null,
      created_at: referral.created_at.toISOString(),
      updated_at: referral.updated_at.toISOString(),
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
        message: 'Failed to fetch referrals.',
      },
      { status: 500 },
    );
  }
}
