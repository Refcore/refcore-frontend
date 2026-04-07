'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MenuSquareIcon } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '../ui/button';
import { nav_config } from './nav/navConfig';
import NavItem from './nav/NavItem';
import AdminUser from './AdminUser';
import { usePathname } from 'next/navigation';
import CompanyLogo from '../shared/CompanyLogo';
import { ADMIN_ROUTES } from '@/routes';

const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <div className="bg-background z-1 border-b w-full sticky top-0 p-3 lg:hidden block">
        <DrawerTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <MenuSquareIcon className="size-7 " />
          </Button>
        </DrawerTrigger>
      </div>

      <DrawerContent className="h-full max-h-screen w-[85%] max-w-75 border-r-2 border-white/10 bg-[#0a0a0f] px-3 text-white">
        <DrawerHeader className="mb-4 px-0 text-left">
          <DrawerTitle asChild>
            <Link href={ADMIN_ROUTES.HOME} className="flex items-center gap-3">
              <CompanyLogo />
            </Link>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex h-full flex-col">
          <nav className="flex flex-1 flex-col">
            {nav_config.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="w-full h-15 border-gradient"></div>
            <div className="mb-3">
              <AdminUser />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;
