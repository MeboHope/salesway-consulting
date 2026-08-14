'use client';

import { useState, useEffect } from 'react';

export function useAdminRole() {
  const [userRole, setUserRole] = useState('admin');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const cookies = document.cookie.split('; ');

      const cookie = cookies.find((row) =>
        row.startsWith(`${name}=`)
      );

      return cookie
        ? decodeURIComponent(cookie.split('=')[1])
        : null;
    };

    const roleCookie = getCookie('user-role');
    const superAdminCookie = getCookie('is-super-admin');

    if (roleCookie) {
      setUserRole(roleCookie);
    }

    if (superAdminCookie) {
      setIsSuperAdmin(superAdminCookie === 'true');
    }

    const roleAttr =
      document.documentElement.getAttribute(
        'data-user-role'
      );

    const superAdminAttr =
      document.documentElement.getAttribute(
        'data-is-super-admin'
      );

    if (roleAttr && !roleCookie) {
      setUserRole(roleAttr);
    }

    if (superAdminAttr && !superAdminCookie) {
      setIsSuperAdmin(
        superAdminAttr === 'true'
      );
    }
  }, []);

  return {
    userRole,
    isSuperAdmin,
  };
}
