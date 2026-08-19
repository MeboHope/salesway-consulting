'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Briefcase,
  Eye,
  Loader2,
  User,
  Calendar,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Job = {
  id: string;
  title: string;
};

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

const statusVariant = (
  status: string
) => {
  switch (status) {
    case 'shortlisted':
    case 'hired':
      return 'default' as const;

    case 'rejected':
      return 'destructive' as const;

    default:
      return 'secondary' as const;
  }
};

export default function AdminJobApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [jobs, setJobs] =
    useState<Record<string, Job>>({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');

    const {
      data,
      error: fetchError,
    } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (fetchError) {
      console.error(
        'Error loading job applications:',
        fetchError
      );

      setError(
        fetchError.message ||
          'Unable to load job applications.'
      );

      setApplications([]);
      setLoading(false);
      return;
    }

    const applicationRows =
      (data || []) as Application[];

    setApplications(applicationRows);

    const jobIds = Array.from(
      new Set(
        applicationRows
          .map((item) => item.job_id)
          .filter(Boolean)
      )
    );

    if (jobIds.length > 0) {
      const {
        data: jobData,
        error: jobError,
      } = await supabase
        .from('jobs')
        .select('id, title')
        .in('id', jobIds);

      if (jobError) {
        console.error(
          'Error loading application careers:',
          jobError
        );
      }

      const jobMap: Record<string, Job> = {};

      (jobData || []).forEach(
        (job) => {
          jobMap[job.id] = job;
        }
      );

      setJobs(jobMap);
    } else {
      setJobs({});
    }

    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filtered =
    applications.filter((application) => {
      const query =
        search.trim().toLowerCase();

      if (!query) return true;

      const careerTitle =
        jobs[application.job_id]
          ?.title || '';

      return (
        application.full_name
          .toLowerCase()
          .includes(query) ||
        application.email
          .toLowerCase()
          .includes(query) ||
        application.phone
          .toLowerCase()
          .includes(query) ||
        careerTitle
          .toLowerCase()
          .includes(query)
      );
    });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Job Applications
        </h1>

        <p className="mt-1 text-muted-foreground">
          Review applications submitted for
          advertised positions.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search applicants or careers..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="pl-10"
        />
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading applications...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/30" />

            <h2 className="mt-4 font-display text-lg font-semibold">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Applications submitted through
              the careers section will appear
              here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">

          {filtered.map((application) => {
            const career =
              jobs[application.job_id];

            return (
              <Card
                key={application.id}
                className="border-border/60"
              >
                <CardContent className="p-5">

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <Badge
                          variant={statusVariant(
                            application.status
                          )}
                        >
                          {application.status ||
                            'new'}
                        </Badge>

                        <Badge variant="outline">
                          {career?.title ||
                            'Career unavailable'}
                        </Badge>

                        {application.cv_file_path && (
                          <Badge variant="secondary">
                            CV
                          </Badge>
                        )}

                        {application.qualification_file_path && (
                          <Badge variant="secondary">
                            Qualification
                          </Badge>
                        )}

                      </div>

                      <h3 className="mt-3 flex items-center gap-2 font-display font-semibold">
                        <User className="h-4 w-4 text-primary" />
                        {application.full_name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {application.email}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {application.phone}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />

                        {new Date(
                          application.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    <Link
                      href={`/admin/job-applications/${application.id}`}
                    >
                      <Button
                        variant="outline"
                        className="w-full gap-2 lg:w-auto"
                      >
                        <Eye className="h-4 w-4" />
                        View Application
                      </Button>
                    </Link>

                  </div>

                </CardContent>
              </Card>
            );
          })}

        </div>
      )}

    </div>
  );
}