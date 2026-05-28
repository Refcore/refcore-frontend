import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { AUTH_ROUTES } from '@/routes';

let isHandlingExpiredSession = false;

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

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
  console.log('[authFetch] Request started:', input);

  const response = await fetch(input, init);

  console.log('[authFetch] Response received:', {
    url: typeof input === 'string' ? input : input.toString(),
    status: response.status,
    ok: response.ok,
    isHandlingExpiredSession,
  });

  if (response.status === 401) {
    console.warn('[authFetch] 401 detected.');

    await handleExpiredSession();
  }

  return response;
};
