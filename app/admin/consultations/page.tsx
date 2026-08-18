'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  CalendarCheck,
  Eye,
  Trash2,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Consultation = {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  business_size: string | null;
  industry: string | null;
  services_needed: string[];
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadConsultations = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('consultation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading consultations:', fetchError);
      setError(fetchError.message);
      setConsultations([]);
    } else {
      setConsultations((data || []) as Consultation[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    const { error: updateError } = await supabase
      .from('consultation_requests')
      .update({ status })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadConsultations();
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this consultation request?'
      )
    ) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('consultation_requests')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadConsultations();
  };

  const filtered = consultations.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.full_name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.company || '').toLowerCase().includes(query) ||
      (item.industry || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Consultations
        </h1>

        <p className="mt-1 text-muted-foreground">
          View and manage consultation requests from potential clients.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search consultations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          Loading consultations...
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CalendarCheck className="h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              No consultation requests found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          item.status === 'new'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {item.status}
                      </Badge>

                      {item.industry && (
                        <Badge variant="outline">
                          {item.industry}
                        </Badge>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold">
                      {item.full_name}
                    </h3>

                    {item.company && (
                      <p className="text-sm text-muted-foreground">
                        {item.company}
                      </p>
                    )}

                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>{item.email}</p>

                      {item.phone && <p>{item.phone}</p>}

                      {item.preferred_date && (
                        <p>
                          Preferred date:{' '}
                          {new Date(
                            item.preferred_date
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {item.preferred_time && (
                        <p>
                          Preferred time: {item.preferred_time}
                        </p>
                      )}
                    </div>

                    {item.message && (
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {item.message}
                      </p>
                    )}

                    {item.services_needed?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.services_needed.map((service) => (
                          <Badge
                            key={service}
                            variant="secondary"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(item.id, e.target.value)
                      }
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="View details"
                      onClick={() =>
                        window.alert(
                          `${item.full_name}\n\n${item.message || 'No message provided.'}`
                        )
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete consultation"
                      onClick={() => handleDelete(item.id)}
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