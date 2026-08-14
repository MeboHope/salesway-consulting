'use client';

import { usePathname } from 'next/navigation';

import { SiteShell } from '@/components/site-shell';

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return <SiteShell>{children}</SiteShell>;
}