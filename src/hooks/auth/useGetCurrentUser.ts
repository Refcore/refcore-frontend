import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { User } from '@/model/user.model';

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
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError && profileError.code !== 'PGRST116') {
    throw new Error(profileError.message);
  }

  return {
    auth_user: {
      id: user.id,
      email: user.email ?? null,
    },
    profile: profile ?? null,
  };
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });
};