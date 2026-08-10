'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  is_published: boolean;
  order: number;
  created_at: string;
};

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('id, name, role, is_published, order, created_at')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });
    setTeam(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    loadTeam();
  };

  const filtered = team.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="mt-1 text-muted-foreground">Manage your team and their profiles.</p>
        </div>
        <Link href="/admin/team/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Team Member
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No team members found. Add your first team member!</p>
            <Link href="/admin/team/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Team Member
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((member) => (
            <Card key={member.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={member.is_published ? 'default' : 'secondary'}>
                        {member.is_published ? 'published' : 'draft'}
                      </Badge>
                      <Badge variant="outline">Order: {member.order}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{member.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    {member.is_published && (
                      <Link href="/team" target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View team page">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/team/${member.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit team member">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                      aria-label="Delete team member"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
