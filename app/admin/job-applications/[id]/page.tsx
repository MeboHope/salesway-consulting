'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Mail,
  Phone,
  User,
  Briefcase,
  Trash2,
  Save,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Application = {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  cover_letter: string | null;
  cv_url: string | null;
  qualification_url: string | null;
  status: string;
  created_at: string;
  jobs?: {
    id: string;
    title: string;
  } | null;
};

const statuses = [
  'new',
  'reviewing',
  'shortlisted',
  'rejected',
  'hired',
];

export default function AdminJobApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const applicationId =
    params.id as string;

  const [application, setApplication] =
    useState<Application | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [status, setStatus] =
    useState('new');

  const loadApplication = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } =
      await supabase
        .from('job_applications')
        .select(
          `
            *,
            jobs (
              id,
              title
            )
          `
        )
        .eq('id', applicationId)
        .single();

    if (fetchError || !data) {
      console.error(
        'Error loading application:',
        fetchError
      );

      setError(
        fetchError?.message ||
          'Application not found.'
      );

      setApplication(null);
    } else {
      const item =
        data as Application;

      setApplication(item);
      setStatus(item.status || 'new');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const handleSaveStatus = async () => {
    setSaving(true);
    setError('');

    const { error: updateError } =
      await supabase
        .from('job_applications')
        .update({
          status,
        })
        .eq('id', applicationId);

    if (updateError) {
      console.error(
        'Error updating application:',
        updateError
      );

      setError(updateError.message);
      setSaving(false);
      return;
    }

    setApplication((current) =>
      current
        ? {
            ...current,
            status,
          }
        : current
    );

    setSaving(false);
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this application?'
      );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const { error: deleteError } =
      await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId);

    if (deleteError) {
      console.error(
        'Error deleting application:',
        deleteError
      );

      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.push(
      '/admin/job-applications'
    );
    router.refresh();
  };

  const openFile = (
    fileUrl: string | null
  ) => {
    if (!fileUrl) return;

    window.open(
      fileUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">

        <Link href="/admin/job-applications">
          <Button
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">
              {error ||
                'Application not found.'}
            </p>
          </CardContent>
        </Card>

      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <Link href="/admin/job-applications">
            <Button
              variant="outline"
              size="icon"
              aria-label="Back to applications"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Job Application
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Review applicant information
              and submitted documents.
            </p>
          </div>

        </div>

        <Button
          variant="destructive"
          className="gap-2"
          onClick={handleDelete}
          disabled={deleting || saving}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}

          {deleting
            ? 'Deleting...'
            : 'Delete Application'}
        </Button>

      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        <div className="space-y-6">

          <Card className="border-border/60">

            <CardHeader>
              <CardTitle>
                Applicant Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              <div>
                <Label>Full Name</Label>

                <p className="mt-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {application.full_name}
                </p>
              </div>

              <div>
                <Label>Email</Label>

                <a
                  href={`mailto:${application.email}`}
                  className="mt-1 flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {application.email}
                </a>
              </div>

              {application.phone && (
                <div>
                  <Label>Phone</Label>

                  <a
                    href={`tel:${application.phone}`}
                    className="mt-1 flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {application.phone}
                  </a>
                </div>
              )}

              <div>
                <Label>Position Applied For</Label>

                <p className="mt-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />

                  {application.jobs?.title ||
                    'Position unavailable'}
                </p>
              </div>

              <div>
                <Label>Application Date</Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(
                    application.created_at
                  ).toLocaleString()}
                </p>
              </div>

            </CardContent>

          </Card>

          {application.cover_letter && (
            <Card className="border-border/60">

              <CardHeader>
                <CardTitle>
                  Cover Letter
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Textarea
                  value={
                    application.cover_letter
                  }
                  readOnly
                  rows={12}
                  className="resize-none"
                />
              </CardContent>

            </Card>
          )}

          <Card className="border-border/60">

            <CardHeader>
              <CardTitle>
                Submitted Documents
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-border/60 p-5">

                <FileText className="h-8 w-8 text-primary" />

                <h3 className="mt-3 font-semibold">
                  Curriculum Vitae
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Applicant's CV/resume.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full gap-2"
                  disabled={!application.cv_url}
                  onClick={() =>
                    openFile(
                      application.cv_url
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                  {application.cv_url
                    ? 'View / Download CV'
                    : 'CV Not Available'}
                </Button>

              </div>

              <div className="rounded-xl border border-border/60 p-5">

                <FileText className="h-8 w-8 text-accent" />

                <h3 className="mt-3 font-semibold">
                  Qualifications
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Academic or professional
                  qualification documents.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full gap-2"
                  disabled={
                    !application.qualification_url
                  }
                  onClick={() =>
                    openFile(
                      application.qualification_url
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                  {application.qualification_url
                    ? 'View / Download'
                    : 'Not Available'}
                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

        <div>

          <Card className="border-border/60 lg:sticky lg:top-6">

            <CardHeader>
              <CardTitle>
                Application Status
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              <div className="rounded-xl bg-muted/50 p-4 text-center">

                <Badge
                  variant={
                    status === 'rejected'
                      ? 'destructive'
                      : status === 'hired' ||
                        status === 'shortlisted'
                      ? 'default'
                      : 'secondary'
                  }
                  className="px-4 py-1"
                >
                  {status}
                </Badge>

              </div>

              <div className="space-y-2">

                <Label htmlFor="status">
                  Change Status
                </Label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {statuses.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item
                          .charAt(0)
                          .toUpperCase() +
                          item.slice(1)}
                      </option>
                    )
                  )}
                </select>

              </div>

              <Button
                type="button"
                onClick={handleSaveStatus}
                disabled={saving}
                className="w-full gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save Status'}
              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}