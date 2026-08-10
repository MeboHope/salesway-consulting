'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type PricingPackage = {
  id: string;
  name: string;
  price: string;
  period: string;
  is_popular: boolean;
  is_published: boolean;
  order: number;
  created_at: string;
};

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const { data } = await supabase
      .from('pricing_packages')
      .select('id, name, price, period, is_popular, is_published, order, created_at')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setPackages(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing package?')) return;
    await supabase.from('pricing_packages').delete().eq('id', id);
    loadPackages();
  };

  const filtered = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Pricing Packages</h1>
          <p className="mt-1 text-muted-foreground">Manage service packages and pricing tiers.</p>
        </div>
        <Link href="/admin/pricing/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Package
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search packages..."
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
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No pricing packages found. Add your first package!</p>
            <Link href="/admin/pricing/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Package
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((pkg) => (
            <Card key={pkg.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={pkg.is_published ? 'default' : 'secondary'}>
                        {pkg.is_published ? 'published' : 'draft'}
                      </Badge>
                      {pkg.is_popular && (
                        <Badge variant="outline">Popular</Badge>
                      )}
                      <Badge variant="outline">Order: {pkg.order}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{pkg.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pkg.price}/{pkg.period}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {pkg.is_published && (
                      <Link href="/pricing" target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View pricing page">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/pricing/${pkg.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit package">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pkg.id)}
                      aria-label="Delete package"
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
