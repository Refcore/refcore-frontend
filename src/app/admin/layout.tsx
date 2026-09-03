'use client';

import MobileNav from '@/components/admin/MobileNav';
import Sidebar from '@/components/admin/Sidebar';
import { useEffect, type ReactNode } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import Loadingscreen from '@/components/ui/Loadingscreen';
import { useAdminLoading } from '@/hooks/admin/useAdminLoading';
import { AUTH_ROUTES } from '@/routes';
import { useRouter } from 'next/navigation';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: DashboardLayoutProps) {
  const {
    authUser,
    registrationStatus,
    // isRegistrationComplete,
    isLoading,
  } = useAuthContext();

  const { isLoading: adminLoading } = useAdminLoading();

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    switch (registrationStatus) {
      case 'unauthenticated':
        router.replace(AUTH_ROUTES.LOGIN);
        break;

      case 'email_unverified':
        router.replace(AUTH_ROUTES.VERIFICATION_EMAIL_SENT);
        break;

      case 'channel_required':
        router.replace(AUTH_ROUTES.REGISTER);
        break;

      case 'whatsapp_unverified':
        // router.replace(AUTH_ROUTES.REGISTER);
        break;

      case 'complete':
        break;
    }
  }, [isLoading, registrationStatus, router]);

  if (
    isLoading ||
    adminLoading ||
    !authUser
    //  || !isRegistrationComplete
  ) {
    return <Loadingscreen />;
  }

  return (
    <section className="relative flex min-h-screen flex-col bg-background custom-scrollbar lg:flex-row">
      <Sidebar />
      <MobileNav />

      <div className="flex-1">{children}</div>
    </section>
  );
}