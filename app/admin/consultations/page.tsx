'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, Clock, Mail, Phone, Building2, Briefcase, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
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

  useEffect(() => { loadConsultations(); }, []);

  const loadConsultations = async () => {
    const { data } = await supabase.from('consultation_requests').select('*').order('created_at', { ascending: false });
    setConsultations(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('consultation_requests').update({ status }).eq('id', id);
    loadConsultations();
  };

  if (loading) return <div className="animate-pulse text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Consultation Requests</h1>
        <p className="mt-1 text-muted-foreground">View and manage booking requests from clients.</p>
      </div>

      {consultations.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No consultation requests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <Card key={c.id} className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-lg">{c.full_name}</h3>
                      <Badge variant={c.status === 'new' ? 'default' : 'secondary'}>{c.status}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {c.company && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-4 w-4 text-primary" /> {c.company}</div>}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> {c.email}</div>
                      {c.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary" /> {c.phone}</div>}
                      {c.business_size && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="h-4 w-4 text-primary" /> {c.business_size}</div>}
                      {c.industry && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-4 w-4 text-primary" /> {c.industry}</div>}
                      {c.preferred_date && <div className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarCheck className="h-4 w-4 text-primary" /> {c.preferred_date} {c.preferred_time && `at ${c.preferred_time}`}</div>}
                    </div>
                    {c.services_needed && c.services_needed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.services_needed.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                    )}
                    {c.message && (
                      <div className="rounded-lg border border-border/60 p-3 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mb-1 text-primary" />
                        {c.message}
                      </div>
                    )}
                  </div>
                  <div className="w-full lg:w-48">
                    <Select value={c.status} onValueChange={(v) => updateStatus(c.id, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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
