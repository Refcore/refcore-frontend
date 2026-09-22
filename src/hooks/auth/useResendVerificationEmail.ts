'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { AUTH_ROUTES } from '@/routes';

export const useResendVerificationEmail = () => {
  const [isResending, setIsResending] = useState(false);

  const resendVerificationEmail = async (email: string) => {
    try {
      setIsResending(true);

      const supabase = createClient();

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/${AUTH_ROUTES.VERIFICATION_EMAIL_SENT}`,
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Verification email sent successfully.');
      return true;
    } catch (error) {
      console.error('Resend verification email error:', error);

      toast.error('Unable to resend verification email.');
      return false;
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    resendVerificationEmail,
  };
};