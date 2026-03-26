'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Star } from 'lucide-react';
import type { ReviewItem } from '@/lib/types';
import { defaultReviews } from '@/lib/default-content';

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    ...defaultReviews,
    // Add a pending review for demo
    {
      id: 'pending-1',
      username: 'NewReviewer',
      rank_before: 'Plat 2',
      rank_after: 'Diamond 3',
      content: 'Just finished my climb, amazing experience! Super fast and professional.',
      rating: 5,
      is_approved: false,
      created_at: new Date().toISOString(),
    },
  ]);

  const approveReview = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const pendingReviews = reviews.filter((r) => !r.is_approved);
  const approvedReviews = reviews.filter((r) => r.is_approved);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reviews</h2>
        <div className="flex gap-2">
          <Badge className="bg-yellow-600/20 text-yellow-300 border border-yellow-500/30">
            {pendingReviews.length} Pending
          </Badge>
          <Badge className="bg-green-600/20 text-green-300 border border-green-500/30">
            {approvedReviews.length} Approved
          </Badge>
        </div>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-300">Pending Approval</h3>
          {pendingReviews.map((review) => (
            <div
              key={review.id}
              className="bg-yellow-900/10 rounded-lg border border-yellow-500/20 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{review.username}</p>
                  <p className="text-sm text-slate-400">
                    {review.rank_before} → {review.rank_after}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 mb-4">&quot;{review.content}&quot;</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => approveReview(review.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteReview(review.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approved Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-300">Approved</h3>
        {approvedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium">{review.username}</p>
                <p className="text-sm text-slate-400">
                  {review.rank_before} → {review.rank_after}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteReview(review.id)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-slate-300">&quot;{review.content}&quot;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
