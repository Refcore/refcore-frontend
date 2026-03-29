'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/routes';
import { useAuthContext } from '@/context/AuthContext';

type Props = {
  children: ReactNode;
};

const RequireCompletedRegistration = ({ children }: Props) => {
  const router = useRouter();
  const { isLoading, isAuthenticated, isRegistrationComplete } =
    useAuthContext();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(AUTH_ROUTES.LOGIN);
      return;
    }

    if (!isRegistrationComplete) {
      router.replace(AUTH_ROUTES.REGISTER);
    }
  }, [isLoading, isAuthenticated, isRegistrationComplete, router]);

  if (isLoading || !isAuthenticated || !isRegistrationComplete) {
    return null;
  }

  return <>{children}</>;
};

export default RequireCompletedRegistration;