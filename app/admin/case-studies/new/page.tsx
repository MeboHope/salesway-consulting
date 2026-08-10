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

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    client: '',
    industry: '',
    challenge: '',
    solution: '',
    results: '',
    metrics: '',
    is_published: false,
    is_featured: false,
  });

  const handleSubmit = async (e: React.FormEvent, publishStatus?: boolean) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const slug = form.slug || slugify(form.title);

    const payload = {
      title: form.title,
      slug,
      client: form.client,
      industry: form.industry,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results,
      metrics: form.metrics,
      is_published: publishStatus !== undefined ? publishStatus : form.is_published,
      is_featured: form.is_featured,
    };

    const { error: insertError } = await supabase.from('case_studies').insert(payload);
    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/case-studies');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/case-studies')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold tracking-tight">New Case Study</h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
                placeholder="How We Increased Sales by 40% in 6 Months"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="increased-sales-40-percent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client Name *</Label>
                <Input
                  id="client"
                  required
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="Acme Corporation"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                required
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="Technology"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-display font-semibold">Case Study Details</h3>
            <div className="space-y-2">
              <Label htmlFor="challenge">Challenge *</Label>
              <Textarea
                id="challenge"
                required
                rows={4}
                value={form.challenge}
                onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                placeholder="Describe the client's problem and challenges..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution *</Label>
              <Textarea
                id="solution"
                required
                rows={4}
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                placeholder="Describe the solution and approach we took..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="results">Results *</Label>
              <Textarea
                id="results"
                required
                rows={4}
                value={form.results}
                onChange={(e) => setForm({ ...form, results: e.target.value })}
                placeholder="Describe the outcomes and results achieved..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metrics">Key Metrics *</Label>
              <Input
                id="metrics"
                required
                value={form.metrics}
                onChange={(e) => setForm({ ...form, metrics: e.target.value })}
                placeholder="40% revenue growth, 25% cost reduction, etc."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-display font-semibold">Publishing Options</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={form.is_featured}
                onCheckedChange={(v) => setForm({ ...form, is_featured: v === true })}
              />
              <Label htmlFor="featured">Feature this case study</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v === true })}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent, false)} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save as Draft
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Publish Case Study
          </Button>
        </div>
      </form>
    </div>
  );
}
