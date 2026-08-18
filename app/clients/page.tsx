'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Quote,
} from 'lucide-react';

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

const fallbackClients: Client[] = [];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(
          'id, name, logo_url, industry, testimonial, is_published, "order"'
        )
        .eq('is_published', true)
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading clients:', error);
        setClients(fallbackClients);
      } else {
        setClients((data || []) as Client[]);
      }

      setLoading(false);
    };

    loadClients();
  }, []);

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-transparent py-20">
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary"
          >
            Our Clients
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Businesses we've helped{' '}
            <span className="text-accent">
              grow
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            We work with ambitious businesses across
            industries to build stronger sales,
            marketing, strategy, and operations.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading clients...
            </div>
          ) : clients.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-16 text-center">
                <Building2 className="mx-auto h-16 w-16 text-muted-foreground/30" />

                <h2 className="mt-5 font-display text-xl font-semibold">
                  Our client portfolio is growing
                </h2>

                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Client stories and partnerships will
                  appear here as they are published.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card
                  key={client.id}
                  className="group overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex h-20 items-center justify-center rounded-2xl bg-muted/40 p-4">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={`${client.name} logo`}
                          className="max-h-14 max-w-full object-contain"
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-primary/60" />
                      )}
                    </div>

                    <div className="mt-5">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {client.industry}
                      </Badge>

                      <h2 className="mt-3 font-display text-xl font-semibold">
                        {client.name}
                      </h2>

                      {client.testimonial && (
                        <div className="mt-5 border-t border-border/60 pt-5">
                          <Quote className="h-5 w-5 text-accent" />

                          <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            {client.testimonial}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary to-primary/90 py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to become our next success story?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Let's discuss your business goals and
            identify the opportunities that can move
            your business forward.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/book">
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}