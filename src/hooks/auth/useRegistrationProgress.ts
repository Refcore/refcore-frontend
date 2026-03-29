import { useMemo } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useGetMyChannel } from './useGetMyChannel';

type RegistrationProgress = {
  step: 1 | 2 | 3;
  is_registration_complete: boolean;
  is_loading: boolean;
  is_authenticated: boolean;
};

export const useRegistrationProgress = (): RegistrationProgress => {
  const { currentUser, isAuthenticated, isLoading: isLoadingUser } =
    useAuthContext();

  const { data: myChannel, isLoading: isLoadingChannel } = useGetMyChannel();

  return useMemo(() => {
    const is_loading = isLoadingUser || (isAuthenticated && isLoadingChannel);

    if (!isAuthenticated || !currentUser) {
      return {
        step: 1,
        is_registration_complete: false,
        is_loading,
        is_authenticated: false,
      };
    }

    if (!myChannel) {
      return {
        step: 2,
        is_registration_complete: false,
        is_loading,
        is_authenticated: true,
      };
    }

    if (!myChannel.whatsapp_verified) {
      return {
        step: 3,
        is_registration_complete: false,
        is_loading,
        is_authenticated: true,
      };
    }

    return {
      step: 3,
      is_registration_complete: true,
      is_loading,
      is_authenticated: true,
    };
  }, [
    currentUser,
    isAuthenticated,
    isLoadingUser,
    isLoadingChannel,
    myChannel,
  ]);
};