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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  is_published: boolean;
  created_at: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('services')
      .select('id, title, slug, summary, is_published, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
      setServices([]);
    } else {
      setServices((data || []) as Service[]);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadServices();
  };

  const filtered = services.filter((service) => {
    const query = search.toLowerCase();

    return (
      service.title.toLowerCase().includes(query) ||
      service.slug.toLowerCase().includes(query) ||
      service.summary.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Services
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage service offerings shown on the website.
          </p>
        </div>

        <Link href="/admin/services/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Service
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-muted-foreground">
          Loading services...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />

            <p className="mt-4 text-muted-foreground">
              No services found.
            </p>

            <Link href="/admin/services/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((service) => (
            <Card key={service.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          service.is_published ? 'default' : 'secondary'
                        }
                      >
                        {service.is_published ? 'published' : 'draft'}
                      </Badge>

                      <Badge variant="outline">
                        /{service.slug}
                      </Badge>
                    </div>

                    <h3 className="mt-2 font-display font-semibold">
                      {service.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {service.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      target="_blank"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="View service"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href={`/admin/services/${service.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit service"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                      aria-label="Delete service"
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