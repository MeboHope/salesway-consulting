'use client';

import { useState } from 'react';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess(false);

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!form.message.trim()) {
      setError('Please enter your message.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        '/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            subject: form.subject.trim(),
            message: form.message.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Unable to send your message.'
        );
      }

      setSuccess(true);

      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error(
        'Contact form error:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />

        <h3 className="mt-4 font-display text-2xl font-semibold">
          Message received
        </h3>

        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thank you for contacting Salesway Consulting.
          We have received your message and will get
          back to you as soon as possible.
        </p>

        <Button
          type="button"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Name *
          </Label>

          <Input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={(event) =>
              updateField(
                'name',
                event.target.value
              )
            }
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            Email *
          </Label>

          <Input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              updateField(
                'email',
                event.target.value
              )
            }
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">
          Subject
        </Label>

        <Input
          id="contact-subject"
          type="text"
          value={form.subject}
          onChange={(event) =>
            updateField(
              'subject',
              event.target.value
            )
          }
          placeholder="How can we help?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">
          Message *
        </Label>

        <Textarea
          id="contact-message"
          required
          rows={8}
          value={form.message}
          onChange={(event) =>
            updateField(
              'message',
              event.target.value
            )
          }
          placeholder="Tell us about your business, goals, or how we can help..."
        />
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
        disabled={submitting}
        size="lg"
        className="w-full gap-2 sm:w-auto"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}

        {submitting
          ? 'Sending...'
          : 'Send Message'}
      </Button>
    </form>
  );
}