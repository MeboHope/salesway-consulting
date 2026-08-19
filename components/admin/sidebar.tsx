'use client';

import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import { useAuth } from '@/lib/auth-context';

import {
  LayoutDashboard,
  FileText,
  Download,
  Star,
  HelpCircle,
  Briefcase,
  CalendarCheck,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { useState } from 'react';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/posts',
    label: 'Blog Posts',
    icon: FileText,
  },
  {
    href: '/admin/services',
    label: 'Services',
    icon: Briefcase,
  },
  {
    href: '/admin/resources',
    label: 'Resources',
    icon: Download,
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    icon: Star,
  },
  {
    href: '/admin/faqs',
    label: 'FAQs',
    icon: HelpCircle,
  },
  {
    href: '/admin/consultations',
    label: 'Consultations',
    icon: CalendarCheck,
  },
  {
    href: '/admin/contact-messages',
    label: 'Contact Messages',
    icon: Mail,
  },
  {
    href: '/admin/subscribers',
    label: 'Subscribers',
    icon: Mail,
  },
  {
    href: '/admin/job-applications',
    label: 'Job Applications',
    icon: FileText,
  },
  {
    href: '/admin/case-studies',
    label: 'Case Studies',
    icon: Briefcase,
  },
  {
    href: '/admin/team',
    label: 'Team',
    icon: Users,
  },
  {
    href: '/admin/clients',
    label: 'Clients',
    icon: Star,
  },
  {
    href: '/admin/pricing',
    label: 'Pricing',
    icon: Download,
  },
  {
    href: '/admin/careers',
    label: 'Careers',
    icon: Briefcase,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    href: '/admin/admins',
    label: 'Admin Management',
    icon: Shield,
    superAdminOnly: true,
  },
];

export function AdminSidebar({
  userRole = 'admin',
  isSuperAdmin = false,
}: {
  userRole?: string;
  isSuperAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { signOut } = useAuth();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const sidebar = (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-primary/10 bg-white/95 shadow-sm backdrop-blur-sm">

      <div className="flex h-16 shrink-0 items-center border-b border-primary/10 px-5">

        <Link
          href="/admin"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold shadow-md">
            S
          </div>

          <span className="font-display font-bold text-primary">
            Salesway Admin
          </span>
        </Link>

      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">

        {navItems
          .filter(
            (item) =>
              !item.superAdminOnly ||
              isSuperAdmin
          )
          .map((item) => {

            const isActive =
              pathname === item.href ||
              (
                item.href !== '/admin' &&
                pathname.startsWith(
                  `${item.href}/`
                )
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />

                {item.label}
              </Link>
            );
          })}

      </nav>

      <div className="shrink-0 space-y-1 border-t border-primary/10 bg-primary/[0.02] p-3">

        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>

      </div>

    </aside>
  );

  return (
    <>
      <button
        onClick={() =>
          setMobileOpen(!mobileOpen)
        }
        className="fixed left-4 top-20 z-50 rounded-lg border border-primary/10 bg-white p-2 shadow-md lg:hidden"
        aria-label="Toggle admin menu"
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      <div
        className={
          mobileOpen
            ? 'block'
            : 'hidden lg:block'
        }
      >
        {sidebar}
      </div>
    </>
  );
}