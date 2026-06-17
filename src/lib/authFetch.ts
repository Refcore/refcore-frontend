import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { AUTH_ROUTES } from '@/routes';

let isHandlingExpiredSession = false;

type AuthErrorResponse = {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: unknown;
  error_code?: string;
};

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const getResponsePayload = async (
  response: Response,
): Promise<AuthErrorResponse | null> => {
  try {
    return (await response.clone().json()) as AuthErrorResponse;
  } catch {
    return null;
  }
};

export const handleExpiredSession = async () => {
  if (typeof window === 'undefined') return;

  if (isHandlingExpiredSession) return;

  isHandlingExpiredSession = true;

  console.warn('[authFetch] Handling expired session.');

  toast.error('Your session has expired. Please sign in again.', {
    toastId: 'session-expired',
  });

  try {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[authFetch] Failed to sign out cleanly:', error);
    }

    await wait(1000);

    window.location.replace(AUTH_ROUTES.LOGIN);
  } finally {
    isHandlingExpiredSession = false;
  }
};

export const authFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  const request_url = typeof input === 'string' ? input : input.toString();

  console.log('[authFetch] Request started:', request_url);

  let response: Response;

  try {
    response = await fetch(input, init);
  } catch (error) {
    console.error('[authFetch] Network request failed:', error);

    toast.error('Network error. Please check your connection and try again.', {
      toastId: 'network-request-failed',
    });

    throw error;
  }

  console.log('[authFetch] Response received:', {
    url: request_url,
    status: response.status,
    ok: response.ok,
    isHandlingExpiredSession,
  });

  const result = await getResponsePayload(response);
  const error_code = result?.error_code;

  if (response.status === 401) {
    console.warn('[authFetch] 401 detected.', {
      error_code,
      message: result?.message,
    });

    if (error_code === 'SESSION_EXPIRED' || error_code === 'AUTH_REQUIRED') {
      await handleExpiredSession();
    }

    return response;
  }

  if (response.status === 503 && error_code === 'AUTH_SERVICE_UNAVAILABLE') {
    console.warn('[authFetch] Auth service unavailable.', {
      error_code,
      message: result?.message,
    });

    toast.error(
      result?.message ||
        'Authentication service is temporarily unavailable. Please try again.',
      {
        toastId: 'auth-service-unavailable',
      },
    );

    return response;
  }

  return response;
};