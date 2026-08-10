'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  order: number;
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setFaqs(data || []);
    setLoading(false);
  };

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            FAQ
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Frequently Asked <span className="text-accent">Questions</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Find answers to common questions about our services, process, and
            how we can help your business grow.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <HelpCircle className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No FAQs published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="font-display text-2xl font-bold tracking-tight mb-4">
                    {category}
                  </h2>
                  <div className="space-y-3">
                    {faqs
                      .filter(f => f.category === category)
                      .map((faq) => (
                        <Card key={faq.id} className="border-border/60">
                          <CardContent className="p-0">
                            <button
                              onClick={() => toggleItem(faq.id)}
                              className="w-full flex items-center justify-between p-6 text-left hover:bg-accent/5 transition-colors"
                            >
                              <span className="font-semibold text-foreground">{faq.question}</span>
                              {openItems.has(faq.id) ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                            </button>
                            {openItems.has(faq.id) && (
                              <div className="px-6 pb-6 pt-0">
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Still have questions?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're here to help. Reach out and we'll get back to you shortly.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Badge variant="secondary" className="bg-accent/10 text-accent text-base py-2 px-4">
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </Badge>
          </div>
        </div>
      </section>
    </main>
  );
}
