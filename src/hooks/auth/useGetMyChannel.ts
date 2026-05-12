import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { useAuthContext } from '@/context/AuthContext';
import { MyChannel } from '@/types/channel.type';
import { AppResponse } from '@/types/response.type';

const getMyChannel = async (): Promise<MyChannel | null> => {
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

  const response = await fetch('/api/channels/my-channel', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result = (await response.json()) as AppResponse<MyChannel | null>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to fetch channel.');
  }

  return result.data;
};

export const useGetMyChannel = () => {
  const {
    authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.channels.myChannel(authUser?.id),
    queryFn: getMyChannel,
    enabled: isAuthenticated && !!authUser?.id && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });
};
