'use client';

import { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, MessageSquare, Send, Loader2,
  CheckCircle2, Linkedin, Facebook, Instagram, Twitter, MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/use-reveal';

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'X (Twitter)', href: '#' },
];

export default function ContactPage() {
  useReveal();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert(form);

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setStatus('error');
      return;
    }
    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Contact Us
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Let&apos;s start a{' '}
            <span className="text-accent">conversation</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Have a question or ready to grow? Reach out and we&apos;ll get back
            to you within one business day.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Info */}
            <div className="space-y-6 reveal">
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">Email</h3>
                      <p className="mt-1 text-sm text-muted-foreground">cuteblueinteriors@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">Phone</h3>
                      <p className="mt-1 text-sm text-muted-foreground">+254 750 481 060</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">Office</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Nairobi, Kenya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#25D366]/30 bg-[#25D366]/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">WhatsApp</h3>
                      <p className="mt-1 text-sm text-muted-foreground">+254 750 481 060</p>
                      <a
                        href="https://wa.me/254750481060"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">Office Hours</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM</p>
                      <p className="text-sm text-muted-foreground">Sat: 9:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 reveal" style={{ transitionDelay: '150ms' }}>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  {status === 'success' ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h3 className="font-display text-xl font-semibold">Message sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We&apos;ll get back to you within one business day.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setStatus('idle')}
                        className="mt-2"
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h3 className="font-display text-lg font-semibold">Send us a message</h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="jane@company.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          placeholder="How can we help?"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          required
                          rows={6}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Tell us about your business and what you'd like to achieve..."
                        />
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <Button type="submit" disabled={status === 'loading'} className="w-full gap-2" size="lg">
                        {status === 'loading' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-64 rounded-2xl border border-border/60 bg-transparent flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
