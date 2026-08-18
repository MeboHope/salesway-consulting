'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Upload,
  CheckCircle2,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

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

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
};

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [qualificationFile, setQualificationFile] =
    useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(
          'id, title, department, location, type'
        )
        .eq('id', jobId)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !data) {
        setError('This job is no longer available.');
      } else {
        setJob(data);
      }

      setLoading(false);
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const validateFile = (file: File | null) => {
    if (!file) {
      return true;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Please upload a PDF, DOC, or DOCX file.'
      );
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        'Each document must be 10MB or smaller.'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    if (!cvFile) {
      setError('Please upload your CV.');
      return;
    }

    if (!validateFile(cvFile)) {
      return;
    }

    if (!validateFile(qualificationFile)) {
      return;
    }

    setSaving(true);

    try {
      const { data: application, error: applicationError } =
        await supabase
          .from('job_applications')
          .insert({
            job_id: jobId,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            linkedin_url:
              linkedinUrl.trim() || null,
            cover_letter:
              coverLetter.trim() || null,
          })
          .select('id')
          .single();

      if (applicationError || !application) {
        throw new Error(
          applicationError?.message ||
            'Unable to create application.'
        );
      }

      const applicationId = application.id;

      const uploadFile = async (
        file: File,
        type: 'cv' | 'qualification'
      ) => {
        const extension =
          file.name.split('.').pop() || 'pdf';

        const path =
          `applications/${applicationId}/${type}-${Date.now()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from('job-applications')
            .upload(path, file, {
              upsert: false,
              contentType: file.type,
            });

        if (uploadError) {
          throw new Error(
            uploadError.message
          );
        }

        return {
          path,
          name: file.name,
        };
      };

      const cvUpload = await uploadFile(
        cvFile,
        'cv'
      );

      let qualificationUpload:
        | {
            path: string;
            name: string;
          }
        | null = null;

      if (qualificationFile) {
        qualificationUpload =
          await uploadFile(
            qualificationFile,
            'qualification'
          );
      }

      const { error: updateError } =
        await supabase
          .from('job_applications')
          .update({
            cv_file_path: cvUpload.path,
            cv_file_name: cvUpload.name,
            qualification_file_path:
              qualificationUpload?.path ||
              null,
            qualification_file_name:
              qualificationUpload?.name ||
              null,
          })
          .eq('id', applicationId);

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      setSuccess(true);
    } catch (submitError) {
      console.error(
        'Job application error:',
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit application.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">
            Job unavailable
          </h1>

          <p className="mt-3 text-muted-foreground">
            {error}
          </p>

          <Link href="/careers">
            <Button className="mt-6">
              Back to Careers
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-2xl px-4 py-20">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />

              <h1 className="mt-6 font-display text-3xl font-bold">
                Application submitted
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Thank you for applying for the{' '}
                <strong>{job.title}</strong>{' '}
                position. Our team will review
                your application and contact you
                if you are shortlisted.
              </p>

              <Link href="/careers">
                <Button className="mt-8">
                  Back to Careers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">

        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-primary">
            Job Application
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold">
            {job.title}
          </h1>

          <p className="mt-3 text-muted-foreground">
            {job.department} · {job.location} ·{' '}
            {job.type}
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              Application Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name
                  </Label>

                  <Input
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">
                    LinkedIn Profile
                  </Label>

                  <Input
                    id="linkedin"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) =>
                      setLinkedinUrl(e.target.value)
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">
                  Cover Letter
                </Label>

                <Textarea
                  id="coverLetter"
                  rows={8}
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  placeholder="Tell us why you are a good fit for this position..."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cv">
                    CV / Resume *
                  </Label>

                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) =>
                      setCvFile(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                  />

                  <p className="text-xs text-muted-foreground">
                    PDF, DOC or DOCX · Maximum 10MB
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">
                    Academic Qualification
                  </Label>

                  <Input
                    id="qualification"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setQualificationFile(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                  />

                  <p className="text-xs text-muted-foreground">
                    Optional · PDF, DOC or DOCX · Maximum
                    10MB
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={saving}
                className="w-full gap-2 sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {saving
                  ? 'Submitting...'
                  : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}