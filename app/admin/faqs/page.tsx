'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  HelpCircle,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  category: string | null;
  order: number | null;
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadFaqs = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('faqs')
        .select(
          'id, question, answer, sort_order, is_published, created_at, category, order'
        )
        .order('sort_order', {
          ascending: true,
        })
        .order('created_at', {
          ascending: false,
        });

      if (fetchError) {
        console.error(
          'FAQ Supabase error:',
          JSON.stringify(fetchError, null, 2)
        );

        setError(
          fetchError.message ||
            fetchError.details ||
            fetchError.hint ||
            'Unable to load FAQs.'
        );

        setFaqs([]);
        return;
      }

      setFaqs((data || []) as Faq[]);
    } catch (err) {
      console.error(
        'Unexpected FAQ error:',
        JSON.stringify(err, null, 2)
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unexpected error loading FAQs.'
      );

      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this FAQ?'
    );

    if (!confirmed) {
      return;
    }

    setError('');

    const { error: deleteError } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(
        'FAQ delete error:',
        JSON.stringify(deleteError, null, 2)
      );

      setError(
        deleteError.message ||
          'Unable to delete FAQ.'
      );

      return;
    }

    await loadFaqs();
  };

  const togglePublished = async (
    faq: Faq
  ) => {
    setError('');

    const { error: updateError } = await supabase
      .from('faqs')
      .update({
        is_published: !faq.is_published,
      })
      .eq('id', faq.id);

    if (updateError) {
      console.error(
        'FAQ update error:',
        JSON.stringify(updateError, null, 2)
      );

      setError(
        updateError.message ||
          'Unable to update FAQ.'
      );

      return;
    }

    await loadFaqs();
  };

  const filteredFaqs = faqs.filter((faq) => {
    const query = search.toLowerCase();

    return (
      faq.question
        .toLowerCase()
        .includes(query) ||
      faq.answer
        .toLowerCase()
        .includes(query) ||
      (faq.category || '')
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            FAQs
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage frequently asked questions displayed on the website.
          </p>
        </div>

        <Link href="/admin/faqs/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            New FAQ
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Error loading FAQs
          </p>

          <p className="mt-1 text-sm text-destructive/80">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading FAQs...
        </div>
      ) : filteredFaqs.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              {search
                ? 'No FAQs match your search.'
                : 'No FAQs found.'}
            </p>

            {!search && (
              <Link href="/admin/faqs/new">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <Card
              key={faq.id}
              className="border-border/60"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          faq.is_published
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {faq.is_published
                          ? 'Published'
                          : 'Draft'}
                      </Badge>

                      {faq.category && (
                        <Badge variant="outline">
                          {faq.category}
                        </Badge>
                      )}

                      <Badge variant="secondary">
                        Order {faq.sort_order}
                      </Badge>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold">
                      {faq.question}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Created{' '}
                      {new Date(
                        faq.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={
                        faq.is_published
                          ? 'secondary'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        togglePublished(faq)
                      }
                    >
                      {faq.is_published
                        ? 'Unpublish'
                        : 'Publish'}
                    </Button>

                    <Link
                      href={`/admin/faqs/${faq.id}`}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Edit FAQ"
                        title="Edit FAQ"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Delete FAQ"
                      title="Delete FAQ"
                      onClick={() =>
                        handleDelete(faq.id)
                      }
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}