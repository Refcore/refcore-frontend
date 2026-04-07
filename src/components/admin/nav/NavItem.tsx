'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavConfigItem } from './navConfig';

type NavItemProps = {
  item: NavConfigItem;
};

const NavItem = ({ item }: NavItemProps) => {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    item.href === '/admin'
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center justify-between gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-green-400/10 shadow-sm lg:border-l-3 lg:border-green-500'
          : 'text-muted-foreground hover:bg-white/5 hover:text-white',
      )}
    >
      <div className="flex items-center gap-3">
          <Icon className="size-5" />
        <span>{item.label}</span>
      </div>

      {item.badge ? (
        <span
          className={cn(
            'flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs',
            isActive
              ? 'bg-black text-white'
              : 'bg-white/10 text-white',
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
};

export default NavItem;