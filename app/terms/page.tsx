import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'The terms and conditions for using Salesway Consulting services.',
};

export default function TermsPage() {
  return (
    <main className="pt-16">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">Legal</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
          <div className="prose-content mt-8">
            <p>By accessing and using the Salesway Consulting website, you agree to be bound by these terms and conditions.</p>
            <h2>Use of Our Website</h2>
            <p>You may use our website for lawful purposes only. You must not misuse the site by introducing viruses, attempting unauthorized access, or engaging in any activity that disrupts the website.</p>
            <h2>Consulting Services</h2>
            <p>Our consulting services are provided under separate engagement agreements. The content on this website is for informational purposes and does not constitute professional advice until a formal engagement is established.</p>
            <h2>Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and resources, is the property of Salesway Consulting unless otherwise stated. You may not reproduce or distribute it without written permission.</p>
            <h2>Limitation of Liability</h2>
            <p>Salesway Consulting shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services.</p>
            <h2>Contact</h2>
            <p>For questions about these terms, contact us at cuteblueinteriors@gmail.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
