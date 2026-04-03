'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Check, Star, ChevronDown, ChevronUp, Play, Copy, ExternalLink, Heart } from 'lucide-react';
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
import Hero from '@/components/sections/hero';

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
        <Hero 
          content={c as any} 
          isBoosterProfile={true} 
          onPrimaryClick={() => console.log('Primary CTA clicked')} 
          onSecondaryClick={() => console.log('Secondary CTA clicked')} 
        />
      );

    case 'faq':
      return inner(<FAQBlock content={c} accentColor={accentColor} />);

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
      const title = (c.title as string) ?? 'What Players Say';
      const subtitle = (c.subtitle as string) ?? 'Real feedback from real climbs';
      return inner(
        <div className="py-12 border-2 border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center bg-slate-800/20 max-w-2xl mx-auto">
          <Star className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">{title}</h3>
          <p className="text-slate-400 text-sm mb-4">{subtitle}</p>
          <div className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-medium">
            Phần đánh giá sẽ tự động điền dữ liệu thật từ Database
          </div>
        </div>
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
      return inner(<ProofSection items={c.items as any[]} title={c.title as string} subtitle={c.subtitle as string} />);

    case 'community':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(<Community content={c as any} />);

    case 'external':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(<ExternalPlatform content={c as any} />);

    case 'donation':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(<DonationBlock c={c as any} />);

    case 'video':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return inner(<VideoBlock c={c as any} />);

    case 'pricing':
      return inner(
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">{(c.title as string) ?? 'Boosting Plans'}</h2>
          {(c.subtitle as string) && <p className="text-slate-400 mb-10 max-w-xl text-center mx-auto text-base">{c.subtitle}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {((c.plans as any[]) ?? []).map((p, i) => (
              <div key={i} className={cn("relative flex flex-col p-6 rounded-3xl border", p.is_popular ? "bg-slate-800/80 border-purple-500 shadow-xl shadow-purple-900/20 transform md:-translate-y-2 z-10" : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-colors")}>
                {p.is_popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full w-max tracking-wide uppercase shadow-lg shadow-purple-500/20">MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-slate-400 text-sm h-10">{p.description}</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                </div>
                <div className="flex-1 space-y-3 mb-8">
                  {p.features?.split(',').map((f: string, fi: number) => (
                    <div key={fi} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{f.trim()}</span>
                    </div>
                  ))}
                </div>
                <a href={p.button_url ?? '#'} className={cn("w-full py-3 rounded-xl text-center font-semibold text-sm transition-all", p.is_popular ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30" : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600")}>
                  {p.button_text || 'Choose Plan'}
                </a>
              </div>
            ))}
          </div>
        </div>
      );

    case 'timeline':
      return inner(
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{(c.title as string) ?? 'My Journey'}</h2>
          {(c.subtitle as string) && <p className="text-slate-400 mb-10 text-sm">{c.subtitle}</p>}
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-10">
            {((c.events as any[]) ?? []).map((e, i) => (
              <div key={i} className="relative pl-10 group">
                <div className="absolute w-8 h-8 bg-slate-950 border-2 border-slate-700 rounded-full -left-[17px] top-0 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                  <div className="w-2.5 h-2.5 bg-slate-500 group-hover:bg-purple-400 rounded-full transition-colors" />
                </div>
                <div className="text-purple-400 font-mono text-sm tracking-widest font-bold mb-1 opacity-80">{e.year}</div>
                <h3 className="text-xl font-bold text-white mb-2">{e.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

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

// Convert standard video URLs to embed URLs
function getEmbedUrl(url: string) {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/watch')) {
      const v = new URL(url).searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('youtube.com/shorts/')) {
      const v = url.split('youtube.com/shorts/')[1].split('?')[0];
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('youtu.be/')) {
      const v = url.split('youtu.be/')[1].split('?')[0];
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('twitch.tv/') && !url.includes('player.twitch.tv')) {
      const channel = url.split('twitch.tv/')[1].split('?')[0];
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      if (channel) return `https://player.twitch.tv/?channel=${channel}&parent=${host}`;
    }
  } catch (e) {
    // Ignore URL parse errors
  }
  return url;
}

// Video Block with optional custom thumbnail overlay
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VideoBlock({ c }: { c: Record<string, any> }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const rawUrl = c.video_url as string;
  const videoUrl = getEmbedUrl(rawUrl);
  const thumbnailUrl = c.thumbnail_url as string;

  // Render original iframe logic if no thumbnail is provided or it's currently playing
  const shouldRenderThumbnail = thumbnailUrl && !isPlaying;

  // Append autoplay=1 if we clicked the thumbnail to reveal the iframe
  let finalIframeUrl = videoUrl;
  if (isPlaying && thumbnailUrl && videoUrl) {
    const separator = videoUrl.includes('?') ? '&' : '?';
    if (!videoUrl.includes('autoplay=1')) {
      finalIframeUrl = `${videoUrl}${separator}autoplay=1`;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{c.title ?? 'Watch Me'}</h2>
      {c.subtitle && <p className="text-slate-400 mb-6 max-w-lg text-center mx-auto text-sm">{c.subtitle}</p>}
      
      <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-black relative">
        {shouldRenderThumbnail ? (
          <div 
            className="absolute inset-0 cursor-pointer group flex items-center justify-center bg-slate-900 z-10"
            onClick={() => setIsPlaying(true)}
          >
            <img 
              src={thumbnailUrl} 
              alt="Video Thumbnail" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
            />
            <div className="relative z-20 w-20 h-20 bg-purple-600/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.5)] group-hover:scale-110 group-hover:bg-purple-500 transition-all duration-300">
              <Play className="w-8 h-8 text-white ml-2" fill="currentColor" />
            </div>
          </div>
        ) : null}

        {videoUrl ? (
          <iframe
            src={finalIframeUrl}
            className="w-full h-full relative z-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 relative z-0">
            Please add a video embed URL
          </div>
        )}
      </div>
    </div>
  );
}

// Donation Block with Copy to Clipboard support
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DonationBlock({ c }: { c: Record<string, any> }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const methods = (c.methods as { platform: string; detail: string; url: string; qr_url?: string }[]) ?? [];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">{(c.title as string) ?? 'Support My Work'}</h2>
      </div>
      {(c.subtitle as string) && <p className="text-slate-400 mb-8 max-w-lg text-center mx-auto text-sm">{c.subtitle}</p>}
      
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {methods.map((m, i) => {
          const isCopied = copiedIndex === i;
          const isLink = !!m.url;

          return (
            <div 
              key={i} 
              className={cn(
                "group relative bg-slate-900/50 border rounded-xl p-5 w-full sm:w-64 flex flex-col items-center text-center transition-all duration-300 overflow-hidden",
                isLink ? "cursor-pointer border-slate-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10" 
                       : "cursor-pointer border-slate-700/50 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10",
                isCopied && "border-green-500 bg-green-500/10 shadow-green-500/20"
              )}
              onClick={() => {
                if (isLink) {
                  const safeUrl = m.url.startsWith('http') ? m.url : `https://${m.url}`;
                  window.open(safeUrl, '_blank', 'noopener,noreferrer');
                } else if (m.detail) {
                  handleCopy(m.detail, i);
                }
              }}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity", isLink ? "from-purple-500" : "from-rose-500")} />
              
              {m.qr_url && (
                <div className="w-28 h-28 mb-4 bg-white p-1.5 rounded-xl shadow-lg border border-slate-700/50 group-hover:scale-105 transition-transform duration-300 mx-auto">
                  <img src={m.qr_url} alt="QR Code" className="w-full h-full object-contain rounded-lg" />
                </div>
              )}

              <h3 className="text-white font-semibold text-lg mb-1">{m.platform}</h3>
              
              <div className="flex items-center gap-1.5 mt-2 text-sm font-medium">
                {isLink ? (
                  <span className="text-purple-400 flex items-center gap-1.5">
                    Donate via Link <ExternalLink className="w-4 h-4" />
                  </span>
                ) : isCopied ? (
                  <span className="text-green-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Copied Info!
                  </span>
                ) : (
                  <span className="text-slate-400 group-hover:text-rose-400 flex items-center gap-1.5 transition-colors">
                    Click to Copy <Copy className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// FAQ Block Implementation
// ------------------------------------------------------------------
function FAQBlock({ content, accentColor }: { content: Record<string, any>; accentColor: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = (content.title as string) || 'Các Câu Hỏi Thường Gặp';
  const subtitle = (content.subtitle as string) || 'Giải đáp thắc mắc';
  const faqs = (content.items as { question: string; answer: string }[]) || [];

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {subtitle && <p className="text-slate-400 text-lg">{subtitle}</p>}
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-300 border backdrop-blur-sm",
                isOpen ? "bg-slate-800/80 shadow-lg shadow-purple-900/10" : "bg-slate-900/40 hover:bg-slate-800/60"
              )}
              style={{ borderColor: isOpen ? `${accentColor}50` : 'rgba(100, 116, 139, 0.2)' }}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className={cn("font-medium pr-4 transition-colors", isOpen ? "text-white" : "text-slate-300")}>
                  {faq.question}
                </span>
                <span 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                  style={{ backgroundColor: isOpen ? `${accentColor}20` : 'rgba(51, 65, 85, 0.5)', color: isOpen ? accentColor : '#94a3b8' }}
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
                </span>
              </button>
              
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-700/30">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
        {faqs.length === 0 && (
          <p className="text-center text-slate-500 py-8">Chưa có câu hỏi nào.</p>
        )}
      </div>
    </div>
  );
}
