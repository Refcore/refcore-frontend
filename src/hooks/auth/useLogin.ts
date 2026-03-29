import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { LoginFormData } from '@/schema/login.schema';
import { queryKeys } from '@/lib/query_keys';

type LoginResponseData = {
  user_id: string;
  email: string;
};

type AppResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
  error_code?: string;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const login = async (
    payload: LoginFormData,
  ): Promise<AppResponse<LoginResponseData>> => {
    const supabase = createClient();
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        return {
          success: false,
          status_code: 401,
          message: error.message,
          data: null,
          error_code: error.code,
        };
      }

      if (!data.user) {
        return {
          success: false,
          status_code: 500,
          message: 'Unable to log in user.',
          data: null,
        };
      }

      await queryClient.refetchQueries({
        queryKey: queryKeys.auth.currentUser,
      });

      return {
        success: true,
        status_code: 200,
        message: 'Login successful.',
        data: {
          user_id: data.user.id,
          email: data.user.email ?? payload.email,
        },
      };
    } catch {
      return {
        success: false,
        status_code: 500,
        message: 'Something went wrong while logging in.',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
  };
};
