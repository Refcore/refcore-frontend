import PageHeader from '@/components/shared/PageHeader';
import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader title='Contests' description='Manage your Contests'/> {children}
    </div>
  );
}
