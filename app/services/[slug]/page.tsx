import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { supabase } from '@/lib/supabase';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

type Service = {
  title: string;
  slug: string;
  summary: string;
  details: string | null;
  icon: string | null;
  features: string[] | null;
  is_published: boolean;
};

async function getService(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select(
      'title, slug, summary, details, icon, features, is_published'
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Error loading service:', error);
    return null;
  }

  return data as Service | null;
}

export default async function ServiceDetailPage({
  params,
}: Params) {
  const { slug } = await params;

  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const features = service.features || [];

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-transparent py-20">
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent"
          >
            Service detail
          </Badge>

          <div className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-start">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {service.title}
              </h1>

              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {service.summary}
              </p>

              {features.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-3xl border border-border/60 bg-white/90 p-5 shadow-sm"
                    >
                      <div className="mt-1 grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <p className="text-sm font-medium text-foreground">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {service.details && (
                <div className="mt-10 rounded-[2rem] border border-border/60 bg-background/90 p-8 shadow-xl">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    More about this service
                  </h2>

                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    {service.details}
                  </p>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/book">
                  <Button className="gap-2">
                    Book a strategy call
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline" className="gap-2">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl">
                <Image
                  src="/images/a_generate_for_me_thre.jpeg"
                  alt={service.title}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>

              <Card className="rounded-[2rem] border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold">
                    What this engagement includes
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Each service is delivered with a practical focus,
                    clear milestones, and measurable outcomes.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-foreground">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      Custom assessment aligned to your business and market
                    </li>

                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      Priority roadmap with implementation guidance
                    </li>

                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      Ongoing support until new performance goals are met
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}