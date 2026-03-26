'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Palette, Eye, Save, Home, X, Brush, Star, MessageSquare, Settings2, ExternalLink, LogOut, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
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
import SettingsTab from '@/components/dashboard/settings-tab';
import Link from 'next/link';

type DashboardTab = 'builder' | 'reviews' | 'leads' | 'settings';

const TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: 'builder', label: 'Page Builder', icon: <Brush className="w-4 h-4" /> },
  { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
  { id: 'leads', label: 'Leads', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings2 className="w-4 h-4" /> },
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

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('builder');
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [pageSettings, setPageSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
  const [isPreview, setIsPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auth guard — redirect to /login if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [router]);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;



  // ── Block operations ──────────────────────────
  const addBlock = useCallback((type: BlockType, afterIndex: number) => {
    const meta = BLOCK_PALETTE.find((b) => b.type === type);
    if (!meta) return;
    const newBlock: Block = { id: generateBlockId(), type, content: { ...meta.defaultContent }, style: { ...DEFAULT_BLOCK_STYLE, ...(meta.defaultStyle ?? {}) } };
    setBlocks((prev) => { const next = [...prev]; next.splice(afterIndex + 1, 0, newBlock); return next; });
  }, []);

  const moveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    setBlocks((prev) => { const next = [...prev]; const t = direction === 'up' ? index - 1 : index + 1; if (t < 0 || t >= next.length) return prev; [next[index], next[t]] = [next[t], next[index]]; return next; });
  }, []);

  const duplicateBlock = useCallback((index: number) => {
    setBlocks((prev) => { const next = [...prev]; next.splice(index + 1, 0, { ...prev[index], id: generateBlockId(), content: { ...prev[index].content }, style: { ...prev[index].style } }); return next; });
  }, []);

  const deleteBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    if (blocks[index]?.id === selectedBlockId) { setSelectedBlockId(null); setShowBlockSettings(false); }
  }, [blocks, selectedBlockId]);

  const updateBlockContent = useCallback((blockId: string, content: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content } : b)));
  }, []);

  const updateBlockStyle = useCallback((blockId: string, style: BlockStyle) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, style } : b)));
  }, []);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // ── Background ────────────────────────────────
  const bgStyle = (() => {
    if (pageSettings.background.type === 'solid') return { backgroundColor: pageSettings.background.value };
    if (pageSettings.background.type === 'image') return { backgroundImage: `url(${pageSettings.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {};
  })();
  const bgClass = pageSettings.background.type === 'gradient' ? `bg-gradient-to-b ${pageSettings.background.value}` : '';

  // Auth loading guard — placed after all hooks to avoid hooks order violation
  if (!authChecked) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Top bar ──────────────────────────────── */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-40">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors"><Home className="w-4 h-4" /></Link>
            <h1 className="text-white font-bold text-sm">Dashboard</h1>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/u/villiant" target="_blank">
              <Button variant="ghost" size="sm" className="h-7 text-slate-400 hover:text-white text-xs">
                <ExternalLink className="w-3 h-3 mr-1" /> Live page
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="h-7 text-slate-400 hover:text-white text-xs">
                <Shield className="w-3 h-3 mr-1" /> Admin
              </Button>
            </Link>
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
          {TABS.map((tab) => (
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
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Builder tab */}
          {activeTab === 'builder' && (
            <>
              {/* Builder toolbar */}
              <div className="flex-shrink-0 bg-slate-900/80 border-b border-slate-800 px-4 h-10 flex items-center justify-between">
                <span className="text-xs text-slate-500">{blocks.length} blocks</span>
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
                {!isPreview && <AddBlockMenu onAdd={(type) => addBlock(type, -1)} />}

                {blocks.map((block, index) => (
                  <div key={block.id}>
                    {isPreview ? (
                      <BlockRenderer block={block} accentColor={pageSettings.accentColor} />
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
                ))}

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

          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-6 max-w-3xl">
              <SettingsTab />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
