'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, ArrowRight } from 'lucide-react';

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
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(
          'id, name, role, bio, image_url, linkedin_url, email, is_published, order'
        )
        .eq('is_published', true)
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error(
          'Error loading team members:',
          JSON.stringify(error, null, 2)
        );
        setMembers([]);
      } else {
        setMembers((data || []) as TeamMember[]);
      }

      setLoading(false);
    };

    loadMembers();
  }, []);

  return (
    <main className="pt-16">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Our Team
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Meet the people behind{' '}
            <span className="text-accent">Salesway</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Experienced professionals committed to helping businesses
            achieve sustainable growth.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading team...
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No team members have been published yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-primary/5">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl font-bold text-primary">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold">
                      {member.name}
                    </h2>

                    <p className="mt-1 font-medium text-accent">
                      {member.role}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>

                    <div className="mt-5 flex gap-2">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Button variant="outline" size="icon">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                      )}

                      {member.email && (
                        <a href={`mailto:${member.email}`}>
                          <Button variant="outline" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
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

      <section className="bg-primary py-20">
        <div className="mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">
            Ready to work with us?
          </h2>

          <p className="mt-4 text-white/80">
            Let's discuss how Salesway Consulting can help your business grow.
          </p>

          <Link href="/book">
            <Button className="mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}