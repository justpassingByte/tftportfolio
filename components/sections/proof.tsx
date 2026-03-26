'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ProofItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  size: 'small' | 'medium' | 'large';
}

const proofItems: ProofItem[] = [
  {
    id: 1,
    title: 'Diamond 2 → Master',
    description: 'Consistent climb in 2 days with stable LP gains',
    tags: ['Fast 8 meta'],
    size: 'large',
  },
  {
    id: 2,
    title: '+180 LP Winstreak',
    description: 'No losing streaks, pure adaptation',
    tags: ['Flex playstyle'],
    size: 'medium',
  },
  {
    id: 3,
    title: 'Top 0.5% Lobby',
    description: 'Consistent high-level gameplay',
    tags: ['Adaptation focus'],
    size: 'medium',
  },
  {
    id: 4,
    title: 'Platinum 1 → Master',
    description: 'Clean 3-day run with zero account risks',
    tags: ['Economy management'],
    size: 'large',
  },
  {
    id: 5,
    title: 'Diamond 4 → Diamond 1',
    description: 'Fast progression through Diamond',
    tags: ['Flex playstyle'],
    size: 'small',
  },
  {
    id: 6,
    title: 'Master Tier Lock',
    description: 'Maintained rank with consistent performance',
    tags: ['Stability'],
    size: 'medium',
  },
];

export default function ProofSection() {
  const [selectedItem, setSelectedItem] = useState<ProofItem | null>(null);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900/50 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Results That Speak
        </h2>
        <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
          Real climbs. Real gameplay. Every game played solo.
        </p>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
          {proofItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`
                cursor-pointer group relative rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                border border-slate-700/50 hover:border-purple-500/50 p-6 md:p-8
                transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/10
                ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.size === 'medium' ? 'md:row-span-2' : ''}
              `}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/0 via-transparent to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 mb-4 text-base md:text-lg">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-300 text-lg">{selectedItem?.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedItem?.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-purple-600/30 text-purple-200 border border-purple-500/50"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-slate-400 text-sm pt-4 border-t border-slate-700">
              ✓ Verified gameplay • No account risks • Clean progression
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
