import Link from 'next/link';
import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Contact Us
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let's talk about your{' '}
            <span className="text-accent">
              business growth
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Have a question, need advice, or want to
            explore how Salesway Consulting can help?
            Send us a message and our team will get
            back to you.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-display font-semibold">
                      Email
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Send us an email and we'll respond
                      as soon as possible.
                    </p>

                    <a
                      href="mailto:info@saleswayconsulting.com"
                      className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      info@saleswayconsulting.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-display font-semibold">
                      Phone
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Prefer to speak directly? Contact
                      our team.
                    </p>

                    <a
                      href="tel:+254700000000"
                      className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      +254 750 481 060

                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-display font-semibold">
                      Prefer a consultation?
                    </h2>

                    <p className="mt-2 text-sm text-primary-foreground/80">
                      Skip the message and book a
                      strategy conversation directly.
                    </p>

                    <Link href="/book">
                      <Button className="mt-4 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                        Book a Consultation
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardContent className="p-6 md:p-8">
              <div className="mb-7">
                <h2 className="font-display text-2xl font-bold">
                  Send us a message
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Complete the form below and we'll be
                  in touch.
                </p>
              </div>

              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}