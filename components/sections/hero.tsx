'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { defaultHeroContent } from '@/lib/default-content';
import type { HeroContent } from '@/lib/types';

interface HeroProps {
  content?: HeroContent;
  isBoosterProfile?: boolean;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  onTertiaryClick: () => void;
}

export default function Hero({ content, isBoosterProfile = false, onPrimaryClick, onSecondaryClick, onTertiaryClick }: HeroProps) {
  const c = content ?? defaultHeroContent;

  // For booster profiles: primary = "Uỷ thác" (opens lead form), secondary = "Join Testictour" (external link)
  // For admin homepage: all 3 buttons as defined in content

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none" />
      
      {/* Glow effect behind avatar */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Avatar */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-purple-500/30 overflow-hidden bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
              {c.avatar_url ? (
                <img src={c.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-6xl md:text-7xl">{c.avatar_initial ?? 'V'}</div>
              )}
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 blur-sm" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
          {c.headline}<br />
          {c.headline_highlight && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400">
              {c.headline_highlight}
            </span>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
          {c.subheadline}
        </p>

        {/* Trust line */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base text-slate-400">
          {c.trust_badges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              {badge}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isBoosterProfile ? (
            <>
              {/* Booster profile: 2 buttons only */}
              <Button
                onClick={onPrimaryClick}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-base h-12 px-8 border border-purple-500/50 shadow-lg shadow-purple-600/20"
              >
                Uỷ thác Rank cho tôi
              </Button>
              <Button
                onClick={onSecondaryClick}
                variant="outline"
                size="lg"
                className="bg-slate-800/50 hover:bg-slate-700 text-purple-300 rounded-lg text-base h-12 px-8 border-slate-700"
              >
                Join Testictour
              </Button>
            </>
          ) : (
            <>
              {/* Admin homepage: all 3 buttons */}
              {c.cta_primary && (
                <Button
                  onClick={onPrimaryClick}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-base h-12 px-8 border border-purple-500/50 shadow-lg shadow-purple-600/20"
                >
                  {c.cta_primary}
                </Button>
              )}
              {c.cta_tertiary && (
                <Button
                  onClick={onTertiaryClick}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base h-12 px-8 border border-blue-500/50"
                >
                  {c.cta_tertiary}
                </Button>
              )}
              {c.cta_secondary && (
                <Button
                  onClick={onSecondaryClick}
                  variant="outline"
                  size="lg"
                  className="bg-slate-800/50 hover:bg-slate-700 text-purple-300 rounded-lg text-base h-12 px-8 border-slate-700"
                >
                  {c.cta_secondary}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
