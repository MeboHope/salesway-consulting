'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Linkedin,
  Mail,
  Users,
  ArrowRight,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { supabase } from '@/lib/supabase';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  is_published: boolean;
  order: number;
};

export default function TeamPage() {
  const [members, setMembers] =
    useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(
          'id, name, role, bio, image_url, linkedin_url, email, is_published, "order"'
        )
        .eq('is_published', true)
        .order('order', {
          ascending: true,
        })
        .order('created_at', {
          ascending: false,
        });

      if (!mounted) return;

      if (error) {
        console.error(
          'Error loading team:',
          error
        );
        setMembers([]);
      } else {
        setMembers(
          (data ?? []) as TeamMember[]
        );
      }

      setLoading(false);
    };

    loadTeam();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="pt-16">
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary"
          >
            Our Team
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Meet the people behind{' '}
            <span className="text-accent">
              Salesway
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Experienced professionals helping businesses
            turn strategy into measurable growth.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardContent className="p-6">
                    <div className="mx-auto h-40 w-40 animate-pulse rounded-full bg-muted" />
                    <div className="mx-auto mt-6 h-5 w-40 animate-pulse rounded bg-muted" />
                    <div className="mx-auto mt-3 h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="mt-5 h-16 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : members.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-16 text-center">
                <Users className="mx-auto h-14 w-14 text-muted-foreground/30" />

                <h2 className="mt-5 font-display text-xl font-semibold">
                  Our team is coming soon
                </h2>

                <p className="mt-2 text-muted-foreground">
                  We&apos;re updating our team information.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto h-40 w-40 overflow-hidden rounded-full bg-primary/10">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Users className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                    </div>

                    <h2 className="mt-6 font-display text-xl font-bold">
                      {member.name}
                    </h2>

                    <p className="mt-1 font-medium text-accent">
                      {member.role}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {member.bio}
                    </p>

                    {(member.linkedin_url ||
                      member.email) && (
                      <div className="mt-6 flex justify-center gap-2">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} LinkedIn`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:bg-primary/5"
                          >
                            <Linkedin className="h-4 w-4 text-primary" />
                          </a>
                        )}

                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            aria-label={`Email ${member.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:bg-primary/5"
                          >
                            <Mail className="h-4 w-4 text-primary" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to grow your business?
          </h2>

          <p className="mt-4 text-lg text-white/80">
            Work with our team to turn your business goals
            into measurable results.
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link href="/book">
                Book a Strategy Call
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}