'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClient = async () => {
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select(
          'id, name, logo_url, industry, testimonial, is_published, "order"'
        )
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Client not found.');
        setLoading(false);
        return;
      }

      setName(data.name ?? '');
      setLogoUrl(data.logo_url ?? '');
      setIndustry(data.industry ?? '');
      setTestimonial(data.testimonial ?? '');
      setOrder(data.order ?? 0);
      setIsPublished(data.is_published ?? false);

      setLoading(false);
    };

    loadClient();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!name.trim()) {
      setError('Please enter the client name.');
      return;
    }

    if (!industry.trim()) {
      setError('Please enter the industry.');
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from('clients')
      .update({
        name: name.trim(),
        logo_url: logoUrl.trim() || null,
        industry: industry.trim(),
        testimonial: testimonial.trim() || null,
        is_published: isPublished,
        order: Number(order) || 0,
      })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/clients');
    router.refresh();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this client?'
      )
    ) {
      return;
    }

    setDeleting(true);
    setError('');

    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.push('/admin/clients');
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
        <Link href="/admin/clients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Client
          </h1>

          <p className="mt-1 text-muted-foreground">
            Update this client's information.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Client Name *
                </Label>

                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry *
                </Label>

                <Input
                  id="industry"
                  required
                  value={industry}
                  onChange={(e) =>
                    setIndustry(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">
                Logo URL
              </Label>

              <Input
                id="logoUrl"
                type="url"
                value={logoUrl}
                onChange={(e) =>
                  setLogoUrl(e.target.value)
                }
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial">
                Client Testimonial
              </Label>

              <Textarea
                id="testimonial"
                value={testimonial}
                onChange={(e) =>
                  setTestimonial(e.target.value)
                }
                rows={6}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order">
                  Display Order
                </Label>

                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) =>
                    setOrder(Number(e.target.value))
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  id="published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) =>
                    setIsPublished(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border"
                />

                <Label
                  htmlFor="published"
                  className="cursor-pointer"
                >
                  Publish this client
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
                disabled={deleting || saving}
                onClick={handleDelete}
                className="w-full gap-2 sm:w-auto"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting ? 'Deleting...' : 'Delete Client'}
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/clients">
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
                  disabled={saving || deleting}
                  className="w-full gap-2 sm:w-auto"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}