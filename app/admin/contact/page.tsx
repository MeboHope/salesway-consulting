'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadMessages = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('contact_messages')
      .select(
        'id, name, email, subject, message, status, created_at'
      )
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error(
        'Error loading contact messages:',
        fetchError
      );
      setError(fetchError.message);
      setMessages([]);
    } else {
      setMessages((data || []) as ContactMessage[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadMessages();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this message?'
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadMessages();
  };

  const query = search.trim().toLowerCase();

  const filteredMessages = messages.filter((message) => {
    return (
      message.name.toLowerCase().includes(query) ||
      message.email.toLowerCase().includes(query) ||
      (message.subject || '').toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Contact Messages
        </h1>

        <p className="mt-1 text-muted-foreground">
          Messages submitted through the public Contact Us form.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading contact messages...
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              {search
                ? 'No messages match your search.'
                : 'No contact messages yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className="border-border/60"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">
                          {message.name}
                        </h2>

                        <Badge
                          variant={
                            message.status === 'read'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {message.status === 'read' ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Read
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              New
                            </>
                          )}
                        </Badge>
                      </div>

                      <a
                        href={`mailto:${message.email}`}
                        className="mt-1 inline-block text-sm text-primary hover:underline"
                      >
                        {message.email}
                      </a>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          message.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {message.status !== 'read' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleMarkRead(message.id)
                          }
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark read
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete message"
                        onClick={() =>
                          handleDelete(message.id)
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {message.subject && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Subject
                      </p>

                      <p className="mt-1 font-medium">
                        {message.subject}
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7">
                      {message.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}