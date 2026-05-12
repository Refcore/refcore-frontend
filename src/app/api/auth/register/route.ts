import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerAccountSchema } from '@/schema/register.schema';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          status_code: 400,
          message: 'Invalid registration details.',
          data: null,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        user_name: payload.user_name,
      },
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          status_code: error.message.toLowerCase().includes('already')
            ? 409
            : 400,
          message: error.message,
          data: null,
          error_code: error.code,
        },
        { status: error.message.toLowerCase().includes('already') ? 409 : 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          status_code: 500,
          message: 'Unable to create user account.',
          data: null,
        },
        { status: 500 },
      );
    }

    const publicUser = await prisma.public_users.create({
      data: {
        id: data.user.id,
        email: data.user.email ?? payload.email,
        user_name: payload.user_name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        status_code: 201,
        message: 'User created successfully.',
        data: {
          user_id: publicUser.id,
          email: publicUser.email ?? payload.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Register API error:', error);

    return NextResponse.json(
      {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the account.',
        data: null,
      },
      { status: 500 },
    );
  }
}
