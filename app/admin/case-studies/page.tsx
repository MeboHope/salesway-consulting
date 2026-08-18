'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BarChart3,
  Eye,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  updated_at?: string;
};

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
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
          created_at,
          updated_at
        `
      )
      .order('created_at', {
        ascending: false,
      });

    if (fetchError) {
      console.error(
        'Error loading case studies:',
        fetchError
      );

      setError(fetchError.message);
      setCaseStudies([]);
    } else {
      setCaseStudies(
        (data || []) as CaseStudy[]
      );
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this case study?'
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    const { error: deleteError } =
      await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

    if (deleteError) {
      console.error(
        'Error deleting case study:',
        deleteError
      );

      setError(deleteError.message);
      return;
    }

    setSuccess(
      'Case study deleted successfully.'
    );

    await loadCaseStudies();
  };

  const filteredCaseStudies = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return caseStudies;
    }

    return caseStudies.filter(
      (study) =>
        study.title
          .toLowerCase()
          .includes(query) ||
        study.client
          .toLowerCase()
          .includes(query) ||
        study.industry
          .toLowerCase()
          .includes(query) ||
        study.slug
          .toLowerCase()
          .includes(query)
    );
  }, [caseStudies, search]);

  const publishedCount =
    caseStudies.filter(
      (study) => study.is_published
    ).length;

  const featuredCount =
    caseStudies.filter(
      (study) => study.is_featured
    ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Case Studies
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage the business case studies
            displayed on the website.
          </p>
        </div>

        <Link href="/admin/case-studies/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Case Study
          </Button>
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Case Studies
            </p>

            <p className="mt-1 text-2xl font-bold">
              {caseStudies.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Published
            </p>

            <p className="mt-1 text-2xl font-bold text-primary">
              {publishedCount}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Featured
            </p>

            <p className="mt-1 text-2xl font-bold">
              {featuredCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search case studies..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-primary">
            {success}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading case studies...
        </div>
      ) : filteredCaseStudies.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/40" />

            <h3 className="mt-4 font-semibold">
              {search
                ? 'No case studies found'
                : 'No case studies yet'}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {search
                ? 'Try a different search term.'
                : 'Create your first case study to display it on the website.'}
            </p>

            {!search && (
              <Link href="/admin/case-studies/new">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Case Study
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCaseStudies.map(
            (study) => (
              <Card
                key={study.id}
                className="border-border/60"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            study.is_published
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {study.is_published
                            ? 'Published'
                            : 'Draft'}
                        </Badge>

                        {study.is_featured && (
                          <Badge variant="outline">
                            Featured
                          </Badge>
                        )}

                        <Badge variant="outline">
                          {study.industry}
                        </Badge>
                      </div>

                      <h3 className="mt-3 font-display text-lg font-semibold">
                        {study.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-primary">
                        {study.client}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        /{study.slug}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {study.results}
                      </p>

                      {study.metrics && (
                        <p className="mt-2 text-sm font-medium text-foreground">
                          Metrics: {study.metrics}
                        </p>
                      )}

                      <p className="mt-3 text-xs text-muted-foreground">
                        Created:{' '}
                        {new Date(
                          study.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      {study.is_published && (
                        <Link
                          href={`/case-studies/${study.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="View case study"
                            aria-label="View case study"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      <Link
                        href={`/admin/case-studies/${study.id}`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Edit case study"
                          aria-label="Edit case study"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Delete case study"
                        aria-label="Delete case study"
                        onClick={() =>
                          handleDelete(
                            study.id
                          )
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}