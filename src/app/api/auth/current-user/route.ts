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

    const profile = await prisma.public_users.findUnique({
      where: {
        id: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Current user fetched successfully.',
      data: {
        auth_user: {
          id: user.id,
          email: user.email ?? null,
        },
        profile,
      },
    });
  } catch (error) {
    console.error('Get current user API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while fetching current user.',
        data: null,
      },
      { status: 500 },
    );
  }
}
