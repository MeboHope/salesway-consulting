import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { supabase } from '@/lib/supabase';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

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

async function getCaseStudy(slug: string) {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Error loading case study:', error);
    return null;
  }

  return data as CaseStudy | null;
}

export default async function CaseStudyDetailPage({
  params,
}: Params) {
  const { slug } = await params;

  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-transparent py-20">
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Case Studies
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              {caseStudy.industry}
            </Badge>

            {caseStudy.is_featured && (
              <Badge
                variant="secondary"
                className="bg-accent/10 text-accent"
              >
                Featured Case Study
              </Badge>
            )}
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {caseStudy.title}
          </h1>

          <p className="mt-5 text-lg text-muted-foreground">
            Client:{' '}
            <span className="font-semibold text-foreground">
              {caseStudy.client}
            </span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <ContentSection
                icon={<Target className="h-5 w-5" />}
                title="The Challenge"
                content={caseStudy.challenge}
              />

              <ContentSection
                icon={<BarChart3 className="h-5 w-5" />}
                title="The Solution"
                content={caseStudy.solution}
              />

              <ContentSection
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="The Results"
                content={caseStudy.results}
              />

              {caseStudy.metrics && (
                <Card className="border-border/60 bg-primary text-white shadow-lg">
                  <CardContent className="p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Key Metrics
                    </p>

                    <p className="mt-3 text-lg font-semibold leading-8">
                      {caseStudy.metrics}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <BarChart3 className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 font-display text-xl font-bold">
                    The Outcome
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    A practical engagement focused on measurable business
                    improvement and sustainable growth.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm">
                        Tailored business strategy
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm">
                        Practical implementation
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm">
                        Measurable results
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-gradient-to-br from-primary to-primary/90 text-white">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold">
                    Want similar results?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/75">
                    Let's discuss the opportunities in your business.
                  </p>

                  <Link href="/book" className="mt-6 block">
                    <Button
                      className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Book a Consultation
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContentSection({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <h2 className="font-display text-2xl font-bold">
          {title}
        </h2>
      </div>

      <p className="mt-5 whitespace-pre-line text-base leading-8 text-muted-foreground">
        {content}
      </p>
    </section>
  );
}