'use client';

import CompanyLogo from '@/components/shared/CompanyLogo';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/routes';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: DashboardLayoutProps) {
  const { isRegistrationComplete } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isRegistrationComplete) {
      router.replace(ADMIN_ROUTES.HOME);
    }
  }, [isRegistrationComplete, router]);

  if (isRegistrationComplete) {
    return null;
  }

  return (
    <section className="min-h-screen relative bg-background py-6 custom-scrollbar flex flex-col justify-center items-center">
      <CompanyLogo />
      <main className="z-1">{children}</main>

      <div className="absolute bg-black/20 top-0 right-0 opacity-15 h-full w-full rotate-180">
        <Image
          src="/svg/bbblurry.svg"
          className="pointer-events-none h-full w-full object-cover select-none"
          alt=""
          fill
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_top,transparent_0%,transparent_45%,rgba(10,10,15,0.35)_70%,rgba(10,10,15,0.75)_88%,#0a0a0f_100%)]" />
      </div>
    </section>
  );
}