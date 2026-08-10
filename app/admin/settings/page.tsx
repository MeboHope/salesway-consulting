'use client';

import { useState } from 'react';
import { Settings, Save, Mail, Lock, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setMessage('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your admin preferences and site configuration.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Authorized Admin Emails
          </CardTitle>
          <CardDescription>Email addresses allowed to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-emails">Admin Emails (comma-separated)</Label>
            <Input
              id="admin-emails"
              placeholder="admin@example.com, another@example.com"
              defaultValue={process.env.NEXT_PUBLIC_AUTHORIZED_ADMIN_EMAILS}
            />
            <p className="text-xs text-muted-foreground">
              Changes require restarting the dev server to take effect.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Configuration
          </CardTitle>
          <CardDescription>General website settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" placeholder="Salesway Consulting" defaultValue="Salesway Consulting" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-url">Site URL</Label>
            <Input id="site-url" placeholder="https://saleswayconsulting.com" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-consultation">New consultation requests</Label>
              <p className="text-xs text-muted-foreground">Receive email when someone books a consultation</p>
            </div>
            <input type="checkbox" id="new-consultation" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-subscriber">New subscribers</Label>
              <p className="text-xs text-muted-foreground">Receive email when someone subscribes</p>
            </div>
            <input type="checkbox" id="new-subscriber" defaultChecked className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Security and authentication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Supabase Auth</Badge>
            <span className="text-sm text-muted-foreground">Authentication is managed via Supabase</span>
          </div>
          <p className="text-xs text-muted-foreground">
            To change admin credentials, use Supabase Dashboard → Authentication → Users
          </p>
        </CardContent>
      </Card>

      {message && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-primary">{message}</p>
        </div>
      )}

      <Button onClick={handleSave} disabled={saving} className="gap-2">
        {saving ? 'Saving...' : 'Save Changes'}
        {!saving && <Save className="h-4 w-4" />}
      </Button>
    </div>
  );
}
