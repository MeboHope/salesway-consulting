'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { supabase } from '@/lib/supabase';

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
  updated_at: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCaseStudyPage({
  params,
}: PageProps) {
  const { id } = use(params);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    client: '',
    industry: '',
    challenge: '',
    solution: '',
    results: '',
    metrics: '',
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    if (!id) return;

    const loadCaseStudy = async () => {
      setLoading(true);
      setError('');

      const {
        data,
        error: fetchError,
      } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error(
          'Error loading case study:',
          fetchError
        );

        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Case study not found.');
        setLoading(false);
        return;
      }

      const caseStudy = data as CaseStudy;

      setForm({
        title: caseStudy.title ?? '',
        slug: caseStudy.slug ?? '',
        client: caseStudy.client ?? '',
        industry: caseStudy.industry ?? '',
        challenge: caseStudy.challenge ?? '',
        solution: caseStudy.solution ?? '',
        results: caseStudy.results ?? '',
        metrics: caseStudy.metrics ?? '',
        is_published:
          caseStudy.is_published ?? false,
        is_featured:
          caseStudy.is_featured ?? false,
      });

      setLoading(false);
    };

    loadCaseStudy();
  }, [id]);

  const handleTitleChange = (
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugify(value),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    if (!form.title.trim()) {
      setError(
        'Please enter a case study title.'
      );
      return;
    }

    if (!form.client.trim()) {
      setError(
        'Please enter the client name.'
      );
      return;
    }

    if (!form.industry.trim()) {
      setError(
        'Please enter the industry.'
      );
      return;
    }

    if (!form.challenge.trim()) {
      setError(
        'Please describe the challenge.'
      );
      return;
    }

    if (!form.solution.trim()) {
      setError(
        'Please describe the solution.'
      );
      return;
    }

    if (!form.results.trim()) {
      setError(
        'Please enter the results.'
      );
      return;
    }

    const generatedSlug =
      slugify(form.title);

    if (!generatedSlug) {
      setError(
        'Unable to generate a valid URL slug from the title.'
      );
      return;
    }

    setSaving(true);

    const {
      error: updateError,
    } = await supabase
      .from('case_studies')
      .update({
        title: form.title.trim(),
        slug: generatedSlug,
        client: form.client.trim(),
        industry: form.industry.trim(),
        challenge: form.challenge.trim(),
        solution: form.solution.trim(),
        results: form.results.trim(),
        metrics: form.metrics.trim(),
        is_published:
          form.is_published,
        is_featured:
          form.is_featured,
      })
      .eq('id', id);

    if (updateError) {
      console.error(
        'Error updating case study:',
        updateError
      );

      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/case-studies');
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this case study?'
      );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const {
      error: deleteError,
    } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(
        'Error deleting case study:',
        deleteError
      );

      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.push('/admin/case-studies');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/case-studies">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Back to case studies"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Case Study
          </h1>

          <p className="mt-1 text-muted-foreground">
            Update this client success story.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>
            Case Study Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title">
                Title
              </Label>

              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={form.slug}
                readOnly
                className="bg-muted"
              />

              <p className="text-xs text-muted-foreground">
                Automatically generated from the
                full case study title.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client
                </Label>

                <Input
                  id="client"
                  value={form.client}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      client:
                        event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry
                </Label>

                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      industry:
                        event.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge">
                Challenge
              </Label>

              <Textarea
                id="challenge"
                value={form.challenge}
                onChange={(event) =>
                  setForm({
                    ...form,
                    challenge:
                      event.target.value,
                  })
                }
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">
                Solution
              </Label>

              <Textarea
                id="solution"
                value={form.solution}
                onChange={(event) =>
                  setForm({
                    ...form,
                    solution:
                      event.target.value,
                  })
                }
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">
                Results
              </Label>

              <Textarea
                id="results"
                value={form.results}
                onChange={(event) =>
                  setForm({
                    ...form,
                    results:
                      event.target.value,
                  })
                }
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metrics">
                Metrics
              </Label>

              <Textarea
                id="metrics"
                value={form.metrics}
                onChange={(event) =>
                  setForm({
                    ...form,
                    metrics:
                      event.target.value,
                  })
                }
                rows={4}
              />
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="published"
                  checked={
                    form.is_published
                  }
                  onCheckedChange={(
                    value
                  ) =>
                    setForm({
                      ...form,
                      is_published:
                        value === true,
                    })
                  }
                />

                <Label
                  htmlFor="published"
                  className="cursor-pointer"
                >
                  Publish this case study
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="featured"
                  checked={
                    form.is_featured
                  }
                  onCheckedChange={(
                    value
                  ) =>
                    setForm({
                      ...form,
                      is_featured:
                        value === true,
                    })
                  }
                />

                <Label
                  htmlFor="featured"
                  className="cursor-pointer"
                >
                  Feature this case study
                </Label>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  deleting || saving
                }
                className="gap-2"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Delete Case Study'}
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/case-studies">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      saving || deleting
                    }
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={
                    saving || deleting
                  }
                  className="gap-2"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}