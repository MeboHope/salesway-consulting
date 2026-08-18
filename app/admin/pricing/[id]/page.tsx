'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react';

import Link from 'next/link';

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

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditPricingPage({
  params,
}: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const pricingId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    period: '',
    features: [] as string[],
    is_popular: false,
    is_published: true,
    order: 0,
  });

  const [featureInput, setFeatureInput] =
    useState('');

  useEffect(() => {
    if (!pricingId) return;

    const loadPricing = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } =
        await supabase
          .from('pricing_packages')
          .select(
            'id, name, description, price, period, features, is_popular, is_published, order, created_at, updated_at'
          )
          .eq('id', pricingId)
          .maybeSingle();

      if (fetchError) {
        console.error(
          'Error loading pricing package:',
          JSON.stringify(fetchError, null, 2)
        );

        setError(
          fetchError.message ||
            'Unable to load pricing package.'
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          'Pricing package not found.'
        );

        setLoading(false);
        return;
      }

      setForm({
        name: data.name ?? '',
        description: data.description ?? '',
        price: data.price ?? '',
        period: data.period ?? '',
        features: Array.isArray(data.features)
          ? data.features
          : [],
        is_popular:
          data.is_popular ?? false,
        is_published:
          data.is_published ?? true,
        order: data.order ?? 0,
      });

      setLoading(false);
    };

    loadPricing();
  }, [pricingId]);

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    setForm((current) => ({
      ...current,
      features: [
        ...current.features,
        value,
      ],
    }));

    setFeatureInput('');
  };

  const removeFeature = (
    index: number
  ) => {
    setForm((current) => ({
      ...current,
      features: current.features.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateFeature = (
    index: number,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      features: current.features.map(
        (feature, i) =>
          i === index
            ? value
            : feature
      ),
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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');

    if (!form.name.trim()) {
      setError(
        'Please enter the package name.'
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        'Please enter the package description.'
      );
      return;
    }

    if (!form.price.trim()) {
      setError(
        'Please enter the package price.'
      );
      return;
    }

    if (!form.period.trim()) {
      setError(
        'Please enter the billing period.'
      );
      return;
    }

    const cleanedFeatures =
      form.features
        .map((feature) => feature.trim())
        .filter(Boolean);

    if (cleanedFeatures.length === 0) {
      setError(
        'Please add at least one package feature.'
      );
      return;
    }

    setSaving(true);

    const { error: updateError } =
      await supabase
        .from('pricing_packages')
        .update({
          name: form.name.trim(),
          description:
            form.description.trim(),
          price: form.price.trim(),
          period: form.period.trim(),
          features: cleanedFeatures,
          is_popular: form.is_popular,
          is_published: form.is_published,
          order: Number(form.order) || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pricingId);

    if (updateError) {
      console.error(
        'Error updating pricing package:',
        JSON.stringify(updateError, null, 2)
      );

      setError(
        updateError.message ||
          'Unable to update pricing package.'
      );

      setSaving(false);
      return;
    }

    router.push('/admin/pricing');
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this pricing package?'
      );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const { error: deleteError } =
      await supabase
        .from('pricing_packages')
        .delete()
        .eq('id', pricingId);

    if (deleteError) {
      console.error(
        'Error deleting pricing package:',
        JSON.stringify(deleteError, null, 2)
      );

      setError(
        deleteError.message ||
          'Unable to delete pricing package.'
      );

      setDeleting(false);
      return;
    }

    router.push('/admin/pricing');
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
      <div className="flex items-center gap-4">
        <Link href="/admin/pricing">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to pricing"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Pricing Package
          </h1>

          <p className="mt-1 text-muted-foreground">
            Update this pricing package.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>
            Package Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Package Name *
                </Label>

                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Growth Accelerator"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price *
                </Label>

                <Input
                  id="price"
                  required
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="KES 50,000"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="period">
                  Billing Period *
                </Label>

                <Input
                  id="period"
                  required
                  value={form.period}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      period: e.target.value,
                    })
                  }
                  placeholder="per month"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">
                  Display Order
                </Label>

                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      order:
                        Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description *
              </Label>

              <Textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Describe who this package is best suited for..."
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label>
                  Package Features *
                </Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add the features included in
                  this package.
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) =>
                    setFeatureInput(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleFeatureKeyDown
                  }
                  placeholder="e.g. Monthly strategy sessions"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                >
                  Add
                </Button>
              </div>

              {form.features.length > 0 && (
                <div className="space-y-3">
                  {form.features.map(
                    (feature, index) => (
                      <div
                        key={`${index}-${feature}`}
                        className="flex items-center gap-2"
                      >
                        <Input
                          value={feature}
                          onChange={(e) =>
                            updateFeature(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeFeature(
                              index
                            )
                          }
                          aria-label={`Remove feature ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="popular"
                  checked={form.is_popular}
                  onCheckedChange={(value) =>
                    setForm({
                      ...form,
                      is_popular:
                        value === true,
                    })
                  }
                />

                <Label
                  htmlFor="popular"
                  className="cursor-pointer"
                >
                  Mark as popular
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="published"
                  checked={form.is_published}
                  onCheckedChange={(value) =>
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
                  Publish this package
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
                  : 'Delete Package'}
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/pricing">
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