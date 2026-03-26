'use client';

import { Check } from 'lucide-react';
import { defaultWhyChooseContent } from '@/lib/default-content';
import type { WhyChooseContent } from '@/lib/types';

interface WhyChooseMeProps {
  content?: WhyChooseContent;
}

export default function WhyChooseMe({ content }: WhyChooseMeProps) {
  const c = content ?? defaultWhyChooseContent;

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          {c.title}
        </h2>
        <p className="text-slate-400 text-center mb-16 text-lg">
          {c.subtitle}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {c.reasons.map((reason, index) => (
            <div
              key={index}
              className="group rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 p-6 transition-all duration-300 hover:bg-slate-800/50"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/30 group-hover:bg-blue-600/30 transition-colors">
                    <Check className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
