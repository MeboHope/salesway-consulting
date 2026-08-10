'use client';

import { useEffect, useState } from 'react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Testimonials
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            What our <span className="text-accent">clients say</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Real results from real businesses. See how we've helped companies
            across industries achieve sustainable growth.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <Quote className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No testimonials published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-border/60 bg-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                    <div className="pt-4 border-t border-border/60">
                      <p className="font-semibold text-foreground">{testimonial.client_name}</p>
                      {testimonial.company && (
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      )}
                    </div>
                    {testimonial.is_featured && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Featured
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to achieve similar results?
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
