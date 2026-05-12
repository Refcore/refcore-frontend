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

    const channel = await prisma.channels.findFirst({
      where: {
        owner_id: user.id,
      },
      select: {
        id: true,
        owner_id: true,
        tv_name: true,
        slug: true,
        whatsapp_number: true,
        whatsapp_verified: true,
        whatsapp_verified_at: true,
        status: true,
        created_at: true,
        updated_at: true,
        channel_members_limit: true,
        channel_banner: true,
        contest_defaults: true,
        referral_rules: true,
        notification_settings: true,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Channel fetched successfully.',
      data: channel,
    });
  } catch (error) {
    console.error('Get my channel API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching your channel.',
        data: null,
      },
      { status: 500 },
    );
  }
}