'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Loader2, Star, X, MessageSquareHeart, User, Globe, Trophy, MessageSquare } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const SERVERS = [
  'Vietnam (VN)',
  'Southeast Asia (SEA)',
  'Korea (KR)',
  'Japan (JP)',
  'NA (North America)',
  'EUW (Europe West)',
  'EUNE (Europe Nordic & East)',
  'OCE (Oceania)',
  'LAN (Latin America North)',
  'LAS (Latin America South)',
  'BR (Brazil)',
  'TR (Turkey)',
  'RU (Russia)',
  'PH (Philippines)',
  'SG (Singapore)',
  'TW (Taiwan)',
  'TH (Thailand)',
];

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  boosterId: string;
}

export default function ReviewForm({ isOpen, onClose, boosterId }: ReviewFormProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [server, setServer] = useState('');
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      booster_id: boosterId,
      username: formData.get('username'),
      server: server,
      rating: rating,
      rank_before: formData.get('rank_before'),
      rank_after: formData.get('rank_after'),
      content: formData.get('content'),
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to submit form');
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t.review_form.error);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleClose = () => {
    if (loading) return;
    setSuccess(false);
    setLoading(false);
    setRating(5);
    setHoverRating(0);
    setServer('');
    isSubmittingRef.current = false;
    onClose();
  };

  const displayRating = hoverRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="bg-slate-950/90 backdrop-blur-2xl border-white/10 sm:max-w-xl w-[95vw] p-0 overflow-hidden shadow-2xl shadow-blue-900/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[120px] bg-blue-600/20 blur-3xl pointer-events-none" />

        {success ? (
          <div className="flex flex-col items-center justify-center p-12 relative z-10 min-h-[440px]">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 relative z-10 border border-white/20">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2 text-center">{t.review_form.success_title}</h3>
            <p className="text-slate-400 text-center text-sm leading-relaxed max-w-[280px] mb-8">
              {t.review_form.success_desc}
            </p>
            <Button onClick={handleClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl h-12 transition-all">
              {t.review_form.close}
            </Button>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
            
            {/* Header */}
            <div className="relative shrink-0 border-b border-white/5 bg-gradient-to-r from-blue-900/10 to-indigo-900/5 px-6 py-5">
              <div className="absolute top-0 right-0 p-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5 z-10 relative"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <DialogHeader>
                <div className="flex gap-4">
                  <div className="mt-1 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
                    <MessageSquareHeart className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-2xl font-bold tracking-tight mb-1">{t.review_form.title}</DialogTitle>
                    <DialogDescription className="text-slate-400 text-sm leading-relaxed max-w-[90%]">
                      {t.review_form.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto px-6 py-6 custom-scrollbar">
              <div className="space-y-6">
                
                {/* Rating - Centralized Visual Element */}
                <div className="flex flex-col items-center p-5 rounded-xl bg-slate-900/40 border border-white/5 shadow-inner">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.review_form.rating}</Label>
                  <div className="flex items-center gap-1.5 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none focus:scale-125"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors duration-200 ${
                            star <= displayRating
                              ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                              : 'fill-slate-800/80 text-slate-700 hover:text-slate-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-2">{displayRating} / 5</span>
                </div>

                {/* Grid 1: Name & Server */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 group">
                    <Label htmlFor="username" className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">
                      {t.review_form.name}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                      <Input
                        id="username"
                        name="username"
                        required
                        className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 shadow-inner"
                        placeholder={t.review_form.name_placeholder}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">
                      {t.review_form.server}
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10 pointer-events-none" />
                      <Select value={server} onValueChange={setServer} required>
                        <SelectTrigger className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white focus:ring-2 focus:ring-blue-500/20 rounded-xl shadow-inner data-[placeholder]:text-slate-600">
                          <SelectValue placeholder={t.review_form.server_placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 rounded-xl shadow-xl max-h-56">
                          {SERVERS.map((s) => (
                            <SelectItem key={s} value={s} className="text-slate-200 focus:bg-blue-600/20 focus:text-blue-300 cursor-pointer">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Grid 2: Rank Before & After */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 group">
                    <Label htmlFor="rank_before" className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">
                      {t.review_form.rank_before}
                    </Label>
                    <div className="relative">
                      <Trophy className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none opacity-60" />
                      <Input
                        id="rank_before"
                        name="rank_before"
                        required
                        className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 shadow-inner"
                        placeholder={t.review_form.rank_before_placeholder}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 group">
                    <Label htmlFor="rank_after" className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">
                      {t.review_form.rank_after}
                    </Label>
                    <div className="relative">
                      <Trophy className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none text-blue-400" />
                      <Input
                        id="rank_after"
                        name="rank_after"
                        required
                        className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 shadow-inner"
                        placeholder={t.review_form.rank_after_placeholder}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 group pb-2">
                  <Label htmlFor="content" className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">
                    {t.review_form.content}
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                    <Textarea
                      id="content"
                      name="content"
                      required
                      rows={4}
                      className="pl-10 pt-3.5 min-h-[100px] bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all resize-none shadow-inner placeholder:text-slate-600"
                      placeholder={t.review_form.content_placeholder}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 shrink-0">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-500 hover:to-indigo-400 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.lead_form.submitting}
                    </span>
                  ) : (
                    t.review_form.submit
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
