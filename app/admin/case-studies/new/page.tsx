'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

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

export default function NewCaseStudyPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [client, setClient] = useState('');
  const [industry, setIndustry] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [metrics, setMetrics] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (value: string) => {
    setTitle(value);

    // Always generate the complete slug from the complete title.
    setSlug(slugify(value));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');
    setSaving(true);

    if (!title.trim()) {
      setError('Please enter a case study title.');
      setSaving(false);
      return;
    }

    if (!client.trim()) {
      setError('Please enter the client name.');
      setSaving(false);
      return;
    }

    if (!industry.trim()) {
      setError('Please enter the industry.');
      setSaving(false);
      return;
    }

    if (!challenge.trim()) {
      setError('Please describe the challenge.');
      setSaving(false);
      return;
    }

    if (!solution.trim()) {
      setError('Please describe the solution.');
      setSaving(false);
      return;
    }

    if (!results.trim()) {
      setError('Please enter the results.');
      setSaving(false);
      return;
    }

    const generatedSlug = slugify(title);

    if (!generatedSlug) {
      setError(
        'Unable to generate a valid URL slug from the title.'
      );
      setSaving(false);
      return;
    }

    const { error: insertError } =
      await supabase
        .from('case_studies')
        .insert({
          title: title.trim(),
          slug: generatedSlug,
          client: client.trim(),
          industry: industry.trim(),
          challenge: challenge.trim(),
          solution: solution.trim(),
          results: results.trim(),
          metrics: metrics.trim(),
          is_published: isPublished,
          is_featured: isFeatured,
        });

    if (insertError) {
      console.error(
        'Error creating case study:',
        insertError
      );

      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/case-studies');
    router.refresh();
  };

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
            New Case Study
          </h1>

          <p className="mt-1 text-muted-foreground">
            Add a client success story to the website.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Case Study Details</CardTitle>
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
                value={title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                placeholder="How We Helped ABC Company Increase Sales"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={slug}
                readOnly
                className="bg-muted"
              />

              <p className="text-xs text-muted-foreground">
                Automatically generated from the case study title.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client
                </Label>

                <Input
                  id="client"
                  value={client}
                  onChange={(event) =>
                    setClient(event.target.value)
                  }
                  placeholder="ABC Company"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry
                </Label>

                <Input
                  id="industry"
                  value={industry}
                  onChange={(event) =>
                    setIndustry(event.target.value)
                  }
                  placeholder="Retail"
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
                value={challenge}
                onChange={(event) =>
                  setChallenge(event.target.value)
                }
                placeholder="Describe the business challenge..."
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
                value={solution}
                onChange={(event) =>
                  setSolution(event.target.value)
                }
                placeholder="Describe the solution provided..."
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
                value={results}
                onChange={(event) =>
                  setResults(event.target.value)
                }
                placeholder="Describe the results achieved..."
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
                value={metrics}
                onChange={(event) =>
                  setMetrics(event.target.value)
                }
                placeholder="40% sales growth, 25% increase in conversion..."
                rows={4}
              />
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="published"
                  checked={isPublished}
                  onCheckedChange={(value) =>
                    setIsPublished(value === true)
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
                  checked={isFeatured}
                  onCheckedChange={(value) =>
                    setIsFeatured(value === true)
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

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link href="/admin/case-studies">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save Case Study'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}