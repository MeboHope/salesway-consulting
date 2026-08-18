'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building2,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  industry: string;
  testimonial: string | null;
  is_published: boolean;
  order: number;
  created_at: string;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadClients = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('clients')
      .select(
        'id, name, logo_url, industry, testimonial, is_published, "order", created_at'
      )
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading clients:', fetchError);
      setError(fetchError.message);
      setClients([]);
    } else {
      setClients((data || []) as Client[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadClients();
  };

  const filtered = clients.filter((client) =>
    `${client.name} ${client.industry}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Clients
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage the clients displayed on the website.
          </p>
        </div>

        <Link href="/admin/clients/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-muted-foreground">
          Loading clients...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              No clients found.
            </p>

            <Link href="/admin/clients/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((client) => (
            <Card key={client.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={client.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            client.is_published
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {client.is_published
                            ? 'Published'
                            : 'Draft'}
                        </Badge>

                        <Badge variant="outline">
                          {client.industry}
                        </Badge>
                      </div>

                      <h3 className="mt-2 truncate font-display font-semibold">
                        {client.name}
                      </h3>

                      {client.testimonial && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {client.testimonial}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {client.is_published && (
                      <Link
                        href="/clients"
                        target="_blank"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View clients"
                          aria-label="View clients"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    <Link href={`/admin/clients/${client.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit client"
                        aria-label="Edit client"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete client"
                      aria-label="Delete client"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(client.id)}
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