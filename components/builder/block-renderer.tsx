'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import type { Block } from '@/lib/block-types';
import { WIDTH_MAP, PADDING_MAP, MARGIN_Y_MAP, RADIUS_MAP, SHADOW_MAP, DEFAULT_BLOCK_STYLE } from '@/lib/block-types';
import { defaultReviews } from '@/lib/default-content';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import AboutWithAvatar from '@/components/sections/about-with-avatar';
import Comparison from '@/components/sections/comparison';
import ProofSection from '@/components/sections/proof';
import Community from '@/components/sections/community';
import ExternalPlatform from '@/components/sections/external-platform';

interface BlockRendererProps {
  block: Block;
  accentColor?: string;
}

function getBlockWrapperClasses(block: Block, accentColor: string): { outer: string; inner: string; style?: React.CSSProperties } {
  const s = block.style || DEFAULT_BLOCK_STYLE;
  const classes: string[] = [
    WIDTH_MAP[s.width],
    PADDING_MAP[s.padding],
    MARGIN_Y_MAP[s.marginY],
    RADIUS_MAP[s.borderRadius],
    SHADOW_MAP[s.shadow],
    `text-${s.textAlign}`,
    'mx-auto',
  ];

  // Background
  let bgStyle: React.CSSProperties = {};
  switch (s.background) {
    case 'subtle':
      classes.push('bg-slate-800/30');
      break;
    case 'card':
      classes.push('bg-slate-800/50');
      break;
    case 'accent':
      bgStyle = { backgroundColor: `${accentColor}20` };
      break;
    case 'custom':
      if (s.bgCustom?.startsWith('#')) {
        bgStyle = { backgroundColor: s.bgCustom };
      } else {
        classes.push(`bg-gradient-to-br ${s.bgCustom ?? ''}`);
      }
      break;
  }

  // Border
  switch (s.border) {
    case 'subtle':
      classes.push('border border-slate-700/50');
      break;
    case 'normal':
      classes.push('border border-slate-600');
      break;
    case 'accent':
      classes.push('border');
      bgStyle.borderColor = `${accentColor}50`;
      break;
  }

  return { outer: 'w-full', inner: classes.filter(Boolean).join(' '), style: bgStyle };
}

