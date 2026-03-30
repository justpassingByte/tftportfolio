'use client';

import { X, Check } from 'lucide-react';

export interface ComparisonItem {
  feature: string;
  oldWay: string;
  newWay: string;
}

export interface ComparisonContent {
  title: string;
  subtitle: string;
  old_label?: string;
  old_sublabel?: string;
  new_label?: string;
  new_sublabel?: string;
  items: ComparisonItem[];
}

interface ComparisonProps {
  content?: ComparisonContent;
}

export default function Comparison({ content }: ComparisonProps) {
  if (!content) return null;

  return (
    <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {content.title}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          
          {/* Cũ (Old way) Panel */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 p-8 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] group-hover:bg-red-500/10 transition-colors" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <X className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-300">{content.old_label || 'Web Boosting Truyền Thống'}</h3>
                <p className="text-slate-500 text-sm">{content.old_sublabel || 'Mô hình lạc hậu từ 2012'}</p>
              </div>
            </div>

            <div className="space-y-6">
              {content.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <X className="w-5 h-5 text-red-500/70" />
                  </div>
                  <div>
                    <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{item.feature}</h4>
                    <p className="text-slate-300">{item.oldWay}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mới (Tacticianclimb) Panel */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 p-8 shadow-2xl shadow-purple-900/20 overflow-hidden group transform lg:-translate-y-4">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[50px] group-hover:bg-purple-500/30 transition-colors" />
            
            <div className="relative flex items-center gap-3 mb-8 z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border border-purple-400/30 shadow-lg shadow-purple-500/30">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{content.new_label || 'Tacticianclimb'}</h3>
                <p className="text-purple-300 text-sm font-medium">{content.new_sublabel || 'Hệ sinh thái cộng đồng mới'}</p>
              </div>
            </div>

            <div className="relative space-y-6 z-10">
              {content.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                      <Check className="w-3 h-3 text-purple-300" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-purple-400/80 text-sm font-semibold uppercase tracking-wider mb-1">{item.feature}</h4>
                    <p className="text-white font-medium">{item.newWay}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 border-2 border-purple-500/20 rounded-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
