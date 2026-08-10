'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
};

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    const { data } = await supabase
      .from('case_studies')
      .select('id, title, slug, client, industry, is_published, is_featured, created_at')
      .order('created_at', { ascending: false });
    setCaseStudies(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    await supabase.from('case_studies').delete().eq('id', id);
    loadCaseStudies();
  };

  const filtered = caseStudies.filter((cs) =>
    cs.title.toLowerCase().includes(search.toLowerCase()) ||
    cs.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Case Studies</h1>
          <p className="mt-1 text-muted-foreground">Manage detailed success stories and client results.</p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Case Study
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search case studies..."
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
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No case studies found. Add your first success story!</p>
            <Link href="/admin/case-studies/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Case Study
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((study) => (
            <Card key={study.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={study.is_published ? 'default' : 'secondary'}>
                        {study.is_published ? 'published' : 'draft'}
                      </Badge>
                      {study.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                      <Badge variant="outline">{study.industry}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{study.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{study.client}</p>
                    <p className="mt-1 text-xs text-muted-foreground">/{study.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    {study.is_published && (
                      <Link href={`/case-studies/${study.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View case study">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/case-studies/${study.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit case study">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(study.id)}
                      aria-label="Delete case study"
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
