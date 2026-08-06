'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

type Faq = { id: string; question: string; answer: string; sort_order: number; is_published: boolean };

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', sort_order: 0, is_published: true });

  useEffect(() => { loadFaqs(); }, []);

  const loadFaqs = async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
    setFaqs(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      await supabase.from('faqs').update(form).eq('id', editingId);
    } else {
      await supabase.from('faqs').insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm({ question: '', answer: '', sort_order: 0, is_published: true });
    loadFaqs();
  };

  const handleEdit = (f: Faq) => {
    setEditingId(f.id);
    setForm({ question: f.question, answer: f.answer, sort_order: f.sort_order, is_published: f.is_published });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    loadFaqs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">FAQs</h1>
          <p className="mt-1 text-muted-foreground">Manage frequently asked questions.</p>
        </div>
        <Button className="gap-2" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ question: '', answer: '', sort_order: 0, is_published: true }); }}>
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {showForm && (
        <Card className="border-border/60">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="question">Question *</Label><Input id="question" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="answer">Answer *</Label><Textarea id="answer" required rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="sort_order">Sort Order</Label><Input id="sort_order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
                <div className="flex items-end gap-2 pb-2"><Checkbox id="pub" checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v === true })} /><Label htmlFor="pub">Published</Label></div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="gap-2">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editingId ? 'Update' : 'Add'} FAQ</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : faqs.length === 0 ? (
        <Card className="border-border/60"><CardContent className="pt-6 text-center"><HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" /><p className="mt-4 text-muted-foreground">No FAQs yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <Card key={f.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="font-display font-semibold">{f.question}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(f)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
