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

export default function EditCareerPage({
  params,
}: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    is_published: false,
  });

  useEffect(() => {
    if (!id) return;

    const loadJob = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading job:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Job posting not found.');
        setLoading(false);
        return;
      }

      setForm({
        title: data.title ?? '',
        department: data.department ?? '',
        location: data.location ?? '',
        type: data.type ?? 'Full-time',
        salary_range: data.salary_range ?? '',
        description: data.description ?? '',
        requirements: data.requirements ?? '',
        is_published: data.is_published ?? false,
      });

      setLoading(false);
    };

    loadJob();
  }, [id]);

  const updateField = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    if (!form.title.trim()) {
      setError('Please enter the job title.');
      return;
    }

    if (!form.department.trim()) {
      setError('Please enter the department.');
      return;
    }

    if (!form.location.trim()) {
      setError('Please enter the location.');
      return;
    }

    if (!form.description.trim()) {
      setError('Please enter the job description.');
      return;
    }

    if (!form.requirements.trim()) {
      setError('Please enter the job requirements.');
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        type: form.type.trim(),
        salary_range: form.salary_range.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim(),
        is_published: form.is_published,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating job:', updateError);
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/careers');
    router.refresh();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this job posting?'
    );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting job:', deleteError);
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.push('/admin/careers');
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
        <Link href="/admin/careers">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Back to careers"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Job Posting
          </h1>

          <p className="mt-1 text-muted-foreground">
            Update this career opportunity.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title
              </Label>

              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  updateField(
                    'title',
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">
                  Department
                </Label>

                <Input
                  id="department"
                  value={form.department}
                  onChange={(event) =>
                    updateField(
                      'department',
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location
                </Label>

                <Input
                  id="location"
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      'location',
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Employment Type
                </Label>

                <Input
                  id="type"
                  value={form.type}
                  onChange={(event) =>
                    updateField(
                      'type',
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">
                  Salary Range
                </Label>

                <Input
                  id="salary_range"
                  value={form.salary_range}
                  onChange={(event) =>
                    updateField(
                      'salary_range',
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Job Description
              </Label>

              <Textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  updateField(
                    'description',
                    event.target.value
                  )
                }
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements
              </Label>

              <Textarea
                id="requirements"
                value={form.requirements}
                onChange={(event) =>
                  updateField(
                    'requirements',
                    event.target.value
                  )
                }
                rows={8}
                required
              />
            </div>

            <div className="rounded-xl border border-border/60 p-4">
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

                <Label
                  htmlFor="published"
                  className="cursor-pointer"
                >
                  Publish this job on the website
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
                disabled={deleting || saving}
                className="gap-2"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Delete Job'}
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/careers">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving || deleting}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={saving || deleting}
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