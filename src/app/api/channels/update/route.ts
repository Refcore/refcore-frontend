import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';
import { Prisma } from '@/generated/prisma/client';

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
    const tv_name = body.tv_name as string;
    const slug = body.slug as string;
    const whatsapp_number = body.whatsapp_number as string;
    const channel_members_limit = body.channel_members_limit as number | null;
    const channel_banner = body.channel_banner as string | null;

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

    if (!tv_name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'TV name is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Slug is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    if (!whatsapp_number?.trim()) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'WhatsApp number is required.',
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
        channel_banner: true,
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

    const duplicate_channel = await prisma.channels.findFirst({
      where: {
        id: {
          not: channel_id,
        },
        OR: [{ slug }, { whatsapp_number }],
      },
      select: {
        slug: true,
        whatsapp_number: true,
      },
    });

    if (duplicate_channel) {
      const message =
        duplicate_channel.slug === slug
          ? 'Slug already exists.'
          : 'WhatsApp number already exists.';

      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message,
          data: null,
          error_code: 'CHANNEL_ALREADY_EXISTS',
        },
        { status: 409 },
      );
    }

    const updated_channel = await prisma.channels.update({
      where: {
        id: channel_id,
      },
      data: {
        tv_name,
        slug,
        whatsapp_number,
        channel_members_limit: channel_members_limit ?? null,
        channel_banner,
      },
      select: {
        id: true,
        owner_id: true,
        channel_banner: true,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Channel updated successfully',
      data: {
        channel_id: updated_channel.id,
        owner_id: updated_channel.owner_id,
        channel_banner: updated_channel.channel_banner,
        old_channel_banner: existing_channel.channel_banner,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target;

      const fields = Array.isArray(target)
        ? target
        : typeof target === 'string'
          ? [target]
          : [];

      const message = fields.includes('slug')
        ? 'Slug already exists.'
        : fields.includes('whatsapp_number')
          ? 'WhatsApp number already exists.'
          : 'Channel already exists.';

      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message,
          data: null,
          error_code: 'CHANNEL_ALREADY_EXISTS',
        },
        { status: 409 },
      );
    }

    console.error('Update channel API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while updating channel.',
        data: null,
      },
      { status: 500 },
    );
  }
}
