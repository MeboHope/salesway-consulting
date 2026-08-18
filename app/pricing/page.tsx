'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type PricingPackage = {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  is_popular: boolean;
  is_published: boolean;
  order: number;
};

export default function PricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select(
          'id, name, description, price, period, features, is_popular, is_published, order'
        )
        .eq('is_published', true)
        .order('order', { ascending: true });

      if (error) {
        console.error(
          'Error loading pricing:',
          JSON.stringify(error, null, 2)
        );
        setPackages([]);
      } else {
        setPackages((data || []) as PricingPackage[]);
      }

      setLoading(false);
    };

    loadPricing();
  }, []);

  return (
    <main className="pt-16">
      <section className="py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-accent/10 text-accent">
            Pricing
          </Badge>

          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Choose the right growth package
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Practical consulting packages designed around your business goals.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading pricing...
            </div>
          ) : packages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Pricing packages will be available soon.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((item) => (
                <Card
                  key={item.id}
                  className={`relative flex flex-col ${
                    item.is_popular
                      ? 'border-primary shadow-xl'
                      : 'border-border/60'
                  }`}
                >
                  {item.is_popular && (
                    <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader>
                    <CardTitle className="font-display text-2xl">
                      {item.name}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="pt-4">
                      <span className="font-display text-4xl font-bold">
                        {item.price}
                      </span>

                      <span className="ml-2 text-sm text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <div className="space-y-3">
                      {item.features.map((feature, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/book" className="mt-auto pt-8">
                      <Button className="w-full gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}