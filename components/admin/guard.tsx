'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from '@/components/admin/sidebar';

export function AdminGuard({
children,
userRole = 'admin',
isSuperAdmin = false,
}: {
children: React.ReactNode;
userRole?: string;
isSuperAdmin?: boolean;
}) {
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
return ( <div className="flex min-h-screen items-center justify-center bg-primary/[0.04]"> <div className="animate-pulse text-muted-foreground">
Loading... </div> </div>
);
}

if (isLogin) {
return <>{children}</>;
}

if (!user) {
return null;
}

return ( <div className="min-h-screen bg-primary/[0.05]"> <div className="flex min-h-screen"> <AdminSidebar
       userRole={userRole}
       isSuperAdmin={isSuperAdmin}
     />


    <main className="min-w-0 flex-1 lg:ml-64">
      <div className="px-4 py-4">
        {children}
      </div>
    </main>
  </div>
</div>

);
}
