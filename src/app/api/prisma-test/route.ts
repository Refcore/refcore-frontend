import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.public_users.findMany({
      take: 5,
      include: {
        channels: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Prisma is connected successfully',
      data: users,
    });
  } catch (error) {
    console.error('Prisma test error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Prisma connection failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}