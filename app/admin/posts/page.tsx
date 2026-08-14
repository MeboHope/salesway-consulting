'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Eye,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  reading_minutes: number;
  is_featured: boolean;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError('');

    const {
      data,
      error: fetchError,
    } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        category,
        author_name,
        reading_minutes,
        is_featured,
        status,
        published_at,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading blog posts:', fetchError);
      setError(fetchError.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this blog post?'
    );

    if (!confirmed) return;

    setDeleting(id);
    setError('');

    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting post:', deleteError);
      setError(deleteError.message);
      setDeleting(null);
      return;
    }

    setPosts((current) => current.filter((post) => post.id !== id));
    setDeleting(null);
  };

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      post.title.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.author_name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Blog Posts
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create and manage Salesway Consulting articles.
          </p>
        </div>

        <Link href="/admin/posts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading blog posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />

            <p className="mt-4 text-muted-foreground">
              {search
                ? 'No posts match your search.'
                : 'No blog posts found.'}
            </p>

            {!search && (
              <Link href="/admin/posts/new">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Post
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="border-border/60"
            >
              <CardContent className="pt-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          post.status === 'published'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {post.status}
                      </Badge>

                      <Badge variant="outline">
                        {post.category}
                      </Badge>

                      {post.is_featured && (
                        <Badge variant="outline">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <h3 className="mt-2 truncate font-display font-semibold">
                      {post.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      /{post.slug}
                      {' · '}
                      {post.author_name}
                      {' · '}
                      {post.reading_minutes} min read
                      {' · '}
                      {post.published_at
                        ? new Date(
                            post.published_at
                          ).toLocaleDateString()
                        : 'Not published'}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="View post"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    <Link href={`/admin/posts/${post.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      aria-label="Delete post"
                      className="text-destructive hover:text-destructive"
                    >
                      {deleting === post.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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