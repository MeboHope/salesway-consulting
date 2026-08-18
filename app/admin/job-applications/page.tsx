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
  phone: string | null;
  cover_letter: string | null;
  cv_url: string | null;
  qualification_url: string | null;
  status: string;
  created_at: string;
  jobs?: Job | null;
};

const statusVariant = (
  status: string
) => {
  switch (status) {
    case 'shortlisted':
      return 'default' as const;
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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const loadApplications = async () => {
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
    } else {
      setApplications(
        (data || []) as Application[]
      );
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

      return (
        application.full_name
          ?.toLowerCase()
          .includes(query) ||
        application.email
          ?.toLowerCase()
          .includes(query) ||
        application.phone
          ?.toLowerCase()
          .includes(query) ||
        application.jobs?.title
          ?.toLowerCase()
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
          placeholder="Search applicants or positions..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="pl-10"
        />
      </div>

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="p-5">
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
              Applications submitted through the
              careers section will appear here.
            </p>

          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">

          {filtered.map((application) => (
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

                      {application.jobs?.title && (
                        <Badge variant="outline">
                          {application.jobs.title}
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

                    {application.phone && (
                      <p className="text-sm text-muted-foreground">
                        {application.phone}
                      </p>
                    )}

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
          ))}

        </div>
      )}

    </div>
  );
}