export default function BlockRenderer({ block, accentColor = '#6d28d9' }: BlockRendererProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = block.content as Record<string, any>;
  const wrapper = getBlockWrapperClasses(block, accentColor);

  const inner = (children: React.ReactNode) => (
    <div className={wrapper.outer}>
      <div className={wrapper.inner} style={wrapper.style}>
        {children}
      </div>
    </div>
  );

  switch (block.type) {
    case 'hero':
      return (
        <section
          className="flex items-center justify-center relative overflow-hidden"
          style={c.bg_image ? { backgroundImage: `url(${c.bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
          <div className={cn(WIDTH_MAP[(block.style || DEFAULT_BLOCK_STYLE).width], PADDING_MAP[(block.style || DEFAULT_BLOCK_STYLE).padding], 'mx-auto relative z-10 text-center')}>
            <div className="mb-8 flex justify-center">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 overflow-hidden bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center" style={{ borderColor: `${accentColor}50` }}>
                {c.avatar_url ? (
                  <img src={c.avatar_url as string} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-5xl md:text-6xl">{(c.avatar_initial as string) ?? 'V'}</div>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white leading-tight">
              {(c.headline as string) ?? 'Your Headline'}
              {c.headline_highlight && (
                <><br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400">{c.headline_highlight as string}</span></>
              )}
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-4 max-w-2xl mx-auto">{(c.subheadline as string) ?? ''}</p>
            {(c.trust_badges as string[])?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm text-slate-400">
                {(c.trust_badges as string[]).map((badge: string, i: number) => (
                  <span key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />{badge}</span>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="text-white rounded-lg h-11 px-6 shadow-lg" style={{ backgroundColor: accentColor }}>
                {(c.cta_primary as string) ?? 'Get Started'}
              </Button>
              <Button variant="outline" size="lg" className="bg-slate-800/50 hover:bg-slate-700 text-white rounded-lg h-11 px-6 border-slate-600">
                <MessageCircle className="w-4 h-4 mr-2" />{(c.cta_secondary as string) ?? 'Message me'}
              </Button>
            </div>
          </div>
        </section>
      );

    case 'text':
    case 'personal':
      return inner(
        <>
          <div className="border-l-4 pl-6 py-4" style={{ borderColor: '#facc15' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{(c.title as string) ?? 'Title'}</h2>
            <div className="space-y-4 text-slate-300 text-base leading-relaxed">
              {((c.paragraphs as string[]) ?? []).map((p: string, i: number) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </>
      );

    case 'image':
      return inner(
        (c.src as string) ? (
          <div>
            <img src={c.src as string} alt={(c.caption as string) ?? ''} className={cn('w-full object-cover', RADIUS_MAP[block.style.borderRadius])} />
            {(c.caption as string) && <p className="text-center text-sm text-slate-400 mt-2">{c.caption as string}</p>}
          </div>
        ) : (
          <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl h-40 flex items-center justify-center">
            <p className="text-slate-500">Click settings to add an image URL</p>
          </div>
        )
      );

    case 'gallery':
      return inner(
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${(c.columns as number) ?? 3}, 1fr)` }}>
          {((c.images as string[]) ?? []).length > 0 ? (
            (c.images as string[]).map((img: string, i: number) => (
              <img key={i} src={img} alt="" className="rounded-lg w-full aspect-video object-cover" />
            ))
          ) : (
            Array.from({ length: (c.columns as number) ?? 3 }).map((_, i) => (
              <div key={i} className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-slate-500 text-xs">Image</p>
              </div>
            ))
          )}
        </div>
      );

    case 'card':
      return inner(
        <div className="text-center">
          <div className="text-3xl mb-3">{(c.icon as string) ?? '⚡'}</div>
          <h3 className="text-lg font-bold text-white mb-1.5">{(c.title as string) ?? 'Card Title'}</h3>
          <p className="text-slate-400 text-sm">{(c.body as string) ?? 'Card content'}</p>
        </div>
      );

    case 'cards_row':
      return inner(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {((c.cards as { icon: string; title: string; body: string }[]) ?? []).map((card, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center hover:border-slate-600 transition-colors">
              <div className="text-2xl mb-3">{card.icon}</div>
              <h4 className="text-white font-semibold mb-1">{card.title}</h4>
              <p className="text-slate-400 text-sm">{card.body}</p>
            </div>
          ))}
        </div>
      );

    case 'stats':
      return inner(
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {((c.items as { value: string; label: string }[]) ?? []).map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ color: accentColor }}>{item.value}</div>
              <div className="text-sm text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      );

    case 'banner':
      return inner(
        <div className="flex flex-wrap items-center justify-center gap-4">
          <p className="text-white font-medium">{(c.text as string) ?? 'Banner text'}</p>
          {(c.link_text as string) && (
            <a href={(c.link_url as string) ?? '#'} className="text-sm font-semibold underline underline-offset-2" style={{ color: accentColor }}>
              {c.link_text as string}
            </a>
          )}
        </div>
      );

    case 'why_me':
      return inner(
        <>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">{(c.title as string) ?? 'Why Choose Me'}</h2>
          <p className="text-slate-400 text-center mb-10 text-base">{(c.subtitle as string) ?? ''}</p>
          <div className="grid md:grid-cols-2 gap-5">
            {((c.reasons as { title: string; description: string }[]) ?? []).map((reason, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-slate-800/30 border border-slate-700/50 p-5">
                <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/30">
                  <Check className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{reason.title}</h3>
                  <p className="text-slate-400 text-sm">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case 'reviews': {
      const blockReviews = (c.reviews as { id: string; username: string; content: string; rank_before: string; rank_after: string; rating: number }[]);
      const reviews = blockReviews && blockReviews.length > 0 ? blockReviews : defaultReviews;
      const title = (c.title as string) ?? 'What Players Say';
      const subtitle = (c.subtitle as string) ?? 'Real feedback from real climbs';
      return inner(
        <>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">{title}</h2>
          <p className="text-slate-400 text-center mb-10">{subtitle}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((review, idx) => (
              <div key={review.id ?? idx} className="rounded-lg bg-slate-800/40 border border-slate-700/50 p-5">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white font-medium text-sm mb-3">
                  {review.rank_before} <span className="text-slate-500">→</span> <span style={{ color: accentColor }}>{review.rank_after}</span>
                </p>
                <p className="text-slate-300 text-sm mb-3">&quot;{review.content}&quot;</p>
                <p className="text-xs text-slate-500">— {review.username}</p>
              </div>
            ))}
          </div>
        </>
      );
    }

    case 'lead_form':
      return inner(
        <>
          <h3 className="text-xl font-bold text-white mb-1.5">Interested?</h3>
          <p className="text-slate-400 text-sm mb-5">Fill out the form and I&apos;ll get back to you</p>
          <div className="space-y-2.5 mb-4">
            <div className="h-9 bg-slate-900/50 border border-slate-700 rounded-lg" />
            <div className="h-9 bg-slate-900/50 border border-slate-700 rounded-lg" />
            <div className="h-20 bg-slate-900/50 border border-slate-700 rounded-lg" />
          </div>
          <Button className="w-full text-white h-10 text-sm" style={{ backgroundColor: accentColor }}>
            {(c.button_text as string) ?? 'Send message'}
          </Button>
        </>
      );

    case 'links':
      return inner(
        <div className="flex flex-wrap justify-center gap-3">
          {((c.items as { label: string; url: string; icon: string }[]) ?? []).map((item, i) => (
            <a key={i} href={item.url} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 text-white text-sm transition-all">
              <span>{item.icon}</span><span>{item.label}</span>
            </a>
          ))}
        </div>
      );

    case 'faq': {
      return inner(<FaqBlock title={(c.title as string) ?? 'FAQ'} items={(c.items as { question: string; answer: string }[]) ?? []} />);
    }

    case 'divider':
      return (
        <div className={cn(WIDTH_MAP[block.style.width], MARGIN_Y_MAP[block.style.marginY], 'mx-auto px-4')}>
          {(c.style as string) === 'gradient' && <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />}
          {(c.style as string) === 'line' && <div className="h-px bg-slate-700" />}
          {(c.style as string) === 'dots' && (
            <div className="flex justify-center gap-2">{[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-600" />)}</div>
          )}
        </div>
      );

    case 'spacer':
      return <div className={cn((c.height as string) === 'sm' && 'h-4', (c.height as string) === 'md' && 'h-8', (c.height as string) === 'lg' && 'h-16', (c.height as string) === 'xl' && 'h-24', !(c.height as string) && 'h-8')} />;

    case 'about_avatar':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(
        <AboutWithAvatar {...(c as any)} />
      );

    case 'comparison':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(
        <Comparison content={c as any} />
      );

    case 'proof':
      return inner(<ProofSection />); // Assuming ProofSection handles its own DB fetches or internal props

    case 'community':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(<Community content={c as any} />);

    case 'external':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(<ExternalPlatform content={c as any} />);

    default:
      return inner(<p className="text-slate-500 text-center">Unknown block: {block.type}</p>);
  }
}

// FAQ with accordion
function FaqBlock({ title, items }: { title: string; items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">{title}</h2>
      <div className="space-y-2 max-w-2xl mx-auto">
        {items.map((item, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-5 py-3.5 text-left text-white font-medium text-sm hover:bg-slate-800/60 transition-colors">
              {item.question}
              {openIndex === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openIndex === i && <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">{item.answer}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
