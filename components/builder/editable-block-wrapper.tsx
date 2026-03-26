'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableBlockWrapperProps {
  children: React.ReactNode;
  blockId: string;
  blockLabel: string;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings: () => void;
}

export default function EditableBlockWrapper({
  children,
  blockLabel,
  isFirst,
  isLast,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
}: EditableBlockWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showControls = isHovered || isSelected;

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-purple-500/50 ring-offset-1 ring-offset-slate-950 rounded-lg',
        isHovered && !isSelected && 'ring-1 ring-purple-500/20 rounded-lg'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {/* Block label + toolbar — centered at top */}
      {showControls && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-1 shadow-xl">
          {/* Label */}
          <span className="text-purple-400 text-xs font-medium px-2 border-r border-slate-700 mr-1">{blockLabel}</span>

          {/* Actions */}
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 transition-colors" title="Move up">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 transition-colors" title="Move down">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onSettings(); }} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Settings">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Duplicate">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Block content */}
      <div className="relative">{children}</div>
    </div>
  );
}
