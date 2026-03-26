'use client';

import { Star } from 'lucide-react';
import { defaultReviews } from '@/lib/default-content';
import type { ReviewItem } from '@/lib/types';

interface ReviewsProps {
  reviews?: ReviewItem[];
}

export default function Reviews({ reviews: reviewsProp }: ReviewsProps) {
  const reviews = reviewsProp ?? defaultReviews;

  return (
    <section className="py-24 px-4 bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          What Players Say
        </h2>
        <p className="text-slate-400 text-center mb-16 text-lg">
          Real feedback from real climbs
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`group rounded-lg bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 hover:border-purple-500/50 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/10 ${
                index % 3 === 2 && 'lg:col-span-1'
              }`}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Progression */}
              <div className="mb-4 pb-4 border-b border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Rank progression</p>
                <p className="text-lg font-semibold text-white">
                  <span className="text-slate-300">{review.rank_before}</span>
                  <span className="mx-2 text-slate-500">→</span>
                  <span className="text-purple-300">{review.rank_after}</span>
                  {review.days && (
                    <span className="ml-3 text-sm text-slate-400">({review.days})</span>
                  )}
                </p>
              </div>

              {/* Review text */}
              <p className="text-slate-300 mb-4 leading-relaxed">
                &quot;{review.content}&quot;
              </p>

              {/* Username */}
              <p className="text-sm text-slate-500 group-hover:text-purple-400 transition-colors">
                — {review.username}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
