'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    username: 'SoloQGrinder',
    before: 'D3',
    after: 'Master',
    days: '3 days',
    review: 'Super smooth climb, no sketchy gameplay. Actually feels like watching a high-level player.',
    rating: 5,
  },
  {
    id: 2,
    username: 'TacticsMain',
    before: 'P1',
    after: 'Diamond 1',
    days: '2 weeks',
    review: 'Fast progression. The guy knows what he&apos;s doing. Consistent LP gains every single day.',
    rating: 5,
  },
  {
    id: 3,
    username: 'NewbieClimber',
    before: 'Gold 1',
    after: 'Plat 2',
    days: '10 days',
    review: 'Clean gameplay. Zero account risks. Would recommend to anyone wanting legit boost.',
    rating: 5,
  },
  {
    id: 4,
    username: 'CompNoob',
    before: 'Diamond 1',
    after: 'Master',
    days: '4 days',
    review: 'The adaptability is unmatched. Never forces a comp, always plays what the lobby needs.',
    rating: 5,
  },
  {
    id: 5,
    username: 'RankedWarrior',
    before: 'Plat 3',
    after: 'Diamond 2',
    days: '16 days',
    review: 'Fast response to messages, professional, no issues. Exactly what I was looking for.',
    rating: 5,
  },
  {
    id: 6,
    username: 'MetaChaser',
    before: 'Diamond 4',
    after: 'Master',
    days: '5 days',
    review: 'Incredible macro decisions. Watched some games and learned a lot just from observation.',
    rating: 5,
  },
];

export default function Reviews() {
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
                  <span className="text-slate-300">{review.before}</span>
                  <span className="mx-2 text-slate-500">→</span>
                  <span className="text-purple-300">{review.after}</span>
                  <span className="ml-3 text-sm text-slate-400">({review.days})</span>
                </p>
              </div>

              {/* Review text */}
              <p className="text-slate-300 mb-4 leading-relaxed">
                &quot;{review.review}&quot;
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
