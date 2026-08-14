'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, UserPlus, Trash2, Crown, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type AdminRole = {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  created_at: string;
  updated_at: string;
};

export default function AdminManagementPage({ userRole = 'admin', isSuperAdmin = false }: {
  userRole?: string;
  isSuperAdmin?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'super_admin'>('admin');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push('/admin');
      return;
    }

    loadAdminRoles();
  }, [router, isSuperAdmin]);

  const loadAdminRoles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading admin roles:', error);
    } else {
      setAdminRoles(data || []);
    }
    setLoading(false);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError('');

    if (!newAdminEmail) {
      setError('Email is required');
      setAdding(false);
      return;
    }

    const { error } = await supabase.from('admin_roles').insert({
      email: newAdminEmail,
      role: newAdminRole,
    });

    if (error) {
      setError(error.message || 'Failed to add admin');
      setAdding(false);
      return;
    }

    setNewAdminEmail('');
    setNewAdminRole('admin');
    setIsAddDialogOpen(false);
    loadAdminRoles();
    setAdding(false);
  };

  const handleDeleteAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove admin access for ${email}?`)) {
      return;
    }

    const { error } = await supabase.from('admin_roles').delete().eq('email', email);

    if (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to remove admin');
    } else {
      loadAdminRoles();
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage admin access and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Add a new admin with access to the admin panel
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'super_admin')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button type="submit" disabled={adding} className="w-full gap-2">
                {adding && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Admin
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Users with access to the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : adminRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admins configured yet
            </div>
          ) : (
            <div className="space-y-3">
              {adminRoles.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{admin.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {admin.role === 'super_admin' ? (
                          <Badge variant="default" className="gap-1">
                            <Crown className="h-3 w-3" />
                            Super Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Added {new Date(admin.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {admin.email !== user?.email && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.email)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Super Admin</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-7">
              <li>• Full access to all admin features</li>
              <li>• Can add and remove other admins</li>
              <li>• Can change admin roles</li>
              <li>• Can manage all content types</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Admin</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-7">
              <li>• Access to content management</li>
              <li>• Can create, edit, delete content</li>
              <li>• Cannot manage other admins</li>
              <li>• Cannot access admin management page</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
