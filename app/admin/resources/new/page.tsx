'use client';

import { useState } from 'react';
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
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewResourcePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    requires_email: true,
    is_published: true,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.title);

    const { error: insertError } = await supabase.from('resources').insert({
      title: form.title,
      slug,
      description: form.description,
      file_url: form.file_url,
      file_name: form.file_name,
      file_size: form.file_size || null,
      requires_email: form.requires_email,
      is_published: form.is_published,
      order: form.order,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/resources');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/resources')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold tracking-tight">New Resource</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_url">File URL *</Label>
              <Input
                id="file_url"
                required
                value={form.file_url}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                placeholder="/downloads/business-growth-checklist.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_name">File Name *</Label>
              <Input
                id="file_name"
                required
                value={form.file_name}
                onChange={(e) => setForm({ ...form, file_name: e.target.value })}
                placeholder="business-growth-checklist.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_size">File Size (bytes)</Label>
              <Input
                id="file_size"
                type="number"
                value={form.file_size}
                onChange={(e) => setForm({ ...form, file_size: parseInt(e.target.value) || 0 })}
                placeholder="1024000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="requires_email"
                checked={form.requires_email}
                onCheckedChange={(value) => setForm({ ...form, requires_email: value === true })}
              />
              <Label htmlFor="requires_email">Requires email to unlock</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_published"
                checked={form.is_published}
                onCheckedChange={(value) => setForm({ ...form, is_published: value === true })}
              />
              <Label htmlFor="is_published">Published</Label>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Resource
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
