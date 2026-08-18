'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

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
  features: string;
  is_published: boolean;
  order: number;
};

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ServiceForm>({
    title: '',
    slug: '',
    summary: '',
    details: '',
    icon: 'Target',
    features: '',
    is_published: true,
    order: 0,
  });

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('title, slug, summary, details, icon, features, is_published, order')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error(fetchError);
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
        features: (data.features || []).join(', '),
        is_published: data.is_published ?? true,
        order: data.order ?? 0,
      });

      setLoading(false);
    }

    loadService();
  }, [id]);

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: current.slug ? current.slug : slugify(title),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.title);
    const features = form.features.split(',').map((item) => item.trim()).filter(Boolean);

    const { error: updateError } = await supabase
      .from('services')
      .update({
        title: form.title,
        slug,
        summary: form.summary,
        details: form.details,
        icon: form.icon,
        features,
        is_published: form.is_published,
        order: form.order,
      })
      .eq('id', id);

    if (updateError) {
      console.error(updateError);
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/services');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="animate-pulse text-muted-foreground">
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

          <p className="mt-1 text-sm text-muted-foreground">
            Update the service information shown on the website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>

              <Input
                id="title"
                required
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(event.target.value)
                }
                placeholder="Sales Strategy & Growth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>

              <Input
                id="slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: slugify(event.target.value),
                  }))
                }
                placeholder="sales-strategy-growth"
              />

              <p className="text-xs text-muted-foreground">
                Automatically generated from the title. You can still edit it
                manually.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Short Summary *</Label>

              <Textarea
                id="summary"
                required
                rows={4}
                value={form.summary}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    summary: event.target.value,
                  }))
                }
                placeholder="A short description of this service..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Detailed Description</Label>

              <Textarea
                id="details"
                rows={7}
                value={form.details}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    details: event.target.value,
                  }))
                }
                placeholder="Explain the service in more detail..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>

              <Input
                id="icon"
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon: event.target.value,
                  }))
                }
                placeholder="Target"
              />

              <p className="text-xs text-muted-foreground">
                Example: TrendingUp, Target, Megaphone, Users, Settings,
                GraduationCap.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features</Label>

              <Textarea
                id="features"
                rows={7}
                value={form.features}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    features: event.target.value,
                  }))
                }
                placeholder={
                  'Sales audits\nPipeline optimization\nCRM implementation'
                }
              />

              <p className="text-xs text-muted-foreground">
                Enter one feature per line.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_published"
                checked={form.is_published}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    is_published: checked === true,
                  }))
                }
              />

              <Label htmlFor="is_published">Published</Label>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? 'Saving...' : 'Update Service'}
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