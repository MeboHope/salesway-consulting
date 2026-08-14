import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { fallbackResources, type ResourceSummary } from '@/lib/data';
import { supabase } from '@/lib/supabase';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

async function getResource(slug: string): Promise<ResourceSummary | null> {
  const { data, error } = await supabase
    .from('resources')
    .select(
      'id, title, slug, description, category, requires_email, file_url'
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) {
    return fallbackResources.find((item) => item.slug === slug) ?? null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    category: data.category,
    requires_email: data.requires_email,
    file_url: data.file_url ?? undefined,
  };
}

export default async function ResourceDetailPage({ params }: Params) {
  const { slug } = await params;

  const resource = await getResource(slug);

  if (!resource) {
    notFound();
  }

  const hasDownload = Boolean(resource.file_url);

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-transparent py-20">
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/resources"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary"
          >
            {resource.category || 'Resource'}
          </Badge>

          <div className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-start">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {resource.title}
              </h1>

              {resource.description && (
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {resource.description}
                </p>
              )}

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">
                    Category
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {resource.category || 'General'}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">
                    Access
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {resource.requires_email
                      ? 'Email required'
                      : 'Free download'}
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-[2rem] border border-border/60 bg-background/90 p-8 shadow-xl">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  About this resource
                </h2>

                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  {resource.description ||
                    'This resource has been prepared to provide practical guidance and useful insights for growing your business.'}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {resource.requires_email ? (
                  <Button asChild className="gap-2">
                    <Link href="/resources">
                      <Lock className="h-4 w-4" />
                      Unlock Resource
                    </Link>
                  </Button>
                ) : hasDownload ? (
                  <Button asChild className="gap-2">
                    <a
                      href={resource.file_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download Resource
                    </a>
                  </Button>
                ) : null}

                <Button asChild variant="outline">
                  <Link href="/contact">Talk to our team</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-2xl">
                <Image
                  src="/images/b_generate_for_me_thre.png"
                  alt={resource.title}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>

              <Card className="border-border/60 bg-card p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-foreground">
                    {resource.requires_email ? (
                      <Lock className="h-5 w-5 text-accent" />
                    ) : (
                      <Download className="h-5 w-5 text-accent" />
                    )}

                    <p className="font-semibold">
                      {resource.requires_email
                        ? 'Email unlock required'
                        : 'Ready to download'}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {resource.requires_email
                      ? 'Return to the resource library to provide your details and unlock this resource.'
                      : hasDownload
                        ? 'This resource is available for immediate download.'
                        : 'This resource is currently being prepared for download.'}
                  </p>

                  <Link
                    href="/resources"
                    className="inline-flex text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    View all resources →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}