'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import { supabase } from '@/lib/supabase';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type ServiceForm = {
  title: string;
  slug: string;
  summary: string;
  details: string;
  icon: string;
  features: string[];
  is_published: boolean;
};

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { id: editId } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const [form, setForm] = useState<ServiceForm>({
    title: '',
    slug: '',
    summary: '',
    details: '',
    icon: 'Target',
    features: [],
    is_published: true,
  });

  useEffect(() => {
    loadService();
  }, [editId]);

  const loadService = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('services')
      .select(
        'id, title, slug, summary, details, icon, features, is_published'
      )
      .eq('id', editId)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setError('Service not found.');
      setLoading(false);
      return;
    }

    setForm({
      title: data.title || '',
      slug: data.slug || '',
      summary: data.summary || '',
      details: data.details || '',
      icon: data.icon || 'Target',
      features: Array.isArray(data.features)
        ? data.features
        : [],
      is_published: data.is_published ?? true,
    });

    setLoading(false);
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    if (form.features.includes(value)) {
      setFeatureInput('');
      return;
    }

    setForm((current) => ({
      ...current,
      features: [...current.features, value],
    }));

    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    setForm((current) => ({
      ...current,
      features: current.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError('');

    const slug =
      form.slug.trim() || slugify(form.title);

    if (!form.title.trim()) {
      setError('Service title is required.');
      setSaving(false);
      return;
    }

    if (!form.summary.trim()) {
      setError('Service summary is required.');
      setSaving(false);
      return;
    }

    if (!slug) {
      setError('Please provide a valid title or slug.');
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('services')
      .update({
        title: form.title.trim(),
        slug,
        summary: form.summary.trim(),
        details: form.details.trim() || null,
        icon: form.icon.trim() || 'Target',
        features: form.features,
        is_published: form.is_published,
      })
      .eq('id', editId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/services');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading service...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/services')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Service
          </h1>

          <p className="text-sm text-muted-foreground">
            Update this Salesway Consulting service.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Service Title *
              </Label>

              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    title: e.target.value,
                    slug:
                      current.slug ||
                      slugify(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    slug: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">
                Short Summary *
              </Label>

              <Textarea
                id="summary"
                required
                rows={4}
                value={form.summary}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    summary: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">
                Full Details
              </Label>

              <Textarea
                id="details"
                rows={8}
                value={form.details}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    details: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">
                Icon
              </Label>

              <Input
                id="icon"
                value={form.icon}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    icon: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-5 pt-6">
            <div>
              <h3 className="font-display font-semibold">
                Service Features
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage the features or benefits displayed for this service.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) =>
                  setFeatureInput(e.target.value)
                }
                onKeyDown={handleFeatureKeyDown}
                placeholder="Enter a feature..."
              />

              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="shrink-0 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {form.features.length > 0 && (
              <div className="space-y-2">
                {form.features.map((feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span className="text-sm">
                      {feature}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_published"
                checked={form.is_published}
                onCheckedChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    is_published: value === true,
                  }))
                }
              />

              <Label htmlFor="is_published">
                Published
              </Label>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/services')}
            disabled={saving}
          >
            Cancel
          </Button>

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

            {saving ? 'Updating...' : 'Update Service'}
          </Button>
        </div>
      </form>
    </div>
  );
}