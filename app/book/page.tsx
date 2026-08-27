'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle2,
  User,
  Building2,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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

import {
  businessSizes,
  serviceOptions,
  industries,
} from '@/lib/data';

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export default function BookPage() {
  useReveal();

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [error, setError] = useState('');

  const [selectedServices, setSelectedServices] =
    useState<string[]>([]);

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
    setSelectedServices((previous) =>
      previous.includes(service)
        ? previous.filter((item) => item !== service)
        : [...previous, service]
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setStatus('loading');
    setError('');

    const payload = {
      full_name: form.full_name.trim(),
      company: form.company.trim() || null,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      business_size: form.business_size || null,
      industry: form.industry || null,
      services_needed: selectedServices,
      preferred_date:
        form.preferred_date || null,
      preferred_time:
        form.preferred_time || null,
      message: form.message.trim() || null,
      status: 'new',
    };

    const { error: insertError } = await supabase
      .from('consultation_requests')
      .insert(payload);

    if (insertError) {
      console.error(
        'Consultation submission error:',
        insertError
      );

      setError(
        'We could not submit your consultation request. Please try again.'
      );

      setStatus('error');
      return;
    }

    setStatus('success');
  };

  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Header */}
      <section className="relative overflow-visible py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent"
          >
            Free Strategy Call
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Book your free{' '}
            <span className="text-accent">
              strategy call
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground text-pretty">
            A 30-minute, no-pressure conversation to
            understand your business and uncover your
            biggest growth opportunities. No pitch. No
            obligation. Just clarity.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="relative z-20 overflow-visible py-12">
        <div className="relative z-30 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {status === 'success' ? (
            <Card className="relative z-30 border-border/60 bg-card shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <h2 className="font-display text-2xl font-bold">
                    Request received!
                  </h2>

                  <p className="max-w-md text-muted-foreground">
                    Thank you,{' '}
                    {form.full_name.split(' ')[0] ||
                      'there'}
                    ! We&apos;ve received your
                    consultation request and will
                    confirm your appointment within one
                    business day.
                  </p>

                  <p className="max-w-md text-sm text-muted-foreground">
                    We&apos;ll contact you using:
                  </p>

                  <div className="rounded-lg bg-muted px-4 py-3 text-sm font-medium">
                    {form.email}
                  </div>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="mt-2"
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="relative z-30 overflow-visible border-border/60 bg-card shadow-xl">
              <CardContent className="pt-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Personal Information */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
                      <User className="h-5 w-5 text-primary" />
                      Your Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">
                          Full Name *
                        </Label>

                        <Input
                          id="full_name"
                          required
                          value={form.full_name}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              full_name:
                                event.target.value,
                            })
                          }
                          placeholder="Jane Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">
                          Company
                        </Label>

                        <Input
                          id="company"
                          value={form.company}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              company:
                                event.target.value,
                            })
                          }
                          placeholder="Your company name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email *
                        </Label>

                        <Input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              email:
                                event.target.value,
                            })
                          }
                          placeholder="jane@company.com"
                          autoComplete="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone
                        </Label>

                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              phone:
                                event.target.value,
                            })
                          }
                          placeholder="+254 700 000 000"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="relative z-40">
                    <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
                      <Building2 className="h-5 w-5 text-primary" />
                      About Your Business
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Business Size */}
                      <div className="relative z-[70] space-y-2">
                        <Label htmlFor="business_size">
                          Business Size
                        </Label>

                        <Select
                          value={form.business_size}
                          onValueChange={(value) =>
                            setForm({
                              ...form,
                              business_size:
                                value,
                            })
                          }
                        >
                          <SelectTrigger
                            id="business_size"
                            className="relative z-[71] bg-background"
                          >
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>

                          <SelectContent
                            position="popper"
                            className="z-[100] max-h-72 border-border bg-white text-foreground shadow-2xl dark:bg-card"
                            sideOffset={6}
                          >
                            {businessSizes.map(
                              (size) => (
                                <SelectItem
                                  key={size}
                                  value={size}
                                  className="cursor-pointer bg-white text-foreground focus:bg-primary/10 focus:text-foreground dark:bg-card"
                                >
                                  {size}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Industry */}
                      <div className="relative z-[70] space-y-2">
                        <Label htmlFor="industry">
                          Industry
                        </Label>

                        <Select
                          value={form.industry}
                          onValueChange={(value) =>
                            setForm({
                              ...form,
                              industry: value,
                            })
                          }
                        >
                          <SelectTrigger
                            id="industry"
                            className="relative z-[71] bg-background"
                          >
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>

                          <SelectContent
                            position="popper"
                            className="z-[100] max-h-72 border-border bg-white text-foreground shadow-2xl dark:bg-card"
                            sideOffset={6}
                          >
                            {industries.map(
                              (industry) => (
                                <SelectItem
                                  key={industry.name}
                                  value={industry.name}
                                  className="cursor-pointer bg-white text-foreground focus:bg-primary/10 focus:text-foreground dark:bg-card"
                                >
                                  {industry.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="relative z-10">
                    <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Services Needed
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {serviceOptions.map(
                        (service) => {
                          const selected =
                            selectedServices.includes(
                              service
                            );

                          return (
                            <label
                              key={service}
                              className={[
                                'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all',
                                selected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/30',
                              ].join(' ')}
                            >
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() =>
                                  toggleService(
                                    service
                                  )
                                }
                              />

                              <span className="text-sm font-medium">
                                {service}
                              </span>
                            </label>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div className="relative z-40">
                    <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
                      <Calendar className="h-5 w-5 text-primary" />
                      Preferred Schedule
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor="preferred_date">
                          Preferred Date
                        </Label>

                        <Input
                          id="preferred_date"
                          type="date"
                          value={form.preferred_date}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              preferred_date:
                                event.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Time */}
                      <div className="relative z-[70] space-y-2">
                        <Label htmlFor="preferred_time">
                          Preferred Time
                        </Label>

                        <Select
                          value={form.preferred_time}
                          onValueChange={(value) =>
                            setForm({
                              ...form,
                              preferred_time:
                                value,
                            })
                          }
                        >
                          <SelectTrigger
                            id="preferred_time"
                            className="relative z-[71] bg-background"
                          >
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>

                          <SelectContent
                            position="popper"
                            className="z-[100] max-h-72 border-border bg-white text-foreground shadow-2xl dark:bg-card"
                            sideOffset={6}
                          >
                            {timeSlots.map(
                              (time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  className="cursor-pointer bg-white text-foreground focus:bg-primary/10 focus:text-foreground dark:bg-card"
                                >
                                  {time}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative z-10">
                    <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Additional Details
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Tell us about your goals
                      </Label>

                      <Textarea
                        id="message"
                        rows={5}
                        value={form.message}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            message:
                              event.target.value,
                          })
                        }
                        placeholder="What are you hoping to achieve? What challenges are you facing?"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-sm text-destructive">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="relative z-10">
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

                      {status === 'loading'
                        ? 'Submitting Request...'
                        : 'Request Free Consultation'}
                    </Button>

                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      We&apos;ll confirm your appointment
                      within one business day. No payment
                      required.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}