'use client';

import { AUTH_ROUTES } from '@/routes';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';


export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [is_logging_out, setIsLoggingOut] = useState(false);

  const logout = async () => {
    try {
      setIsLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message || 'Failed to log out');
        return;
      }

      queryClient.removeQueries({
        queryKey: queryKeys.auth.currentUser,
      });

      toast.success('Logged out successfully');
      router.replace(AUTH_ROUTES.LOGIN);
      router.refresh();
    } catch {
      toast.error('Something went wrong while logging out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    is_logging_out,
  };
};