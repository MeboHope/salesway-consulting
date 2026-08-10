'use client';

import { useEffect, useState } from 'react';
import { Mail, Search, Trash2, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Subscriber = {
  id: string;
  email: string;
  status: string;
  created_at: string;
};

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    await supabase.from('subscribers').delete().eq('id', id);
    loadSubscribers();
  };

  const handleExport = () => {
    const csv = [
      ['Email', 'Status', 'Subscribed Date'],
      ...subscribers.map(s => [
        s.email,
        s.status,
        new Date(s.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Subscribers</h1>
          <p className="mt-1 text-muted-foreground">Manage newsletter and email list subscribers.</p>
        </div>
        <Button onClick={handleExport} className="gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{subscribers.length}</div>
            <div className="text-sm text-muted-foreground">Total subscribers</div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No subscribers found yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((subscriber) => (
            <Card key={subscriber.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                        {subscriber.status}
                      </Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{subscriber.email}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Subscribed {new Date(subscriber.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(subscriber.id)}
                    aria-label="Delete subscriber"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
