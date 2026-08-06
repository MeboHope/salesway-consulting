'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function EditPostPage({ params }: { params: Promise<{ id: string[] }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const editId = resolvedParams.id[0];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Business Strategy',
    tags: '',
    author_name: 'Rachel Waithera',
    reading_minutes: 5,
    is_featured: false,
    status: 'draft',
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', editId).maybeSingle();
      if (data) {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || 'Business Strategy',
          tags: (data.tags || []).join(', '),
          author_name: data.author_name || 'Rachel Waithera',
          reading_minutes: data.reading_minutes || 5,
          is_featured: data.is_featured || false,
          status: data.status || 'draft',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
        });
      }
      setLoading(false);
    })();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent, publishStatus?: string) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.title);
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      slug,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags,
      author_name: form.author_name,
      reading_minutes: Number(form.reading_minutes) || 5,
      is_featured: form.is_featured,
      status: publishStatus || form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: (publishStatus || form.status) === 'published' && !form.status ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase.from('blog_posts').update(payload).eq('id', editId);
    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    router.push('/admin/posts');
  };

  if (loading) {
    return <div className="animate-pulse text-muted-foreground">Loading post...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/posts')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold tracking-tight">Edit Post</h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea id="excerpt" required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (use # for headings, - for bullets) *</Label>
              <Textarea id="content" required rows={16} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="font-mono text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-display font-semibold">Post Settings</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input id="author" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reading">Reading Time (minutes)</Label>
                <Input id="reading" type="number" min={1} value={form.reading_minutes} onChange={(e) => setForm({ ...form, reading_minutes: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="featured" checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v === true })} />
              <Label htmlFor="featured">Feature this post</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-display font-semibold">SEO Settings (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input id="seo_title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea id="seo_description" rows={2} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'draft')} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save as Draft
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Update & Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
