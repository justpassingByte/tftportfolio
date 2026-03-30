'use client';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { defaultCommunityContent } from '@/lib/default-content';
import type { CommunityContent } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface CommunityProps {
  content?: CommunityContent;
}

export default function Community({ content }: CommunityProps) {
  const c = content ?? defaultCommunityContent;
  const { t } = useI18n();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-950 to-slate-900/50">
      <div className="max-w-2xl mx-auto text-center">
        {c.image_src ? (
          <div className="mb-8 flex justify-center">
            <img src={c.image_src} alt="Community" className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover shadow-xl border border-slate-800/50" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <Users className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">{c.title || t.community.title}</h2>
          </div>
        )}

        {c.image_src && (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{c.title || t.community.title}</h2>
        )}

        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          {c.description || t.community.description}
        </p>

        {c.stats && c.stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {c.stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-xl px-6 py-4 min-w-[120px]">
                <div className="text-2xl font-bold text-purple-400 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-0 shadow-lg shadow-[#5865F2]/20 rounded-lg h-12 px-8 font-medium transition-all"
          >
            <a href={(c.cta_url as string) || c.link_url} target="_blank" rel="noopener noreferrer">
              {c.cta_text || t.community.cta}
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto bg-slate-900 border-purple-500/30 text-purple-100 hover:bg-purple-900/20 hover:text-white rounded-lg h-12 px-8 font-medium transition-all"
          >
            <a href={c.testictour_url || 'https://testictour.com'} target="_blank" rel="noopener noreferrer">
              {c.testictour_text || 'Join Testictour Platform'}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
