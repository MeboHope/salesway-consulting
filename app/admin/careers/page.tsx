'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Briefcase, Eye } from 'lucide-react';
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
  is_published: boolean;
  created_at: string;
};

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('id, title, department, location, type, is_published, created_at')
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    await supabase.from('jobs').delete().eq('id', id);
    loadJobs();
  };

  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Careers</h1>
          <p className="mt-1 text-muted-foreground">Manage job postings and career opportunities.</p>
        </div>
        <Link href="/admin/careers/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Job Posting
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No job postings found. Add your first position!</p>
            <Link href="/admin/careers/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Job Posting
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <Card key={job.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={job.is_published ? 'default' : 'secondary'}>
                        {job.is_published ? 'published' : 'draft'}
                      </Badge>
                      <Badge variant="outline">{job.department}</Badge>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{job.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
                  </div>
                  <div className="flex gap-2">
                    {job.is_published && (
                      <Link href="/careers" target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View careers page">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/careers/${job.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit job">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(job.id)}
                      aria-label="Delete job"
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
