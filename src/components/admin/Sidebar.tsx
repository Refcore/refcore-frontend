'use client';

import React from 'react';
import Link from 'next/link';
import NavItem from './nav/NavItem';
import { nav_config } from './nav/navConfig';
import CompanyLogo from '../shared/CompanyLogo';
import { ADMIN_ROUTES } from '@/routes';
import AdminUser from './AdminUser';

const Sidebar = () => {
  return (
    <aside className="hidden sticky top-0 h-screen w-70 shrink-0 border-r border-white/10 bg-[#0a0a0f] px-4 py-6 lg:flex lg:flex-col">
      <Link
        href={ADMIN_ROUTES.HOME}
        className="mb-8 flex items-center gap-3 px-2"
      >
        <CompanyLogo />
      </Link>

      <nav className="flex flex-1 flex-col gap-2">
        {nav_config.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <AdminUser />
    </aside>
  );
};

export default Sidebar;
