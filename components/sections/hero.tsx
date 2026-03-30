'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import type { HeroContent } from '@/lib/types';
import { defaultHeroContent } from '@/lib/default-content';

interface HeroProps {
  content?: HeroContent;
  isBoosterProfile?: boolean;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export default function Hero({ content, isBoosterProfile = false, onPrimaryClick, onSecondaryClick }: HeroProps) {
  const { t } = useI18n();
  const c = content ?? defaultHeroContent;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20 relative overflow-hidden bg-slate-950">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-slate-950 to-blue-900/10 pointer-events-none" />
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Content */}
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start pl-0 lg:pl-4">
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 text-xs font-medium text-purple-300">
            {c.trust_badges?.map((badge, idx) => (
              <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/20 backdrop-blur-sm shadow-sm group cursor-default">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)] filter transition-all group-hover:scale-125" />
                {badge}
              </span>
            ))}
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight tracking-tight">
            {c.headline || t.hero.headline}<br />
            {(c.headline_highlight || t.hero.headline_highlight) && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400">
                {c.headline_highlight || t.hero.headline_highlight}
              </span>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
            {c.subheadline || t.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              onClick={onPrimaryClick}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-base h-14 px-8 shadow-lg shadow-purple-600/20 w-full sm:w-auto font-semibold transition-all hover:scale-[1.02]"
            >
              {c.cta_tertiary || t.hero.cta_tertiary}
            </Button>
            <Button
              onClick={onSecondaryClick}
              variant="outline"
              size="lg"
              className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-base h-14 px-8 border-slate-700 w-full sm:w-auto font-medium transition-all"
            >
              {c.cta_primary || t.hero.cta_primary}
            </Button>
          </div>
        </div>

        {/* Right Content / Big Image Intro */}
        <div className="relative w-full hidden lg:flex justify-center items-center">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl shadow-purple-900/20 bg-slate-900">
            {/* Glossy overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-400/10 pointer-events-none" />
            
            <img 
              src={(c as any).bg_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
              alt="Community Welcome"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          
          {/* Decorative accents */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-3xl opacity-20 blur-xl" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl" />
        </div>
        
      </div>
    </section>
  );
}
