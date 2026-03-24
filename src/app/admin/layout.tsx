import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="min-h-screen bg-background custom-scrollbar">
      <main>{children}</main>
    </section>
  );
}
