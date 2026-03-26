'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Upload } from 'lucide-react';
import type { ProofItem } from '@/lib/types';
import { defaultProofItems } from '@/lib/default-content';

export default function ProofTab() {
  const [items, setItems] = useState<ProofItem[]>(defaultProofItems);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const addItem = () => {
    if (!newTitle.trim()) return;
    const newItem: ProofItem = {
      id: `proof-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      tags: [],
      size: 'medium',
    };
    setItems([...items, newItem]);
    setNewTitle('');
    setNewDescription('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Proof Gallery</h2>
        <span className="text-sm text-slate-400">{items.length} items</span>
      </div>

      {/* Upload area */}
      <div className="bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-600 p-8 text-center">
        <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <p className="text-slate-400 mb-1">Upload proof screenshots</p>
        <p className="text-xs text-slate-500 mb-4">PNG, JPG up to 5MB</p>
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
          Choose Files
        </Button>
      </div>

      {/* Add text proof */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Proof Item
        </h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Title</Label>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Diamond 2 → Master"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Description</Label>
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="e.g., Consistent climb in 2 days"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <Button onClick={addItem} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Existing items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-slate-800/50 rounded-lg border border-slate-700 p-4"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{item.title}</h4>
              <p className="text-sm text-slate-400 truncate">{item.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-slate-400 hover:text-red-400 ml-3 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
