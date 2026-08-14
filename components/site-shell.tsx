'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';

export function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [transitionKey, setTransitionKey] = useState(pathname);

  useEffect(() => {
    setTransitionKey(pathname);
  }, [pathname]);

  /*
   * Admin pages have their own layout/sidebar.
   * Do NOT wrap them with the public Navbar,
   * Footer or WhatsApp button.
   */
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div
        key={transitionKey}
        className="page-transition-shell"
      >
        {children}
      </div>

      <Footer />

      <WhatsAppButton />
    </>
  );
}