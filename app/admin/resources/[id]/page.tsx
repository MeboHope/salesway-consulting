'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import { supabase } from '@/lib/supabase';

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [resource, setResource] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    file_url: '',
    requires_email: true,
    is_published: false,
  });

  useEffect(() => {
    loadResource();
  }, []);

  const loadResource = async () => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      router.push('/admin/resources');
      return;
    }

    setResource({
      title: data.title ?? '',
      slug: data.slug ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      file_url: data.file_url ?? '',
      requires_email: data.requires_email ?? true,
      is_published: data.is_published ?? false,
    });

    setLoading(false);
  };


  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('resources')
      .update({
        title: resource.title,
        slug: resource.slug,
        description: resource.description,
        category: resource.category,
        file_url: resource.file_url,
        requires_email: resource.requires_email,
        is_published: resource.is_published,
      })
      .eq('id', id);


    setSaving(false);

    if (!error) {
      router.push('/admin/resources');
    }
  };


  const handleDelete = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this resource?'
    );

    if (!confirmDelete) return;

    await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    router.push('/admin/resources');
  };


  if (loading) {
    return (
      <div className="p-10 text-muted-foreground">
        Loading resource...
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-3xl">

      <Link
        href="/admin/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to resources
      </Link>


      <Card>
        <CardHeader>
          <CardTitle>
            Edit Resource
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={resource.title}
              onChange={(e) =>
                setResource({
                  ...resource,
                  title: e.target.value,
                })
              }
            />
          </div>


          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={resource.slug}
              onChange={(e) =>
                setResource({
                  ...resource,
                  slug: e.target.value,
                })
              }
            />
          </div>


          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={5}
              value={resource.description}
              onChange={(e) =>
                setResource({
                  ...resource,
                  description: e.target.value,
                })
              }
            />
          </div>


          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={resource.category}
              onChange={(e) =>
                setResource({
                  ...resource,
                  category: e.target.value,
                })
              }
            />
          </div>


          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              value={resource.file_url}
              onChange={(e) =>
                setResource({
                  ...resource,
                  file_url: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </div>


          <div className="flex items-center gap-3">

            <Checkbox
              checked={resource.requires_email}
              onCheckedChange={(value) =>
                setResource({
                  ...resource,
                  requires_email: Boolean(value),
                })
              }
            />

            <Label>
              Require email before download
            </Label>

          </div>


          <div className="flex items-center gap-3">

            <Checkbox
              checked={resource.is_published}
              onCheckedChange={(value) =>
                setResource({
                  ...resource,
                  is_published: Boolean(value),
                })
              }
            />

            <Label>
              Published
            </Label>

          </div>


          <div className="flex gap-3 pt-4">

            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {
                saving &&
                <Loader2 className="h-4 w-4 animate-spin" />
              }

              <Save className="h-4 w-4" />

              Save Changes
            </Button>


            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />

              Delete
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}