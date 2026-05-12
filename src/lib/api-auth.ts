import { supabaseAdmin } from '@/utils/supabase/admin';

export async function getApiAuthUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      user: null,
      error: {
        success: false,
        status_code: 401,
        message: 'You must be signed in to continue.',
        data: null,
      },
    };
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return {
      user: null,
      error: {
        success: false,
        status_code: 401,
        message: 'Your session is invalid or expired.',
        data: null,
        error_code: error?.code,
      },
    };
  }

  return {
    user,
    error: null,
  };
}
