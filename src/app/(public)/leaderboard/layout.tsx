import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function LeaderboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="min-h-screen bg-background custom-scrollbar">
      <main>{children}</main>
    </section>
  );
}
