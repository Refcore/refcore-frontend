import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerChannelSchema } from '@/schema/register.schema';
import { getApiAuthUser } from '@/lib/api-auth';
import { Prisma } from '@/generated/prisma/client';

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const body = await request.json();
    const parsed = registerChannelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid channel details.',
          data: null,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    const existingChannel = await prisma.channels.findFirst({
      where: {
        OR: [
          { slug: payload.slug },
          { whatsapp_number: payload.whatsapp_number },
        ],
      },
      select: {
        slug: true,
        whatsapp_number: true,
      },
    });

    if (existingChannel) {
      const message =
        existingChannel.slug === payload.slug
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

    const channel = await prisma.channels.create({
      data: {
        owner_id: user.id,
        tv_name: payload.tv_name,
        slug: payload.slug,
        whatsapp_number: payload.whatsapp_number,
      },
      select: {
        id: true,
        owner_id: true,
        slug: true,
        whatsapp_verified: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        status_code: 201,
        message: 'Channel created successfully.',
        data: {
          channel_id: channel.id,
          owner_id: channel.owner_id,
          slug: channel.slug,
          whatsapp_verified: channel.whatsapp_verified,
          status: channel.status,
        },
      },
      { status: 201 },
    );
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

    console.error('Create channel API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the channel.',
        data: null,
      },
      { status: 500 },
    );
  }
}
