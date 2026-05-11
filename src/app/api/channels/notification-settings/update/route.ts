import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';

export async function PATCH(request: Request) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const body = await request.json();

    const channel_id = body.channel_id as string;
    const notification_settings = body.notification_settings;

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

    if (!notification_settings) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Notification settings are required.',
          data: null,
        },
        { status: 400 },
      );
    }

    const existing_channel = await prisma.channels.findUnique({
      where: {
        id: channel_id,
      },
      select: {
        id: true,
        owner_id: true,
      },
    });

    if (!existing_channel) {
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

    if (existing_channel.owner_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          status_code: 403,
          message: 'You are not allowed to update this channel.',
          data: null,
        },
        { status: 403 },
      );
    }

    const updated_channel = await prisma.channels.update({
      where: {
        id: channel_id,
      },
      data: {
        notification_settings,
      },
      select: {
        id: true,
        owner_id: true,
        notification_settings: true,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Notification settings updated successfully',
      data: {
        channel_id: updated_channel.id,
        owner_id: updated_channel.owner_id,
        notification_settings: updated_channel.notification_settings,
      },
    });
  } catch (error) {
    console.error('Update notification settings API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while updating notification settings.',
        data: null,
      },
      { status: 500 },
    );
  }
}
