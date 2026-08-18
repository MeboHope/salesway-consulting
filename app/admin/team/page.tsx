'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  created_at: string;
};

export default function AdminTeamPage() {
  const [members, setMembers] =
    useState<TeamMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadMembers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('team_members')
      .select(
        `
          id,
          name,
          role,
          bio,
          image_url,
          linkedin_url,
          email,
          is_published,
          order,
          created_at
        `
      )
      .order('order', {
        ascending: true,
      })
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Error loading team members:',
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

  useEffect(() => {
    loadMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this team member?'
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      alert(
        `Failed to delete team member: ${error.message}`
      );
      return;
    }

    await loadMembers();
  };

  const filtered = members.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      member.role
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Team
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage the people displayed on the
            Salesway Consulting website.
          </p>
        </div>

        <Link href="/admin/team/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search team members..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="p-6">
                <div className="h-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-16 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />

            <p className="mt-4 text-muted-foreground">
              {search
                ? 'No team members match your search.'
                : 'No team members have been added yet.'}
            </p>

            {!search && (
              <Link href="/admin/team/new">
                <Button className="mt-5 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((member) => (
            <Card
              key={member.id}
              className="border-border/60"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Users className="h-6 w-6" />
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-semibold">
                          {member.name}
                        </h3>

                        <Badge
                          variant={
                            member.is_published
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {member.is_published
                            ? 'Published'
                            : 'Draft'}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/team"
                      target="_blank"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View team page"
                        aria-label="View team page"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link
                      href={`/admin/team/${member.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit team member"
                        aria-label="Edit team member"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete team member"
                      aria-label="Delete team member"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        handleDelete(member.id)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}