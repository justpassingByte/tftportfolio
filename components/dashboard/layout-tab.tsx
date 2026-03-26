'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean dark theme with purple accents. Conversion-focused layout.',
    preview: 'bg-gradient-to-br from-purple-900/40 to-slate-900',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold gradients with a futuristic gamer aesthetic.',
    preview: 'bg-gradient-to-br from-blue-900/40 to-slate-900',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Stripped-down, content-first design. Maximum readability.',
    preview: 'bg-gradient-to-br from-slate-800/40 to-slate-900',
  },
];

const ACCENT_COLORS = [
  { name: 'Purple', value: '#6d28d9' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Cyan', value: '#0891b2' },
];

export default function LayoutTab() {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [accentColor, setAccentColor] = useState('#6d28d9');
  const [spacing, setSpacing] = useState('normal');

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Layout & Theme</h2>

      {/* ── Template Selector ───────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={cn(
                'relative rounded-xl border-2 p-4 text-left transition-all duration-200',
                selectedTemplate === template.id
                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                  : 'border-slate-700 hover:border-slate-600'
              )}
            >
              {/* Preview swatch */}
              <div
                className={cn(
                  'h-24 rounded-lg mb-3',
                  template.preview
                )}
              />
              <h4 className="text-white font-semibold mb-1">{template.name}</h4>
              <p className="text-sm text-slate-400">{template.description}</p>
              {selectedTemplate === template.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Accent Color ────────────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className={cn(
                'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                accentColor === color.value
                  ? 'border-white scale-110'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {accentColor === color.value && (
                <Check className="w-5 h-5 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Spacing ─────────────────────────────────── */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Spacing</h3>
        <Select value={spacing} onValueChange={setSpacing}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="compact" className="text-white">
              Compact
            </SelectItem>
            <SelectItem value="normal" className="text-white">
              Normal
            </SelectItem>
            <SelectItem value="spacious" className="text-white">
              Spacious
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
