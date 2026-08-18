'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Save,
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

export default function NewCareerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    is_published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

    const { error: insertError } = await supabase
      .from('jobs')
      .insert({
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        type: form.type.trim(),
        salary_range: form.salary_range.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim(),
        is_published: form.is_published,
      });

    if (insertError) {
      console.error('Error creating job:', insertError);
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/careers');
    router.refresh();
  };

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
            New Job Posting
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create a new career opportunity.
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
                placeholder="Sales Consultant"
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
                  placeholder="Sales"
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
                  placeholder="Nairobi, Kenya"
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
                  placeholder="Full-time"
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
                  placeholder="KES 80,000 - 120,000"
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
                placeholder="Describe the role, responsibilities and expectations..."
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
                placeholder="List the qualifications, skills and experience required..."
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

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link href="/admin/careers">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>

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
                  : 'Save Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}