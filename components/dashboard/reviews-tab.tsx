'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Star, Loader2 } from 'lucide-react';
import type { ReviewItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface ReviewsTabProps {
  userId?: string;
}

export default function ReviewsTab({ userId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [userId]);

  const loadReviews = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const boosterId = userId ?? user?.id;
    if (!boosterId) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booster_id', boosterId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data.map(r => ({
        id: r.id,
        username: r.username,
        rank_before: r.rank_before ?? '',
        rank_after: r.rank_after ?? '',
        content: r.content ?? '',
        rating: r.rating ?? 5,
        is_approved: r.is_approved ?? false,
        created_at: r.created_at,
      })));
    }
    setLoading(false);
  };

  const approveReview = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    if (!error) {
      setReviews(reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá đánh giá này? Dữ liệu sẽ bị xoá vĩnh viễn và không thể khôi phục.')) return;
    
    const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      alert('Không thể xoá đánh giá. Vui lòng thử lại.');
    }
  };

  const pendingReviews = reviews.filter((r) => !r.is_approved);
  const approvedReviews = reviews.filter((r) => r.is_approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

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

      <p className="text-slate-400 text-sm bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
        💡 Khách hàng viết review từ trang profile công khai của bạn. Review mới sẽ hiện ở đây để bạn duyệt trước khi hiển thị.
      </p>

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
        {approvedReviews.length === 0 && (
          <p className="text-slate-500 text-sm">Chưa có review nào được duyệt.</p>
        )}
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

      {reviews.length === 0 && (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Chưa có review nào. Chia sẻ trang profile để khách hàng viết review!</p>
        </div>
      )}
    </div>
  );
}
