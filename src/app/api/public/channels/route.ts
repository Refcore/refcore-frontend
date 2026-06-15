import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

const getPublicChannelSelect = {
  id: true,
  tv_name: true,
  slug: true,
  whatsapp_number: true,
//   whatsapp_verified: true,
  channel_banner: true,
  status: true,
  created_at: true,
} as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim() ?? '';
    const limit = parsePositiveInteger(searchParams.get('limit'), 10, 25);

    if (!search) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Search term is required.',
          data: {
            channels: [],
            match_type: null,
          },
        },
        { status: 400 },
      );
    }

    const exactSlugMatch = await prisma.channels.findFirst({
      where: {
        slug: {
          equals: search,
          mode: 'insensitive',
        },
        // whatsapp_verified: true,
      },
      select: getPublicChannelSelect,
    });

    if (exactSlugMatch) {
      return NextResponse.json({
        success: true,
        status_code: 200,
        message: 'Channel fetched successfully.',
        data: {
          channels: [
            {
              ...exactSlugMatch,
              created_at: exactSlugMatch.created_at.toISOString(),
            },
          ],
          match_type: 'slug',
        },
      });
    }

    const channels = await prisma.channels.findMany({
      where: {
        tv_name: {
          contains: search,
          mode: 'insensitive',
        },
        whatsapp_verified: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      select: getPublicChannelSelect,
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Channels fetched successfully.',
      data: {
        channels: channels.map((channel) => ({
          ...channel,
          created_at: channel.created_at.toISOString(),
        })),
        match_type: 'name',
      },
    });
  } catch (error) {
    console.error('PUBLIC_SEARCH_CHANNELS_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while searching for channels.',
        data: {
          channels: [],
          match_type: null,
        },
      },
      { status: 500 },
    );
  }
}