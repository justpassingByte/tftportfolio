'use client';

import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { defaultExternalContent } from '@/lib/default-content';
import type { ExternalContent } from '@/lib/types';

interface ExternalPlatformProps {
  content?: ExternalContent;
}

export default function ExternalPlatform({ content }: ExternalPlatformProps) {
  const c = content ?? defaultExternalContent;

  return (
    <section className="py-16 px-4 bg-slate-950 border-t border-slate-800">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">{c.title}</h2>
        </div>

        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          {c.description}
        </p>

        <Button
          asChild
          className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-200 border border-yellow-500/50 rounded-lg h-11 px-8"
        >
          <a href={c.link_url} target="_blank" rel="noopener noreferrer">
            {c.link_text}
          </a>
        </Button>
      </div>
    </section>
  );
}
