// import RequireWhatsappVerified from '@/components/auth/RequireWhatsappVerified';
import MobileNav from '@/components/admin/MobileNav';
import Sidebar from '@/components/admin/Sidebar';
import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="min-h-screen relative bg-background custom-scrollbar flex flex-col lg:flex-row">
      {/* <RequireWhatsappVerified>{children}</RequireWhatsappVerified> */}
      <Sidebar />
      <MobileNav/>
      <div className="flex-1"> {children}</div>
    </section>
  );
}
