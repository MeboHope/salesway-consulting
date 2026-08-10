'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, BarChart3, Target, Users, Award } from 'lucide-react';
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

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    const { data } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    setCaseStudies(data || []);
    setLoading(false);
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Case Studies
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Real results for <span className="text-accent">real businesses</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            See how we've helped companies across industries achieve measurable
            growth and transform their sales operations.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: TrendingUp, value: '40%', label: 'Avg. sales growth' },
              { icon: Users, value: '120+', label: 'Businesses served' },
              { icon: Award, value: '98%', label: 'Client satisfaction' },
              { icon: BarChart3, value: '12+', label: 'Industries' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-8 w-8 text-primary" />
                <div className="mt-2 text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading case studies...</div>
          ) : caseStudies.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No case studies published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <Card key={study.id} className="border-border/60 bg-card overflow-hidden group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{study.industry}</Badge>
                      {study.is_featured && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{study.client}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{study.challenge}</p>
                    <div className="pt-4 border-t border-border/60">
                      <p className="text-sm font-semibold text-primary">{study.metrics}</p>
                    </div>
                    <Link href={`/case-studies/${study.slug}`}>
                      <Button variant="ghost" className="gap-2 w-full group-hover:bg-primary/10">
                        Read Case Study
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to be our next success story?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let's discuss how we can help your business achieve similar results.
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
    </main>
  );
}
