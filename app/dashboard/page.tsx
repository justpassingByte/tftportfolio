'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Palette, Eye, Save, Home, X, Brush, Star, MessageSquare, Settings2, ExternalLink, LogOut, Shield, Users, FileText, Plus, Trash2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Block, BlockType, BlockStyle, PageSettings } from '@/lib/block-types';
import { BLOCK_PALETTE, DEFAULT_PAGE_SETTINGS, DEFAULT_BLOCK_STYLE, generateBlockId } from '@/lib/block-types';
import {
  defaultHeroContent,
  defaultPersonalContent,
  defaultWhyChooseContent,
} from '@/lib/default-content';
import EditableBlockWrapper from '@/components/builder/editable-block-wrapper';
import BlockRenderer from '@/components/builder/block-renderer';
import AddBlockMenu from '@/components/builder/add-block-menu';
import BlockSettingsPanel from '@/components/builder/block-settings-panel';
import PageSettingsPanel from '@/components/builder/page-settings-panel';
import ReviewsTab from '@/components/dashboard/reviews-tab';
import LeadsTab from '@/components/dashboard/leads-tab';
import Link from 'next/link';
type DashboardTab = 'builder' | 'reviews' | 'leads' | 'admin_apps' | 'admin_users';

const BOOSTER_TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: 'builder', label: 'Page Builder', icon: <Brush className="w-4 h-4" /> },
  { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
  { id: 'leads', label: 'Leads', icon: <MessageSquare className="w-4 h-4" /> },
];

const ADMIN_TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: 'admin_apps', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
  { id: 'admin_users', label: 'Boosters', icon: <Users className="w-4 h-4" /> },
];

