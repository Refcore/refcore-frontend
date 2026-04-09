'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavConfigItem } from './navConfig';

type NavItemProps = {
  item: NavConfigItem;
};

const NavItem = ({ item }: NavItemProps) => {
  const pathname = usePathname();
  const Icon = item.icon;

  const hasChildren = Boolean(item.children?.length);

  const isParentActive =
    item.href === '/admin'
      ? pathname === item.href
      : pathname.startsWith(item.href);

  const isChildActive =
    item.children?.some((child) => pathname === child.href) ?? false;

  const isActive = isParentActive || isChildActive;

  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive && hasChildren) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, [isActive, hasChildren]);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'group flex items-center justify-between gap-3 rounded px-4 py-3 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-(--neon-green)/10 text-white shadow-sm lg:border-l-[3px] lg:border-(--neon-green)/50'
            : 'text-muted-foreground hover:bg-white/5 hover:text-white',
        )}
      >
        <Link
          href={item.href}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Icon className="size-5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>

        <div className="flex items-center gap-2">
          {item.badge ? (
            <span
              className={cn(
                'flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs',
                isActive ? 'bg-black text-white' : 'bg-white/10 text-white',
              )}
            >
              {item.badge}
            </span>
          ) : null}

          {hasChildren ? (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center justify-center rounded-xl p-1 hover:bg-white/10"
              aria-label={
                isOpen ? `Collapse ${item.label}` : `Expand ${item.label}`
              }
              aria-expanded={isOpen}
            >
              <ChevronDown
                className={cn(
                  'size-4 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
          ) : null}
        </div>
      </div>

      {hasChildren && isOpen ? (
        <div className="ml-4 space-y-1 border-l border-white/10 pl-4">
          {item.children?.map((child) => {
            const isNestedActive = pathname === child.href;

            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'block rounded px-3 py-2 text-sm transition-colors duration-200',
                  isNestedActive
                    ? 'bg-white/10 text-white'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white',
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
