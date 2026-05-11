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

    const user_name = body.user_name as string;
    const profile_picture = body.profile_picture as string | null;

    if (!user_name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'User name is required.',
          data: null,
        },
        { status: 400 },
      );
    }

    const existing_user = await prisma.public_users.findUnique({
      where: {
        id: user.id,
      },
      select: {
        profile_picture: true,
      },
    });

    if (!existing_user) {
      return NextResponse.json(
        {
          success: false,
          status_code: 404,
          message: 'User profile not found.',
          data: null,
        },
        { status: 404 },
      );
    }

    const updated_user = await prisma.public_users.update({
      where: {
        id: user.id,
      },
      data: {
        user_name,
        profile_picture,
      },
      select: {
        id: true,
        profile_picture: true,
      },
    });

    return NextResponse.json({
      success: true,
      status_code: 200,
      message: 'Profile updated successfully',
      data: {
        user_id: updated_user.id,
        profile_picture: updated_user.profile_picture,
        old_profile_picture: existing_user.profile_picture,
      },
    });
  } catch (error) {
    console.error('Update profile API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while updating profile.',
        data: null,
      },
      { status: 500 },
    );
  }
}