'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import CompanyLogo from './CompanyLogo';
import { homelinks } from '@/consts/homelinks';
import { AUTH_ROUTES, PUBLIC_ROUTES } from '@/routes';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { useLogout } from '@/hooks/auth/useLogout';

const Navbar = ({ disablenav }: { disablenav?: boolean }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated, isLoading } = useAuthContext();
  const { logout, is_logging_out } = useLogout();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
  };

  if(isLoading){
    return
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={cn(
          'fixed top-0 z-50 w-full bg-transparent transition-all',
          scrolled && 'bg-background/80 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-20 w-full max-w-(--breakpoint-2xl) items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <CompanyLogo />

          {!disablenav && (
            <ul className="hidden md:flex items-center gap-8">
              {homelinks.map((item) => {
                if (item.link) {
                  return (
                    <li key={item.text}>
                      <Link
                        href={PUBLIC_ROUTES.LEADERBOARD}
                        className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                      >
                        {item.text}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.text}>
                    <a
                      href={`#${item.value}`}
                      className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Desktop CTA */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              {' '}
              <Button
                disabled={is_logging_out}
                onClick={handleLogout}
                className="disabled:cursor-not-allowed text-red-500"
              >
                Log Out
              </Button>
              <Button className="rounded-full px-5 py-2.5 text-sm font-semibold text-black bg-white hover:bg-gray-200 transition-all">
                Dashboard
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={AUTH_ROUTES.LOGIN}
                className="text-sm font-medium text-muted-foreground hover:text-white"
              >
                Log in
              </Link>

              <Link
                href={AUTH_ROUTES.REGISTER}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-black bg-white hover:bg-gray-200 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-screen bg-background/20 backdrop-blur-lg transition-transform duration-300',
            mobileOpen ? 'translate-y-0' : '-translate-y-full',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <CompanyLogo />

            <button onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6 px-6 py-8">
            {homelinks.map((item) => {
              if (item.link) {
                return (
                  <Link
                    key={item.text}
                    href={PUBLIC_ROUTES.LEADERBOARD}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-white"
                  >
                    {item.text}
                  </Link>
                );
              }

              return (
                <a
                  key={item.text}
                  href={`#${item.value}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-white"
                >
                  {item.text}
                </a>
              );
            })}

            {/* CTA */}
            {isAuthenticated ? (
              <div className="mt-6 flex flex-col gap-3">
                {' '}
                <Button
                  disabled={is_logging_out}
                  onClick={handleLogout}
                  className="disabled:cursor-not-allowed"
                >
                  Log Out
                </Button>
                <Button>Dashboard</Button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-sm text-muted-foreground"
                >
                  Log in
                </Link>

                <Link
                  href={AUTH_ROUTES.REGISTER}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-white text-black py-3 text-center font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
