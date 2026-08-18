'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Search,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminContactPage() {
  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    setError('');

    const {
      data,
      error: fetchError,
    } = await supabase
      .from('contact_messages')
      .select(
        'id, name, email, subject, message, status, created_at'
      )
      .order('created_at', {
        ascending: false,
      });

    if (fetchError) {
      console.error(
        'Error loading contact messages:',
        fetchError
      );

      setError(
        fetchError.message ||
          'Unable to load contact messages.'
      );

      setMessages([]);
    } else {
      setMessages(
        (data || []) as ContactMessage[]
      );
    }

    setLoading(false);
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this contact message?'
      );

    if (!confirmed) return;

    const {
      error: deleteError,
    } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(
        deleteError.message ||
          'Unable to delete message.'
      );
      return;
    }

    setMessages((current) =>
      current.filter(
        (message) =>
          message.id !== id
      )
    );
  };

  const markAsRead = async (
    id: string
  ) => {
    const {
      error: updateError,
    } = await supabase
      .from('contact_messages')
      .update({
        status: 'read',
      })
      .eq('id', id);

    if (updateError) {
      setError(
        updateError.message ||
          'Unable to update message.'
      );
      return;
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === id
          ? {
              ...message,
              status: 'read',
            }
          : message
      )
    );
  };

  const filteredMessages =
    messages.filter((message) => {
      const query =
        search.toLowerCase();

      return (
        message.name
          .toLowerCase()
          .includes(query) ||
        message.email
          .toLowerCase()
          .includes(query) ||
        (message.subject || '')
          .toLowerCase()
          .includes(query) ||
        message.message
          .toLowerCase()
          .includes(query)
      );
    });

  const unreadCount =
    messages.filter(
      (message) =>
        message.status === 'new'
    ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Contact Messages
          </h1>

          <p className="mt-1 text-muted-foreground">
            Messages submitted through the
            website contact form.
          </p>
        </div>

        <Badge
          variant={
            unreadCount > 0
              ? 'default'
              : 'secondary'
          }
          className="w-fit gap-2"
        >
          <Mail className="h-3.5 w-3.5" />
          {unreadCount} new
        </Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
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
        <div className="animate-pulse text-muted-foreground">
          Loading contact messages...
        </div>
      ) : filteredMessages.length ===
        0 ? (
        <Card className="border-border/60">
          <CardContent className="p-10 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/40" />

            <h2 className="mt-4 font-display text-lg font-semibold">
              No contact messages
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Messages submitted through the
              Contact Us form will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map(
            (message) => (
              <Card
                key={message.id}
                className="border-border/60"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            message.status ===
                            'new'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {message.status ===
                          'new'
                            ? 'New'
                            : 'Read'}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            message.created_at
                          ).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display font-semibold">
                        {message.name}
                      </h3>

                      <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {message.email}
                      </a>

                      {message.subject && (
                        <p className="mt-3 font-medium">
                          {message.subject}
                        </p>
                      )}

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {message.message}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      {message.status ===
                        'new' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            markAsRead(
                              message.id
                            )
                          }
                          aria-label="Mark as read"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}

                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(
                          `Re: ${
                            message.subject ||
                            'Your message to Salesway Consulting'
                          }`
                        )}`}
                        aria-label="Reply"
                        title="Reply"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted"
                      >
                        <Eye className="h-4 w-4" />
                      </a>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(
                            message.id
                          )
                        }
                        aria-label="Delete message"
                        title="Delete message"
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