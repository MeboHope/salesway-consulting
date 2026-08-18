'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
};

const fallbackCaseStudies: CaseStudy[] = [];

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(
    fallbackCaseStudies
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaseStudies = async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select(
          `
            id,
            title,
            slug,
            client,
            industry,
            challenge,
            solution,
            results,
            metrics,
            is_published,
            is_featured,
            created_at
          `
        )
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading case studies:', error);
        setCaseStudies(fallbackCaseStudies);
      } else {
        setCaseStudies((data || []) as CaseStudy[]);
      }

      setLoading(false);
    };

    loadCaseStudies();
  }, []);

  const featured = caseStudies.filter(
    (caseStudy) => caseStudy.is_featured
  );

  const regular = caseStudies.filter(
    (caseStudy) => !caseStudy.is_featured
  );

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent"
          >
            Case Studies
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Real businesses.
            <span className="text-accent"> Real results.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Explore how we help businesses improve sales, strengthen
            operations, sharpen their strategy, and build sustainable growth.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : caseStudies.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BriefcaseBusiness className="h-14 w-14 text-muted-foreground/40" />

                <h2 className="mt-5 font-display text-xl font-semibold">
                  Case studies coming soon
                </h2>

                <p className="mt-2 max-w-md text-muted-foreground">
                  We are preparing detailed stories showing how Salesway
                  Consulting helps businesses achieve measurable growth.
                </p>

                <Link href="/book" className="mt-6">
                  <Button className="gap-2">
                    Book a Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-16">
              {/* Featured */}
              {featured.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                      Featured Results
                    </Badge>

                    <h2 className="mt-3 font-display text-3xl font-bold">
                      Success stories worth exploring
                    </h2>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    {featured.map((caseStudy) => (
                      <CaseStudyCard
                        key={caseStudy.id}
                        caseStudy={caseStudy}
                        featured
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular */}
              {regular.length > 0 && (
                <div className="space-y-6">
                  {featured.length > 0 && (
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-accent/10 text-accent"
                      >
                        More Success Stories
                      </Badge>
                    </div>
                  )}

                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {regular.map((caseStudy) => (
                      <CaseStudyCard
                        key={caseStudy.id}
                        caseStudy={caseStudy}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-20">
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Target className="mx-auto h-10 w-10 text-accent" />

          <h2 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to create your own success story?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Let's identify the opportunities in your business and build a
            practical roadmap for measurable growth.
          </p>

          <Link href="/book" className="mt-8 inline-block">
            <Button
              size="lg"
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Book a Strategy Call
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

function CaseStudyCard({
  caseStudy,
  featured = false,
}: {
  caseStudy: CaseStudy;
  featured?: boolean;
}) {
  return (
    <Card
      className={`group overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? 'lg:flex lg:flex-col' : ''
      }`}
    >
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-7 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <BarChart3 className="h-6 w-6" />
            </div>

            {caseStudy.is_featured && (
              <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                Featured
              </Badge>
            )}
          </div>

          <p className="mt-6 text-sm font-medium text-white/70">
            {caseStudy.industry}
          </p>

          <h2
            className={`mt-2 font-display font-bold ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            {caseStudy.title}
          </h2>

          <p className="mt-2 text-sm text-white/70">
            {caseStudy.client}
          </p>
        </div>

        <div className="space-y-5 p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Challenge
            </p>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {caseStudy.challenge}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Results
            </p>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {caseStudy.results}
            </p>
          </div>

          {caseStudy.metrics && (
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Key Metrics
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {caseStudy.metrics}
              </p>
            </div>
          )}

          <Link
            href={`/case-studies/${caseStudy.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            Read full case study
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}