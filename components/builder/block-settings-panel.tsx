'use client';

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Block, BlockStyle } from '@/lib/block-types';
import { cn } from '@/lib/utils';

interface BlockSettingsPanelProps {
  block: Block | null;
  onUpdate: (blockId: string, content: Record<string, unknown>) => void;
  onUpdateStyle: (blockId: string, style: BlockStyle) => void;
  onClose: () => void;
}

type Tab = 'content' | 'style';

export default function BlockSettingsPanel({ block, onUpdate, onUpdateStyle, onClose }: BlockSettingsPanelProps) {
  const [activeTab, setActiveTab] = __import_useState<Tab>('content');

  if (!block) return null;

  const update = (key: string, value: unknown) => {
    onUpdate(block.id, { ...block.content, [key]: value });
  };

  const updateStyle = (key: keyof BlockStyle, value: string) => {
    onUpdateStyle(block.id, { ...block.style, [key]: value });
  };

  const c = block.content;
  const s = block.style;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white capitalize">{block.type.replace('_', ' ')}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {(['content', 'style'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn('flex-1 py-2 text-xs font-medium capitalize transition-colors', activeTab === tab ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'content' && <ContentEditor block={block} content={c} update={update} />}
        {activeTab === 'style' && <StyleEditor style={s} updateStyle={updateStyle} />}
      </div>
    </div>
  );
}

// ================================================================
// Hack to use hooks in a non-hook file pattern
// ================================================================
import { useState as __import_useState } from 'react';

