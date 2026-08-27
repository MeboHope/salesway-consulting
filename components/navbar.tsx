'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/team', label: 'Team' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/faq', label: 'FAQ' },
  { href: '/resources', label: 'Resources' },
  { href: '/careers', label: 'Careers' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP / MOBILE HEADER
      ====================================================== */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] w-full',
          'border-b border-slate-200',
          'bg-white',
          'transition-shadow duration-200',
          scrolled
            ? 'shadow-md'
            : 'shadow-sm'
        )}
      >
        <nav
          className="
            mx-auto
            flex
            h-16
            w-full
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
          aria-label="Main navigation"
        >
          {/* =================================================
              LOGO
          ================================================== */}
          <Link
            href="/"
            onClick={closeMenu}
            className="
              group
              flex
              shrink-0
              items-center
              gap-2.5
              rounded-md
              outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary
                text-lg
                font-bold
                text-primary-foreground
                shadow-md
                transition-transform
                duration-200
                group-hover:scale-105
              "
            >
              S
            </div>

            <span
              className="
                whitespace-nowrap
                font-display
                text-base
                font-bold
                tracking-tight
                text-slate-900
                sm:text-lg
              "
            >
              Salesway
              <span className="text-accent">
                {' '}
                Consulting
              </span>
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}
          <div
            className="
              hidden
              items-center
              gap-0.5
              xl:flex
            "
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    `
                      whitespace-nowrap
                      rounded-md
                      px-2.5
                      py-2
                      text-sm
                      font-medium
                      transition-colors
                      duration-150
                      outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                      focus-visible:ring-offset-2
                    `,
                    active
                      ? `
                        bg-primary/5
                        text-primary
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-100
                        hover:text-primary
                      `
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Desktop CTA */}
            <Link
              href="/book"
              className="hidden 2xl:block"
            >
              <Button
                size="sm"
                className="
                  gap-1.5
                  whitespace-nowrap
                "
              >
                Book a Strategy Call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() =>
                setIsOpen((open) => !open)
              }
              className="
                inline-flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-800
                shadow-sm
                transition-colors
                hover:bg-slate-50
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-offset-2
                xl:hidden
              "
              aria-label={
                isOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="
            fixed
            inset-0
            z-[90]
            bg-slate-950/50
            backdrop-blur-[2px]
            xl:hidden
          "
        />
      )}

      {/* =====================================================
          MOBILE NAVIGATION DRAWER
      ====================================================== */}
      <div
        id="mobile-navigation"
        className={cn(
          `
            fixed
            inset-x-0
            top-16
            z-[95]
            border-b
            border-slate-200
            bg-white
            shadow-2xl
            xl:hidden
          `,
          'max-h-[calc(100vh-4rem)]',
          'overflow-y-auto',
          'overscroll-contain'
        )}
        aria-hidden={!isOpen}
        style={{
          display: isOpen
            ? 'block'
            : 'none',
        }}
      >
        <div
          className="
            mx-auto
            w-full
            max-w-2xl
            px-4
            py-4
            sm:px-6
          "
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    `
                      flex
                      min-h-11
                      w-full
                      items-center
                      rounded-lg
                      px-4
                      py-3
                      text-base
                      font-medium
                      transition-colors
                      outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                      focus-visible:ring-inset
                    `,
                    active
                      ? `
                        bg-primary
                        text-primary-foreground
                      `
                      : `
                        text-slate-700
                        hover:bg-slate-100
                        hover:text-primary
                      `
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="border-t border-slate-200 pt-4">
            <Link
              href="/book"
              onClick={closeMenu}
              className="block"
            >
              <Button
                size="lg"
                className="
                  w-full
                  justify-center
                  gap-2
                "
              >
                Book a Strategy Call
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}