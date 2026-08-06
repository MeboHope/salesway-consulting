'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Resource = {
  id: string;
  title: string;
  slug: string;
  category: string;
  requires_email: boolean;
  created_at: string;
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const { data } = await supabase
      .from('resources')
      .select('id, title, slug, category, requires_email, created_at')
      .order('created_at', { ascending: false });

    setResources(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    await supabase.from('resources').delete().eq('id', id);
    loadResources();
  };

  const filtered = resources.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase()) ||
    resource.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Resources</h1>
          <p className="mt-1 text-muted-foreground">Manage download and signup resources.</p>
        </div>
        <Link href="/admin/resources/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Resource
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
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
            <Download className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No resources found. Add a new downloadable asset.</p>
            <Link href="/admin/resources/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Resource
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((resource) => (
            <Card key={resource.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={resource.requires_email ? 'secondary' : 'default'}>
                        {resource.requires_email ? 'Signup required' : 'Free'}
                      </Badge>
                      <Badge variant="outline">/{resource.slug}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{resource.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{resource.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/resources/${resource.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" aria-label="View resource">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/resources/${resource.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit resource">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resource.id)}
                      aria-label="Delete resource"
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
