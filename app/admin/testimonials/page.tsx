'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Testimonial = {
  id: string;
  client_name: string;
  company: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    loadTestimonials();
  };

  const filtered = testimonials.filter((t) =>
    t.client_name.toLowerCase().includes(search.toLowerCase()) ||
    (t.company && t.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-muted-foreground">Manage client testimonials and reviews.</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Testimonial
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search testimonials..."
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
            <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No testimonials found. Add your first client review!</p>
            <Link href="/admin/testimonials/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Testimonial
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((testimonial) => (
            <Card key={testimonial.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={testimonial.is_published ? 'default' : 'secondary'}>
                        {testimonial.is_published ? 'published' : 'draft'}
                      </Badge>
                      {testimonial.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{testimonial.client_name}</h3>
                    {testimonial.company && (
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{testimonial.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/testimonials/${testimonial.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit testimonial">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(testimonial.id)}
                      aria-label="Delete testimonial"
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
