'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, slug, title, category, status, published_at, created_at')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    loadPosts();
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-muted-foreground">Create and manage your articles.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No posts found. Create your first article!</p>
            <Link href="/admin/posts/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <Card key={post.id} className="border-border/60">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{post.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      /{post.slug} · {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {post.status === 'published' && (
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View post">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.id}`}>
                      <Button variant="ghost" size="icon" aria-label="Edit post">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      aria-label="Delete post"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
