import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';
import { contestDefaultsSchema } from '@/schema/contestDefaults.schema';

export async function PATCH(request: Request) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid JSON body.',
          data: null,
        },
        { status: 400 },
      );
    }

    const request_body = body as {
      channel_id?: string;
      contest_defaults?: unknown;
    };

    const channel_id = request_body.channel_id;
    const contest_defaults = request_body.contest_defaults;

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

    const parsed = contestDefaultsSchema.safeParse(contest_defaults);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid contest defaults.',
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
        contest_defaults: parsed.data,
      },
      select: {
        id: true,
        owner_id: true,
        contest_defaults: true,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Contest defaults updated successfully',
      data: {
        channel_id: updated_channel.id,
        owner_id: updated_channel.owner_id,
        contest_defaults: updated_channel.contest_defaults,
      },
    });
  } catch (error) {
    console.error('Update contest defaults API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while updating contest defaults.',
        data: null,
      },
      { status: 500 },
    );
  }
}
