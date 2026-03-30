'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { BLOCK_PALETTE, type BlockType } from '@/lib/block-types';
import { cn } from '@/lib/utils';

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
  isAdmin?: boolean;
}

export default function AddBlockMenu({ onAdd, isAdmin = false }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group flex justify-center py-2">
      {/* Trigger line */}
      <div className="absolute inset-x-8 top-1/2 h-px bg-transparent group-hover:bg-purple-500/30 transition-colors" />

      {/* Add button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-lg',
          isOpen
            ? 'bg-purple-600 text-white'
            : 'bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-purple-600 hover:text-white border border-slate-700 hover:border-purple-500'
        )}
      >
        {isOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        {isOpen ? 'Close' : 'Add block'}
      </button>

      {/* Palette dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 z-50 w-80 max-h-96 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl grid grid-cols-2 gap-2">
          {BLOCK_PALETTE.filter(block => isAdmin || !block.isAdminOnly).map((block) => (
            <button
              key={block.type}
              onClick={() => {
                onAdd(block.type);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 hover:bg-purple-600/10 transition-all text-left"
            >
              <span className="text-xl flex-shrink-0">{block.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{block.label}</p>
                <p className="text-xs text-slate-400 truncate">{block.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
