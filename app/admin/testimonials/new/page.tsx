'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Star } from 'lucide-react';
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

import { supabase } from '@/lib/supabase';

export default function NewTestimonialPage() {
  const router = useRouter();

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    const cleanClientName = clientName.trim();
    const cleanCompany = company.trim();
    const cleanContent = content.trim();

    if (!cleanClientName) {
      setError('Please enter the client name.');
      return;
    }

    if (!cleanContent) {
      setError('Please enter the testimonial.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase
      .from('testimonials')
      .insert({
        client_name: cleanClientName,

        // Your database contains both columns.
        company: cleanCompany || null,

        // Keep both fields synchronized.
        content: cleanContent,
        quote: cleanContent,

        rating,
        is_featured: isFeatured,
        is_published: isPublished,
      });

    if (insertError) {
      console.error('Testimonial insert error:', insertError);
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/testimonials');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/testimonials">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to testimonials"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            New Testimonial
          </h1>

          <p className="mt-1 text-muted-foreground">
            Add a client testimonial to your website.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">
                  Client Name
                </Label>

                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) =>
                    setClientName(e.target.value)
                  }
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">
                  Company
                </Label>

                <Input
                  id="company"
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                  placeholder="ABC Company"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Testimonial
              </Label>

              <Textarea
                id="content"
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write the client's testimonial here..."
                rows={7}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Rating</Label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-md p-1 transition hover:bg-primary/10"
                    aria-label={`Give ${value} star${
                      value === 1 ? '' : 's'
                    }`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        value <= rating
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}

                <span className="ml-2 text-sm text-muted-foreground">
                  {rating}/5
                </span>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <input
                  id="featured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) =>
                    setIsFeatured(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border"
                />

                <Label
                  htmlFor="featured"
                  className="cursor-pointer"
                >
                  Feature this testimonial
                </Label>
              </div>

              <div className="flex items-center gap-3">
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
                  Publish this testimonial
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
              <Link href="/admin/testimonials">
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
                className="gap-2 w-full sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? 'Saving...' : 'Save Testimonial'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}