// Default blocks that replicate the existing landing page
const DEFAULT_BLOCKS: Block[] = [
  {
    id: 'default-hero', type: 'hero',
    content: { ...defaultHeroContent },
    style: { ...DEFAULT_BLOCK_STYLE, width: 'full', padding: 'lg', textAlign: 'center' },
  },
  {
    id: 'default-personal', type: 'personal',
    content: { ...defaultPersonalContent },
    style: { ...DEFAULT_BLOCK_STYLE, width: 'medium', padding: 'md' },
  },
  {
    id: 'default-why', type: 'why_me',
    content: { ...defaultWhyChooseContent },
    style: { ...DEFAULT_BLOCK_STYLE, width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    id: 'default-reviews', type: 'reviews', content: {},
    style: { ...DEFAULT_BLOCK_STYLE, width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    id: 'default-lead', type: 'lead_form',
    content: { button_text: 'Send message' },
    style: { ...DEFAULT_BLOCK_STYLE, width: 'narrow', padding: 'lg', background: 'card', borderRadius: 'lg', border: 'subtle', textAlign: 'center' },
  },
  {
    id: 'default-links', type: 'links',
    content: { items: [{ label: 'Join Discord', url: '#', icon: '💬' }, { label: 'Visit Testictour', url: 'https://testictour.com', icon: '🏆' }] },
    style: { ...DEFAULT_BLOCK_STYLE, width: 'medium', padding: 'md', textAlign: 'center' },
  },
];

// ================================================================
// Admin sub-components
// ================================================================

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

function AdminApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingApp, setAcceptingApp] = useState<Application | null>(null);
  const [acceptForm, setAcceptForm] = useState({ username: '', password: '' });
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('booster_applications').select('*').order('created_at', { ascending: false });
      if (data) setApplications(data);
      setLoading(false);
    };
    load();
  }, []);

  const rejectApplication = async (id: string) => {
    const supabase = createClient();
    await supabase.from('booster_applications').update({ status: 'rejected' }).eq('id', id);
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
  };

  const handleAcceptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingApp) return;
    setAcceptError('');
    setAcceptLoading(true);
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acceptingApp.email, display_name: acceptingApp.display_name, username: acceptForm.username, password: acceptForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      
      const supabase = createClient();
      await supabase.from('booster_applications').update({ status: 'approved' }).eq('id', acceptingApp.id);
      
      setApplications((prev) => prev.map((a) => (a.id === acceptingApp.id ? { ...a, status: 'approved' } : a)));
      setAcceptingApp(null);
      setAcceptForm({ username: '', password: '' });
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : 'Error accepting');
    } finally {
      setAcceptLoading(false);
    }
  };

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const processedApps = applications.filter((a) => a.status !== 'pending');
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <p className="text-slate-500 text-sm">Loading...</p>;

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-white">Booster Applications</h2>
      {pendingApps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-yellow-300">Pending ({pendingApps.length})</h3>
          {pendingApps.map((app) => (
            <div key={app.id} className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">{app.display_name}</p>
                  <p className="text-xs text-slate-400">{app.email}{app.discord && <> · Discord: <span className="text-slate-300">{app.discord}</span></>} · {formatDate(app.created_at)}</p>
                </div>
                <Badge className="bg-slate-700 text-slate-300 text-xs">{app.game}</Badge>
              </div>
              {app.message && <p className="text-sm text-slate-300 bg-slate-900/50 rounded px-4 py-3 mb-4">{app.message}</p>}
              {acceptingApp?.id === app.id ? (
                <div className="mt-4 bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-300 mb-2">Create Booster Account</p>
                  <form onSubmit={handleAcceptSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-slate-400 text-xs mb-1 block">Username *</Label><Input value={acceptForm.username} onChange={(e) => setAcceptForm({ ...acceptForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required placeholder="e.g. jondoe" className="bg-slate-900 border-slate-700 text-white text-sm h-8" /></div>
                      <div><Label className="text-slate-400 text-xs mb-1 block">Password *</Label><Input type="password" value={acceptForm.password} onChange={(e) => setAcceptForm({ ...acceptForm, password: e.target.value })} required className="bg-slate-900 border-slate-700 text-white text-sm h-8" /></div>
                    </div>
                    {acceptError && <p className="text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded border border-red-500/20">{acceptError}</p>}
                    <div className="flex gap-2">
                      <Button type="submit" disabled={acceptLoading} size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs">{acceptLoading ? 'Creating...' : 'Create Account & Approve'}</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setAcceptingApp(null); setAcceptForm({username: '', password: ''}) }} className="text-slate-400 h-7 text-xs">Cancel</Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setAcceptingApp(app)} className="text-green-400 hover:text-green-300 h-8 text-xs bg-green-900/20">
                    <Check className="w-3.5 h-3.5 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => rejectApplication(app.id)} className="text-red-400 hover:text-red-300 h-8 text-xs bg-red-900/20">
                    <X className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              )}
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
              <Badge className={app.status === 'approved' ? 'bg-green-600/20 text-green-300 border-green-500/30' : 'bg-red-600/20 text-red-300 border-red-500/30'}>{app.status}</Badge>
            </div>
          ))}
        </div>
      )}
      {applications.length === 0 && <p className="text-slate-500 text-center py-16">No applications yet.</p>}
    </div>
  );
}

