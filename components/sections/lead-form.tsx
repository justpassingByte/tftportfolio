'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2, MessageSquare, Send, Gamepad2, Phone, ChevronRight, AlignLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  boosterId?: string;
}

export default function LeadForm({ isOpen, onClose, boosterId }: LeadFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    game: 'TFT',
    contact: '',
    currentRank: '',
    targetRank: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);

    if (boosterId) {
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booster_id: boosterId,
            game: formData.game,
            contact_info: formData.contact,
            current_rank: formData.currentRank,
            desired_rank: formData.targetRank,
            message: formData.message,
          }),
        });
      } catch {
        // Silently fail for now
      }
    }

    setSubmitted(true);
    setLoading(false);
    
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ game: 'TFT', contact: '', currentRank: '', targetRank: '', message: '' });
      isSubmittingRef.current = false;
    }, 2500);
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while submitting
    setSubmitted(false);
    isSubmittingRef.current = false;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="bg-slate-950/90 backdrop-blur-2xl border-white/10 sm:max-w-xl w-[95vw] p-0 overflow-hidden shadow-2xl shadow-purple-900/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[100px] bg-purple-600/20 blur-3xl pointer-events-none" />

        {submitted ? (
          <div className="flex flex-col items-center justify-center p-12 relative z-10 min-h-[400px]">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 relative z-10 border border-white/10">
                <Send className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2 text-center">{t.lead_form.success_title}</h3>
            <p className="text-slate-400 text-center text-sm leading-relaxed max-w-[280px]">
              {t.lead_form.success_desc}
            </p>
          </div>
        ) : (
          <div className="p-6 relative z-10 flex flex-col h-full max-h-[85vh]">
            <DialogHeader className="flex flex-row items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center shadow-inner">
                  <MessageSquare className="w-5 h-5 text-purple-300" />
                </div>
                <DialogTitle className="text-white text-xl font-bold tracking-tight">{t.lead_form.title}</DialogTitle>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {/* Form Elements */}
                  
                {/* Game Selection (Cards) */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider transition-colors group-focus-within:text-purple-400">
                    Game
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['TFT', 'League of Legends', 'Valorant'].map((g) => {
                      const isSelected = formData.game === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, game: g })}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all min-w-0 ${
                            isSelected 
                              ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-purple-200' 
                              : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/10 hover:text-slate-200'
                          }`}
                        >
                          <Gamepad2 className={`w-5 h-5 mb-1.5 shrink-0 ${isSelected ? 'text-purple-400' : 'opacity-70'}`} />
                          <span className="text-[10px] font-medium text-center uppercase tracking-wide leading-tight truncate w-full">
                            {g === 'League of Legends' ? 'LOL' : g}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Contact field */}
                <div className="group relative">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider transition-colors group-focus-within:text-purple-400">
                    {t.lead_form.contact}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <Input
                      type="text"
                      placeholder={t.lead_form.contact_placeholder}
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                      className="h-12 w-full pl-10 pr-4 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500/70 focus:bg-slate-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                {/* Ranks Progression */}
                <div className="flex items-center gap-3">
                  {/* Current rank */}
                  <div className="group flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider transition-colors group-focus-within:text-purple-400 truncate">
                      {t.lead_form.current_rank}
                    </label>
                    <Select value={formData.currentRank} onValueChange={(value) => setFormData({ ...formData, currentRank: value })}>
                      <SelectTrigger className="h-12 w-full bg-slate-900/50 border-white/10 text-white focus:ring-2 focus:ring-purple-500/20 rounded-xl [&>span]:truncate [&>span]:block [&>span]:flex-1 [&>span]:text-left">
                        <SelectValue placeholder={t.lead_form.current_rank_placeholder} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 rounded-xl shadow-xl">
                        {ranks.map((rank) => (
                          <SelectItem key={rank} value={rank} className="text-slate-200 focus:bg-purple-600/20 focus:text-purple-300 cursor-pointer">
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Arrow Icon directly between select inputs vertically matching their level */}
                  <div className="pt-6 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/5 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Target rank */}
                  <div className="group flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider transition-colors group-focus-within:text-purple-400 truncate">
                      {t.lead_form.target_rank}
                    </label>
                    <Select value={formData.targetRank} onValueChange={(value) => setFormData({ ...formData, targetRank: value })}>
                      <SelectTrigger className="h-12 w-full bg-purple-900/10 border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500/20 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:border-purple-500/50 transition-all focus:bg-purple-900/20 [&>span]:truncate [&>span]:block [&>span]:flex-1 [&>span]:text-left">
                        <SelectValue placeholder={t.lead_form.target_rank_placeholder} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 rounded-xl shadow-xl">
                        {ranks.map((rank) => (
                          <SelectItem key={rank} value={rank} className="text-slate-200 focus:bg-purple-600/20 focus:text-purple-300 cursor-pointer">
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="group relative">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider transition-colors group-focus-within:text-purple-400">
                    {t.lead_form.message}
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                      <AlignLeft className="h-4 w-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <Textarea
                      placeholder={t.lead_form.message_placeholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500/70 focus:bg-slate-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none rounded-xl"
                      rows={4}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {t.lead_form.tagline}
                  </p>
                </div>
              </div>

              {/* Submit button area */}
              <div className="pt-4 mt-2 border-t border-white/5 shrink-0">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden group/btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl h-12 font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all disabled:opacity-70 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] border-0"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                        {t.lead_form.submitting}
                      </>
                    ) : (
                      <>
                        {t.lead_form.submit}
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
