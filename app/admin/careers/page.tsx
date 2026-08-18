'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Briefcase,
  Eye,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary_range: string;
  description: string;
  requirements: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('jobs')
      .select(
        'id, title, department, location, type, salary_range, description, requirements, is_published, created_at, updated_at'
      )
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading jobs:', fetchError);
      setError(fetchError.message);
      setJobs([]);
    } else {
      setJobs((data || []) as Job[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadJobs();
  };

  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Careers
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage job opportunities displayed on the website.
          </p>
        </div>

        <Link href="/admin/careers/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading jobs...
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              {search
                ? 'No jobs match your search.'
                : 'No job postings found.'}
            </p>

            {!search && (
              <Link href="/admin/careers/new">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Job
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          job.is_published ? 'default' : 'secondary'
                        }
                      >
                        {job.is_published ? 'Published' : 'Draft'}
                      </Badge>

                      <Badge variant="outline">{job.type}</Badge>

                      <Badge variant="outline">
                        {job.department}
                      </Badge>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.location}
                      {job.salary_range
                        ? ` · ${job.salary_range}`
                        : ''}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {job.is_published && (
                      <Link
                        href="/careers"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="View careers"
                          title="View on website"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    <Link href={`/admin/careers/${job.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit job"
                        title="Edit job"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete job"
                      title="Delete job"
                      onClick={() => handleDelete(job.id)}
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