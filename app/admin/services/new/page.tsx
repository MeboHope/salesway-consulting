'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus, X } from 'lucide-react';

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

export default function NewServicePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    details: '',
    icon: 'Target',
    features: [''],
    is_published: true,
  });

  const updateFeature = (index: number, value: string) => {
    const features = [...form.features];
    features[index] = value;

    setForm({
      ...form,
      features,
    });
  };

  const addFeature = () => {
    setForm({
      ...form,
      features: [...form.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    if (form.features.length === 1) {
      setForm({
        ...form,
        features: [''],
      });
      return;
    }

    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError('');

    const title = form.title.trim();

    if (!title) {
      setError('Service title is required.');
      setSaving(false);
      return;
    }

    const slug = form.slug.trim() || slugify(title);

    const cleanedFeatures = form.features
      .map((feature) => feature.trim())
      .filter(Boolean);

    if (cleanedFeatures.length === 0) {
      setError('Please add at least one service feature.');
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('services')
      .insert({
        title,
        slug,
        summary: form.summary.trim(),
        details: form.details.trim() || null,
        icon: form.icon.trim() || 'Target',
        features: cleanedFeatures,
        is_published: form.is_published,
      });

    if (insertError) {
      console.error('Error creating service:', insertError);
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/services');
    router.refresh();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => router.push('/admin/services')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            New Service
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a service that can be displayed on the website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="space-y-6 pt-6">

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Service Title *
              </Label>

              <Input
                id="title"
                required
                placeholder="Sales Performance Consulting"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;

                  setForm({
                    ...form,
                    title,
                    slug: slugify(title),
                  });
                }}
              />

              <p className="text-xs text-muted-foreground">
                The URL slug is generated automatically from the title.
              </p>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: slugify(e.target.value),
                  })
                }
              />

              <p className="text-xs text-muted-foreground">
                Example: sales-performance-consulting
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">
                Summary *
              </Label>

              <Textarea
                id="summary"
                required
                rows={4}
                placeholder="A short description of this service..."
                value={form.summary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    summary: e.target.value,
                  })
                }
              />

              <p className="text-xs text-muted-foreground">
                This is the main description displayed on the services page.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="details">
                Detailed Description
              </Label>

              <Textarea
                id="details"
                rows={7}
                placeholder="Explain the service in more detail..."
                value={form.details}
                onChange={(e) =>
                  setForm({
                    ...form,
                    details: e.target.value,
                  })
                }
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">
                Icon
              </Label>

              <Input
                id="icon"
                placeholder="Target"
                value={form.icon}
                onChange={(e) =>
                  setForm({
                    ...form,
                    icon: e.target.value,
                  })
                }
              />

              <p className="text-xs text-muted-foreground">
                Use a Lucide icon name such as Target, TrendingUp,
                Megaphone, Users, Settings, or GraduationCap.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div>
                <Label>
                  Service Features *
                </Label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add the specific things included in this service.
                </p>
              </div>

              <div className="space-y-3">
                {form.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) =>
                        updateFeature(index, e.target.value)
                      }
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      aria-label={`Remove feature ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={addFeature}
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </Button>
            </div>

            {/* Published */}
            <div className="flex items-center gap-3 rounded-lg border border-border/60 p-4">
              <Checkbox
                id="is_published"
                checked={form.is_published}
                onCheckedChange={(value) =>
                  setForm({
                    ...form,
                    is_published: value === true,
                  })
                }
              />

              <div>
                <Label htmlFor="is_published">
                  Publish this service
                </Label>

                <p className="text-xs text-muted-foreground">
                  Published services appear on the client website.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
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

                {saving ? 'Saving...' : 'Save Service'}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => router.push('/admin/services')}
              >
                Cancel
              </Button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}