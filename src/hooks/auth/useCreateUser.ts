import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { RegisterAccountFormData } from '@/schema/register.schema';
import type { AppResponse } from '@/types/response.type';

type CreateUserResponseData = {
  user_id: string;
  email: string;
};

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createUser = async (
    payload: RegisterAccountFormData,
    redirectTo?: string,
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

      toast.success(
        result.message ||
          'Account created. Please check your email to verify your account.',
      );

      if (redirectTo) {
        router.push(redirectTo);
      }

      return result;
    } catch (error) {
      console.error('Create user hook error:', error);

      const errorResponse: AppResponse<CreateUserResponseData> = {
        success: false,
        status_code: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while creating the user.',
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
