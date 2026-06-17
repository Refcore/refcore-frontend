import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateSession } from '@/utils/supabase/middleware';

const PUBLIC_API_ROUTES = new Set(['/api/auth/register']);

const PUBLIC_API_PREFIXES = ['/api/public'];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabaseAuth = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const isPublicApiRoute = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_API_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }

  if (request.method === 'POST' && PUBLIC_API_ROUTES.has(pathname)) {
    return true;
  }

  return false;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith('/api');

  if (isApiRoute) {
    if (isPublicApiRoute(request)) {
      return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          status_code: 401,
          message: 'You must be signed in to continue.',
          data: null,
          error_code: 'AUTH_REQUIRED',
        },
        { status: 401 },
      );
    }

    try {
      const {
        data: { user },
        error,
      } = await supabaseAuth.auth.getUser(token);

      if (error || !user) {
        return NextResponse.json(
          {
            success: false,
            status_code: 401,
            message: 'Your session has expired. Please sign in again.',
            data: null,
            error_code: 'SESSION_EXPIRED',
          },
          { status: 401 },
        );
      }
    } catch (error) {
      console.error('[proxy] Supabase auth validation failed:', error);

      return NextResponse.json(
        {
          success: false,
          status_code: 503,
          message:
            'Authentication service is temporarily unavailable. Please try again.',
          data: null,
          error_code: 'AUTH_SERVICE_UNAVAILABLE',
        },
        { status: 503 },
      );
    }

    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};