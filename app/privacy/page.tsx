import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Salesway Consulting collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="pt-16">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">Legal</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
          <div className="prose-content mt-8">
            <p>At Salesway Consulting, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you visit our website or use our services.</p>
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email, phone number, and company when you fill out forms, subscribe to our newsletter, or book a consultation.</p>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To respond to your inquiries and schedule consultations</li>
              <li>To send you our newsletter and business insights (only if you opt in)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
            <h2>Data Protection</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or disclosure.</p>
            <h2>Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at cuteblueinteriors@gmail.com.</p>
            <h2>Contact Us</h2>
            <p>If you have questions about this privacy policy, please email us at cuteblueinteriors@gmail.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
