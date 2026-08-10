'use client';

import { useEffect, useState } from 'react';
import { Building2, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  industry: string;
  testimonial: string | null;
  is_published: boolean;
  order: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setClients(data || []);
    setLoading(false);
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Our Clients
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Trusted by <span className="text-accent">industry leaders</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            We've had the privilege of working with amazing companies across
            various industries to help them achieve their growth goals.
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading clients...</div>
          ) : clients.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <Building2 className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No clients published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {clients.map((client) => (
                <Card key={client.id} className="border-border/60 bg-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={client.name}
                          className="h-24 w-24 object-contain"
                        />
                      ) : (
                        <Building2 className="h-12 w-12 text-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{client.name}</h3>
                      <Badge variant="outline" className="mt-1">{client.industry}</Badge>
                    </div>
                    {client.testimonial && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        "{client.testimonial}"
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Building2, value: '120+', label: 'Businesses served' },
              { icon: Star, value: '98%', label: 'Client satisfaction' },
              { icon: Building2, value: '12+', label: 'Industries' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-8 w-8 text-primary" />
                <div className="mt-2 text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to join our client family?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let's discuss how we can help your business grow.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="gap-2" asChild>
              <a href="/book">
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="/contact">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
