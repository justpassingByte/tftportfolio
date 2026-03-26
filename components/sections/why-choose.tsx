'use client';

import { Check } from 'lucide-react';

const reasons = [
  {
    title: 'Same Player Every Game',
    description: 'No variance. You get consistent playstyle and decision-making from start to finish.',
  },
  {
    title: 'Strong Macro & Economy',
    description: 'Core TFT skills that separate high-level from middling play. Proper resource management every lobby.',
  },
  {
    title: 'Flexible Comps',
    description: 'Not forced to one meta. I adapt to lobby and play whatever wins — fast 8, hyperroll, slow roll.',
  },
  {
    title: 'Stable LP Climb',
    description: 'Consistent progression without risky coinflips. You know what you&apos;re getting.',
  },
];

export default function WhyChooseMe() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Why Choose Me
        </h2>
        <p className="text-slate-400 text-center mb-16 text-lg">
          TFT-specific focus on what actually matters
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
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
