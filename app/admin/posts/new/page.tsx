'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { supabase } from '@/lib/supabase';
import { blogCategories } from '@/lib/data';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewPostPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: 'Business Strategy',
    tags: '',
    author_name: 'Rachel Waithera',
    reading_minutes: 5,
    is_featured: false,
    seo_title: '',
    seo_description: '',
  });

  const updateField = (
    field: keyof typeof form,
    value: string | number | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slug
        ? current.slug
        : slugify(value),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent,
    status: 'draft' | 'published'
  ) => {
    event.preventDefault();

    setSaving(true);
    setError('');

    const finalSlug =
      form.slug.trim() || slugify(form.title);

    if (!form.title.trim()) {
      setError('Title is required.');
      setSaving(false);
      return;
    }

    if (!form.excerpt.trim()) {
      setError('Excerpt is required.');
      setSaving(false);
      return;
    }

    if (!form.content.trim()) {
      setError('Content is required.');
      setSaving(false);
      return;
    }

    if (!finalSlug) {
      setError('A valid slug could not be generated.');
      setSaving(false);
      return;
    }

    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const publishedAt =
      status === 'published'
        ? new Date().toISOString()
        : null;

    const payload = {
      title: form.title.trim(),
      slug: finalSlug,
      excerpt: form.excerpt.trim(),
      content: form.content,
      cover_image_url:
        form.cover_image_url.trim() || null,
      category: form.category,
      tags,
      author_name:
        form.author_name.trim() || 'Rachel Waithera',
      reading_minutes:
        Number(form.reading_minutes) || 5,
      is_featured: form.is_featured,
      status,
      seo_title:
        form.seo_title.trim() || null,
      seo_description:
        form.seo_description.trim() || null,
      published_at: publishedAt,
    };

    const {
      error: insertError,
    } = await supabase
      .from('blog_posts')
      .insert(payload);

    if (insertError) {
      console.error(
        'Error creating blog post:',
        insertError
      );

      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/posts')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            New Blog Post
          </h1>

          <p className="text-sm text-muted-foreground">
            Create a new Salesway Consulting article.
          </p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Main Content */}
        <Card className="border-border/60">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title *
              </Label>

              <Input
                id="title"
                required
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                placeholder="5 Sales Mistakes Costing You Revenue"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">
                  URL Slug
                </Label>

                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      'slug',
                      event.target.value
                    )
                  }
                  placeholder="5-sales-mistakes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category
                </Label>

                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    updateField(
                      'category',
                      value
                    )
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {blogCategories.map(
                      (category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Excerpt *
              </Label>

              <Textarea
                id="excerpt"
                required
                rows={3}
                value={form.excerpt}
                onChange={(event) =>
                  updateField(
                    'excerpt',
                    event.target.value
                  )
                }
                placeholder="A short summary of the article..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Content *
              </Label>

              <Textarea
                id="content"
                required
                rows={18}
                value={form.content}
                onChange={(event) =>
                  updateField(
                    'content',
                    event.target.value
                  )
                }
                placeholder={`# Your Article Title

Write your article content here...

## Subheading

Your paragraph text...

- Bullet point 1
- Bullet point 2`}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image_url">
                Cover Image URL
              </Label>

              <Input
                id="cover_image_url"
                value={form.cover_image_url}
                onChange={(event) =>
                  updateField(
                    'cover_image_url',
                    event.target.value
                  )
                }
                placeholder="https://..."
              />

              <p className="text-xs text-muted-foreground">
                Optional. This matches the
                cover_image_url column in the
                database.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Post Settings */}
        <Card className="border-border/60">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display font-semibold">
              Post Settings
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">
                  Author Name
                </Label>

                <Input
                  id="author"
                  value={form.author_name}
                  onChange={(event) =>
                    updateField(
                      'author_name',
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reading">
                  Reading Time (minutes)
                </Label>

                <Input
                  id="reading"
                  type="number"
                  min={1}
                  value={form.reading_minutes}
                  onChange={(event) =>
                    updateField(
                      'reading_minutes',
                      Number(
                        event.target.value
                      )
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags
              </Label>

              <Input
                id="tags"
                value={form.tags}
                onChange={(event) =>
                  updateField(
                    'tags',
                    event.target.value
                  )
                }
                placeholder="sales, revenue, strategy"
              />

              <p className="text-xs text-muted-foreground">
                Separate tags with commas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={form.is_featured}
                onCheckedChange={(value) =>
                  updateField(
                    'is_featured',
                    value === true
                  )
                }
              />

              <Label htmlFor="featured">
                Feature this post
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card className="border-border/60">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display font-semibold">
              SEO Settings
            </h3>

            <div className="space-y-2">
              <Label htmlFor="seo_title">
                SEO Title
              </Label>

              <Input
                id="seo_title"
                value={form.seo_title}
                onChange={(event) =>
                  updateField(
                    'seo_title',
                    event.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">
                SEO Description
              </Label>

              <Textarea
                id="seo_description"
                rows={3}
                value={form.seo_description}
                onChange={(event) =>
                  updateField(
                    'seo_description',
                    event.target.value
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={(event) =>
              handleSubmit(
                event,
                'draft'
              )
            }
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}

            Save as Draft
          </Button>

          <Button
            type="button"
            disabled={saving}
            onClick={(event) =>
              handleSubmit(
                event,
                'published'
              )
            }
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}

            Publish Post
          </Button>
        </div>
      </form>
    </div>
  );
}