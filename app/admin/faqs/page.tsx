'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  HelpCircle,
  Eye,
  Loader2,
  X,
  Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

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

type FaqForm = {
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
};

const EMPTY_FORM: FaqForm = {
  question: '',
  answer: '',
  category: 'General',
  sort_order: 0,
  is_published: true,
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<FaqForm>({
    ...EMPTY_FORM,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
   * Load every FAQ from Supabase.
   *
   * IMPORTANT:
   * We intentionally do NOT request updated_at because
   * that column does not exist in the current table.
   */
  const loadFaqs = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('faqs')
      .select(
        `
          id,
          question,
          answer,
          sort_order,
          is_published,
          created_at,
          category,
          order
        `
      )
      .order('sort_order', {
        ascending: true,
      })
      .order('created_at', {
        ascending: false,
      });

    if (fetchError) {
      console.error('Error loading FAQs:', fetchError);

      setError(
        `Could not load FAQs: ${fetchError.message}`
      );

      setFaqs([]);
    } else {
      setFaqs((data ?? []) as Faq[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  /*
   * Search FAQs by question, answer or category.
   */
  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return faqs;
    }

    return faqs.filter((faq) => {
      return (
        faq.question
          .toLowerCase()
          .includes(query) ||
        faq.answer
          .toLowerCase()
          .includes(query) ||
        (faq.category ?? '')
          .toLowerCase()
          .includes(query)
      );
    });
  }, [faqs, search]);

  /*
   * Open the form for creating a new FAQ.
   */
  const handleNew = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
      sort_order:
        faqs.length > 0
          ? Math.max(
              ...faqs.map(
                (faq) =>
                  faq.sort_order ??
                  faq.order ??
                  0
              )
            ) + 1
          : 1,
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  };

  /*
   * Open the form for editing an existing FAQ.
   */
  const handleEdit = (faq: Faq) => {
    setEditingId(faq.id);

    setForm({
      question: faq.question,
      answer: faq.answer,
      category:
        faq.category?.trim() || 'General',
      sort_order:
        faq.sort_order ??
        faq.order ??
        0,
      is_published: faq.is_published,
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  };

  /*
   * Cancel add/edit mode.
   */
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
    });
    setError('');
  };

  /*
   * Save either a new FAQ or an existing FAQ.
   */
  const handleSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    const question =
      form.question.trim();

    const answer =
      form.answer.trim();

    const category =
      form.category.trim() || 'General';

    if (!question) {
      setError(
        'Please enter the FAQ question.'
      );
      setSaving(false);
      return;
    }

    if (!answer) {
      setError(
        'Please enter the FAQ answer.'
      );
      setSaving(false);
      return;
    }

    const payload = {
      question,
      answer,
      category,
      sort_order:
        Number(form.sort_order) || 0,
      is_published:
        form.is_published,
    };

    /*
     * UPDATE
     */
    if (editingId) {
      const {
        error: updateError,
      } = await supabase
        .from('faqs')
        .update(payload)
        .eq('id', editingId);

      if (updateError) {
        console.error(
          'Error updating FAQ:',
          updateError
        );

        setError(
          `Could not update FAQ: ${updateError.message}`
        );

        setSaving(false);
        return;
      }

      setSuccess(
        'FAQ updated successfully.'
      );
    } else {
      /*
       * INSERT
       */
      const {
        error: insertError,
      } = await supabase
        .from('faqs')
        .insert(payload);

      if (insertError) {
        console.error(
          'Error creating FAQ:',
          insertError
        );

        setError(
          `Could not create FAQ: ${insertError.message}`
        );

        setSaving(false);
        return;
      }

      setSuccess(
        'FAQ created successfully.'
      );
    }

    await loadFaqs();

    setShowForm(false);
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
    });

    setSaving(false);
  };

  /*
   * Delete an FAQ.
   */
  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this FAQ? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError('');
    setSuccess('');

    const {
      error: deleteError,
    } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(
        'Error deleting FAQ:',
        deleteError
      );

      setError(
        `Could not delete FAQ: ${deleteError.message}`
      );

      setDeletingId(null);
      return;
    }

    setSuccess(
      'FAQ deleted successfully.'
    );

    setFaqs((current) =>
      current.filter(
        (faq) => faq.id !== id
      )
    );

    setDeletingId(null);
  };

  /*
   * Toggle published state.
   */
  const handleTogglePublished = async (
    faq: Faq
  ) => {
    setError('');
    setSuccess('');

    const {
      error: updateError,
    } = await supabase
      .from('faqs')
      .update({
        is_published:
          !faq.is_published,
      })
      .eq('id', faq.id);

    if (updateError) {
      console.error(
        'Error changing FAQ status:',
        updateError
      );

      setError(
        `Could not change FAQ status: ${updateError.message}`
      );

      return;
    }

    setFaqs((current) =>
      current.map((item) =>
        item.id === faq.id
          ? {
              ...item,
              is_published:
                !item.is_published,
            }
          : item
      )
    );

    setSuccess(
      faq.is_published
        ? 'FAQ unpublished.'
        : 'FAQ published.'
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            FAQs
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage the frequently asked questions displayed on the website.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <Link
            href="/faq"
            target="_blank"
          >
            <Button
              variant="outline"
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View Website
            </Button>
          </Link>

          <Button
            onClick={handleNew}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>

        </div>

      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-primary">
            {success}
          </p>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <Card className="border-border/60">
          <CardContent className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="font-display text-xl font-semibold">
                  {editingId
                    ? 'Edit FAQ'
                    : 'Add New FAQ'}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingId
                    ? 'Update this FAQ and its website visibility.'
                    : 'Create a new FAQ for the website.'}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </Button>

            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5"
            >

              {/* Question */}
              <div className="space-y-2">

                <label
                  htmlFor="faq-question"
                  className="text-sm font-medium"
                >
                  Question
                </label>

                <Input
                  id="faq-question"
                  value={form.question}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      question:
                        event.target.value,
                    }))
                  }
                  placeholder="What does Salesway Consulting do?"
                  required
                />

              </div>

              {/* Answer */}
              <div className="space-y-2">

                <label
                  htmlFor="faq-answer"
                  className="text-sm font-medium"
                >
                  Answer
                </label>

                <Textarea
                  id="faq-answer"
                  value={form.answer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      answer:
                        event.target.value,
                    }))
                  }
                  placeholder="Enter the answer..."
                  rows={6}
                  required
                />

              </div>

              {/* Category + Order */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div className="space-y-2">

                  <label
                    htmlFor="faq-category"
                    className="text-sm font-medium"
                  >
                    Category
                  </label>

                  <Input
                    id="faq-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category:
                          event.target.value,
                      }))
                    }
                    placeholder="General"
                  />

                </div>

                <div className="space-y-2">

                  <label
                    htmlFor="faq-order"
                    className="text-sm font-medium"
                  >
                    Display Order
                  </label>

                  <Input
                    id="faq-order"
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sort_order:
                          Number(
                            event.target.value
                          ),
                      }))
                    }
                  />

                </div>

              </div>

              {/* Published */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 p-4">

                <input
                  type="checkbox"
                  checked={
                    form.is_published
                  }
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      is_published:
                        event.target
                          .checked,
                    }))
                  }
                  className="h-4 w-4"
                />

                <div>
                  <p className="text-sm font-medium">
                    Published
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Published FAQs are visible on the public FAQ page.
                  </p>
                </div>

              </label>

              {/* Form buttons */}
              <div className="flex flex-wrap gap-3">

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
                    : editingId
                      ? 'Update FAQ'
                      : 'Add FAQ'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>

              </div>

            </form>

          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search FAQs..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="pl-10"
        />

      </div>

      {/* Count */}
      {!loading && (
        <div className="flex items-center justify-between">

          <p className="text-sm text-muted-foreground">
            {filteredFaqs.length}{' '}
            {filteredFaqs.length === 1
              ? 'FAQ'
              : 'FAQs'}
          </p>

          <p className="text-sm text-muted-foreground">
            {faqs.filter(
              (faq) =>
                faq.is_published
            ).length}{' '}
            published
          </p>

        </div>
      )}

      {/* FAQ List */}
      {loading ? (

        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading FAQs...
        </div>

      ) : filteredFaqs.length === 0 ? (

        <Card className="border-border/60">

          <CardContent className="py-12 text-center">

            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />

            <h3 className="mt-4 font-display text-lg font-semibold">
              {search
                ? 'No FAQs found'
                : 'No FAQs yet'}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {search
                ? 'Try a different search term.'
                : 'Create your first FAQ to display it on the website.'}
            </p>

            {!search && (
              <Button
                onClick={handleNew}
                className="mt-5 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            )}

          </CardContent>

        </Card>

      ) : (

        <div className="space-y-3">

          {filteredFaqs.map(
            (faq, index) => (
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

                        <Badge variant="outline">
                          {faq.category ||
                            'General'}
                        </Badge>

                        <Badge variant="outline">
                          #
                          {faq.sort_order ??
                            faq.order ??
                            index + 1}
                        </Badge>

                      </div>

                      <h3 className="mt-3 font-display text-base font-semibold">
                        {faq.question}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>

                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">

                      {/* View public FAQ page */}
                      <Link
                        href="/faq"
                        target="_blank"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="View FAQs"
                          title="View FAQs on website"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleEdit(faq)
                        }
                        aria-label="Edit FAQ"
                        title="Edit FAQ"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Publish / unpublish */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleTogglePublished(
                            faq
                          )
                        }
                      >
                        {faq.is_published
                          ? 'Unpublish'
                          : 'Publish'}
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(
                            faq.id
                          )
                        }
                        disabled={
                          deletingId ===
                          faq.id
                        }
                        aria-label="Delete FAQ"
                        title="Delete FAQ"
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingId ===
                        faq.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>

                    </div>

                  </div>

                </CardContent>

              </Card>
            )
          )}

        </div>

      )}

    </div>
  );
}