'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

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
  Linkedin,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

type Application = {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string | null;
  linkedin_url: string | null;
  cv_file_path: string | null;
  cv_file_name: string | null;
  qualification_file_path: string | null;
  qualification_file_name: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Job = {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
  type?: string | null;
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

  const [job, setJob] =
    useState<Job | null>(null);

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

  const [notes, setNotes] =
    useState('');

  const loadApplication = async () => {
    setLoading(true);
    setError('');

    const {
      data,
      error: fetchError,
    } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();

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
      setLoading(false);
      return;
    }

    const applicationData =
      data as Application;

    setApplication(applicationData);

    setStatus(
      applicationData.status || 'new'
    );

    setNotes(
      applicationData.notes || ''
    );

    const {
      data: jobData,
      error: jobError,
    } = await supabase
      .from('jobs')
      .select(
        'id, title, department, location, type'
      )
      .eq(
        'id',
        applicationData.job_id
      )
      .maybeSingle();

    if (jobError) {
      console.error(
        'Error loading career:',
        jobError
      );
    }

    setJob(
      (jobData as Job) || null
    );

    setLoading(false);
  };

  useEffect(() => {
    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const {
      error: updateError,
    } = await supabase
      .from('job_applications')
      .update({
        status,
        notes:
          notes.trim() || null,
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
            notes:
              notes.trim() || null,
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

    const {
      error: deleteError,
    } = await supabase
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

  const openDocument = async (
    filePath: string | null,
    documentType: string
  ) => {
    if (!filePath) {
      setError(
        `${documentType} is not available.`
      );
      return;
    }

    try {
      setError('');

      /*
       * The path is intentionally sent to the
       * server rather than exposing a private
       * Storage bucket URL.
       */
      const response = await fetch(
        `/api/admin/job-applications/${applicationId}/documents?type=${encodeURIComponent(
          documentType
        )}`
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Unable to open ${documentType}.`
        );
      }

      if (!result.url) {
        throw new Error(
          `No download URL was returned for ${documentType}.`
        );
      }

      window.open(
        result.url,
        '_blank',
        'noopener,noreferrer'
      );
    } catch (documentError) {
      console.error(
        `Error opening ${documentType}:`,
        documentError
      );

      setError(
        documentError instanceof Error
          ? documentError.message
          : `Unable to open ${documentType}.`
      );
    }
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
    <div className="max-w-6xl space-y-6">

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
              Review applicant information,
              career details and documents.
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

              {application.linkedin_url && (
                <div>
                  <Label>LinkedIn</Label>

                  <a
                    href={
                      application.linkedin_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    View LinkedIn Profile
                  </a>
                </div>
              )}

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

          <Card className="border-border/60">

            <CardHeader>
              <CardTitle>
                Career Applied For
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">

                <div className="flex items-start gap-3">

                  <Briefcase className="mt-1 h-5 w-5 shrink-0 text-primary" />

                  <div>

                    <h2 className="font-display text-lg font-semibold">
                      {job?.title ||
                        'Career unavailable'}
                    </h2>

                    {job?.department && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Department:{' '}
                        {job.department}
                      </p>
                    )}

                    {job?.location && (
                      <p className="text-sm text-muted-foreground">
                        Location:{' '}
                        {job.location}
                      </p>
                    )}

                    {job?.type && (
                      <p className="text-sm text-muted-foreground">
                        Type: {job.type}
                      </p>
                    )}

                  </div>

                </div>

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

                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {application.cv_file_name ||
                    'No CV uploaded'}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full gap-2"
                  disabled={
                    !application.cv_file_path
                  }
                  onClick={() =>
                    openDocument(
                      application.cv_file_path,
                      'cv'
                    )
                  }
                >
                  <Download className="h-4 w-4" />

                  {application.cv_file_path
                    ? 'View / Download CV'
                    : 'CV Not Available'}
                </Button>

              </div>

              <div className="rounded-xl border border-border/60 p-5">

                <FileText className="h-8 w-8 text-accent" />

                <h3 className="mt-3 font-semibold">
                  Qualification
                </h3>

                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {application.qualification_file_name ||
                    'No qualification uploaded'}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full gap-2"
                  disabled={
                    !application.qualification_file_path
                  }
                  onClick={() =>
                    openDocument(
                      application.qualification_file_path,
                      'qualification'
                    )
                  }
                >
                  <Download className="h-4 w-4" />

                  {application.qualification_file_path
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
                Application Review
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              <div className="rounded-xl bg-muted/50 p-4 text-center">

                <Badge
                  variant={
                    status === 'rejected'
                      ? 'destructive'
                      : status === 'hired' ||
                        status ===
                          'shortlisted'
                      ? 'default'
                      : 'secondary'
                  }
                  className="px-4 py-1"
                >
                  {status}
                </Badge>

              </div>

              <div className="space-y-2">

                <Label htmlFor="application-status">
                  Status
                </Label>

                <select
                  id="application-status"
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

              <div className="space-y-2">

                <Label htmlFor="application-notes">
                  Admin Notes
                </Label>

                <Textarea
                  id="application-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  rows={7}
                  placeholder="Add internal notes about this applicant..."
                />

              </div>

              <Button
                type="button"
                onClick={handleSave}
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
                  : 'Save Review'}
              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}