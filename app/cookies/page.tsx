import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Cookie Policy',
  description: 'How Salesway Consulting uses cookies on its website.',
};

export default function CookiesPage() {
  return (
    <main className="pt-16">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">Legal</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Cookie Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
          <div className="prose-content mt-8">
            <p>This cookie policy explains how Salesway Consulting uses cookies and similar technologies on our website.</p>
            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us understand how you use our site and improve your experience.</p>
            <h2>Types of Cookies We Use</h2>
            <ul>
              <li><strong>Essential cookies:</strong> Required for the website to function properly.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site.</li>
              <li><strong>Preference cookies:</strong> Remember your settings, such as theme preference.</li>
            </ul>
            <h2>Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings. Disabling cookies may affect some features of our website.</p>
            <h2>Contact</h2>
            <p>For questions about our cookie policy, contact us at cuteblueinteriors@gmail.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
