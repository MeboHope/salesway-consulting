'use client';

import Link from 'next/link';
import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = {
  company: [
    { href: '/#about', label: 'About Us' },
    { href: '/#services', label: 'Services' },
    { href: '/blog', label: 'Business Insights Blog' },
    { href: '/#resources', label: 'Resources' },
    { href: '/#contact', label: 'Contact' },
  ],
  services: [
    { href: '/services#sales-strategy-growth', label: 'Sales Strategy & Growth' },
    { href: '/services#business-strategy-positioning', label: 'Business Strategy' },
    { href: '/services#marketing-that-feeds-sales', label: 'Marketing That Feeds Sales' },
    { href: '/services#growth-coaching', label: 'Growth Coaching' },
    { href: '/services#corporate-training', label: 'Corporate Training' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'X (Twitter)' },
];

export function Footer() {
  return (
    <footer className="border-t border-border site-footer-solid">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg">
                S
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Salesway<span className="text-accent"> Consulting</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Helping businesses grow smarter, sell better, and scale faster.
              We work <em>with</em> you, not just <em>for</em> you — staying
              alongside you until measurable growth is achieved.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                cuteblueinteriors@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                +254 750 481 060
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Nairobi, Kenya
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Practical growth strategies, straight to your inbox.
            </p>
            <form className="mt-4 flex gap-2" action="/api/newsletter" method="POST">
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                className="flex-1"
                required
              />
              <Button type="submit" size="icon" aria-label="Subscribe">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <a
              href="https://wa.me/254750481060"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Salesway Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="text-sm text-muted-foreground/60 transition-colors hover:text-primary"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
