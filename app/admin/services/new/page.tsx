'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

import Link from 'next/link';

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

type ServiceForm = {
  title: string;
  slug: string;
  summary: string;
  details: string;
  icon: string;
  features: string[];
  is_published: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewServicePage() {
  const router = useRouter();

  const [form, setForm] = useState<ServiceForm>({
    title: '',
    slug: '',
    summary: '',
    details: '',
    icon: 'Target',
    features: [],
    is_published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addFeature = () => {
    setForm((previous) => ({
      ...previous,
      features: [...previous.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((previous) => ({
      ...previous,
      features: previous.features.filter(
        (_, featureIndex) => featureIndex !== index
      ),
    }));
  };

  const updateFeature = (
    index: number,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      features: previous.features.map(
        (feature, featureIndex) =>
          featureIndex === index
            ? value
            : feature
      ),
    }));
  };

  const handleTitleChange = (
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug:
        previous.slug ===
        slugify(previous.title)
          ? slugify(value)
          : previous.slug,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSaving(true);
    setError('');

    const title = form.title.trim();
    const slug =
      form.slug.trim() || slugify(title);

    if (!title) {
      setError('Please enter a service title.');
      setSaving(false);
      return;
    }

    if (!form.summary.trim()) {
      setError('Please enter a service summary.');
      setSaving(false);
      return;
    }

    const features = form.features
      .map((feature) => feature.trim())
      .filter(Boolean);

    const { error: insertError } =
      await supabase
        .from('services')
        .insert({
          title,
          slug,
          summary: form.summary.trim(),
          details:
            form.details.trim() || null,
          icon: form.icon.trim() || 'Target',
          features,
          is_published: form.is_published,
        });

    if (insertError) {
      console.error(
        'Error creating service:',
        insertError
      );

      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/services');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Back to services"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            New Service
          </h1>

          <p className="mt-1 text-muted-foreground">
            Add a service to your Salesway Consulting website.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Service Title
              </Label>

              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                placeholder="Sales Strategy & Growth"
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
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    slug: slugify(
                      event.target.value
                    ),
                  }))
                }
                placeholder="sales-strategy-growth"
              />

              <p className="text-xs text-muted-foreground">
                Automatically generated from the
                service title. You can edit it.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">
                Summary
              </Label>

              <Textarea
                id="summary"
                value={form.summary}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    summary:
                      event.target.value,
                  }))
                }
                placeholder="A short description of this service."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">
                Details
              </Label>

              <Textarea
                id="details"
                value={form.details}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    details:
                      event.target.value,
                  }))
                }
                placeholder="Explain what this service includes and how it helps clients."
                rows={7}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">
                Icon
              </Label>

              <Input
                id="icon"
                value={form.icon}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    icon: event.target.value,
                  }))
                }
                placeholder="Target"
              />

              <p className="text-xs text-muted-foreground">
                Enter the Lucide icon name used by
                the website.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Service Features</CardTitle>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {form.features.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No features added yet.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="mt-3 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First Feature
                </Button>
              </div>
            ) : (
              form.features.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={feature}
                      onChange={(event) =>
                        updateFeature(
                          index,
                          event.target.value
                        )
                      }
                      placeholder={`Feature ${index + 1}`}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeFeature(index)
                      }
                      aria-label={`Remove feature ${
                        index + 1
                      }`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3">
              <Checkbox
                id="is_published"
                checked={form.is_published}
                onCheckedChange={(checked) =>
                  setForm((previous) => ({
                    ...previous,
                    is_published:
                      checked === true,
                  }))
                }
              />

              <Label
                htmlFor="is_published"
                className="cursor-pointer"
              >
                Publish this service on the website
              </Label>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/admin/services">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={saving}
            className="gap-2 w-full sm:w-auto"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving
              ? 'Saving...'
              : 'Save Service'}
          </Button>
        </div>
      </form>
    </div>
  );
}