'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, ArrowRight, Loader2, CheckCircle2, User,
  Building2, Mail, Phone, Briefcase, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/hooks/use-reveal';
import { businessSizes, serviceOptions, industries } from '@/lib/data';

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM',
];

export default function BookPage() {
  useReveal();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    full_name: '',
    company: '',
    email: '',
    phone: '',
    business_size: '',
    industry: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const { error: insertError } = await supabase
      .from('consultation_requests')
      .insert({
        ...form,
        services_needed: selectedServices,
        preferred_date: form.preferred_date || null,
      });

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
            Free Strategy Call
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Book your free{' '}
            <span className="text-accent">strategy call</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            A 30-minute, no-pressure conversation to understand your business
            and uncover your biggest growth opportunities. No pitch. No
            obligation. Just clarity.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {status === 'success' ? (
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Request received!</h2>
                  <p className="max-w-md text-muted-foreground">
                    Thank you, {form.full_name.split(' ')[0] || 'there'}! We&apos;ve
                    received your consultation request and will confirm your
                    appointment within one business day. Check your inbox at{' '}
                    <span className="font-medium text-foreground">{form.email}</span>.
                  </p>
                  <Link href="/">
                    <Button variant="outline" className="mt-2">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60 reveal">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      Your Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          required
                          value={form.full_name}
                          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="Your company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="jane@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+254 700 000 000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div>
                    <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5 text-primary" />
                      About Your Business
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="business_size">Business Size</Label>
                        <Select
                          value={form.business_size}
                          onValueChange={(v) => setForm({ ...form, business_size: v })}
                        >
                          <SelectTrigger id="business_size">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessSizes.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={form.industry}
                          onValueChange={(v) => setForm({ ...form, industry: v })}
                        >
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind.name} value={ind.name}>{ind.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Services Needed
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {serviceOptions.map((service) => (
                        <label
                          key={service}
                          className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                            selectedServices.includes(service)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <Checkbox
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleService(service)}
                          />
                          <span className="text-sm font-medium">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div>
                    <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      Preferred Schedule
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="preferred_date">Preferred Date</Label>
                        <Input
                          id="preferred_date"
                          type="date"
                          value={form.preferred_date}
                          onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferred_time">Preferred Time</Label>
                        <Select
                          value={form.preferred_time}
                          onValueChange={(v) => setForm({ ...form, preferred_time: v })}
                        >
                          <SelectTrigger id="preferred_time">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Additional Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your goals</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="What are you hoping to achieve? What challenges are you facing?"
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    Request Free Consultation
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    We&apos;ll confirm your appointment within one business day. No payment required.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
