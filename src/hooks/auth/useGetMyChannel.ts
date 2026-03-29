import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { useAuthContext } from '@/context/AuthContext';
import { MyChannel } from '@/types/channel.type';

const getMyChannel = async (user_id: string): Promise<MyChannel | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('channels')
    .select(
      `
        id,
        owner_id,
        tv_name,
        slug,
        whatsapp_number,
        whatsapp_verified,
        whatsapp_verified_at,
        status,
        created_at,
        updated_at,
        channel_members_limit
      `,
    )
    .eq('owner_id', user_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useGetMyChannel = () => {
  const { authUser, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.channels.myChannel(authUser?.id),
    queryFn: () => getMyChannel(authUser!.id),
    enabled: isAuthenticated && !!authUser?.id && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
  });
};