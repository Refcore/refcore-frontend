import { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function EditLayout({ children }: DashboardLayoutProps) {
  return <div className="flex-1"> {children}</div>;
}
