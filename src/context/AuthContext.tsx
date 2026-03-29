'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/query_keys';
import { User } from '@/model/user.model';
import { MyChannel } from '@/types/channel.type';

type AuthUser = {
  id: string;
  email: string | null;
};

type AuthContextType = {
  authUser: AuthUser | null;
  currentUser: User | null;
  myChannel: MyChannel | null;
  isAuthenticated: boolean;
  isWhatsappVerified: boolean;
  registrationStep: 1 | 2 | 3;
  isRegistrationComplete: boolean;
  isLoading: boolean;
  isError: boolean;
  refetchAuthState: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

type CurrentUserResponse = {
  auth_user: AuthUser;
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

  if (profileError) {
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const {
    data: currentUserData,
    isLoading: isLoadingUser,
    isError: isUserError,
    refetch: refetchCurrentUser,
  } = useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: getCurrentUser,
    enabled: isMounted,
    staleTime: 1000 * 60 * 5,
  });

  const authUser = currentUserData?.auth_user ?? null;
  const currentUser = currentUserData?.profile ?? null;
  const isAuthenticated = !!authUser;

  const {
    data: myChannel,
    isLoading: isLoadingChannel,
    isError: isChannelError,
    refetch: refetchMyChannel,
  } = useQuery({
    queryKey: queryKeys.channels.myChannel(authUser?.id),
    queryFn: () => getMyChannel(authUser!.id),
    enabled: isMounted && !!authUser?.id,
    staleTime: 1000 * 60 * 5,
  });

  const value = useMemo<AuthContextType>(() => {
    const isLoading =
      !isMounted || isLoadingUser || (isAuthenticated && isLoadingChannel);

    const isWhatsappVerified = !!myChannel?.whatsapp_verified;

    let registrationStep: 1 | 2 | 3 = 1;
    let isRegistrationComplete = false;

    if (!isAuthenticated) {
      registrationStep = 1;
    } else if (!myChannel) {
      registrationStep = 2;
    } else if (!myChannel.whatsapp_verified) {
      registrationStep = 3;
    } else {
      registrationStep = 3;
      isRegistrationComplete = true;
    }

    return {
      authUser,
      currentUser,
      myChannel: myChannel ?? null,
      isAuthenticated,
      isWhatsappVerified,
      registrationStep,
      isRegistrationComplete,
      isLoading,
      isError: isUserError || isChannelError,
      refetchAuthState: () => {
        void refetchCurrentUser();
        if (authUser?.id) {
          void refetchMyChannel();
        }
      },
    };
  }, [
    isMounted,
    authUser,
    currentUser,
    myChannel,
    isAuthenticated,
    isLoadingUser,
    isLoadingChannel,
    isUserError,
    isChannelError,
    refetchCurrentUser,
    refetchMyChannel,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};