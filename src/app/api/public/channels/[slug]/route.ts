import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

const getPublicChannelSelect = {
  id: true,
  tv_name: true,
  slug: true,
  whatsapp_number: true,
  channel_banner: true,
  status: true,
  live_contest: true,
  created_at: true,
} as const;

const getPublicContestSelect = {
  id: true,
  channel_id: true,
  title: true,
  slug: true,
  description: true,
  status: true,
  visibility: true,
  start_date: true,
  end_date: true,
  reward_type: true,
  reward_value: true,
  reward_description: true,
  winner_selection: true,
  max_winners: true,
  participants_count: true,
  referrals_count: true,
  views_count: true,
  top_performer_name: true,
  top_performer_phone: true,
  top_performer_referrals: true,
  created_at: true,
  updated_at: true,
} as const;

const safelyDecodeSlug = (slug?: string | null) => {
  try {
    return {
      success: true,
      slug: decodeURIComponent(slug ?? '').trim(),
    };
  } catch {
    return {
      success: false,
      slug: '',
    };
  }
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const decoded_slug = safelyDecodeSlug(slug);

    if (!decoded_slug.success) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid channel slug.',
          data: null,
        },
        { status: 400 },
      );
    }

    const clean_slug = decoded_slug.slug;

    if (!clean_slug) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Channel slug is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    const channel = await prisma.channels.findFirst({
      where: {
        slug: {
          equals: clean_slug,
          mode: 'insensitive',
        },
      },
      select: getPublicChannelSelect,
    });

    if (!channel) {
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

    if (!channel.live_contest) {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message:
            'This channel currently has no active contest at the moment.',
          data: {
            channel: {
              ...channel,
              created_at: channel.created_at.toISOString(),
            },
            active_contest: null,
          },
        },
        { status: 409 },
      );
    }

    const active_contest = await prisma.contests.findFirst({
      where: {
        channel_id: channel.id,
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
      select: getPublicContestSelect,
    });

    if (!active_contest) {
      return NextResponse.json(
        {
          success: false,
          status_code: 409,
          message:
            'This channel currently has no active contest at the moment.',
          data: {
            channel: {
              ...channel,
              created_at: channel.created_at.toISOString(),
            },
            active_contest: null,
          },
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Channel active contest fetched successfully.',
      data: {
        channel: {
          ...channel,
          created_at: channel.created_at.toISOString(),
        },
        active_contest: {
          ...active_contest,
          start_date: active_contest.start_date?.toISOString() ?? null,
          end_date: active_contest.end_date?.toISOString() ?? null,
          created_at: active_contest.created_at.toISOString(),
          updated_at: active_contest.updated_at.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('PUBLIC_GET_CHANNEL_BY_SLUG_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching the channel.',
        data: null,
      },
      { status: 500 },
    );
  }
}
