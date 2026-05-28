'use client';

// import RequireWhatsappVerified from '@/components/auth/RequireWhatsappVerified';
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
  const { isLoading, authUser } = useAuthContext();
  const { isLoading: adminloading } = useAdminLoading();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.replace(AUTH_ROUTES.LOGIN);
    }
  }, [isLoading, authUser, router]);

  if (isLoading || adminloading || !authUser) {
    return <Loadingscreen />;
  }

  return (
    <section className="min-h-screen relative bg-background custom-scrollbar flex flex-col lg:flex-row">
      {/* <RequireWhatsappVerified>{children}</RequireWhatsappVerified> */}
      <Sidebar />
      <MobileNav />
      <div className="flex-1"> {children}</div>
    </section>
  );
}
