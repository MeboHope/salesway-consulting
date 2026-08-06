'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from '@/components/admin/sidebar';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLogin) {
      router.push('/admin/login');
    }
    if (!loading && user && isLogin) {
      router.push('/admin');
    }
  }, [user, loading, pathname, router, isLogin]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
