'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock, Calendar, ArrowLeft, ArrowRight, BookOpen, Share2,
  Twitter, Linkedin, Facebook, Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/use-reveal';
import { NewsletterForm } from '@/components/newsletter-form';
import { fallbackBlogPostDetails, fallbackBlogPosts } from '@/lib/data';

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author_name: string;
  reading_minutes: number;
  published_at: string | null;
};

type RelatedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  reading_minutes: number;
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  useReveal();
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, content, category, tags, author_name, reading_minutes, published_at')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error || !data) {
        const fallback = fallbackBlogPostDetails[slug];
        if (fallback) {
          setPost(fallback);
          setRelated(fallbackBlogPosts.filter((p) => p.slug !== slug).slice(0, 3));
        }
        setLoading(false);
        return;
      }
      setPost(data);

      const { data: relData, error: relError } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, reading_minutes')
        .eq('status', 'published')
        .neq('id', data.id)
        .limit(3);

      if (relError || !relData || relData.length === 0) {
        setRelated(fallbackBlogPosts.filter((p) => p.slug !== slug).slice(0, 3));
      } else {
        setRelated(relData);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-24 rounded bg-secondary" />
            <div className="h-10 w-full rounded bg-secondary" />
            <div className="h-10 w-3/4 rounded bg-secondary" />
            <div className="h-64 rounded bg-secondary" />
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.reading_minutes} min read
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {post.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium">{post.author_name}</div>
              <div className="text-xs text-muted-foreground">Author</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <Share2 className="h-4 w-4" />
              Share
            </span>
            {[
              { icon: Twitter, label: 'X' },
              { icon: Linkedin, label: 'LinkedIn' },
              { icon: Facebook, label: 'Facebook' },
              { icon: Link2, label: 'Copy link' },
            ].map((s) => (
              <button
                key={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                aria-label={`Share on ${s.label}`}
              >
                <s.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <NewsletterForm />
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight reveal">
              Related articles
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="reveal group block"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <Card className="h-full overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                    <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-primary/30" />
                    </div>
                    <CardContent className="pt-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        {r.category}
                      </Badge>
                      <h3 className="mt-2 font-display font-semibold leading-snug group-hover:text-primary transition-colors">
                        {r.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {r.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function formatContent(content: string): string {
  return content
    .split('\n')
    .map((line) => {
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith('# ')) return `<h2>${line.slice(2)}</h2>`;
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
      if (line.startsWith('**Fix:**') || line.startsWith('**The ')) return `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
      if (line.trim() === '') return '';
      return `<p>${line}</p>`;
    })
    .join('\n')
    .replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
}
