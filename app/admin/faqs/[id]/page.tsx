'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

type Faq = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sort_order?: number | null;
  order?: number | null;
  is_published: boolean;
};

export default function EditFaqPage() {
  const params = useParams();
  const router = useRouter();

  const faqId =
    typeof params.id === 'string'
      ? params.id
      : '';

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (!faqId) return;

    const loadFaq = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } =
        await supabase
          .from('faqs')
          .select('*')
          .eq('id', faqId)
          .maybeSingle();

      if (fetchError) {
        console.error(
          'FAQ loading error:',
          fetchError
        );

        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('FAQ not found.');
        setLoading(false);
        return;
      }

      const faq = data as Faq;

      setQuestion(faq.question ?? '');
      setAnswer(faq.answer ?? '');
      setCategory(
        faq.category?.trim() || 'General'
      );

      setSortOrder(
        Number(
          faq.sort_order ??
          faq.order ??
          0
        )
      );

      setIsPublished(
        faq.is_published ?? true
      );

      setLoading(false);
    };

    loadFaq();
  }, [faqId]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    const cleanQuestion =
      question.trim();

    const cleanAnswer =
      answer.trim();

    const cleanCategory =
      category.trim() || 'General';

    if (!cleanQuestion) {
      setError(
        'Please enter the FAQ question.'
      );
      return;
    }

    if (!cleanAnswer) {
      setError(
        'Please enter the FAQ answer.'
      );
      return;
    }

    setSaving(true);

    /*
     * We intentionally do NOT update updated_at
     * because the current FAQ table does not
     * require that column.
     */
    const { error: updateError } =
      await supabase
        .from('faqs')
        .update({
          question: cleanQuestion,
          answer: cleanAnswer,
          category: cleanCategory,
          sort_order:
            Number(sortOrder) || 0,
          order:
            Number(sortOrder) || 0,
          is_published:
            isPublished,
        })
        .eq('id', faqId);

    if (updateError) {
      console.error(
        'FAQ update error:',
        updateError
      );

      setError(
        updateError.message ||
          'Could not save the FAQ.'
      );

      setSaving(false);
      return;
    }

    router.push('/admin/faqs');
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this FAQ?'
      );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const { error: deleteError } =
      await supabase
        .from('faqs')
        .delete()
        .eq('id', faqId);

    if (deleteError) {
      console.error(
        'FAQ delete error:',
        deleteError
      );

      setError(
        deleteError.message ||
          'Could not delete the FAQ.'
      );

      setDeleting(false);
      return;
    }

    router.push('/admin/faqs');
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
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">

        <Link href="/admin/faqs">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Back to FAQs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit FAQ
          </h1>

          <p className="mt-1 text-muted-foreground">
            Update this frequently asked question.
          </p>
        </div>

      </div>

      {/* Form */}
      <Card className="border-border/60">

        <CardHeader>
          <CardTitle>
            FAQ Details
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Question */}
            <div className="space-y-2">

              <Label htmlFor="question">
                Question
              </Label>

              <Input
                id="question"
                type="text"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                placeholder="What does Salesway Consulting do?"
                required
              />

            </div>

            {/* Answer */}
            <div className="space-y-2">

              <Label htmlFor="answer">
                Answer
              </Label>

              <Textarea
                id="answer"
                value={answer}
                onChange={(event) =>
                  setAnswer(
                    event.target.value
                  )
                }
                placeholder="Enter the answer to this FAQ..."
                rows={8}
                required
              />

            </div>

            {/* Category + Order */}
            <div className="grid gap-6 md:grid-cols-2">

              <div className="space-y-2">

                <Label htmlFor="category">
                  Category
                </Label>

                <Input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  placeholder="General"
                />

              </div>

              <div className="space-y-2">

                <Label htmlFor="sortOrder">
                  Display Order
                </Label>

                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      Number(
                        event.target.value
                      )
                    )
                  }
                />

                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first.
                </p>

              </div>

            </div>

            {/* Published */}
            <div className="rounded-xl border border-border/60 p-4">

              <div className="flex items-center gap-3">

                <input
                  id="isPublished"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(event) =>
                    setIsPublished(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-border"
                />

                <div>

                  <Label
                    htmlFor="isPublished"
                    className="cursor-pointer font-medium"
                  >
                    Publish this FAQ
                  </Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Published FAQs are visible
                    on the public FAQ page.
                  </p>

                </div>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  deleting || saving
                }
                className="w-full gap-2 sm:w-auto"
              >

                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Delete FAQ'}

              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">

                <Link href="/admin/faqs">
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
                  className="w-full gap-2 sm:w-auto"
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