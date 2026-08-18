'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Plus,
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

export default function NewPricingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    period: '',
    features: [''],
    is_popular: false,
    is_published: true,
    order: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (
    field: keyof typeof form,
    value: string | boolean | number
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addFeature = () => {
    setForm((current) => ({
      ...current,
      features: [...current.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((current) => ({
      ...current,
      features:
        current.features.length === 1
          ? ['']
          : current.features.filter(
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
          i === index ? value : feature
      ),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    const features = form.features
      .map((feature) => feature.trim())
      .filter(Boolean);

    if (!form.name.trim()) {
      setError('Please enter the package name.');
      return;
    }

    if (!form.description.trim()) {
      setError('Please enter a description.');
      return;
    }

    if (!form.price.trim()) {
      setError('Please enter the price.');
      return;
    }

    if (!form.period.trim()) {
      setError('Please enter the billing period.');
      return;
    }

    if (features.length === 0) {
      setError('Please add at least one feature.');
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase
      .from('pricing_packages')
      .insert({
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        period: form.period.trim(),
        features,
        is_popular: form.is_popular,
        is_published: form.is_published,
        order: form.order,
      });

    if (insertError) {
      console.error(
        'Error creating pricing package:',
        insertError
      );
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/pricing');
    router.refresh();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pricing">
          <Button
            type="button"
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold">
            New Pricing Package
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create a pricing package for the website.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                Package Name
              </Label>

              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  updateField('name', e.target.value)
                }
                placeholder="Growth Package"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  updateField(
                    'description',
                    e.target.value
                  )
                }
                rows={4}
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price
                </Label>

                <Input
                  id="price"
                  value={form.price}
                  onChange={(e) =>
                    updateField(
                      'price',
                      e.target.value
                    )
                  }
                  placeholder="KES 50,000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">
                  Period
                </Label>

                <Input
                  id="period"
                  value={form.period}
                  onChange={(e) =>
                    updateField(
                      'period',
                      e.target.value
                    )
                  }
                  placeholder="/ month"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">
                  Display Order
                </Label>

                <Input
                  id="order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    updateField(
                      'order',
                      Number(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Features</Label>
                <p className="text-sm text-muted-foreground">
                  Add the features included in this package.
                </p>
              </div>

              {form.features.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <Input
                      value={feature}
                      onChange={(e) =>
                        updateFeature(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Feature ${index + 1}`}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        removeFeature(index)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}

              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-4 rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="popular"
                  checked={form.is_popular}
                  onCheckedChange={(value) =>
                    updateField(
                      'is_popular',
                      value === true
                    )
                  }
                />

                <Label htmlFor="popular">
                  Mark as popular
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="published"
                  checked={form.is_published}
                  onCheckedChange={(value) =>
                    updateField(
                      'is_published',
                      value === true
                    )
                  }
                />

                <Label htmlFor="published">
                  Publish on website
                </Label>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex justify-end">
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
                  : 'Save Package'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}