'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

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

export default function NewFaqPage() {
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    const cleanQuestion = question.trim();
    const cleanAnswer = answer.trim();
    const cleanCategory = category.trim() || 'General';

    if (!cleanQuestion) {
      setError('Please enter the FAQ question.');
      return;
    }

    if (!cleanAnswer) {
      setError('Please enter the FAQ answer.');
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase
      .from('faqs')
      .insert({
        question: cleanQuestion,
        answer: cleanAnswer,
        category: cleanCategory,
        sort_order: Number(sortOrder) || 0,
        order: Number(sortOrder) || 0,
        is_published: isPublished,
      });

    if (insertError) {
      console.error('FAQ creation error:', insertError);
      setError(
        insertError.message ||
          'Could not create the FAQ.'
      );
      setSaving(false);
      return;
    }

    router.push('/admin/faqs');
    router.refresh();
  };

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
            New FAQ
          </h1>

          <p className="mt-1 text-muted-foreground">
            Add a frequently asked question to your website.
          </p>
        </div>

      </div>

      {/* Form */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>FAQ Details</CardTitle>
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
                  setQuestion(event.target.value)
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
                  setAnswer(event.target.value)
                }
                placeholder="Enter the answer to this frequently asked question..."
                rows={7}
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
                    setCategory(event.target.value)
                  }
                  placeholder="General"
                />

                <p className="text-xs text-muted-foreground">
                  Example: General, Services, Consulting,
                  Training.
                </p>

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
                      Number(event.target.value)
                    )
                  }
                />

                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first.
                </p>

              </div>

            </div>

            {/* Publishing */}
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
                    Published FAQs are visible on the
                    public FAQ page.
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
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

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
                disabled={saving}
                className="w-full gap-2 sm:w-auto"
              >

                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save FAQ'}

              </Button>

            </div>

          </form>

        </CardContent>
      </Card>

    </div>
  );
}