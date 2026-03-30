'use client';

import Image from 'next/image';

interface AboutWithAvatarProps {
  title: string;
  paragraphs: string[];
  avatarUrl: string;
  avatarAlt?: string;
  highlights?: { icon: string; label: string; value: string }[];
  secondaryImageUrl?: string;
  missionStatement?: string;
  missionAuthor?: string;
}

export default function AboutWithAvatar({
  title,
  paragraphs,
  avatarUrl,
  avatarAlt = 'Profile avatar',
  highlights,
  secondaryImageUrl,
  missionStatement,
  missionAuthor,
}: AboutWithAvatarProps) {
  return (
    <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-12 md:gap-16 items-start">
          {/* Avatar column */}
          <div className="flex flex-col items-center md:sticky md:top-24">
            {/* Avatar with glow ring */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-teal-400/30 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-600/10">
                <Image
                  src={avatarUrl}
                  alt={avatarAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 224px, 256px"
                />
              </div>
              {/* Corner accent */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-tl-3xl pointer-events-none" />
            </div>

            {/* Highlight stats under avatar */}
            {highlights && highlights.length > 0 && (
              <div className="mt-8 w-full space-y-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    <span className="text-xl">{h.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{h.label}</p>
                      <p className="text-white font-medium text-sm truncate group-hover:text-purple-300 transition-colors">
                        {h.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content column */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
              ✦ About Me
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              {title}
            </h2>

            <div className="space-y-5">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-slate-300 text-lg leading-relaxed"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Secondary Image if provided */}
            {secondaryImageUrl && (
              <div className="relative w-full h-64 md:h-80 lg:h-96 mt-10 rounded-2xl overflow-hidden border border-slate-700/50 group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50 z-10 pointer-events-none" />
                <Image
                  src={secondaryImageUrl}
                  alt="Community preview"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
              </div>
            )}

            {/* Decorative line */}
            <div className="mt-10 h-px bg-gradient-to-r from-purple-500/50 via-blue-500/30 to-transparent" />

            {/* Mission statement */}
            {(missionStatement || missionAuthor) && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-500/20">
                {missionStatement && (
                  <p className="text-purple-200 italic text-base leading-relaxed">
                    &ldquo;{missionStatement}&rdquo;
                  </p>
                )}
                {missionAuthor && (
                  <p className="text-slate-500 text-sm mt-3">— {missionAuthor}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
