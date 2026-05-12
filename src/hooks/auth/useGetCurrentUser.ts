import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { User } from '@/model/user.model';
import { AppResponse } from '@/types/response.type';

type CurrentUserResponse = {
  auth_user: {
    id: string;
    email: string | null;
  };
  profile: User | null;
};

const getCurrentUser = async (): Promise<CurrentUserResponse | null> => {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session?.access_token) {
    return null;
  }

  const response = await fetch('/api/auth/current-user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result =
    (await response.json()) as AppResponse<CurrentUserResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to fetch current user.');
  }

  return result.data;
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });
};