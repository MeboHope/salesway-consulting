'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Save,
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

export default function NewTeamMemberPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

    const { error: insertError } = await supabase
      .from('team_members')
      .insert({
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        image_url: imageUrl.trim() || null,
        linkedin_url:
          linkedinUrl.trim() || null,
        email: email.trim() || null,
        is_published: isPublished,
        order: Number(order) || 0,
      });

    if (insertError) {
      console.error(
        'Team member insert error:',
        insertError
      );

      setError(
        `Could not save team member: ${insertError.message}`
      );

      setSaving(false);
      return;
    }

    router.push('/admin/team');
    router.refresh();
  };

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
            Add Team Member
          </h1>

          <p className="mt-1 text-muted-foreground">
            Add a new member to the Salesway Consulting
            team.
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
                <Label htmlFor="name">
                  Full Name
                </Label>

                <Input
                  id="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Rachel Waithera"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role
                </Label>

                <Input
                  id="role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  placeholder="Managing Director"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                Biography
              </Label>

              <Textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                placeholder="Write a short professional biography..."
                rows={7}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">
                  Image URL
                </Label>

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
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@company.com"
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
                  Publish this team member on the
                  website
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

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                disabled={saving}
                className="w-full gap-2 sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save Team Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}