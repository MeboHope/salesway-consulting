'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { supabase } from '@/lib/supabase';

export default function EditTeamMemberPage() {
  const params = useParams();
  const router = useRouter();

  const memberId = params.id as string;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!memberId) return;

    const loadMember = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select(
          'id, name, role, bio, image_url, linkedin_url, email, is_published, "order"'
        )
        .eq('id', memberId)
        .maybeSingle();

      if (fetchError) {
        console.error(fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Team member not found.');
        setLoading(false);
        return;
      }

      setName(data.name ?? '');
      setRole(data.role ?? '');
      setBio(data.bio ?? '');
      setImageUrl(data.image_url ?? '');
      setLinkedinUrl(data.linkedin_url ?? '');
      setEmail(data.email ?? '');
      setOrder(data.order ?? 0);
      setIsPublished(data.is_published ?? true);

      setLoading(false);
    };

    loadMember();
  }, [memberId]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (!name.trim()) {
      setError('Please enter the team member name.');
      return;
    }

    if (!role.trim()) {
      setError('Please enter the team member role.');
      return;
    }

    if (!bio.trim()) {
      setError('Please enter a biography.');
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from('team_members')
      .update({
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        image_url: imageUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        email: email.trim() || null,
        is_published: isPublished,
        order: Number(order) || 0,
      })
      .eq('id', memberId);

    if (updateError) {
      console.error(updateError);
      setError(
        `Could not save team member: ${updateError.message}`
      );
      setSaving(false);
      return;
    }

    router.push('/admin/team');
    router.refresh();
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this team member?'
      )
    ) {
      return;
    }

    setDeleting(true);
    setError('');

    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) {
      console.error(deleteError);
      setError(
        `Could not delete team member: ${deleteError.message}`
      );
      setDeleting(false);
      return;
    }

    router.push('/admin/team');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/team">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to team"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Team Member
          </h1>

          <p className="mt-1 text-muted-foreground">
            Update this team member&apos;s information.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Member Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>

                <Input
                  id="role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>

              <Textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                rows={7}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>

                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(event) =>
                    setImageUrl(event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">
                  LinkedIn URL
                </Label>

                <Input
                  id="linkedinUrl"
                  type="url"
                  value={linkedinUrl}
                  onChange={(event) =>
                    setLinkedinUrl(event.target.value)
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">
                  Display Order
                </Label>

                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(event) =>
                    setOrder(
                      Number(event.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(event) =>
                    setIsPublished(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-border"
                />

                <Label
                  htmlFor="published"
                  className="cursor-pointer"
                >
                  Publish this team member on the website
                </Label>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={saving || deleting}
                className="gap-2"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting
                  ? 'Deleting...'
                  : 'Delete Team Member'}
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/admin/team">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={saving || deleting}
                  className="gap-2"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}