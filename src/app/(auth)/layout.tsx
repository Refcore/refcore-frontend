import CompanyLogo from '@/components/shared/CompanyLogo';
import Image from 'next/image';
import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="min-h-screen relative bg-background py-6 custom-scrollbar flex flex-col justify-center items-center">
      <CompanyLogo />
      <main className='z-1'>{children}</main>

      <div className="absolute bg-black/20 top-0 right-0 opacity-15 h-full w-full rotate-180">
        <Image
          src={'/svg/bbblurry.svg'}
          className="pointer-events-none h-full w-full object-cover select-none"
          alt=""
          fill
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_top,transparent_0%,transparent_45%,rgba(10,10,15,0.35)_70%,rgba(10,10,15,0.75)_88%,#0a0a0f_100%)]" />
      </div>
      {/* <div className="absolute bg-black/20 top-0 right-0 lg:opacity-2 opacity-2 h-full w-full rotate-180">
        <Image
          src={'/svg/wwwhirl.svg'}
          className="pointer-events-none h-full w-full object-cover select-none"
          alt=""
          fill
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_top,transparent_0%,transparent_45%,rgba(10,10,15,0.35)_70%,rgba(10,10,15,0.75)_88%,#0a0a0f_100%)]" />
      </div> */}
    </section>
  );
}
