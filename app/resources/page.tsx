'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Download, FileText, ArrowRight, Lock, CheckCircle2, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/use-reveal';
import { fallbackResources, type ResourceSummary } from '@/lib/data';

type Resource = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  requires_email: boolean;
};

export default function ResourcesPage() {
  useReveal();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, slug, description, category, requires_email')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) {
        setResources(fallbackResources);
      } else {
        setResources((data && data.length > 0 ? data : fallbackResources) as ResourceSummary[]);
      }
      setLoading(false);
    })();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeResource) return;
    setEmailStatus('loading');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;

    await supabase.from('newsletter_subscribers').insert({
      email,
      name,
      consent: true,
      confirmed: false,
    });

    setEmailStatus('success');
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
            Free Resources
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Tools to help you{' '}
            <span className="text-accent">grow smarter</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Download our free templates, checklists, and guides. Some require
            your email — we&apos;ll send practical growth tips too.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl max-w-4xl">
            <Image
              src="/images/b_generate_for_me_thre.png"
              alt="Resource library visual"
              width={1400}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-border/60">
                  <div className="h-40 bg-muted animate-pulse" />
                  <CardContent className="pt-5 space-y-3">
                    <div className="h-4 w-20 rounded bg-secondary animate-pulse" />
                    <div className="h-5 w-full rounded bg-secondary animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-destructive">
                Something went wrong loading resources. Please try again later.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No resources available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource, i) => (
                <Card
                  key={resource.id}
                  className="reveal group border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-primary/30" />
                  </div>
                  <CardContent className="pt-5">
                    {resource.category && (
                      <Badge variant="secondary" className="bg-transparent text-primary text-xs">
                        {resource.category}
                      </Badge>
                    )}
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
                      {resource.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="mt-4 space-y-3">
                      {resource.requires_email ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2"
                              onClick={() => {
                                setActiveResource(resource);
                                setEmailStatus('idle');
                              }}
                            >
                              <Lock className="h-4 w-4" />
                              Unlock with Email
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Unlock {resource.title}</DialogTitle>
                              <DialogDescription>
                                Enter your email to download this resource. We&apos;ll also send you practical growth tips.
                              </DialogDescription>
                            </DialogHeader>
                            {emailStatus === 'success' ? (
                              <div className="flex flex-col items-center gap-3 py-6 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                                  <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <p className="font-medium">You&apos;re unlocked!</p>
                                <Button className="gap-2 w-full">
                                  <Download className="h-4 w-4" />
                                  Download Now
                                </Button>
                              </div>
                            ) : (
                              <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="res-name">Name</Label>
                                  <Input id="res-name" name="name" required placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="res-email">Email</Label>
                                  <Input id="res-email" name="email" type="email" required placeholder="jane@company.com" />
                                </div>
                                <Button type="submit" disabled={emailStatus === 'loading'} className="w-full gap-2">
                                  {emailStatus === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                  Unlock & Download
                                </Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Download Free
                        </Button>
                      )}
                      <Link
                        href={`/resources/${resource.slug}`}
                        className="inline-flex items-center justify-center rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                      >
                        View resource details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance reveal">
            Want personalized guidance?
          </h2>
          <p className="mt-4 text-lg text-white/80 reveal">
            Resources are great. Working with a partner who knows your business is better.
          </p>
          <div className="mt-8 reveal">
            <Button size="lg" variant="secondary" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href="/book">
                Book a Free Strategy Call
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
