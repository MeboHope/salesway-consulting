import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteShell } from '@/components/site-shell';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Salesway Consulting',
  description: 'Practical sales and growth strategy for businesses in East Africa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
