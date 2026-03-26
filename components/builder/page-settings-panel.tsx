'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Palette } from 'lucide-react';
import type { PageSettings } from '@/lib/block-types';

const GRADIENTS = [
  { name: 'Midnight Purple', value: 'from-slate-950 via-purple-950/20 to-slate-950' },
  { name: 'Deep Blue', value: 'from-slate-950 via-blue-950/20 to-slate-950' },
  { name: 'Dark Rose', value: 'from-slate-950 via-rose-950/20 to-slate-950' },
  { name: 'Emerald Night', value: 'from-slate-950 via-emerald-950/20 to-slate-950' },
  { name: 'Pure Dark', value: 'from-slate-950 to-slate-950' },
  { name: 'Neon Glow', value: 'from-slate-950 via-purple-900/30 to-blue-950' },
];

const SOLID_COLORS = [
  { name: 'Slate', value: '#020617' },
  { name: 'Zinc', value: '#09090b' },
  { name: 'Stone', value: '#0c0a09' },
  { name: 'Pure Black', value: '#000000' },
];

const ACCENT_COLORS = [
  '#6d28d9', '#2563eb', '#059669', '#e11d48', '#d97706', '#0891b2',
  '#7c3aed', '#4f46e5', '#06b6d4', '#ec4899', '#f59e0b', '#10b981',
];

interface PageSettingsPanelProps {
  settings: PageSettings;
  isOpen: boolean;
  onUpdate: (settings: PageSettings) => void;
  onClose: () => void;
}

export default function PageSettingsPanel({ settings, isOpen, onUpdate, onClose }: PageSettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-700 z-50 overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5" /> Page Settings
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Background */}
        <div>
          <Label className="text-slate-300 text-sm block mb-3">Background</Label>

          <div className="space-y-2 mb-3">
            <button
              onClick={() => onUpdate({ ...settings, background: { ...settings.background, type: 'gradient' } })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settings.background.type === 'gradient' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Gradient
            </button>
            <button
              onClick={() => onUpdate({ ...settings, background: { ...settings.background, type: 'solid' } })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settings.background.type === 'solid' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Solid Color
            </button>
            <button
              onClick={() => onUpdate({ ...settings, background: { ...settings.background, type: 'image' } })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settings.background.type === 'image' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              Image
            </button>
          </div>

          {settings.background.type === 'gradient' && (
            <div className="grid grid-cols-2 gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => onUpdate({ ...settings, background: { type: 'gradient', value: g.value } })}
                  className={`rounded-lg h-12 bg-gradient-to-br ${g.value} border-2 transition-all ${settings.background.value === g.value ? 'border-purple-500' : 'border-slate-700 hover:border-slate-600'}`}
                  title={g.name}
                />
              ))}
            </div>
          )}

          {settings.background.type === 'solid' && (
            <div className="flex flex-wrap gap-2">
              {SOLID_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onUpdate({ ...settings, background: { type: 'solid', value: c.value } })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${settings.background.value === c.value ? 'border-purple-500' : 'border-slate-700'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {settings.background.type === 'image' && (
            <Input
              value={settings.background.value}
              onChange={(e) => onUpdate({ ...settings, background: { type: 'image', value: e.target.value } })}
              placeholder="Background image URL"
              className="bg-slate-800 border-slate-700 text-white text-sm"
            />
          )}
        </div>

        {/* Accent Color */}
        <div>
          <Label className="text-slate-300 text-sm block mb-3">Accent Color</Label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onUpdate({ ...settings, accentColor: color })}
                className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Font */}
        <div>
          <Label className="text-slate-300 text-sm block mb-3">Font</Label>
          <div className="space-y-2">
            {[
              { id: 'inter' as const, name: 'Inter', sample: 'Aa' },
              { id: 'outfit' as const, name: 'Outfit', sample: 'Aa' },
              { id: 'space-grotesk' as const, name: 'Space Grotesk', sample: 'Aa' },
            ].map((font) => (
              <button
                key={font.id}
                onClick={() => onUpdate({ ...settings, font: font.id })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settings.font === font.id ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div>
          <Label className="text-slate-300 text-sm block mb-3">Spacing</Label>
          <div className="space-y-2">
            {(['compact', 'normal', 'spacious'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onUpdate({ ...settings, spacing: s })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${settings.spacing === s ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
