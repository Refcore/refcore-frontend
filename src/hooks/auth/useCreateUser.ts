import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import type { RegisterAccountFormData } from '@/schema/register.schema';
import { AppResponse } from '@/types/response.type';

type CreateUserResponseData = {
  user_id: string;
  email: string;
};

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const createUser = async (
    payload: RegisterAccountFormData,
  ): Promise<AppResponse<CreateUserResponseData>> => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result =
        (await response.json()) as AppResponse<CreateUserResponseData>;

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Unable to create user account.');
        return result;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (signInError) {
        toast.error(
          'Account created, but automatic sign in failed. Please sign in manually.',
        );

        return {
          ...result,
          success: false,
          status_code: 401,
          message:
            'Account created, but automatic sign in failed. Please sign in manually.',
          error_code: signInError.code,
        };
      }

      toast.success(result.message || 'User created successfully.');

      return result;
    } catch {
      const errorResponse: AppResponse<CreateUserResponseData> = {
        success: false,
        status_code: 500,
        message: 'Something went wrong while creating the account.',
        data: null,
      };

      toast.error(errorResponse.message);

      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createUser,
  };
};