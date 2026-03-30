'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, Save, Eye } from 'lucide-react';
import type {
  HeroContent,
  PersonalContent,
  WhyChooseContent,
  CommunityContent,
  ExternalContent,
  SectionType,
} from '@/lib/types';
import {
  defaultHeroContent,
  defaultPersonalContent,
  defaultWhyChooseContent,
  defaultCommunityContent,
  defaultExternalContent,
  defaultSectionOrder,
} from '@/lib/default-content';

// Section labels for display
const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero / Banner',
  proof: 'Trust Bar',
  personal: 'About / Intro',
  why_me: 'Why Choose Me',
  reviews: 'Reviews',
  lead_form: 'Lead Form',
  community: 'Community',
  external: 'External Links',
  gallery: 'Gallery',
  about_avatar: 'Avatar Intro',
  comparison: 'Comparison'
};

export default function EditPageTab() {
  // Hero content state
  const [hero, setHero] = useState<HeroContent>(defaultHeroContent);

  // Personal content state
  const [personal, setPersonal] = useState<PersonalContent>(defaultPersonalContent);

  // Why Choose Me state
  const [whyChoose, setWhyChoose] = useState<WhyChooseContent>(defaultWhyChooseContent);

  // Community state
  const [community, setCommunity] = useState<CommunityContent>(defaultCommunityContent);

  // External state
  const [external, setExternal] = useState<ExternalContent>(defaultExternalContent);

  // Section toggles & order
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>(defaultSectionOrder);
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(
    Object.fromEntries(defaultSectionOrder.map((s) => [s, true]))
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Persist to Supabase when configured
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSection = (type: string) => {
    setEnabledSections((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setSectionOrder(newOrder);
  };

  return (
    <div className="space-y-8">
      {/* Save button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Edit Page</h2>
        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* ── Section Manager ─────────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sections</h3>
        <p className="text-sm text-slate-400 mb-4">Toggle and reorder page sections</p>
        <div className="space-y-2">
          {sectionOrder.map((type, index) => (
            <div
              key={type}
              className="flex items-center gap-3 bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-700/50"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="text-slate-500 hover:text-white disabled:opacity-20 text-xs leading-none"
                >
                  ▲
                </button>
                <GripVertical className="w-4 h-4 text-slate-600" />
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sectionOrder.length - 1}
                  className="text-slate-500 hover:text-white disabled:opacity-20 text-xs leading-none"
                >
                  ▼
                </button>
              </div>
              <span className="flex-1 text-sm font-medium text-slate-200">
                {SECTION_LABELS[type] ?? type}
              </span>
              <Switch
                checked={enabledSections[type] ?? true}
                onCheckedChange={() => toggleSection(type)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero Section Editor ─────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">🎯 Hero Section</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Headline</Label>
          <Input
            value={hero.headline}
            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Headline Highlight</Label>
          <Input
            value={hero.headline_highlight ?? ''}
            onChange={(e) => setHero({ ...hero, headline_highlight: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
            placeholder="Gradient highlighted text"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Subheadline</Label>
          <Input
            value={hero.subheadline}
            onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">CTA Primary</Label>
          <Input
            value={hero.cta_primary ?? ''}
            onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">CTA Secondary</Label>
          <Input
            value={hero.cta_secondary ?? ''}
            onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* ── Personal Section Editor ─────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">📝 Personal Section</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Title</Label>
          <Input
            value={personal.title}
            onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        {personal.paragraphs.map((p, i) => (
          <div key={i}>
            <Label className="text-slate-300 mb-1.5 block">Paragraph {i + 1}</Label>
            <Textarea
              value={p}
              onChange={(e) => {
                const newParagraphs = [...personal.paragraphs];
                newParagraphs[i] = e.target.value;
                setPersonal({ ...personal, paragraphs: newParagraphs });
              }}
              className="bg-slate-900 border-slate-700 text-white resize-none"
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* ── Why Choose Me Editor ────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">✅ Why Choose Me</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Section Title</Label>
          <Input
            value={whyChoose.title}
            onChange={(e) => setWhyChoose({ ...whyChoose, title: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Subtitle</Label>
          <Input
            value={whyChoose.subtitle}
            onChange={(e) => setWhyChoose({ ...whyChoose, subtitle: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        {whyChoose.reasons.map((reason, i) => (
          <div key={i} className="bg-slate-900/50 rounded-lg p-4 space-y-2 border border-slate-700/50">
            <Input
              value={reason.title}
              onChange={(e) => {
                const newReasons = [...whyChoose.reasons];
                newReasons[i] = { ...newReasons[i], title: e.target.value };
                setWhyChoose({ ...whyChoose, reasons: newReasons });
              }}
              className="bg-slate-900 border-slate-700 text-white"
              placeholder="Reason title"
            />
            <Textarea
              value={reason.description}
              onChange={(e) => {
                const newReasons = [...whyChoose.reasons];
                newReasons[i] = { ...newReasons[i], description: e.target.value };
                setWhyChoose({ ...whyChoose, reasons: newReasons });
              }}
              className="bg-slate-900 border-slate-700 text-white resize-none"
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* ── Community Editor ────────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">👥 Community</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Title</Label>
          <Input
            value={community.title}
            onChange={(e) => setCommunity({ ...community, title: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Description</Label>
          <Textarea
            value={community.description}
            onChange={(e) => setCommunity({ ...community, description: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white resize-none"
            rows={3}
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Button Text</Label>
          <Input
            value={community.link_text}
            onChange={(e) => setCommunity({ ...community, link_text: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Link URL</Label>
          <Input
            value={community.link_url}
            onChange={(e) => setCommunity({ ...community, link_url: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* ── External Platform Editor ────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">🏆 External Platform</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Title</Label>
          <Input
            value={external.title}
            onChange={(e) => setExternal({ ...external, title: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Description</Label>
          <Textarea
            value={external.description}
            onChange={(e) => setExternal({ ...external, description: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white resize-none"
            rows={3}
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Button Text</Label>
          <Input
            value={external.link_text}
            onChange={(e) => setExternal({ ...external, link_text: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Link URL</Label>
          <Input
            value={external.link_url}
            onChange={(e) => setExternal({ ...external, link_url: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>
    </div>
  );
}