// ================================================================
// Content Editor — dynamic per block type
// ================================================================
function ContentEditor({ block, content: c, update }: { block: Block; content: Record<string, unknown>; update: (key: string, value: unknown) => void }) {
  return (
    <>
      {block.type === 'hero' && (
        <>
          <Field label="Headline" value={c.headline as string} onChange={(v) => update('headline', v)} />
          <Field label="Highlight" value={c.headline_highlight as string} onChange={(v) => update('headline_highlight', v)} />
          <Field label="Subheadline" value={c.subheadline as string} onChange={(v) => update('subheadline', v)} />
          <Field label="Avatar Letter" value={c.avatar_initial as string} onChange={(v) => update('avatar_initial', v)} />
          <Field label="Avatar Image URL (Optional)" value={(c.avatar_url as string) ?? ''} onChange={(v) => update('avatar_url', v)} placeholder="https://..." />
          <Field label="CTA Primary" value={c.cta_primary as string} onChange={(v) => update('cta_primary', v)} />
          <Field label="CTA Secondary" value={c.cta_secondary as string} onChange={(v) => update('cta_secondary', v)} />
          <Field label="Background Image URL" value={(c.bg_image as string) ?? ''} onChange={(v) => update('bg_image', v)} placeholder="https://..." />
        </>
      )}

      {(block.type === 'text' || block.type === 'personal') && (
        <>
          <Field label="Title" value={c.title as string} onChange={(v) => update('title', v)} />
          {((c.paragraphs as string[]) ?? ['']).map((p: string, i: number) => (
            <div key={i}>
              <Label className="text-slate-300 mb-1 block text-xs">Paragraph {i + 1}</Label>
              <Textarea value={p} onChange={(e) => { const a = [...((c.paragraphs as string[]) ?? [''])]; a[i] = e.target.value; update('paragraphs', a); }} className="bg-slate-800 border-slate-700 text-white text-sm resize-none" rows={2} />
            </div>
          ))}
          <AddBtn onClick={() => update('paragraphs', [...((c.paragraphs as string[]) ?? []), ''])} label="paragraph" />
        </>
      )}

      {block.type === 'image' && (
        <>
          <Field label="Image URL" value={(c.src as string) ?? ''} onChange={(v) => update('src', v)} placeholder="Paste URL" />
          <Field label="Caption" value={(c.caption as string) ?? ''} onChange={(v) => update('caption', v)} />
        </>
      )}

      {block.type === 'gallery' && (
        <>
          <SelectField label="Columns" value={String((c.columns as number) ?? 3)} options={['2', '3', '4']} onChange={(v) => update('columns', parseInt(v))} />
          <Label className="text-slate-300 block text-xs">Images (URLs)</Label>
          {((c.images as string[]) ?? []).map((img: string, i: number) => (
            <div key={i} className="flex gap-1">
              <Input value={img} onChange={(e) => { const a = [...((c.images as string[]) ?? [])]; a[i] = e.target.value; update('images', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="URL" />
              <button onClick={() => { const a = [...((c.images as string[]) ?? [])]; a.splice(i, 1); update('images', a); }} className="text-red-400 hover:text-red-300 px-1 text-xs">✕</button>
            </div>
          ))}
          <AddBtn onClick={() => update('images', [...((c.images as string[]) ?? []), ''])} label="image" />
        </>
      )}

      {block.type === 'card' && (
        <>
          <Field label="Icon (emoji)" value={(c.icon as string) ?? '⚡'} onChange={(v) => update('icon', v)} />
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <div><Label className="text-slate-300 mb-1 block text-xs">Body</Label><Textarea value={(c.body as string) ?? ''} onChange={(e) => update('body', e.target.value)} className="bg-slate-800 border-slate-700 text-white text-sm resize-none" rows={2} /></div>
        </>
      )}

      {block.type === 'cards_row' && (
        <>
          <Label className="text-slate-300 block text-xs mb-1">Cards</Label>
          {((c.cards as { icon: string; title: string; body: string }[]) ?? []).map((card, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <div className="flex gap-1.5">
                <Input value={card.icon} onChange={(e) => { const a = [...((c.cards as { icon: string; title: string; body: string }[]) ?? [])]; a[i] = { ...a[i], icon: e.target.value }; update('cards', a); }} className="bg-slate-800 border-slate-700 text-white text-xs w-14" />
                <Input value={card.title} onChange={(e) => { const a = [...((c.cards as { icon: string; title: string; body: string }[]) ?? [])]; a[i] = { ...a[i], title: e.target.value }; update('cards', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Title" />
              </div>
              <Textarea value={card.body} onChange={(e) => { const a = [...((c.cards as { icon: string; title: string; body: string }[]) ?? [])]; a[i] = { ...a[i], body: e.target.value }; update('cards', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={1} />
            </div>
          ))}
          <AddBtn onClick={() => update('cards', [...((c.cards as { icon: string; title: string; body: string }[]) ?? []), { icon: '⚡', title: 'New Card', body: 'Description' }])} label="card" />
        </>
      )}

      {block.type === 'stats' && (
        <>
          <Label className="text-slate-300 block text-xs mb-1">Stats</Label>
          {((c.items as { value: string; label: string }[]) ?? []).map((item, i) => (
            <div key={i} className="flex gap-1.5">
              <Input value={item.value} onChange={(e) => { const a = [...((c.items as { value: string; label: string }[]) ?? [])]; a[i] = { ...a[i], value: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs w-20" placeholder="500+" />
              <Input value={item.label} onChange={(e) => { const a = [...((c.items as { value: string; label: string }[]) ?? [])]; a[i] = { ...a[i], label: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Label" />
            </div>
          ))}
          <AddBtn onClick={() => update('items', [...((c.items as { value: string; label: string }[]) ?? []), { value: '0', label: 'Label' }])} label="stat" />
        </>
      )}

      {block.type === 'banner' && (
        <>
          <Field label="Text" value={(c.text as string) ?? ''} onChange={(v) => update('text', v)} />
          <Field label="Link Text" value={(c.link_text as string) ?? ''} onChange={(v) => update('link_text', v)} />
          <Field label="Link URL" value={(c.link_url as string) ?? ''} onChange={(v) => update('link_url', v)} />
        </>
      )}

      {block.type === 'why_me' && (
        <>
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <Field label="Subtitle" value={(c.subtitle as string) ?? ''} onChange={(v) => update('subtitle', v)} />
          <Label className="text-slate-300 block text-xs mt-2">Reasons</Label>
          {((c.reasons as { title: string; description: string }[]) ?? []).map((r, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <Input value={r.title} onChange={(e) => { const a = [...((c.reasons as { title: string; description: string }[]) ?? [])]; a[i] = { ...a[i], title: e.target.value }; update('reasons', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Title" />
              <Textarea value={r.description} onChange={(e) => { const a = [...((c.reasons as { title: string; description: string }[]) ?? [])]; a[i] = { ...a[i], description: e.target.value }; update('reasons', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={1} />
            </div>
          ))}
          <AddBtn onClick={() => update('reasons', [...((c.reasons as { title: string; description: string }[]) ?? []), { title: '', description: '' }])} label="reason" />
        </>
      )}

      {block.type === 'faq' && (
        <>
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <Label className="text-slate-300 block text-xs mt-2">Questions</Label>
          {((c.items as { question: string; answer: string }[]) ?? []).map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <Input value={item.question} onChange={(e) => { const a = [...((c.items as { question: string; answer: string }[]) ?? [])]; a[i] = { ...a[i], question: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Question" />
              <Textarea value={item.answer} onChange={(e) => { const a = [...((c.items as { question: string; answer: string }[]) ?? [])]; a[i] = { ...a[i], answer: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={1} />
            </div>
          ))}
          <AddBtn onClick={() => update('items', [...((c.items as { question: string; answer: string }[]) ?? []), { question: '', answer: '' }])} label="question" />
        </>
      )}

      {block.type === 'links' && (
        <>
          {((c.items as { label: string; url: string; icon: string }[]) ?? []).map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <div className="flex gap-1.5">
                <Input value={item.icon} onChange={(e) => { const a = [...((c.items as { label: string; url: string; icon: string }[]) ?? [])]; a[i] = { ...a[i], icon: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs w-12" />
                <Input value={item.label} onChange={(e) => { const a = [...((c.items as { label: string; url: string; icon: string }[]) ?? [])]; a[i] = { ...a[i], label: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Label" />
              </div>
              <Input value={item.url} onChange={(e) => { const a = [...((c.items as { label: string; url: string; icon: string }[]) ?? [])]; a[i] = { ...a[i], url: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="URL" />
            </div>
          ))}
          <AddBtn onClick={() => update('items', [...((c.items as { label: string; url: string; icon: string }[]) ?? []), { label: 'New', url: '#', icon: '🔗' }])} label="link" />
        </>
      )}

      {block.type === 'reviews' && (
        <>
          <Field label="Title" value={(c.title as string) ?? 'What My Clients Say'} onChange={(v) => update('title', v)} />
          <Field label="Subtitle" value={(c.subtitle as string) ?? 'Real stories from real people who trusted me with their climb'} onChange={(v) => update('subtitle', v)} />
          <Label className="text-slate-300 block text-xs mt-3">Reviews</Label>
          {((c.reviews as { id: string; username: string; content: string; rank_before: string; rank_after: string; rating: number; days?: string }[]) ?? []).map((review, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <div className="flex gap-1.5">
                <Input value={review.username} onChange={(e) => { const a = [...((c.reviews as any[]) ?? [])]; a[i] = { ...a[i], username: e.target.value }; update('reviews', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Username" />
                <Input value={String(review.rating ?? 5)} onChange={(e) => { const a = [...((c.reviews as any[]) ?? [])]; a[i] = { ...a[i], rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) }; update('reviews', a); }} className="bg-slate-800 border-slate-700 text-white text-xs w-12" placeholder="★" type="number" />
              </div>
              <Textarea value={review.content} onChange={(e) => { const a = [...((c.reviews as any[]) ?? [])]; a[i] = { ...a[i], content: e.target.value }; update('reviews', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={2} placeholder="Review content..." />
              <div className="flex gap-1.5">
                <Input value={review.rank_before} onChange={(e) => { const a = [...((c.reviews as any[]) ?? [])]; a[i] = { ...a[i], rank_before: e.target.value }; update('reviews', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Rank before" />
                <span className="text-slate-500 flex items-center text-xs">→</span>
                <Input value={review.rank_after} onChange={(e) => { const a = [...((c.reviews as any[]) ?? [])]; a[i] = { ...a[i], rank_after: e.target.value }; update('reviews', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Rank after" />
              </div>
              <Input value={review.days ?? ''} onChange={(e) => { const a = [...((c.reviews as any[]) ?? [])]; a[i] = { ...a[i], days: e.target.value }; update('reviews', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Duration (e.g. 3 days)" />
              <button onClick={() => { const a = [...((c.reviews as any[]) ?? [])]; a.splice(i, 1); update('reviews', a); }} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
          ))}
          <AddBtn onClick={() => update('reviews', [...((c.reviews as any[]) ?? []), { id: `r-${Date.now()}`, username: 'Player', content: 'Great service!', rank_before: 'Gold', rank_after: 'Diamond', rating: 5, days: '3 days', is_approved: true, created_at: new Date().toISOString() }])} label="review" />
        </>
      )}

      {block.type === 'lead_form' && <Field label="Button Text" value={(c.button_text as string) ?? 'Send message'} onChange={(v) => update('button_text', v)} />}

      {block.type === 'divider' && <SelectField label="Style" value={(c.style as string) ?? 'gradient'} options={['line', 'gradient', 'dots']} onChange={(v) => update('style', v)} />}

      {block.type === 'spacer' && <SelectField label="Height" value={(c.height as string) ?? 'md'} options={['sm', 'md', 'lg', 'xl']} onChange={(v) => update('height', v)} />}

      {block.type === 'about_avatar' && (
        <>
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <Field label="Avatar Image URL" value={(c.avatarUrl as string) ?? ''} onChange={(v) => update('avatarUrl', v)} placeholder="https://..." />
          <Field label="Avatar Alt Text" value={(c.avatarAlt as string) ?? ''} onChange={(v) => update('avatarAlt', v)} />
          {((c.paragraphs as string[]) ?? ['']).map((p: string, i: number) => (
            <div key={i} className="flex gap-1">
              <Textarea value={p} onChange={(e) => { const a = [...((c.paragraphs as string[]) ?? [''])]; a[i] = e.target.value; update('paragraphs', a); }} className="bg-slate-800 border-slate-700 text-white text-sm resize-none flex-1" rows={2} />
              <button onClick={() => { const a = [...((c.paragraphs as string[]) ?? [])]; a.splice(i, 1); update('paragraphs', a); }} className="text-red-400 hover:text-red-300 px-1 text-xs">✕</button>
            </div>
          ))}
          <AddBtn onClick={() => update('paragraphs', [...((c.paragraphs as string[]) ?? []), ''])} label="paragraph" />
          <Label className="text-slate-300 block text-xs mt-3">Highlights</Label>
          {((c.highlights as { icon: string; label: string; value: string }[]) ?? []).map((h, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <div className="flex gap-1.5">
                <Input value={h.icon} onChange={(e) => { const a = [...((c.highlights as { icon: string; label: string; value: string }[]) ?? [])]; a[i] = { ...a[i], icon: e.target.value }; update('highlights', a); }} className="bg-slate-800 border-slate-700 text-white text-xs w-12" />
                <Input value={h.label} onChange={(e) => { const a = [...((c.highlights as { icon: string; label: string; value: string }[]) ?? [])]; a[i] = { ...a[i], label: e.target.value }; update('highlights', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Label" />
                <Input value={h.value} onChange={(e) => { const a = [...((c.highlights as { icon: string; label: string; value: string }[]) ?? [])]; a[i] = { ...a[i], value: e.target.value }; update('highlights', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Value" />
              </div>
              <button onClick={() => { const a = [...((c.highlights as { icon: string; label: string; value: string }[]) ?? [])]; a.splice(i, 1); update('highlights', a); }} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
          ))}
          <AddBtn onClick={() => update('highlights', [...((c.highlights as { icon: string; label: string; value: string }[]) ?? []), { icon: '⚡', label: 'Label', value: 'Value' }])} label="highlight" />
        </>
      )}

      {block.type === 'comparison' && (
        <>
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <Field label="Subtitle" value={(c.subtitle as string) ?? ''} onChange={(v) => update('subtitle', v)} />
          <Label className="text-slate-300 block text-xs mt-2">Comparison Items</Label>
          {((c.items as { feature: string; oldWay: string; newWay: string }[]) ?? []).map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <Input value={item.feature} onChange={(e) => { const a = [...((c.items as { feature: string; oldWay: string; newWay: string }[]) ?? [])]; a[i] = { ...a[i], feature: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Feature name" />
              <Textarea value={item.oldWay} onChange={(e) => { const a = [...((c.items as { feature: string; oldWay: string; newWay: string }[]) ?? [])]; a[i] = { ...a[i], oldWay: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={1} placeholder="Old way..." />
              <Textarea value={item.newWay} onChange={(e) => { const a = [...((c.items as { feature: string; oldWay: string; newWay: string }[]) ?? [])]; a[i] = { ...a[i], newWay: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={1} placeholder="New way..." />
              <button onClick={() => { const a = [...((c.items as { feature: string; oldWay: string; newWay: string }[]) ?? [])]; a.splice(i, 1); update('items', a); }} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
          ))}
          <AddBtn onClick={() => update('items', [...((c.items as { feature: string; oldWay: string; newWay: string }[]) ?? []), { feature: '', oldWay: '', newWay: '' }])} label="comparison" />
        </>
      )}

      {block.type === 'proof' && (
        <>
          <Field label="Section Title" value={(c.title as string) ?? 'Results That Speak'} onChange={(v) => update('title', v)} />
          <Field label="Section Subtitle" value={(c.subtitle as string) ?? 'Real climbs. Real gameplay.'} onChange={(v) => update('subtitle', v)} />
          <Label className="text-slate-300 block text-xs mt-3">Proof Items</Label>
          {((c.items as { id: string; title: string; description: string; tags: string[]; size?: string; images?: string[] }[]) ?? []).map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <Input value={item.title} onChange={(e) => { const a = [...((c.items as any[]) ?? [])]; a[i] = { ...a[i], title: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Title (e.g. Diamond → Master)" />
              <Textarea value={item.description} onChange={(e) => { const a = [...((c.items as any[]) ?? [])]; a[i] = { ...a[i], description: e.target.value }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs resize-none" rows={2} placeholder="Description..." />
              <Input value={(item.tags ?? []).join(', ')} onChange={(e) => { const a = [...((c.items as any[]) ?? [])]; a[i] = { ...a[i], tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Tags (comma separated)" />
              <SelectField label="Size" value={item.size ?? 'small'} options={['small', 'medium', 'large']} onChange={(v) => { const a = [...((c.items as any[]) ?? [])]; a[i] = { ...a[i], size: v }; update('items', a); }} />
              
              <Label className="text-slate-400 block text-[10px] mt-1">Images (URLs)</Label>
              {(item.images ?? []).map((img: string, imgIdx: number) => (
                <div key={imgIdx} className="flex gap-1">
                  <Input value={img} onChange={(e) => { const a = [...((c.items as any[]) ?? [])]; const imgs = [...(a[i].images ?? [])]; imgs[imgIdx] = e.target.value; a[i] = { ...a[i], images: imgs }; update('items', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="https://..." />
                  <button onClick={() => { const a = [...((c.items as any[]) ?? [])]; const imgs = [...(a[i].images ?? [])]; imgs.splice(imgIdx, 1); a[i] = { ...a[i], images: imgs }; update('items', a); }} className="text-red-400 hover:text-red-300 px-1 text-xs">✕</button>
                </div>
              ))}
              <button onClick={() => { const a = [...((c.items as any[]) ?? [])]; const imgs = [...(a[i].images ?? []), '']; a[i] = { ...a[i], images: imgs }; update('items', a); }} className="text-purple-400 hover:text-purple-300 text-xs">+ Add image</button>

              <button onClick={() => { const a = [...((c.items as any[]) ?? [])]; a.splice(i, 1); update('items', a); }} className="text-red-400 hover:text-red-300 text-xs block mt-1">Remove item</button>
            </div>
          ))}
          <AddBtn onClick={() => update('items', [...((c.items as any[]) ?? []), { id: `proof-${Date.now()}`, title: 'New Result', description: 'Describe the climb...', tags: ['TFT'], size: 'small', images: [] }])} label="proof item" />
        </>
      )}

      {block.type === 'community' && (
        <>
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <Field label="Subtitle" value={(c.subtitle as string) ?? ''} onChange={(v) => update('subtitle', v)} />
          <Field label="Image URL" value={(c.image_src as string) ?? ''} onChange={(v) => update('image_src', v)} placeholder="https://..." />
          <Field label="CTA Text" value={(c.cta_text as string) ?? 'Join Discord'} onChange={(v) => update('cta_text', v)} />
          <Field label="CTA URL" value={(c.cta_url as string) ?? '#'} onChange={(v) => update('cta_url', v)} />
          <Label className="text-slate-300 block text-xs mt-2">Stats</Label>
          {((c.stats as { label: string; value: string }[]) ?? []).map((s, i) => (
            <div key={i} className="flex gap-1.5">
              <Input value={s.value} onChange={(e) => { const a = [...((c.stats as { label: string; value: string }[]) ?? [])]; a[i] = { ...a[i], value: e.target.value }; update('stats', a); }} className="bg-slate-800 border-slate-700 text-white text-xs w-20" placeholder="1K+" />
              <Input value={s.label} onChange={(e) => { const a = [...((c.stats as { label: string; value: string }[]) ?? [])]; a[i] = { ...a[i], label: e.target.value }; update('stats', a); }} className="bg-slate-800 border-slate-700 text-white text-xs flex-1" placeholder="Members" />
              <button onClick={() => { const a = [...((c.stats as { label: string; value: string }[]) ?? [])]; a.splice(i, 1); update('stats', a); }} className="text-red-400 hover:text-red-300 px-1 text-xs">✕</button>
            </div>
          ))}
          <AddBtn onClick={() => update('stats', [...((c.stats as { label: string; value: string }[]) ?? []), { label: 'Label', value: '0' }])} label="stat" />
        </>
      )}

      {block.type === 'external' && (
        <>
          <Field label="Title" value={(c.title as string) ?? ''} onChange={(v) => update('title', v)} />
          <Field label="Subtitle" value={(c.subtitle as string) ?? ''} onChange={(v) => update('subtitle', v)} />
          <Label className="text-slate-300 block text-xs mt-2">Platforms</Label>
          {((c.platforms as { name: string; url: string; icon_url: string }[]) ?? []).map((p, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 space-y-1.5 border border-slate-700/50">
              <Input value={p.name} onChange={(e) => { const a = [...((c.platforms as { name: string; url: string; icon_url: string }[]) ?? [])]; a[i] = { ...a[i], name: e.target.value }; update('platforms', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Platform name" />
              <Input value={p.url} onChange={(e) => { const a = [...((c.platforms as { name: string; url: string; icon_url: string }[]) ?? [])]; a[i] = { ...a[i], url: e.target.value }; update('platforms', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="URL" />
              <Input value={p.icon_url} onChange={(e) => { const a = [...((c.platforms as { name: string; url: string; icon_url: string }[]) ?? [])]; a[i] = { ...a[i], icon_url: e.target.value }; update('platforms', a); }} className="bg-slate-800 border-slate-700 text-white text-xs" placeholder="Icon URL (optional)" />
              <button onClick={() => { const a = [...((c.platforms as { name: string; url: string; icon_url: string }[]) ?? [])]; a.splice(i, 1); update('platforms', a); }} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
          ))}
          <AddBtn onClick={() => update('platforms', [...((c.platforms as { name: string; url: string; icon_url: string }[]) ?? []), { name: 'Platform', url: '#', icon_url: '' }])} label="platform" />
        </>
      )}
    </>
  );
}

// ================================================================
// Style Editor — per-block visual controls
// ================================================================
function StyleEditor({ style: s, updateStyle }: { style: BlockStyle; updateStyle: (key: keyof BlockStyle, value: string) => void }) {
  return (
    <>
      <SelectField label="Width" value={s.width} options={['full', 'wide', 'medium', 'narrow']} onChange={(v) => updateStyle('width', v)} />
      <SelectField label="Padding" value={s.padding} options={['none', 'sm', 'md', 'lg', 'xl']} onChange={(v) => updateStyle('padding', v)} />
      <SelectField label="Vertical Margin" value={s.marginY} options={['none', 'sm', 'md', 'lg']} onChange={(v) => updateStyle('marginY', v)} />
      <SelectField label="Background" value={s.background} options={['transparent', 'subtle', 'card', 'accent', 'custom']} onChange={(v) => updateStyle('background', v)} />
      {s.background === 'custom' && <Field label="Custom BG (hex or gradient)" value={s.bgCustom ?? ''} onChange={(v) => updateStyle('bgCustom', v)} placeholder="#1a1a2e" />}
      <SelectField label="Border Radius" value={s.borderRadius} options={['none', 'sm', 'md', 'lg', 'xl', 'full']} onChange={(v) => updateStyle('borderRadius', v)} />
      <SelectField label="Border" value={s.border} options={['none', 'subtle', 'normal', 'accent']} onChange={(v) => updateStyle('border', v)} />
      <SelectField label="Shadow" value={s.shadow} options={['none', 'sm', 'md', 'lg', 'glow']} onChange={(v) => updateStyle('shadow', v)} />
      <SelectField label="Text Align" value={s.textAlign} options={['left', 'center', 'right']} onChange={(v) => updateStyle('textAlign', v)} />
    </>
  );
}

// ================================================================
// Helpers
// ================================================================
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label className="text-slate-300 mb-1 block text-xs">{label}</Label>
      <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-slate-800 border-slate-700 text-white text-sm" />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-slate-300 mb-1 block text-xs">{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-2 py-1.5 text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="border-slate-700 text-slate-300 text-xs w-full">+ Add {label}</Button>
  );
}
