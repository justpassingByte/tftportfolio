'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, PenLine, Globe } from 'lucide-react';
import type { ReviewItem } from '@/lib/types';
import ReviewForm from './review-form';
import { useI18n } from '@/lib/i18n';

interface TestimonialsProps {
  reviews?: ReviewItem[];
  title?: string;
  subtitle?: string;
  boosterId?: string;
}

export default function Testimonials({
  reviews: reviewsProp,
  boosterId,
}: TestimonialsProps) {
  const { t } = useI18n();
  const reviews = reviewsProp ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goNext = useCallback(() => {
    if (reviews.length <= 1) return;
    goTo((activeIndex + 1) % reviews.length);
  }, [activeIndex, reviews.length, goTo]);

  const goPrev = useCallback(() => {
    if (reviews.length <= 1) return;
    goTo((activeIndex - 1 + reviews.length) % reviews.length);
  }, [activeIndex, reviews.length, goTo]);

  // Auto-play
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [goNext, reviews.length]);

  // Derived stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '0.0';
  const satisfaction = Number(avgRating) >= 4.8 ? '100%' : Number(avgRating) >= 4.0 ? '98%' : '90%';

  const getCardStyle = (index: number) => {
    if (reviews.length === 0) return {};
    if (reviews.length === 1) {
      return { 
        transform: 'translateX(0) scale(1)', 
        opacity: 1, 
        zIndex: 10,
        position: 'relative' as const 
      };
    }

    let offset = index - activeIndex;
    if (reviews.length >= 3) {
      if (offset < -1 && offset < -Math.floor(reviews.length / 2)) offset += reviews.length;
      if (offset > 1 && offset > Math.floor(reviews.length / 2)) offset -= reviews.length;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseTranslate = isMobile ? 105 : 110; 

    if (offset === 0) {
      return {
        transform: 'translateX(0%) scale(1.05)',
        opacity: 1,
        zIndex: 10,
        position: 'absolute' as const,
        inset: 0,
        pointerEvents: 'auto' as const,
      };
    }
    if (offset === -1 || (offset < 0 && reviews.length === 2)) {
      return {
        transform: `translateX(-${baseTranslate}%) scale(0.95)`,
        opacity: 0.5,
        zIndex: 0,
        filter: 'blur(1px)',
        position: 'absolute' as const,
        inset: 0,
        pointerEvents: 'none' as const,
      };
    }
    if (offset === 1 || (offset > 0 && reviews.length === 2)) {
      return {
        transform: `translateX(${baseTranslate}%) scale(0.95)`,
        opacity: 0.5,
        zIndex: 0,
        filter: 'blur(1px)',
        position: 'absolute' as const,
        inset: 0,
        pointerEvents: 'none' as const,
      };
    }
    
    // Hidden cards
    return {
      transform: `translateX(${offset > 0 ? 200 : -200}%) scale(0.8)`,
      opacity: 0,
      zIndex: -1,
      position: 'absolute' as const,
      inset: 0,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {t.reviews.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.reviews.title}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            {t.reviews.subtitle}
          </p>
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-lg shadow-purple-600/20"
          >
            <PenLine className="w-4 h-4" />
            {t.reviews.write_review}
          </button>
        </div>

        {reviews.length > 0 ? (
          <>
            {/* Carousel Container */}
            <div className="relative mx-auto w-full max-w-md h-[400px] md:h-[350px]">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className="w-full h-full transition-all duration-700 ease-in-out origin-center"
                  style={getCardStyle(i)}
                >
                  <TestimonialCard review={review} isActive={i === activeIndex} t={t} />
                </div>
              ))}

              {/* Nav arrows - Desktop */}
              {reviews.length > 1 && (
                <div className="hidden md:block">
                  <button
                    onClick={goPrev}
                    className="absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-slate-700/50 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-slate-700/50 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile controls */}
            {reviews.length > 1 && (
              <div className="md:hidden flex justify-between items-center mt-8 px-4 max-w-sm mx-auto">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-slate-700/50 flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === activeIndex
                          ? 'w-8 bg-purple-500'
                          : 'w-2 bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-slate-700/50 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {/* Desktop Dots */}
            {reviews.length > 1 && (
              <div className="hidden md:flex justify-center gap-2 mt-12">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? 'w-10 bg-gradient-to-r from-purple-500 to-blue-500'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto relative z-10">
              {[
                { value: `${totalReviews}+`, label: t.reviews.happy_clients },
                { value: avgRating, label: t.reviews.avg_rating },
                { value: satisfaction, label: t.reviews.satisfaction },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {stat.value}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/30 relative z-10 mx-auto max-w-2xl">
            <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">{t.reviews.no_reviews}</h3>
            <p className="text-slate-400">{t.reviews.no_reviews_desc}</p>
          </div>
        )}
      </div>

      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        boosterId={boosterId || 'mock'}
      />
    </section>
  );
}

// --- Testimonial Card ---
function TestimonialCard({
  review,
  isActive,
  t,
}: {
  review: ReviewItem;
  isActive: boolean;
  t: any;
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 h-full bg-slate-800/30 border border-slate-700/30 transition-all duration-700 flex flex-col ${
        isActive
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-purple-500/30 shadow-2xl shadow-purple-600/10'
          : ''
      }`}
    >
      {/* Quote icon */}
      <div
        className={`absolute -top-4 -left-2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700 ${
          isActive
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-600/30'
            : 'bg-slate-800 border border-slate-700'
        }`}
      >
        <Quote className="w-5 h-5 text-white" />
      </div>

      <div className="flex items-center justify-between mb-5 mt-2">
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-all duration-500 ${
                i < (review.rating || 5)
                  ? isActive 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-yellow-400/50 text-yellow-400/50'
                  : 'fill-slate-700 text-slate-700'
              }`}
            />
          ))}
        </div>
        
        {/* Server badge */}
        {review.server && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/50">
            <Globe className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
              {review.server.split(' ')[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <p className={`text-slate-200 text-base leading-relaxed transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
          &ldquo;{review.content}&rdquo;
        </p>
      </div>

      {/* Rank progression */}
      <div className="flex items-center gap-3 mb-5 py-3 px-4 rounded-lg bg-slate-900/50 border border-slate-700/30 shrink-0">
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 truncate">{t.reviews.rank_journey}</p>
          <div className="flex items-center gap-2 text-sm truncate">
            <span className="text-slate-300 font-medium truncate shrink">{review.rank_before}</span>
            <span className="text-purple-400 shrink-0">→</span>
            <span className="text-purple-300 font-bold truncate shrink">{review.rank_after}</span>
          </div>
        </div>
        {review.days && (
          <div className="text-right shrink-0 ml-2 border-l border-slate-700/50 pl-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t.reviews.duration}</p>
            <p className="text-blue-300 font-medium text-sm">{review.days}</p>
          </div>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/30 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-purple-300">
            {review.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="truncate">
          <p className="text-white font-semibold text-sm truncate">{review.username}</p>
          <p className="text-slate-500 text-xs truncate">{t.reviews.verified_client}</p>
        </div>
      </div>
    </div>
  );
}
