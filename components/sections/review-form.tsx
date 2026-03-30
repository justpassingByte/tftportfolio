'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  boosterId: string;
}

export default function ReviewForm({ isOpen, onClose, boosterId }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      booster_id: boosterId,
      username: formData.get('username'),
      rank_before: formData.get('rank_before'),
      rank_after: formData.get('rank_after'),
      content: formData.get('content'),
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to submit form');
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi gửi review. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Để lại Đánh giá</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Chia sẻ trải nghiệm của bạn sau khi sử dụng dịch vụ.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Gửi thành công!</h3>
            <p className="text-slate-400">
              Đánh giá của bạn đã được gửi đến booster để duyệt trước khi hiển thị công khai.
            </p>
            <Button
              onClick={handleClose}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Đóng
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="username" className="text-slate-300">Tên của bạn</Label>
              <Input
                id="username"
                name="username"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1"
                placeholder="Ví dụ: Player123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rank_before" className="text-slate-300">Rank trước khi thuê</Label>
                <Input
                  id="rank_before"
                  name="rank_before"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1"
                  placeholder="Ví dụ: Lục Bảo 4"
                />
              </div>
              <div>
                <Label htmlFor="rank_after" className="text-slate-300">Rank hiện tại</Label>
                <Input
                  id="rank_after"
                  name="rank_after"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1"
                  placeholder="Ví dụ: Cao Thủ"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-slate-300">Nhận xét của bạn</Label>
              <Textarea
                id="content"
                name="content"
                required
                rows={4}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 mt-1 resize-none"
                placeholder="Bạn hài lòng với dịch vụ chứ? Booster chơi có clean không?"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-semibold mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi Đánh giá'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
