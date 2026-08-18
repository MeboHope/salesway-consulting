'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Quote, ArrowRight, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { supabase } from '@/lib/supabase';

type Testimonial = {
  id: string;
  client_name: string;
  client_logo_url: string | null;
  industry: string | null;
  results: string | null;
  photo_url: string | null;
  rating: number;
  quote: string;
  is_published: boolean;
  created_at: string;
};

const fallbackTestimonials: Testimonial[] = [
  {
    id: 'fallback-1',
    client_name: 'Rachel Waithera',
    client_logo_url: null,
    industry: 'Business Consulting',
    results: 'Improved sales performance and business clarity.',
    photo_url: null,
    rating: 5,
    quote:
      'Salesway Consulting helped us bring structure to our sales process and gave our team a much clearer growth direction.',
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select(
          `
            id,
            client_name,
            client_logo_url,
            industry,
            results,
            photo_url,
            rating,
            quote,
            is_published,
            created_at
          `
        )
        .eq('is_published', true)
        .order('created_at', {
          ascending: false,
        });

      if (!mounted) return;

      if (error) {
        console.error('Error loading testimonials:', error);
        setTestimonials(fallbackTestimonials);
      } else {
        setTestimonials(
          (data ?? []) as Testimonial[]
        );
      }

      setLoading(false);
    };

    loadTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary"
          >
            Client Testimonials
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            What our{' '}
            <span className="text-accent">
              clients say
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Real feedback from businesses that have
            worked with Salesway Consulting.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  className="border-border/60"
                >
                  <CardContent className="space-y-5 p-6">
                    <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-24 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-16 text-center">
                <Quote className="mx-auto h-14 w-14 text-muted-foreground/30" />

                <h2 className="mt-5 font-display text-xl font-semibold">
                  No testimonials published yet
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Check back soon for client stories.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 ${
                              index <
                              testimonial.rating
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        )
                      )}
                    </div>

                    <Quote className="mt-6 h-8 w-8 text-accent/40" />

                    <p className="mt-3 flex-1 text-base leading-7 text-muted-foreground">
                      {testimonial.quote}
                    </p>

                    {testimonial.results && (
                      <div className="mt-6 rounded-xl bg-primary/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                          Results
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {testimonial.results}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                      {testimonial.photo_url ? (
                        <img
                          src={testimonial.photo_url}
                          alt={testimonial.client_name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.client_name}
                        </p>

                        {testimonial.industry && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.industry}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to create your own success story?
          </h2>

          <p className="mt-4 text-lg text-white/80">
            Let&apos;s discuss how Salesway Consulting
            can help your business grow.
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link href="/book">
                Book a Strategy Call
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}