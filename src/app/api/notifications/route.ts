import { NextResponse } from 'next/server';
import { notification_type, Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const notificationTypeValues = Object.values(notification_type);

type NotificationScope = 'user' | 'channel' | 'all';

const getValidScope = (scope: string | null): NotificationScope => {
  if (scope === 'user' || scope === 'channel' || scope === 'all') {
    return scope;
  }

  return 'all';
};

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { searchParams } = new URL(request.url);

    const scope = getValidScope(searchParams.get('scope'));
    const channelId = searchParams.get('channel_id');
    const contestId = searchParams.get('contest_id');
    const isRead = searchParams.get('is_read');
    const type = searchParams.get('type');

    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20;

    const skip = (safePage - 1) * safeLimit;

    if (channelId && !UUID_REGEX.test(channelId)) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid channel_id format.',
          data: null,
          error_code: 'INVALID_CHANNEL_ID',
        },
        { status: 400 },
      );
    }

    if (contestId && !UUID_REGEX.test(contestId)) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest_id format.',
          data: null,
          error_code: 'INVALID_CONTEST_ID',
        },
        { status: 400 },
      );
    }

    const notificationType =
      type &&
      type !== 'all' &&
      notificationTypeValues.includes(type as notification_type)
        ? (type as notification_type)
        : undefined;

    let resolvedChannelId: string | null = null;

    if (scope === 'channel' || scope === 'all') {
      const channel = await prisma.channels.findFirst({
        where: {
          ...(channelId
            ? {
                id: channelId,
              }
            : {}),
          owner_id: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!channel && scope === 'channel') {
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

      resolvedChannelId = channel?.id ?? null;
    }

    let resolvedContestId: string | null = null;

    if (contestId) {
      const contest = await prisma.contests.findFirst({
        where: {
          id: contestId,
          channels: {
            owner_id: user.id,
          },
        },
        select: {
          id: true,
          channel_id: true,
        },
      });

      if (!contest) {
        return NextResponse.json(
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

      if (resolvedChannelId && contest.channel_id !== resolvedChannelId) {
        return NextResponse.json(
          {
            success: false,
            status_code: 400,
            message: 'Contest does not belong to the selected channel.',
            data: null,
            error_code: 'CONTEST_CHANNEL_MISMATCH',
          },
          { status: 400 },
        );
      }

      resolvedContestId = contest.id;
    }

    const where: Prisma.notificationsWhereInput = {
      ...(scope === 'user'
        ? {
            user_id: user.id,
          }
        : {}),

      ...(scope === 'channel'
        ? {
            channel_id: resolvedChannelId,
          }
        : {}),

      ...(scope === 'all'
        ? {
            OR: [
              {
                user_id: user.id,
              },
              ...(resolvedChannelId
                ? [
                    {
                      channel_id: resolvedChannelId,
                    },
                  ]
                : []),
            ],
          }
        : {}),

      ...(resolvedContestId
        
        ? {
            contest_id: resolvedContestId,
          }
        : {}),

      ...(isRead === 'true'
        ? {
            is_read: true,
          }
        : {}),

      ...(isRead === 'false'
        ? {
            is_read: false,
          }
        : {}),

      ...(notificationType
        ? {
            type: notificationType,
          }
        : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notifications.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: safeLimit,
        select: {
          id: true,
          user_id: true,
          channel_id: true,
          contest_id: true,
          type: true,
          title: true,
          description: true,
          actor: true,
          meta: true,
          is_read: true,
          read_at: true,
          created_at: true,
          updated_at: true,
        },
      }),

      prisma.notifications.count({
        where,
      }),

      prisma.notifications.count({
        where: {
          ...where,
          is_read: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Notifications fetched successfully.',
      data: {
        notifications,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          total_pages: Math.ceil(total / safeLimit),
          can_previous_page: safePage > 1,
          can_next_page: safePage * safeLimit < total,
        },
        unread_count: unreadCount,
      },
    });
  } catch (error) {
    console.error('Get notifications API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching notifications.',
        data: null,
      },
      { status: 500 },
    );
  }
}
