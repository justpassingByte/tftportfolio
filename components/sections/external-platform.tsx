'use client';

import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export default function ExternalPlatform() {
  return (
    <section className="py-16 px-4 bg-slate-950 border-t border-slate-800">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">Daily Tournaments</h2>
        </div>

        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          I also run TFT tournaments daily — from small games to larger events. 
          Great way to test your skills against competitive players.
        </p>

        <Button
          asChild
          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-200 border border-yellow-500/50 rounded-lg h-11 px-8"
        >
          <a href="https://testictour.com" target="_blank" rel="noopener noreferrer">
            Visit Testictour
          </a>
        </Button>
      </div>
    </section>
  );
}
