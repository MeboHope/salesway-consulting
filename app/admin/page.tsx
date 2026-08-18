'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  FileText,
  Briefcase,
  Download,
  Star,
  HelpCircle,
  CalendarCheck,
  Mail,
  Settings,
  Clock,
  LayoutDashboard,
  Users,
  TrendingUp,
  Plus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useAdminRole } from '@/hooks/use-admin-role';

type RecentItem = {
  id: string;
  title: string;
  status?: string;
  created_at: string;
};

const adminSections = [
  {
    href: '/admin/posts',
    label: 'Blog Posts',
    icon: FileText,
    description: 'Create, edit, and publish blog content.',
  },
  {
    href: '/admin/services',
    label: 'Services',
    icon: Briefcase,
    description: 'Manage the services shown on the website.',
  },
  {
    href: '/admin/resources',
    label: 'Resources',
    icon: Download,
    description: 'Publish and update resource downloads.',
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    icon: Star,
    description: 'Review and manage client testimonials.',
  },
  {
    href: '/admin/faqs',
    label: 'FAQs',
    icon: HelpCircle,
    description: 'Update frequently asked questions.',
  },
  {
    href: '/admin/case-studies',
    label: 'Case Studies',
    icon: TrendingUp,
    description: 'Showcase client success stories.',
  },
  {
    href: '/admin/team',
    label: 'Team Members',
    icon: Users,
    description: 'Manage team profiles and bios.',
  },
  {
    href: '/admin/clients',
    label: 'Clients',
    icon: Briefcase,
    description: 'Manage client logos and testimonials.',
  },
  {
    href: '/admin/pricing',
    label: 'Pricing',
    icon: Settings,
    description: 'Update pricing packages and plans.',
  },
  {
    href: '/admin/careers',
    label: 'Careers',
    icon: Briefcase,
    description: 'Post and manage job openings.',
  },
  {
    href: '/admin/consultations',
    label: 'Consultations',
    icon: CalendarCheck,
    description: 'View consultation requests and leads.',
  },
  {
    href: '/admin/subscribers',
    label: 'Subscribers',
    icon: Mail,
    description: 'Manage newsletter and email list subscribers.',
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { isSuperAdmin } = useAdminRole();

  const [counts, setCounts] = useState({
    posts: 0,
    services: 0,
    resources: 0,
    testimonials: 0,
    consultations: 0,
    subscribers: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });

  const [recentPosts, setRecentPosts] =
    useState<RecentItem[]>([]);

  const [recentResources, setRecentResources] =
    useState<RecentItem[]>([]);

  const [pendingConsultations, setPendingConsultations] =
    useState(0);

  const [loading, setLoading] = useState(true);

  /*
   * Read the first name stored in Supabase Auth metadata.
   *
   * Expected metadata:
   * {
   *   first_name: "Merab"
   * }
   */
  const metadata = user?.user_metadata as
    | {
        first_name?: string;
        firstName?: string;
      }
    | undefined;

  const firstName =
    metadata?.first_name?.trim() ||
    metadata?.firstName?.trim() ||
    user?.email?.split('@')[0]?.charAt(0).toUpperCase() + user?.email?.split('@')[0]?.slice(1) ||
    'Admin';

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const [
        postsRes,
        servicesRes,
        resourcesRes,
        testimonialsRes,
        consultationsRes,
        subscribersRes,
      ] = await Promise.all([
        supabase
          .from('blog_posts')
          .select(
            'id, title, status, created_at',
            { count: 'exact' }
          )
          .order('created_at', {
            ascending: false,
          })
          .limit(3),

        supabase
          .from('services')
          .select('id', {
            count: 'exact',
          })
          .order('created_at', {
            ascending: false,
          })
          .limit(1),

        supabase
          .from('resources')
          .select(
            'id, title, created_at',
            { count: 'exact' }
          )
          .order('created_at', {
            ascending: false,
          })
          .limit(3),

        supabase
          .from('testimonials')
          .select('id', {
            count: 'exact',
          }),

        supabase
          .from('consultation_requests')
          .select('id, status', {
            count: 'exact',
          }),

        supabase
          .from('newsletter_subscribers')
          .select('id', {
            count: 'exact',
          }),
      ]);

      const publishedPosts = (postsRes.data || []).filter(p => p.status === 'published').length;
      const draftPosts = (postsRes.data || []).filter(p => p.status === 'draft').length;
      const newConsultations = (consultationsRes.data || []).filter(c => c.status === 'new').length;

      setCounts({
        posts:
          postsRes.count ??
          postsRes.data?.length ??
          0,

        services:
          servicesRes.count ??
          servicesRes.data?.length ??
          0,

        resources:
          resourcesRes.count ??
          resourcesRes.data?.length ??
          0,

        testimonials:
          testimonialsRes.count ??
          testimonialsRes.data?.length ??
          0,

        consultations:
          consultationsRes.count ??
          consultationsRes.data?.length ??
          0,

        subscribers:
          subscribersRes.count ??
          subscribersRes.data?.length ??
          0,

        publishedPosts,
        draftPosts,
      });

      setPendingConsultations(newConsultations);

      setRecentPosts(
        (postsRes.data || []) as RecentItem[]
      );

      setRecentResources(
        (resourcesRes.data ||
          []) as RecentItem[]
      );

      setLoading(false);
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">

            {/* Welcome header */}
            <section
              className="
                rounded-2xl
                border
                border-border/60
                bg-card
                p-6
                shadow-sm
                sm:p-8
              "
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Admin Dashboard
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <LayoutDashboard className="h-7 w-7 shrink-0 text-primary" />

                    <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                      Welcome back, {firstName}
                    </h1>
                  </div>

                  <p className="mt-3 max-w-2xl text-muted-foreground">
                    Manage your website content,
                    blog posts, services, resources,
                    and inquiries from one place.
                  </p>
                </div>

                <Link href="/admin/settings">
                  <Button
                    className="
                      w-full
                      gap-2
                      bg-gradient-to-r
                      from-primary
                      to-accent
                      sm:w-auto
                    "
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </section>

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <FileText className="h-5 w-5" />
                    <h2 className="font-semibold">Blog posts</h2>
                  </div>
                  <p className="text-3xl font-semibold">{loading ? '—' : counts.posts}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400">{counts.publishedPosts} published</Badge>
                    <Badge variant="secondary">{counts.draftPosts} draft</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Briefcase className="h-5 w-5" />
                    <h2 className="font-semibold">Services</h2>
                  </div>
                  <p className="text-3xl font-semibold">{loading ? '—' : counts.services}</p>
                  <p className="text-sm text-muted-foreground">Current service offerings</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Download className="h-5 w-5" />
                    <h2 className="font-semibold">Resources</h2>
                  </div>
                  <p className="text-3xl font-semibold">{loading ? '—' : counts.resources}</p>
                  <p className="text-sm text-muted-foreground">Downloadable guides</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Star className="h-5 w-5" />
                    <h2 className="font-semibold">Testimonials</h2>
                  </div>
                  <p className="text-3xl font-semibold">{loading ? '—' : counts.testimonials}</p>
                  <p className="text-sm text-muted-foreground">Client reviews</p>
                </CardContent>
              </Card>
            </section>

            {/* Secondary Stats */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <CalendarCheck className="h-5 w-5" />
                    <h2 className="font-semibold">Consultations</h2>
                  </div>
                  <p className="text-3xl font-semibold">{loading ? '—' : counts.consultations}</p>
                  {pendingConsultations > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {pendingConsultations} new
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">Total requests received</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Mail className="h-5 w-5" />
                    <h2 className="font-semibold">Subscribers</h2>
                  </div>
                  <p className="text-3xl font-semibold">{loading ? '—' : counts.subscribers}</p>
                  <p className="text-sm text-muted-foreground">Newsletter subscribers</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <TrendingUp className="h-5 w-5" />
                    <h2 className="font-semibold">Quick Actions</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/admin/posts/new">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Plus className="h-3 w-3" /> New Post
                      </Button>
                    </Link>
                    <Link href="/admin/consultations">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <CalendarCheck className="h-3 w-3" /> Requests
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent content */}
            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary">
                      <Clock className="h-5 w-5" />

                      <h2 className="font-semibold">
                        Recent posts
                      </h2>
                    </div>

                    <Link
                      href="/admin/posts"
                      className="text-sm text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <p className="text-sm text-muted-foreground">
                        Loading recent posts...
                      </p>
                    ) : recentPosts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No recent posts yet.
                      </p>
                    ) : (
                      recentPosts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-xl border border-border/60 bg-primary/5 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-medium">
                              {post.title}
                            </h3>

                            <Badge
                              variant={
                                post.status ===
                                'published'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {post.status ??
                                'draft'}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(
                              post.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary">
                      <Clock className="h-5 w-5" />

                      <h2 className="font-semibold">
                        Recent resources
                      </h2>
                    </div>

                    <Link
                      href="/admin/resources"
                      className="text-sm text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <p className="text-sm text-muted-foreground">
                        Loading recent resources...
                      </p>
                    ) : recentResources.length ===
                      0 ? (
                      <p className="text-sm text-muted-foreground">
                        No recent resources yet.
                      </p>
                    ) : (
                      recentResources.map(
                        (resource) => (
                          <div
                            key={resource.id}
                            className="rounded-xl border border-border/60 bg-primary/5 p-4"
                          >
                            <h3 className="font-medium">
                              {resource.title}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(
                                resource.created_at
                              ).toLocaleString()}
                            </p>
                          </div>
                        )
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Admin sections */}
            <section>
              <h2 className="font-display text-xl font-semibold tracking-tight mb-4">Content Management</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {adminSections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <Card
                      key={section.href}
                      className="border-border/60 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <CardContent className="space-y-4 p-6">
                        <div className="flex items-center gap-3 text-primary">
                          <Icon className="h-5 w-5" />
                          <h2 className="font-semibold">
                            {section.label}
                          </h2>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>

                        <Link
                          href={section.href}
                          className="block"
                        >
                          <Button
                            variant="outline"
                            className="mt-2 w-full"
                          >
                            Manage
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
    </div>
  );
}