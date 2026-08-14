'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Target,
  Megaphone,
  Users,
  Settings,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Phone,
  Search,
  Lightbulb,
  Rocket,
  LineChart,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  services as fallbackServices,
  processSteps,
  type Service,
} from '@/lib/data';

import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/use-reveal';
import { NewsletterForm } from '@/components/newsletter-form';

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  TrendingUp,
  Target,
  Megaphone,
  Users,
  Settings,
  GraduationCap,
  Phone,
  Search,
  Lightbulb,
  Rocket,
  LineChart,
};

type DatabaseService = {
  title: string;
  slug: string;
  summary: string;
  details: string | null;
  icon: string | null;
  features: string[] | null;
};

export default function ServicesPage() {
  useReveal();

  const [serviceList, setServiceList] =
    useState<Service[]>(fallbackServices);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select(
          'title, slug, summary, details, icon, features'
        )
        .eq('is_published', true)
        .order('created_at', {
          ascending: true,
        });

      if (!mounted) return;

      if (!error && data) {
        const databaseServices = (data as DatabaseService[]).map(
          (item) => ({
            title: item.title,
            slug: item.slug,
            summary: item.summary,
            details: item.details || '',
            icon: item.icon || 'Target',
            features: item.features || [],
          })
        );

        /*
         * The database is now the source of truth.
         *
         * If services exist in Supabase, display those services.
         * This means newly-created or edited admin services
         * automatically appear on the public website.
         */
        if (databaseServices.length > 0) {
          setServiceList(databaseServices);
        }
      }

      setLoading(false);
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent"
          >
            Our Services
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Services designed to drive{' '}
            <span className="text-accent">
              measurable growth
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Every engagement is tailored to your business,
            industry, and stage of growth. No templates, no fluff
            — just practical strategies and hands-on
            implementation that delivers real results.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/book">
              <Button size="lg" className="gap-2">
                Book a Free Strategy Call
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl">
              <Image
                src="/images/a_generate_for_me_thre.jpeg"
                alt="Strategic growth planning session"
                width={1440}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="grid gap-6">
              <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl">
                <Image
                  src="/images/b_generate_for_me_thre.png"
                  alt="Planning and growth visuals"
                  width={1440}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl">
                <Image
                  src="/images/IMG-20260804-WA0001.jpg"
                  alt="Salesway Consulting team discussion"
                  width={1440}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {serviceList.map((service, i) => {
                const Icon =
                  iconMap[service.icon] || Target;

                const isReversed = i % 2 === 1;

                return (
                  <div
                    key={service.slug}
                    id={service.slug}
                    className={`grid gap-8 lg:grid-cols-2 lg:items-center reveal ${
                      isReversed
                        ? 'lg:[direction:rtl]'
                        : ''
                    }`}
                  >
                    <div
                      className={`space-y-6 lg:[direction:ltr] ${
                        isReversed ? 'lg:order-2' : ''
                      }`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Icon className="h-7 w-7" />
                      </div>

                      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        {service.title}
                      </h2>

                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {service.summary}
                      </p>

                      {service.features.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {service.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-2.5"
                            >
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent" />
                              <span className="text-sm font-medium">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/services/${service.slug}`}
                        >
                          <Button
                            variant="outline"
                            className="gap-1.5"
                          >
                            View details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href="/book">
                          <Button
                            variant="secondary"
                            className="gap-1.5"
                          >
                            Get started
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div
                      className={`lg:[direction:ltr] ${
                        isReversed ? 'lg:order-1' : ''
                      }`}
                    >
                      <Card className="border-border/60 bg-transparent p-8">
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <h3 className="font-display font-semibold text-primary">
                              What you get
                            </h3>

                            {service.features.length > 0 ? (
                              service.features.map(
                                (feature) => (
                                  <div
                                    key={feature}
                                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4"
                                  >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                                      <CheckCircle2 className="h-4 w-4" />
                                    </div>

                                    <div>
                                      <div className="text-sm font-medium">
                                        {feature}
                                      </div>

                                      <div className="mt-0.5 text-xs text-muted-foreground">
                                        Tailored to your business
                                        context and goals.
                                      </div>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                A tailored consulting engagement
                                designed around your business goals.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary"
            >
              How We Work
            </Badge>

            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Our consulting process
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-5">
            {processSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || Phone;

              return (
                <div
                  key={step.step}
                  className="reveal relative text-center"
                  style={{
                    transitionDelay: `${i * 120}ms`,
                  }}
                >
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Icon className="h-7 w-7" />

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-md">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-base font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewsletterForm />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance reveal">
            Ready to turn strategy into sales?
          </h2>

          <p className="mt-4 text-lg text-white/80 reveal">
            Let&apos;s build a practical roadmap that drives
            measurable growth.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 reveal">
            <Link href="/book">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Schedule Your Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}