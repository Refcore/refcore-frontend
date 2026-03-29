import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { RegisterAccountFormData } from '@/schema/register.schema';

type CreateUserResponseData = {
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

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const createUser = async (
    payload: RegisterAccountFormData,
  ): Promise<AppResponse<CreateUserResponseData>> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            user_name: payload.user_name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          status_code: error.message.toLowerCase().includes('already')
            ? 409
            : 400,
          message: error.message,
          data: null,
          error_code: error.code,
        };
      }

      if (!data.user) {
        return {
          success: false,
          status_code: 500,
          message: 'Unable to create user account.',
          data: null,
        };
      }

      return {
        success: true,
        status_code: 201,
        message: 'User created successfully.',
        data: {
          user_id: data.user.id,
          email: data.user.email ?? payload.email,
        },
      };
    } catch {
      return {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the account.',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createUser,
  };
};