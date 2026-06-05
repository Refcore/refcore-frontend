import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';

type ApiResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
  error_code?: string;
};

type RouteParams = {
  params: Promise<{
    notificationId: string;
  }>;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const notificationSelect = {
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
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { notificationId } = await params;

    if (!notificationId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          status_code: 400,
          message: 'Notification ID is missing from the request URL.',
          data: null,
          error_code: 'MISSING_NOTIFICATION_ID',
        },
        { status: 400 },
      );
    }

    if (!UUID_REGEX.test(notificationId)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          status_code: 400,
          message: 'Invalid notification ID format.',
          data: null,
          error_code: 'INVALID_NOTIFICATION_ID',
        },
        { status: 400 },
      );
    }

    const notification = await prisma.notifications.findFirst({
      where: {
        id: notificationId,
        OR: [
          {
            user_id: user.id,
          },
          {
            channels: {
              owner_id: user.id,
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!notification) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          status_code: 404,
          message: 'Notification not found.',
          data: null,
          error_code: 'NOTIFICATION_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    const now = new Date();

    await prisma.notifications.updateMany({
      where: {
        id: notificationId,
        is_read: false,
        OR: [
          {
            user_id: user.id,
          },
          {
            channels: {
              owner_id: user.id,
            },
          },
        ],
      },
      data: {
        is_read: true,
        read_at: now,
        updated_at: now,
      },
    });

    const updatedNotification = await prisma.notifications.findUnique({
      where: {
        id: notificationId,
      },
      select: notificationSelect,
    });

    return NextResponse.json<ApiResponse<typeof updatedNotification>>(
      {
        success: true,
        status_code: 200,
        message: 'Notification marked as read successfully.',
        data: updatedNotification,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Mark notification as read API error:', error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while marking notification as read.',
        data: null,
        error_code: 'MARK_NOTIFICATION_AS_READ_ERROR',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { notificationId } = await params;

    if (!notificationId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          status_code: 400,
          message: 'Notification ID is missing from the request URL.',
          data: null,
          error_code: 'MISSING_NOTIFICATION_ID',
        },
        { status: 400 },
      );
    }

    if (!UUID_REGEX.test(notificationId)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          status_code: 400,
          message: 'Invalid notification ID format.',
          data: null,
          error_code: 'INVALID_NOTIFICATION_ID',
        },
        { status: 400 },
      );
    }

    const deleteResult = await prisma.notifications.deleteMany({
      where: {
        id: notificationId,
        OR: [
          {
            user_id: user.id,
          },
          {
            channels: {
              owner_id: user.id,
            },
          },
        ],
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          status_code: 404,
          message: 'Notification not found.',
          data: null,
          error_code: 'NOTIFICATION_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<{ deleted_id: string }>>(
      {
        success: true,
        status_code: 200,
        message: 'Notification deleted successfully.',
        data: {
          deleted_id: notificationId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Delete notification API error:', error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while deleting notification.',
        data: null,
        error_code: 'DELETE_NOTIFICATION_ERROR',
      },
      { status: 500 },
    );
  }
}
