'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function NewsletterForm({ variant = 'section' }: { variant?: 'section' | 'compact' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Please agree to the privacy policy to subscribe.');
      return;
    }
    setStatus('loading');
    setError('');

    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ name, email, consent, confirmed: false });

    if (insertError) {
      if (insertError.message.includes('duplicate')) {
        setError('You are already subscribed. Thank you!');
        setStatus('idle');
      } else {
        setError('Something went wrong. Please try again.');
        setStatus('error');
      }
      return;
    }
    setStatus('success');
    setName('');
    setEmail('');
    setConsent(false);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-display text-xl font-semibold">You&apos;re subscribed!</h3>
        <p className="text-muted-foreground">
          Check your inbox to confirm your subscription.
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex items-start gap-2">
          <Checkbox
            id="consent-compact"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
          />
          <Label htmlFor="consent-compact" className="text-xs text-muted-foreground">
            I agree to receive emails and accept the privacy policy.
          </Label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={status === 'loading'} className="w-full gap-2">
          {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
          Subscribe
        </Button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-lg sm:p-10">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Mail className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl text-balance">
          Stay Ahead of the Competition
        </h3>
        <p className="mt-3 text-muted-foreground text-pretty">
          Receive practical business strategies, sales insights, and growth
          tips directly in your inbox.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nl-name">Name</Label>
            <Input
              id="nl-name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nl-email">Email</Label>
            <Input
              id="nl-email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="consent-section"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
          />
          <Label htmlFor="consent-section" className="text-sm text-muted-foreground">
            I agree to receive emails and accept the{' '}
            <a href="/privacy" className="text-primary underline">privacy policy</a>.
          </Label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={status === 'loading'} className="w-full gap-2" size="lg">
          {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
          Subscribe
        </Button>
      </form>
    </div>
  );
}
