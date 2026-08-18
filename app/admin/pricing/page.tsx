'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  created_at: string;
};

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadPackages = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading pricing:', fetchError);
      setError(fetchError.message);
      setPackages([]);
    } else {
      setPackages((data || []) as PricingPackage[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this pricing package?'
      )
    ) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('pricing_packages')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadPackages();
  };

  const filtered = packages.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Pricing
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage pricing packages displayed on the website.
          </p>
        </div>

        <Link href="/admin/pricing/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            New Package
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search pricing packages..."
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
          Loading pricing...
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              No pricing packages found.
            </p>

            <Link href="/admin/pricing/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Package
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="border-border/60"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          item.is_published
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {item.is_published
                          ? 'Published'
                          : 'Draft'}
                      </Badge>

                      {item.is_popular && (
                        <Badge variant="outline">
                          Popular
                        </Badge>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-xl font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-2xl font-bold text-primary">
                      {item.price}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        {item.period}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Link
                      href={`/admin/pricing/${item.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit package"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete package"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-4 space-y-2">
                  {(item.features || []).map(
                    (feature) => (
                      <div
                        key={feature}
                        className="text-sm"
                      >
                        ✓ {feature}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}