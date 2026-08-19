
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTHORIZED_ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_AUTHORIZED_ADMIN_EMAILS ||
  'admin@saleswayconsulting.com'
)
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter((email) => email.length > 0);

const SUPER_ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ||
  AUTHORIZED_ADMIN_EMAILS[0]
).trim().toLowerCase();

export async function proxy(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);

            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  /*
   * The login page must remain publicly accessible.
   */
  if (isLoginRoute) {
    return response;
  }

  /*
   * Ignore non-admin routes.
   */
  if (!isAdminRoute) {
    return response;
  }

  /*
   * Get the currently authenticated user.
   *
   * getUser() is preferred here because it validates
   * the authenticated user through Supabase Auth.
   */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  /*
   * No authenticated user.
   */
  if (userError || !user) {
    const redirectUrl = new URL('/admin/login', req.url);

    redirectUrl.searchParams.set(
      'redirectedFrom',
      pathname
    );

    return NextResponse.redirect(redirectUrl);
  }

  const userEmail = user.email?.trim().toLowerCase();

  /*
   * Make sure the authenticated email is authorized.
   */
  if (!userEmail || !AUTHORIZED_ADMIN_EMAILS.includes(userEmail)) {
    const redirectUrl = new URL('/admin/login', req.url);

    redirectUrl.searchParams.set('error', 'unauthorized');

    return NextResponse.redirect(redirectUrl);
  }

  /*
   * Determine the user's admin role.
   */
  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('email', userEmail)
    .maybeSingle();

  const userRole = adminRole?.role || 'admin';

  const isSuperAdmin =
    userEmail === SUPER_ADMIN_EMAIL ||
    userRole === 'super_admin';

  /*
   * Only super admins can access admin management.
   */
  const isAdminManagementRoute =
    pathname === '/admin/admins';

  if (isAdminManagementRoute && !isSuperAdmin) {
    const redirectUrl = new URL('/admin', req.url);

    redirectUrl.searchParams.set(
      'error',
      'insufficient_permissions'
    );

    return NextResponse.redirect(redirectUrl);
  }

  /*
   * Make role information available to the client.
   */
  response.headers.set('x-user-role', userRole);
  response.headers.set(
    'x-is-super-admin',
    isSuperAdmin.toString()
  );

  response.cookies.set('user-role', userRole, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  });

  response.cookies.set(
    'is-super-admin',
    isSuperAdmin.toString(),
    {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    }
  );

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};

