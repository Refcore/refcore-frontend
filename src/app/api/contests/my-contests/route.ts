import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthUser } from '@/lib/api-auth';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await getApiAuthUser(request);

    if (authError || !user) {
      return NextResponse.json(authError, {
        status: authError?.status_code ?? 401,
      });
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const channel = await prisma.channels.findFirst({
      where: {
        owner_id: user.id,
      },
      select: {
        id: true,
      },
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

    const contests = await prisma.contests.findMany({
      where: {
        channel_id: channel.id,

        ...(status && status !== 'all'
          ? {
              status,
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  slug: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        channel_id: true,
        title: true,
        slug: true,
        description: true,
        status: true,
        visibility: true,
        referral_code_prefix: true,
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
        is_published: true,
        is_archived: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Contests fetched successfully.',
      data: contests,
    });
  } catch (error) {
    console.error('Get contests API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching contests.',
        data: null,
      },
      { status: 500 },
    );
  }
}