'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FileText, Briefcase, Download, Star, HelpCircle, CalendarCheck, Mail, Settings, Clock, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminSidebar } from '@/components/admin/sidebar';
import { supabase } from '@/lib/supabase';

type RecentItem = {
  id: string;
  title: string;
  status?: string;
  created_at: string;
};

const adminSections = [
  { href: '/admin/posts', label: 'Blog Posts', icon: FileText, description: 'Create, edit, and publish blog content.' },
  { href: '/admin/services', label: 'Services', icon: Briefcase, description: 'Manage the services shown on the website.' },
  { href: '/admin/resources', label: 'Resources', icon: Download, description: 'Publish and update resource downloads.' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star, description: 'Review and manage client testimonials.' },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle, description: 'Update frequently asked questions.' },
  { href: '/admin/consultations', label: 'Consultations', icon: CalendarCheck, description: 'View consultation requests and leads.' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Mail, description: 'Manage newsletter and email list subscribers.' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, description: 'Update admin settings and preferences.' },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ posts: 0, services: 0, resources: 0 });
  const [recentPosts, setRecentPosts] = useState<RecentItem[]>([]);
  const [recentResources, setRecentResources] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const [postsRes, servicesRes, resourcesRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('id, title, status, created_at', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('services')
          .select('id', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('resources')
          .select('id, title, created_at', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      setCounts({
        posts: postsRes.count ?? postsRes.data?.length ?? 0,
        services: servicesRes.count ?? servicesRes.data?.length ?? 0,
        resources: resourcesRes.count ?? resourcesRes.data?.length ?? 0,
      });
      setRecentPosts((postsRes.data || []) as RecentItem[]);
      setRecentResources((resourcesRes.data || []) as RecentItem[]);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 sm:p-8 lg:p-10">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-8 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin dashboard</p>
                <div className="mt-3 flex items-center gap-2 text-3xl font-display font-bold tracking-tight">
                  <LayoutDashboard className="h-8 w-8 text-primary" />
                  <span>Welcome back, Admin</span>
                </div>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Manage website content, blog posts, services, resources, and inquiries from one place.
                </p>
              </div>
              <Link href="/admin/settings">
                <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-3 text-primary">
                  <FileText className="h-5 w-5" />
                  <h2 className="font-semibold">Blog posts</h2>
                </div>
                <p className="text-3xl font-semibold">{loading ? '—' : counts.posts}</p>
                <p className="text-sm text-muted-foreground">Total published and draft articles.</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-3 text-primary">
                  <Briefcase className="h-5 w-5" />
                  <h2 className="font-semibold">Services</h2>
                </div>
                <p className="text-3xl font-semibold">{loading ? '—' : counts.services}</p>
                <p className="text-sm text-muted-foreground">Current service offerings live on the site.</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-3 text-primary">
                  <Download className="h-5 w-5" />
                  <h2 className="font-semibold">Resources</h2>
                </div>
                <p className="text-3xl font-semibold">{loading ? '—' : counts.resources}</p>
                <p className="text-sm text-muted-foreground">Downloadable guides and templates.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <Clock className="h-5 w-5" />
                    <h2 className="font-semibold">Recent posts</h2>
                  </div>
                  <Link href="/admin/posts" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading recent posts...</p>
                  ) : recentPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent posts yet.</p>
                  ) : (
                    recentPosts.map((post) => (
                      <div key={post.id} className="rounded-xl border border-border/60 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status ?? 'draft'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <Clock className="h-5 w-5" />
                    <h2 className="font-semibold">Recent resources</h2>
                  </div>
                  <Link href="/admin/resources" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading recent resources...</p>
                  ) : recentResources.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent resources yet.</p>
                  ) : (
                    recentResources.map((resource) => (
                      <div key={resource.id} className="rounded-xl border border-border/60 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-xs text-muted-foreground">{new Date(resource.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.href} className="border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="space-y-4 p-0">
                    <div className="flex items-center gap-3 text-primary">
                      <Icon className="h-5 w-5" />
                      <h2 className="font-semibold">{section.label}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                    <Link href={section.href}>
                      <Button variant="secondary" className="mt-4 w-full">Open</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
