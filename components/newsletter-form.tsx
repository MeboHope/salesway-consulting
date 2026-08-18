'use client';

import { useState } from 'react';

import {
  CheckCircle2,
  Loader2,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type NewsletterFormProps = {
  variant?: 'section' | 'compact';
};

type SubscribeResponse = {
  success?: boolean;
  alreadySubscribed?: boolean;
  emailSent?: boolean;
  error?: string;
};

export function NewsletterForm({
  variant = 'section',
}: NewsletterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const [error, setError] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    const normalizedName = name.trim();
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedName) {
      setError('Please enter your name.');
      return;
    }

    if (!normalizedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!consent) {
      setError(
        'Please agree to receive emails and accept the privacy policy.'
      );
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(
        '/api/newsletter/subscribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: normalizedName,
            email: normalizedEmail,
          }),
        }
      );

      const result =
        (await response.json()) as SubscribeResponse;

      if (!response.ok) {
        setError(
          result.error ||
            'Unable to subscribe. Please try again.'
        );

        setStatus('error');
        return;
      }

      setStatus('success');

      setName('');
      setEmail('');
      setConsent(false);
    } catch (requestError) {
      console.error(
        'Newsletter request error:',
        requestError
      );

      setError(
        'Unable to connect to the newsletter service. Please try again.'
      );

      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <h3 className="font-display text-xl font-semibold">
          You&apos;re subscribed!
        </h3>

        <p className="text-muted-foreground">
          Thank you for joining the Salesway Consulting
          newsletter.
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          autoComplete="name"
          required
          disabled={status === 'loading'}
        />

        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoComplete="email"
          required
          disabled={status === 'loading'}
        />

        <div className="flex items-start gap-2">
          <Checkbox
            id="consent-compact"
            checked={consent}
            onCheckedChange={(value) =>
              setConsent(value === true)
            }
            disabled={status === 'loading'}
          />

          <Label
            htmlFor="consent-compact"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            I agree to receive emails and accept the{' '}
            <a
              href="/privacy"
              className="text-primary underline"
            >
              privacy policy
            </a>
            .
          </Label>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full gap-2"
        >
          {status === 'loading' && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {status === 'loading'
            ? 'Subscribing...'
            : 'Subscribe'}
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

        <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          Stay Ahead of the Competition
        </h3>

        <p className="mt-3 text-muted-foreground">
          Receive practical business strategies, sales
          insights, and growth tips directly in your inbox.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-xl space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nl-name">
              Name
            </Label>

            <Input
              id="nl-name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
              required
              disabled={status === 'loading'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nl-email">
              Email
            </Label>

            <Input
              id="nl-email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="consent-section"
            checked={consent}
            onCheckedChange={(value) =>
              setConsent(value === true)
            }
            disabled={status === 'loading'}
          />

          <Label
            htmlFor="consent-section"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            I agree to receive emails and accept the{' '}
            <a
              href="/privacy"
              className="text-primary underline"
            >
              privacy policy
            </a>
            .
          </Label>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full gap-2"
          size="lg"
        >
          {status === 'loading' && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {status === 'loading'
            ? 'Subscribing...'
            : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
}