
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  Eye,
} from 'lucide-react';

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
  const [error, setError] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setLoading(true);

    const { data, error } = await supabase
      .from('testimonials')
      .select(
        'id, client_name, company, content, rating, is_featured, is_published, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setTestimonials([]);
    } else {
      setTestimonials((data || []) as Testimonial[]);
      setError('');
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    loadTestimonials();
  }

  const filtered = testimonials.filter((t) =>
    `${t.client_name} ${t.company || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Testimonials
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage client reviews displayed on the website.
          </p>
        </div>

        <Link href="/admin/testimonials/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Testimonial
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search testimonials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="animate-pulse text-muted-foreground">
          Loading testimonials...
        </div>
      ) : error ? (
        <Card className="border-destructive/20">
          <CardContent className="pt-6 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-8 pb-8 text-center">
            <Star className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">
              No testimonials found.
            </p>

            <Link href="/admin/testimonials/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add First Testimonial
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((testimonial) => (
            <Card key={testimonial.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          testimonial.is_published ? 'default' : 'secondary'
                        }
                      >
                        {testimonial.is_published ? 'Published' : 'Draft'}
                      </Badge>

                      {testimonial.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}

                      <div className="ml-auto flex gap-0.5 sm:ml-0">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`h-4 w-4 ${
                              n <= testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-semibold">
                      {testimonial.client_name}
                    </h3>

                    {testimonial.company && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.company}
                      </p>
                    )}

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {testimonial.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* NEW VIEW ICON */}
                    <Link
                      href="/testimonials"
                      target="_blank"
                      title="View on website"
                    >
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link
                      href={`/admin/testimonials/${testimonial.id}`}
                      title="Edit testimonial"
                    >
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete testimonial"
                      onClick={() => handleDelete(testimonial.id)}
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