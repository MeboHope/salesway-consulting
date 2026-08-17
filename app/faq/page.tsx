'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

const fallbackFaqs: Faq[] = [
  {
    id: 'fallback-1',
    question: 'What services does Salesway Consulting provide?',
    answer:
      'We provide sales strategy and growth consulting, business strategy and positioning, marketing support, growth coaching, business process improvement, and corporate training.',
    sort_order: 1,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-2',
    question: 'Who can work with Salesway Consulting?',
    answer:
      'We work with entrepreneurs, SMEs, established businesses, executives, and teams looking to improve sales, marketing, operations, leadership, and sustainable business growth.',
    sort_order: 2,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-3',
    question: 'How does the consulting process work?',
    answer:
      'We begin with a discovery conversation, assess your business and growth opportunities, develop a practical strategy, support implementation, and continuously measure and improve the results.',
    sort_order: 3,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-4',
    question: 'Can you customize your services for my business?',
    answer:
      'Yes. Every engagement is tailored to your business, industry, current challenges, resources, and growth objectives.',
    sort_order: 4,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-5',
    question: 'Do you offer corporate training?',
    answer:
      'Yes. Our practical training programs cover sales excellence, leadership, customer service, team productivity, and communication skills.',
    sort_order: 5,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-6',
    question: 'How can I get started?',
    answer:
      'The easiest way to get started is to book a consultation. We will have a conversation about your business, goals, and the areas where you need support.',
    sort_order: 6,
    is_published: true,
    created_at: '',
  },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    setLoading(true);

    const { data, error } = await supabase
      .from('faqs')
      .select(
        'id, question, answer, sort_order, is_published, created_at'
      )
      .eq('is_published', true)
      .order('sort_order', {
        ascending: true,
      })
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error('Error loading FAQs:', error);
      setFaqs(fallbackFaqs);
    } else if (data && data.length > 0) {
      setFaqs(data as Faq[]);
    } else {
      setFaqs(fallbackFaqs);
    }

    setLoading(false);
  }

  function toggleFaq(id: string) {
    setOpenId((current) =>
      current === id ? null : id
    );
  }

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary"
          >
            Frequently Asked Questions
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Questions?
            <span className="text-accent">
              {' '}
              We have answers.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Find answers to some of the most common questions
            about Salesway Consulting, our services, and how we
            help businesses grow.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading FAQs...</span>
            </div>
          ) : faqs.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-16 text-center">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />

                <h2 className="mt-4 font-display text-xl font-semibold">
                  No FAQs available
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Please check back soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openId === faq.id;

                return (
                  <Card
                    key={faq.id}
                    className="overflow-hidden border-border/60 transition-all hover:border-primary/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 p-6 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="pt-1 font-display text-base font-semibold text-foreground sm:text-lg">
                          {faq.question}
                        </span>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-border/60 bg-primary/[0.02] px-6 pb-6 pt-5">
                        <div className="ml-12 max-w-3xl">
                          <p className="text-base leading-8 text-muted-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/85" />

        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Still have questions?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Let&apos;s have a conversation about your business,
            your challenges, and where you want to go next.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link href="/book">
                Book a Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}