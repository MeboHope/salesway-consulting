'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { blogCategories, fallbackBlogPosts, type BlogPostSummary } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/use-reveal';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  reading_minutes: number;
  published_at: string | null;
  is_featured: boolean;
};

export default function BlogPage() {
  useReveal();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, tags, reading_minutes, published_at, is_featured')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) {
        setPosts(fallbackBlogPosts);
      } else {
        setPosts((data && data.length > 0 ? data : fallbackBlogPosts) as BlogPostSummary[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  const featured = posts.find((p) => p.is_featured) || posts[0];

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Business Insights
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Practical insights for{' '}
            <span className="text-accent">growing businesses</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Strategies, frameworks, and lessons from the front lines of
            business growth. Written by Rachel Waithera and the Salesway team.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && !search && activeCategory === 'All' && (
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href={`/blog/${featured.slug}`} className="block reveal">
              <Card className="overflow-hidden border-border/60 transition-all hover:shadow-2xl hover:border-primary/30">
                <div className="grid md:grid-cols-2">
                  <div className="relative min-h-[280px] bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-primary/30" />
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {featured.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {featured.reading_minutes} min read
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl text-balance hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-medium">
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* Search + Categories */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', ...blogCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-border/60">
                  <div className="h-44 bg-secondary animate-pulse" />
                  <CardContent className="pt-5 space-y-3">
                    <div className="h-4 w-20 rounded bg-secondary animate-pulse" />
                    <div className="h-5 w-full rounded bg-secondary animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-secondary animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-destructive">
                Something went wrong loading articles. Please try again later.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No articles found. Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="reveal group block"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                    <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-primary/30" />
                    </div>
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {post.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_minutes} min read
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      {post.published_at && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