function AdminUsersTab() {
  const [users, setUsers] = useState<BoosterUser[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '', display_name: '' });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from('booster_profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setShowCreate(false);
      setForm({ email: '', password: '', username: '', display_name: '' });
      loadUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this booster and all their data?')) return;
    
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting user');
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Boosters</h2>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Create Account
        </Button>
      </div>
      {showCreate && (
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-purple-300 mb-3">Create New Booster</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            <div><Label className="text-slate-300 text-xs mb-1 block">Email *</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="user@email.com" className="bg-slate-800 border-slate-700 text-white text-sm" /></div>
            <div><Label className="text-slate-300 text-xs mb-1 block">Password *</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="bg-slate-800 border-slate-700 text-white text-sm" /></div>
            <div><Label className="text-slate-300 text-xs mb-1 block">Username *</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} required className="bg-slate-800 border-slate-700 text-white text-sm" /></div>
            <div><Label className="text-slate-300 text-xs mb-1 block">Display Name *</Label><Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} required className="bg-slate-800 border-slate-700 text-white text-sm" /></div>
            {createError && <div className="col-span-2 text-red-400 text-xs bg-red-900/20 border border-red-500/20 rounded px-3 py-2">{createError}</div>}
            <div className="col-span-2 flex gap-2">
              <Button type="submit" disabled={createLoading} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">{createLoading ? 'Creating...' : 'Create Account'}</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)} className="text-slate-400 h-8 text-xs">Cancel</Button>
            </div>
          </form>
        </div>
      )}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.user_id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{user.display_name}</p>
              <p className="text-xs text-slate-500"><span className="text-purple-400">/u/{user.username}</span> · {formatDate(user.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/u/${user.username}`} target="_blank">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-7">
                  <ExternalLink className="w-3 h-3 mr-1" /> View
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(user.user_id)} className="text-red-400 hover:text-red-300 text-xs h-7 px-2">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-slate-500 text-center py-12">No boosters yet.</p>}
      </div>
    </div>
  );
}

// ================================================================
// Main Dashboard
// ================================================================

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('builder');
  
  // Dual-language block state
  const [blockData, setBlockData] = useState<{ vi: Block[], en: Block[] }>({
    vi: DEFAULT_BLOCKS,
    en: [],
  });
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');
  
  // Computed active blocks
  const blocks = blockData[editLang];
  
  // Custom setter to update only the active language's blocks
  const setBlocks = useCallback((action: React.SetStateAction<Block[]>) => {
    setBlockData((prev) => ({
      ...prev,
      [editLang]: typeof action === 'function' ? action(prev[editLang]) : action
    }));
  }, [editLang]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [pageSettings, setPageSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
  const [isPreview, setIsPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auth guard, role check, and DB Loader
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check admin role
      const { data: role } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
      if (role?.role === 'admin') setIsAdmin(true);

      // Get username for "View live page" link
      const { data: profile } = await supabase.from('booster_profiles').select('username').eq('user_id', user.id).single();
      if (profile) setUsername(profile.username);

      // Load saved blocks from DB
      const { data: page } = await supabase
        .from('booster_pages')
        .select('blocks, blocks_en, theme_config')
        .eq('user_id', user.id)
        .single();

      const newBlockData = { vi: DEFAULT_BLOCKS, en: [] as Block[] };
      if (page?.blocks && Array.isArray(page.blocks) && page.blocks.length > 0) {
        newBlockData.vi = page.blocks as Block[];
      }
      if (page?.blocks_en && Array.isArray(page.blocks_en)) {
        newBlockData.en = page.blocks_en as Block[];
      }
      setBlockData(newBlockData);

      setAuthChecked(true);
    };
    checkAuthAndLoad();
  }, [router]);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  // ── Block operations ──────────────────────────
  const addBlock = useCallback((type: BlockType, afterIndex: number) => {
    const meta = BLOCK_PALETTE.find((b) => b.type === type);
    if (!meta) return;
    const newBlock: Block = { id: generateBlockId(), type, content: { ...meta.defaultContent }, style: { ...DEFAULT_BLOCK_STYLE, ...(meta.defaultStyle ?? {}) } };
    setBlocks((prev) => { const next = [...prev]; next.splice(afterIndex + 1, 0, newBlock); return next; });
  }, [setBlocks]);

  const moveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    setBlocks((prev) => { const next = [...prev]; const t = direction === 'up' ? index - 1 : index + 1; if (t < 0 || t >= next.length) return prev; [next[index], next[t]] = [next[t], next[index]]; return next; });
  }, [setBlocks]);

  const duplicateBlock = useCallback((index: number) => {
    setBlocks((prev) => { const next = [...prev]; next.splice(index + 1, 0, { ...prev[index], id: generateBlockId(), content: { ...prev[index].content }, style: { ...prev[index].style } }); return next; });
  }, [setBlocks]);

  const deleteBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    if (blocks[index]?.id === selectedBlockId) { setSelectedBlockId(null); setShowBlockSettings(false); }
  }, [blocks, selectedBlockId, setBlocks]);

  const updateBlockContent = useCallback((blockId: string, content: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content } : b)));
  }, [setBlocks]);

  const updateBlockStyle = useCallback((blockId: string, style: BlockStyle) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, style } : b)));
  }, [setBlocks]);

  const handleSave = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingPage } = await supabase.from('booster_pages').select('id').eq('user_id', user.id).single();

    const payload = {
      user_id: user.id,
      template_id: 'default',
      theme_config: pageSettings,
      is_published: true,
      blocks: blockData.vi,
      blocks_en: blockData.en,
    };

    let saveErr;
    if (existingPage) {
      const { error } = await supabase.from('booster_pages').update(payload).eq('user_id', user.id);
      saveErr = error;
    } else {
      const { error } = await supabase.from('booster_pages').insert([payload]);
      saveErr = error;
    }

    if (!saveErr) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      console.error(saveErr);
      alert('Save failed: ' + saveErr.message);
    }
  };

  // ── Background ────────────────────────────────
  const bgStyle = (() => {
    if (pageSettings.background.type === 'solid') return { backgroundColor: pageSettings.background.value };
    if (pageSettings.background.type === 'image') return { backgroundImage: `url(${pageSettings.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {};
  })();
  const bgClass = pageSettings.background.type === 'gradient' ? `bg-gradient-to-b ${pageSettings.background.value}` : '';

  if (!authChecked) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  const allTabs = [...BOOSTER_TABS, ...(isAdmin ? ADMIN_TABS : [])];

  return (
    <>
      {/* ── Top bar ──────────────────────────────── */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-40">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors"><Home className="w-4 h-4" /></Link>
            <h1 className="text-white font-bold text-sm">Dashboard</h1>
            {isAdmin && <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30 text-[10px]">ADMIN</Badge>}
          </div>
          <div className="flex items-center gap-1">
            {username && (
              <Link href={`/u/${username}`} target="_blank">
                <Button variant="ghost" size="sm" className="h-7 text-slate-400 hover:text-white text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" /> Live page
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={async () => { const s = createClient(); await s.auth.signOut(); router.push('/login'); }} className="h-7 text-slate-400 hover:text-red-400 text-xs">
              <LogOut className="w-3 h-3 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* ── Sidebar + Content ────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-48 bg-slate-900 border-r border-slate-800 flex flex-col py-3">
          {BOOSTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowBlockSettings(false); setShowPageSettings(false); setIsPreview(false); setSelectedBlockId(null); }}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left',
                activeTab === tab.id
                  ? 'text-white bg-purple-600/20 border-r-2 border-purple-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {isAdmin && (
            <>
              <div className="mx-4 my-3 border-t border-slate-700/50" />
              <p className="px-4 text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Admin
              </p>
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowBlockSettings(false); setShowPageSettings(false); setIsPreview(false); setSelectedBlockId(null); }}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left',
                    activeTab === tab.id
                      ? 'text-white bg-yellow-600/20 border-r-2 border-yellow-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Builder tab */}
          {activeTab === 'builder' && (
            <>
              {/* Builder toolbar */}
              <div className="flex-shrink-0 bg-slate-900/80 border-b border-slate-800 px-4 h-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{blocks.length} blocks</span>
                  
                  {/* Language Toggle */}
                  <div className="flex items-center bg-slate-800/50 rounded-md border border-slate-700/50 overflow-hidden">
                    <button
                      onClick={() => setEditLang('vi')}
                      className={cn(
                        "px-3 py-1 text-xs font-medium transition-colors",
                        editLang === 'vi' ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => setEditLang('en')}
                      className={cn(
                        "px-3 py-1 text-xs font-medium transition-colors",
                        editLang === 'en' ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      English
                    </button>
                  </div>

                  {editLang === 'en' && blockData.en.length === 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] text-purple-400 hover:text-purple-300 px-2"
                      onClick={() => setBlockData(prev => ({ ...prev, en: prev.vi }))}
                      title="Quét toàn bộ layout Tiếng Việt sang bản Tiếng Anh để bắt đầu sửa text"
                    >
                      Auto-copy từ Tiếng Việt
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { setShowPageSettings(!showPageSettings); setShowBlockSettings(false); }}
                    className={cn('h-7 text-xs border-slate-700 text-slate-300', showPageSettings && 'bg-purple-600/20 border-purple-500/30 text-purple-300')}
                  >
                    <Palette className="w-3 h-3 mr-1" /> Design
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { setIsPreview(!isPreview); setShowBlockSettings(false); setShowPageSettings(false); setSelectedBlockId(null); }}
                    className={cn('h-7 text-xs border-slate-700 text-slate-300', isPreview && 'bg-blue-600/20 border-blue-500/30 text-blue-300')}
                  >
                    {isPreview ? <><X className="w-3 h-3 mr-1" /> Exit Preview</> : <><Eye className="w-3 h-3 mr-1" /> Preview</>}
                  </Button>
                  <Button size="sm" onClick={handleSave} className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white">
                    <Save className="w-3 h-3 mr-1" /> {saved ? 'Saved!' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* Page settings panel */}
              <PageSettingsPanel settings={pageSettings} isOpen={showPageSettings} onUpdate={setPageSettings} onClose={() => setShowPageSettings(false)} />

              {/* Block settings panel */}
              {showBlockSettings && (
                <BlockSettingsPanel block={selectedBlock} onUpdate={updateBlockContent} onUpdateStyle={updateBlockStyle} onClose={() => { setShowBlockSettings(false); setSelectedBlockId(null); }} />
              )}

              {/* Canvas */}
              <div
                className={cn('flex-1 overflow-y-auto', bgClass)}
                style={bgStyle}
                onClick={() => { if (!isPreview) { setSelectedBlockId(null); setShowBlockSettings(false); } }}
              >
                {!isPreview && <AddBlockMenu onAdd={(type) => addBlock(type, -1)} isAdmin={isAdmin} />}

                {blocks.map((block, index) => {
                  const isLockedBlock = (block.type === 'hero' || block.type === 'community') && !isAdmin;

                  return (
                    <div key={block.id}>
                      {isPreview || isLockedBlock ? (
                        <div className={isLockedBlock ? 'relative' : ''}>
                          <BlockRenderer block={block} accentColor={pageSettings.accentColor} />
                          {isLockedBlock && !isPreview && (
                            <div className="absolute top-2 right-2 bg-slate-800/90 backdrop-blur-sm text-slate-400 text-[10px] px-2 py-1 rounded-full border border-slate-700/50 flex items-center gap-1 pointer-events-none">
                              🔒 Cố định
                            </div>
                          )}
                        </div>
                      ) : (
                        <EditableBlockWrapper
                          blockId={block.id}
                          blockLabel={BLOCK_PALETTE.find((b) => b.type === block.type)?.label ?? block.type}
                          isFirst={index === 0}
                          isLast={index === blocks.length - 1}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onMoveUp={() => moveBlock(index, 'up')}
                          onMoveDown={() => moveBlock(index, 'down')}
                          onDuplicate={() => duplicateBlock(index)}
                          onDelete={() => deleteBlock(index)}
                          onSettings={() => { setSelectedBlockId(block.id); setShowBlockSettings(true); setShowPageSettings(false); }}
                        >
                          <BlockRenderer block={block} accentColor={pageSettings.accentColor} />
                        </EditableBlockWrapper>
                      )}
                      {!isPreview && <AddBlockMenu onAdd={(type) => addBlock(type, index)} />}
                    </div>
                  );
                })}

                {blocks.length === 0 && !isPreview && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <p className="text-xl text-slate-500 mb-3">Start building your page</p>
                    <p className="text-slate-600 text-sm">Click &quot;+ Add block&quot; above</p>
                  </div>
                )}
                <div className="h-20" />
              </div>
            </>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
              <ReviewsTab />
            </div>
          )}

          {/* Leads tab */}
          {activeTab === 'leads' && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
              <LeadsTab />
            </div>
          )}

          {/* Admin tabs */}
          {activeTab === 'admin_apps' && (
            <div className="flex-1 overflow-y-auto p-6">
              <AdminApplicationsTab />
            </div>
          )}
          {activeTab === 'admin_users' && (
            <div className="flex-1 overflow-y-auto p-6">
              <AdminUsersTab />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
