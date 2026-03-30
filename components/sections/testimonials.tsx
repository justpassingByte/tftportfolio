'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, PenLine } from 'lucide-react';
import type { ReviewItem } from '@/lib/types';
import ReviewForm from './review-form';

interface TestimonialsProps {
  reviews?: ReviewItem[];
  title?: string;
  subtitle?: string;
  boosterId?: string;
}

export default function Testimonials({
  reviews: reviewsProp,
  title = 'What My Clients Say',
  subtitle = 'Real stories from real people who trusted me with their climb',
  boosterId,
}: TestimonialsProps) {
  const reviews = reviewsProp ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || reviews.length <= 1) return;
      setIsAnimating(true);
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, reviews.length]
  );

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

  // Display 3 reviews on desktop: prev, active, next
  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    if (reviews.length === 1) return [{ review: reviews[0], position: 'active' as const }];
    if (reviews.length === 2) {
      const next = (activeIndex + 1) % reviews.length;
      return [
        { review: reviews[activeIndex], position: 'active' as const },
        { review: reviews[next], position: 'next' as const },
      ];
    }
    const prev = (activeIndex - 1 + reviews.length) % reviews.length;
    const next = (activeIndex + 1) % reviews.length;
    return [
      { review: reviews[prev], position: 'prev' as const },
      { review: reviews[activeIndex], position: 'active' as const },
      { review: reviews[next], position: 'next' as const },
    ];
  };

  const visible = getVisibleReviews();

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
            Trusted by players across all ranks
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-lg shadow-purple-600/20"
          >
            <PenLine className="w-4 h-4" />
            Viết Đánh Giá
          </button>
        </div>

        {reviews.length > 0 ? (
          <>
            {/* Carousel - Desktop */}
            <div className="hidden md:block relative">
              <div className="flex items-stretch justify-center gap-6 px-12">
                {visible.map(({ review, position }) => (
                  <div
                    key={review.id}
                    className={`flex-1 max-w-md transition-all duration-600 ease-out ${
                      position === 'active'
                        ? 'scale-105 opacity-100 z-10'
                        : 'scale-95 opacity-50 blur-[1px]'
                    }`}
                  >
                    <TestimonialCard review={review} isActive={position === 'active'} />
                  </div>
                ))}
              </div>

              {/* Nav arrows */}
              {reviews.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-slate-700/50 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-slate-700/50 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Carousel - Mobile */}
            <div className="md:hidden">
              <TestimonialCard review={reviews[activeIndex]} isActive />

              {reviews.length > 1 && (
                <div className="flex justify-between items-center mt-6 px-4">
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
            </div>

            {/* Dots - Desktop */}
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
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { value: `${reviews.length}+`, label: 'Happy Clients' },
                { value: '5.0', label: 'Average Rating' },
                { value: '100%', label: 'Satisfaction' },
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
          <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/30">
            <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">Chưa có đánh giá nào</h3>
            <p className="text-slate-400">Hãy là người đầu tiên để lại nhận xét với dịch vụ này!</p>
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
}: {
  review: ReviewItem;
  isActive: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-500 ${
        isActive
          ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/30 shadow-2xl shadow-purple-600/10'
          : 'bg-slate-800/30 border border-slate-700/30'
      }`}
    >
      {/* Quote icon */}
      <div
        className={`absolute -top-4 -left-2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
          isActive
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-600/30'
            : 'bg-slate-800 border border-slate-700'
        }`}
      >
        <Quote className="w-5 h-5 text-white" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-5 mt-2">
        {[...Array(review.rating)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 transition-all duration-500 ${
              isActive
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-yellow-400/50 text-yellow-400/50'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-slate-200 text-base leading-relaxed mb-6 min-h-[80px]">
        &ldquo;{review.content}&rdquo;
      </p>

      {/* Rank progression */}
      <div className="flex items-center gap-3 mb-5 py-3 px-4 rounded-lg bg-slate-900/50 border border-slate-700/30">
        <div className="flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rank Journey</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">{review.rank_before}</span>
            <span className="text-purple-400">→</span>
            <span className="text-purple-300 font-bold">{review.rank_after}</span>
          </div>
        </div>
        {review.days && (
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
            <p className="text-blue-300 font-medium text-sm">{review.days}</p>
          </div>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/30 flex items-center justify-center">
          <span className="text-sm font-bold text-purple-300">
            {review.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{review.username}</p>
          <p className="text-slate-500 text-xs">Verified Client</p>
        </div>
      </div>
    </div>
  );
}
