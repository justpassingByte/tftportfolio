'use client';

import { defaultPersonalContent } from '@/lib/default-content';
import type { PersonalContent } from '@/lib/types';

interface PersonalSectionProps {
  content?: PersonalContent;
}

export default function PersonalSection({ content }: PersonalSectionProps) {
  const c = content ?? defaultPersonalContent;

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <div className="border-l-4 border-yellow-400 pl-8 py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {c.title}
          </h2>

          <div className="space-y-5 text-slate-300 text-lg leading-relaxed">
            {c.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
