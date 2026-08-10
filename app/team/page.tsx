'use client';

import { useEffect, useState } from 'react';
import { Users, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_published', true)
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setTeam(data || []);
    setLoading(false);
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Our Team
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Meet the <span className="text-accent">experts</span> behind your success
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Our team brings together decades of experience across industries,
            united by a passion for helping businesses grow.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading team...</div>
          ) : team.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No team members published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <Card key={member.id} className="border-border/60 bg-card overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Users className="h-24 w-24 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{member.name}</h3>
                      <p className="text-sm font-semibold text-primary">{member.role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                    <div className="flex gap-2 pt-2">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-border/60 hover:bg-primary/10 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-lg border border-border/60 hover:bg-primary/10 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Want to join our team?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're always looking for talented people who share our passion for
            helping businesses grow.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="gap-2" asChild>
              <a href="/careers">
                View Open Positions
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
