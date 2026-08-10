'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type PricingPackage = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  is_popular: boolean;
  is_published: boolean;
  order: number;
};

export default function PricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const { data } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setPackages(data || []);
    setLoading(false);
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Pricing
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Simple, transparent <span className="text-accent">pricing</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Choose the package that fits your business needs. All packages
            include our hands-on implementation approach.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading pricing...</div>
          ) : packages.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <DollarSign className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No pricing packages published yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">Contact us for custom pricing.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`border-border/60 bg-card relative ${
                    pkg.is_popular ? 'border-primary/50 shadow-lg' : ''
                  }`}
                >
                  {pkg.is_popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                        <span className="text-muted-foreground">/{pkg.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full gap-2" asChild>
                      <a href="/book">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Pricing */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Need a custom solution?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every business is unique. Let's discuss a tailored package for your
            specific needs.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="gap-2" asChild>
              <a href="/book">
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="/contact">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What is included in each package?',
                a: 'All packages include our hands-on implementation approach, strategy development, and ongoing support. The difference lies in scope, duration, and level of involvement.'
              },
              {
                q: 'Can I upgrade or downgrade my package?',
                a: 'Yes, we offer flexibility to adjust your package based on your evolving needs. Contact us to discuss changes.'
              },
              {
                q: 'Do you offer custom pricing for larger projects?',
                a: 'Absolutely. For enterprise clients or complex projects, we create custom proposals tailored to your specific requirements.'
              },
              {
                q: 'What payment terms do you offer?',
                a: 'We offer flexible payment terms including monthly, quarterly, or project-based billing. Details are discussed during consultation.'
              }
            ].map((faq) => (
              <Card key={faq.q} className="border-border/60">
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold text-foreground">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
