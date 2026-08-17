'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';

type Resource = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  file_url: string | null;
  requires_email: boolean;
  is_published: boolean;
  created_at: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getFileNameFromUrl(url: string | null) {
  if (!url) return null;

  try {
    const cleanUrl = url.split('?')[0];
    const parts = cleanUrl.split('/');
    return decodeURIComponent(parts[parts.length - 1] || '');
  } catch {
    return null;
  }
}

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();

  const resourceId = useMemo(() => {
    const value = params?.id;

    if (Array.isArray(value)) {
      return value[0] ?? '';
    }

    return value ? String(value) : '';
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [requiresEmail, setRequiresEmail] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
   * Load the existing resource.
   */
  useEffect(() => {
    if (!resourceId) return;

    const loadResource = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('resources')
        .select(
          'id, title, slug, description, category, file_url, requires_email, is_published, created_at'
        )
        .eq('id', resourceId)
        .maybeSingle();

      if (fetchError) {
        console.error('Resource loading error:', fetchError);
        setError(`Could not load resource: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Resource not found.');
        setLoading(false);
        return;
      }

      const resource = data as Resource;

      setTitle(resource.title || '');
      setSlug(resource.slug || '');
      setDescription(resource.description || '');
      setCategory(resource.category || '');
      setFileUrl(resource.file_url || '');
      setOriginalFileUrl(resource.file_url || null);
      setRequiresEmail(resource.requires_email ?? true);
      setIsPublished(resource.is_published ?? true);

      setLoading(false);
    };

    loadResource();
  }, [resourceId]);

  /*
   * Automatically generate slug from title.
   *
   * Once the admin manually changes the slug,
   * we stop overwriting it.
   */
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(createSlug(title));
    }
  }, [title, slugManuallyEdited]);

  /*
   * Upload replacement file.
   *
   * IMPORTANT:
   * The bucket must already exist in Supabase.
   *
   * This uses the same "resources" bucket used
   * by the resource creation flow.
   */
  const uploadReplacementFile = async () => {
    if (!selectedFile) {
      return fileUrl || null;
    }

    const extension = selectedFile.name.includes('.')
      ? selectedFile.name.substring(
          selectedFile.name.lastIndexOf('.') + 1
        )
      : 'bin';

    const safeSlug = createSlug(slug || title) || 'resource';

    const filePath = `${safeSlug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `File upload failed: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error(
        'The file uploaded, but Supabase did not return a public URL.'
      );
    }

    /*
     * Remove the previous file after the replacement
     * has successfully uploaded.
     */
    if (originalFileUrl) {
      const oldFileName = getFileNameFromUrl(originalFileUrl);

      if (oldFileName) {
        await supabase.storage
          .from('resources')
          .remove([oldFileName]);
      }
    }

    return data.publicUrl;
  };

  /*
   * Save resource.
   */
  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!resourceId) {
      setError('Resource ID is missing.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const cleanTitle = title.trim();
      const cleanSlug = createSlug(slug || cleanTitle);

      if (!cleanTitle) {
        throw new Error('Please enter a resource title.');
      }

      if (!cleanSlug) {
        throw new Error('Please enter a valid resource title or slug.');
      }

      let finalFileUrl = fileUrl.trim() || null;

      /*
       * Upload replacement file only when
       * the admin selected one.
       */
      if (selectedFile) {
        finalFileUrl = await uploadReplacementFile();
      }

      /*
       * IMPORTANT:
       * There is intentionally NO updated_at here.
       *
       * Your resources table currently does not have
       * an updated_at column.
       */
      const { data, error: updateError } = await supabase
        .from('resources')
        .update({
          title: cleanTitle,
          slug: cleanSlug,
          description: description.trim() || null,
          category: category.trim() || null,
          file_url: finalFileUrl,
          requires_email: requiresEmail,
          is_published: isPublished,
        })
        .eq('id', resourceId)
        .select()
        .single();

      if (updateError) {
        console.error('Resource update error:', updateError);

        /*
         * If the slug already exists, give a useful message.
         */
        if (updateError.code === '23505') {
          throw new Error(
            'That slug is already being used by another resource. Please choose a different slug.'
          );
        }

        throw new Error(
          `Could not save resource: ${updateError.message}`
        );
      }

      if (!data) {
        throw new Error(
          'The resource could not be saved.'
        );
      }

      setFileUrl(finalFileUrl || '');
      setOriginalFileUrl(finalFileUrl || null);
      setSelectedFile(null);
      setSlugManuallyEdited(true);

      setSuccess('Resource updated successfully.');

      /*
       * Give the user a moment to see the success message,
       * then return to the resource list.
       */
      setTimeout(() => {
        router.push('/admin/resources');
        router.refresh();
      }, 700);
    } catch (err) {
      console.error('Save resource error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving the resource.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Delete resource and associated file.
   */
  const handleDelete = async () => {
    if (!resourceId) return;

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this resource?'
    );

    if (!confirmed) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      /*
       * Delete the database record first.
       */
      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (deleteError) {
        throw new Error(
          `Could not delete resource: ${deleteError.message}`
        );
      }

      /*
       * Then remove its file from storage.
       */
      if (originalFileUrl) {
        const fileName = getFileNameFromUrl(originalFileUrl);

        if (fileName) {
          const { error: storageError } =
            await supabase.storage
              .from('resources')
              .remove([fileName]);

          if (storageError) {
            console.warn(
              'Resource deleted but storage file could not be removed:',
              storageError
            );
          }
        }
      }

      router.push('/admin/resources');
      router.refresh();
    } catch (err) {
      console.error('Delete resource error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while deleting the resource.'
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/resources">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to resources"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Edit Resource
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the resource information or replace its downloadable file.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-primary" />

          <p className="text-sm font-medium text-primary">
            {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Resource Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Resource Title
              </Label>

              <Input
                id="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setSlugManuallyEdited(false);
                }}
                placeholder="Business Growth Checklist"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={slug}
                onChange={(event) => {
                  setSlug(
                    createSlug(event.target.value)
                  );
                  setSlugManuallyEdited(true);
                }}
                placeholder="business-growth-checklist"
                required
              />

              <p className="text-xs text-muted-foreground">
                URL:
                {' '}
                <span className="font-medium">
                  /resources/{slug || 'your-resource'}
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe what this resource helps the visitor accomplish..."
                rows={5}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category
              </Label>

              <Input
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Strategy"
              />
            </div>
          </CardContent>
        </Card>

        {/* File */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Downloadable File</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Existing file */}
            {fileUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    Current file
                  </p>

                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-xs text-primary hover:underline"
                  >
                    {getFileNameFromUrl(fileUrl) ||
                      fileUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Upload replacement */}
            <div className="space-y-2">
              <Label htmlFor="file">
                Replace File
              </Label>

              <div className="rounded-xl border-2 border-dashed border-border/60 p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  {selectedFile
                    ? selectedFile.name
                    : 'Choose a replacement file'}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Leave empty to keep the current file.
                </p>

                <Input
                  id="file"
                  type="file"
                  className="mx-auto mt-4 max-w-md cursor-pointer"
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0] ?? null;

                    setSelectedFile(file);
                  }}
                />
              </div>
            </div>

            {/* Direct URL */}
            <div className="space-y-2">
              <Label htmlFor="fileUrl">
                File URL
              </Label>

              <Input
                id="fileUrl"
                type="url"
                value={fileUrl}
                onChange={(event) =>
                  setFileUrl(event.target.value)
                }
                placeholder="https://..."
              />

              <p className="text-xs text-muted-foreground">
                You can use an existing public file URL. Selecting
                a replacement file above will upload the new file
                and replace this URL.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Access & Publishing</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
              <div>
                <p className="font-medium">
                  Require Email
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Visitors must provide their name and email before
                  downloading.
                </p>
              </div>

              <Switch
                checked={requiresEmail}
                onCheckedChange={setRequiresEmail}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
              <div>
                <p className="font-medium">
                  Published
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Published resources are visible on the public
                  resources page.
                </p>
              </div>

              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
              : 'Delete Resource'}
          </Button>

          <div className="flex gap-3">
            <Link href="/admin/resources">
              <Button
                type="button"
                variant="outline"
                disabled={saving || deleting}
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
    </div>
  );
}