'use client';

import { useEffect } from 'react';
import { AdminGuard } from '@/components/admin/guard';
import { useAdminRole } from '@/hooks/use-admin-role';

export default function AdminLayout({
children,
}: {
children: React.ReactNode;
}) {
const { userRole, isSuperAdmin } = useAdminRole();

useEffect(() => {
if (userRole) {
document.documentElement.setAttribute(
'data-user-role',
userRole
);
}


document.documentElement.setAttribute(
  'data-is-super-admin',
  isSuperAdmin.toString()
);

}, [userRole, isSuperAdmin]);

return ( <AdminGuard
   userRole={userRole}
   isSuperAdmin={isSuperAdmin}
 >
{children} </AdminGuard>
);
}
