'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Home, Users, FileText, Check, X, Plus, LogOut, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AdminTab = 'applications' | 'users';

interface Application {
  id: string;
  display_name: string;
  email: string;
  discord: string | null;
  game: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface BoosterUser {
  user_id: string;
  username: string;
  display_name: string;
  created_at: string;
}

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<BoosterUser[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', password: '', username: '', display_name: '' });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  // Which application is being turned into an account
  const [approvingAppId, setApprovingAppId] = useState<string | null>(null);
  const router = useRouter();

  const loadData = useCallback(async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data: role } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    if (!role || role.role !== 'admin') { router.push('/dashboard'); return; }

    const { data: apps } = await supabase.from('booster_applications').select('*').order('created_at', { ascending: false });
    if (apps) setApplications(apps);

    const { data: boosterUsers } = await supabase.from('booster_profiles').select('*').order('created_at', { ascending: false });
    if (boosterUsers) setUsers(boosterUsers);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const rejectApplication = async (id: string) => {
    const supabase = createClient();
    await supabase.from('booster_applications').update({ status: 'rejected' }).eq('id', id);
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
  };

  // When admin clicks "Approve & Create" on an application, pre-fill the form
  const startApproveFlow = (app: Application) => {
    setApprovingAppId(app.id);
    setCreateForm({
      email: app.email,
      password: '',
      username: app.display_name.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      display_name: app.display_name,
    });
    setShowCreateForm(true);
    setTab('users');
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      // If this was from an application, mark it approved
      if (approvingAppId) {
        const supabase = createClient();
        await supabase.from('booster_applications').update({ status: 'approved' }).eq('id', approvingAppId);
        setApplications((prev) => prev.map((a) => (a.id === approvingAppId ? { ...a, status: 'approved' } : a)));
        setApprovingAppId(null);
      }

      setShowCreateForm(false);
      setCreateForm({ email: '', password: '', username: '', display_name: '' });
      loadData();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const processedApps = applications.filter((a) => a.status !== 'pending');

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Top bar */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-40">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors"><Home className="w-4 h-4" /></Link>
            <h1 className="text-white font-bold text-sm">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-7 text-slate-400 hover:text-white text-xs">Dashboard</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-7 text-slate-400 hover:text-red-400 text-xs">
              <LogOut className="w-3 h-3 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-48 bg-slate-900 border-r border-slate-800 py-3">
          <button
            onClick={() => setTab('applications')}
            className={cn('flex items-center gap-2.5 px-4 py-2.5 text-sm w-full text-left transition-colors', tab === 'applications' ? 'text-white bg-purple-600/20 border-r-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/50')}
          >
            <FileText className="w-4 h-4" /> Applications
            {pendingApps.length > 0 && <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30 text-[10px] px-1.5 ml-auto">{pendingApps.length}</Badge>}
          </button>
          <button
            onClick={() => setTab('users')}
            className={cn('flex items-center gap-2.5 px-4 py-2.5 text-sm w-full text-left transition-colors', tab === 'users' ? 'text-white bg-purple-600/20 border-r-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/50')}
          >
            <Users className="w-4 h-4" /> Boosters
            <Badge className="bg-slate-700 text-slate-300 text-[10px] px-1.5 ml-auto">{users.length}</Badge>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Applications Tab ────────────────────── */}
          {tab === 'applications' && (
            <div className="max-w-4xl space-y-6">
              <h2 className="text-xl font-bold text-white">Booster Applications</h2>

              {pendingApps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-yellow-300">Pending ({pendingApps.length})</h3>
                  {pendingApps.map((app) => (
                    <div key={app.id} className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold text-lg">{app.display_name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {app.email}
                            {app.discord && <> · Discord: <span className="text-slate-300">{app.discord}</span></>}
                            {' · '}{formatDate(app.created_at)}
                          </p>
                        </div>
                        <Badge className="bg-slate-700 text-slate-300 text-xs">{app.game}</Badge>
                      </div>
                      {app.message && <p className="text-sm text-slate-300 bg-slate-900/50 rounded-lg px-4 py-3 mb-4">{app.message}</p>}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => startApproveFlow(app)} className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs">
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve & Create Account
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => rejectApplication(app.id)} className="text-red-400 hover:text-red-300 h-8 text-xs">
                          <X className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {processedApps.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-400">Processed</h3>
                  {processedApps.map((app) => (
                    <div key={app.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{app.display_name}</p>
                        <p className="text-xs text-slate-500">{app.email} · {formatDate(app.created_at)}</p>
                      </div>
                      <Badge className={app.status === 'approved' ? 'bg-green-600/20 text-green-300 border-green-500/30' : 'bg-red-600/20 text-red-300 border-red-500/30'}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {applications.length === 0 && (
                <div className="text-center py-16">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">No applications yet. Share <Link href="/apply" className="text-purple-400 underline">/apply</Link> to get applications.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Boosters Tab ────────────────────────── */}
          {tab === 'users' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Boosters</h2>
                <Button size="sm" onClick={() => { setShowCreateForm(!showCreateForm); setApprovingAppId(null); setCreateForm({ email: '', password: '', username: '', display_name: '' }); }} className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Create Account
                </Button>
              </div>

              {/* Create user form */}
              {showCreateForm && (
                <div className={cn('border rounded-lg p-5', approvingAppId ? 'bg-green-900/10 border-green-500/20' : 'bg-purple-900/10 border-purple-500/20')}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: approvingAppId ? '#86efac' : '#c4b5fd' }}>
                    {approvingAppId ? '✓ Create Account from Application' : 'Create New Booster Account'}
                  </h3>
                  <form onSubmit={handleCreateAccount} className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-slate-300 text-xs mb-1 block">Email *</Label>
                      <Input value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required placeholder="user@email.com" className="bg-slate-800 border-slate-700 text-white text-sm" />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-xs mb-1 block">Password *</Label>
                      <Input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required placeholder="Strong password" className="bg-slate-800 border-slate-700 text-white text-sm" />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-xs mb-1 block">Username (URL: /u/username) *</Label>
                      <Input value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required placeholder="booster-name" className="bg-slate-800 border-slate-700 text-white text-sm" />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-xs mb-1 block">Display Name *</Label>
                      <Input value={createForm.display_name} onChange={(e) => setCreateForm({ ...createForm, display_name: e.target.value })} required placeholder="Booster Name" className="bg-slate-800 border-slate-700 text-white text-sm" />
                    </div>
                    {createError && <div className="col-span-2 text-red-400 text-xs bg-red-900/20 border border-red-500/20 rounded px-3 py-2">{createError}</div>}
                    <div className="col-span-2 flex gap-2">
                      <Button type="submit" disabled={createLoading} size="sm" className={cn('text-white h-8 text-xs', approvingAppId ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700')}>
                        {createLoading ? 'Creating...' : approvingAppId ? 'Approve & Create Account' : 'Create Account'}
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); setApprovingAppId(null); }} className="text-slate-400 h-8 text-xs">Cancel</Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Users list */}
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.user_id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{user.display_name}</p>
                      <p className="text-xs text-slate-500">
                        <span className="text-purple-400">/u/{user.username}</span>
                        {' · Created '}{formatDate(user.created_at)}
                      </p>
                    </div>
                    <Link href={`/u/${user.username}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-7">
                        <ExternalLink className="w-3 h-3 mr-1" /> View page
                      </Button>
                    </Link>
                  </div>
                ))}
                {users.length === 0 && !showCreateForm && (
                  <div className="text-center py-16">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500">No boosters yet. Create one above or approve an application.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
