'use client';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function Community() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-950 to-slate-900/50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-6">
          <Users className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">Community</h2>
        </div>

        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          If you want to learn, discuss TFT, or just hang out, feel free to join. 
          Active community focused on high-level gameplay.
        </p>

        <Button
          asChild
          className="bg-slate-800/50 hover:bg-slate-700 text-white border border-slate-600 rounded-lg h-11 px-8"
        >
          <a href="#" target="_blank" rel="noopener noreferrer">
            Join Discord
          </a>
        </Button>
      </div>
    </section>
  );
}
