'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Search,
  Mail,
  Trash2,
  Loader2,
  CheckCircle2,
  Users,
  Copy,
  Check,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';

type Subscriber = {
  id: string;
  name: string;
  email: string;
  consent: boolean;
  confirmed: boolean;
  created_at: string;
};

export default function AdminSubscribersPage() {
  const [
    subscribers,
    setSubscribers,
  ] = useState<Subscriber[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [error, setError] =
    useState('');

  const [copiedId, setCopiedId] =
    useState<string | null>(null);

  const loadSubscribers =
    async () => {
      setLoading(true);
      setError('');

      const {
        data,
        error: fetchError,
      } = await supabase
        .from(
          'newsletter_subscribers'
        )
        .select(
          'id, name, email, consent, confirmed, created_at'
        )
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

      if (fetchError) {
        console.error(
          'Error loading subscribers:',
          JSON.stringify(
            fetchError,
            null,
            2
          )
        );

        setError(
          fetchError.message ||
            'Unable to load subscribers.'
        );

        setSubscribers([]);
      } else {
        setSubscribers(
          (data || []) as Subscriber[]
        );
      }

      setLoading(false);
    };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete =
    async (id: string) => {
      const confirmed =
        window.confirm(
          'Are you sure you want to permanently delete this subscriber?'
        );

      if (!confirmed) {
        return;
      }

      const {
        error: deleteError,
      } = await supabase
        .from(
          'newsletter_subscribers'
        )
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error(
          'Error deleting subscriber:',
          deleteError
        );

        setError(
          deleteError.message ||
            'Unable to delete subscriber.'
        );

        return;
      }

      setSubscribers(
        (current) =>
          current.filter(
            (subscriber) =>
              subscriber.id !== id
          )
      );
    };

  const copyEmail =
    async (
      subscriber: Subscriber
    ) => {
      try {
        await navigator.clipboard.writeText(
          subscriber.email
        );

        setCopiedId(
          subscriber.id
        );

        window.setTimeout(
          () => {
            setCopiedId(null);
          },
          1500
        );
      } catch (copyError) {
        console.error(
          'Unable to copy email:',
          copyError
        );
      }
    };

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return subscribers;
      }

      return subscribers.filter(
        (subscriber) =>
          subscriber.name
            .toLowerCase()
            .includes(query) ||
          subscriber.email
            .toLowerCase()
            .includes(query)
      );
    }, [
      subscribers,
      search,
    ]);

  const totalSubscribers =
    subscribers.length;

  const confirmedSubscribers =
    subscribers.filter(
      (subscriber) =>
        subscriber.confirmed
    ).length;

  const consentedSubscribers =
    subscribers.filter(
      (subscriber) =>
        subscriber.consent
    ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Newsletter Subscribers
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage people subscribed to the
            Salesway Consulting newsletter.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit gap-2"
        >
          <Users className="h-3.5 w-3.5" />
          {totalSubscribers}{' '}
          {totalSubscribers === 1
            ? 'subscriber'
            : 'subscribers'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 text-primary">
              <Users className="h-5 w-5" />

              <p className="font-medium">
                Total subscribers
              </p>
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {totalSubscribers}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="h-5 w-5" />

              <p className="font-medium">
                Confirmed
              </p>
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {confirmedSubscribers}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 text-primary">
              <Mail className="h-5 w-5" />

              <p className="font-medium">
                Consent given
              </p>
            </div>

            <p className="mt-3 text-3xl font-semibold">
              {consentedSubscribers}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="pl-10"
        />
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />

          Loading subscribers...
        </div>
      ) : filtered.length ===
        0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground/40" />

            <h2 className="mt-4 font-display text-lg font-semibold">
              {search
                ? 'No matching subscribers'
                : 'No subscribers yet'}
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {search
                ? 'Try a different name or email search.'
                : 'Newsletter subscribers will appear here when visitors subscribe through the website.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(
            (subscriber) => (
              <Card
                key={subscriber.id}
                className="border-border/60"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-semibold">
                          {subscriber.name}
                        </h3>

                        {subscriber.confirmed && (
                          <Badge
                            variant="secondary"
                            className="gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmed
                          </Badge>
                        )}

                        {subscriber.consent && (
                          <Badge variant="outline">
                            Consent given
                          </Badge>
                        )}
                      </div>

                      <a
                        href={`mailto:${subscriber.email}`}
                        className="mt-1 block text-sm text-primary hover:underline"
                      >
                        {subscriber.email}
                      </a>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Subscribed{' '}
                        {new Date(
                          subscriber.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Copy email"
                        aria-label="Copy email"
                        onClick={() =>
                          copyEmail(
                            subscriber
                          )
                        }
                      >
                        {copiedId ===
                        subscriber.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Email subscriber"
                        aria-label="Email subscriber"
                        asChild
                      >
                        <a
                          href={`mailto:${subscriber.email}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete subscriber"
                        aria-label="Delete subscriber"
                        onClick={() =>
                          handleDelete(
                            subscriber.id
                          )
                        }
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}