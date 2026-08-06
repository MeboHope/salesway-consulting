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
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function EditServicePage({ params }: { params: Promise<{ id: string[] }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const editId = resolvedParams.id[0];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    details: '',
    icon: 'Target',
    features: '',
    is_published: true,
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('services')
        .select('title, slug, summary, details, icon, features, is_published')
        .eq('id', editId)
        .maybeSingle();

      if (data) {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          summary: data.summary || '',
          details: data.details || '',
          icon: data.icon || 'Target',
          features: (data.features || []).join(', '),
          is_published: data.is_published ?? true,
        });
      }
      setLoading(false);
    })();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.title);
    const features = form.features.split(',').map((item) => item.trim()).filter(Boolean);

    const { error: updateError } = await supabase
      .from('services')
      .update({
        title: form.title,
        slug,
        summary: form.summary,
        details: form.details,
        icon: form.icon,
        features,
        is_published: form.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/services');
  };

  if (loading) {
    return <div className="animate-pulse text-muted-foreground">Loading service...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/services')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold tracking-tight">Edit Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea id="summary" required rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea id="details" rows={5} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea id="features" rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Strategy, execution, coaching" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="is_published" checked={form.is_published} onCheckedChange={(value) => setForm({ ...form, is_published: value === true })} />
              <Label htmlFor="is_published">Published</Label>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Update Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
