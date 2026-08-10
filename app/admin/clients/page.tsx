'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Building2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Client = {
  id: string;
  name: string;
  industry: string;
  is_published: boolean;
  order: number;
  created_at: string;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('id, name, industry, is_published, order, created_at')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setClients(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    await supabase.from('clients').delete().eq('id', id);
    loadClients();
  };

  const filtered = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-muted-foreground">Manage your client portfolio and logos.</p>
        </div>
        <Link href="/admin/clients/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
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
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No clients found. Add your first client!</p>
            <Link href="/admin/clients/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Client
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((client) => (
            <Card key={client.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={client.is_published ? 'default' : 'secondary'}>
                        {client.is_published ? 'published' : 'draft'}
                      </Badge>
                      <Badge variant="outline">Order: {client.order}</Badge>
                      <Badge variant="outline">{client.industry}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{client.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    {client.is_published && (
                      <Link href="/clients" target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View clients page">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/clients/${client.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit client">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(client.id)}
                      aria-label="Delete client"
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
