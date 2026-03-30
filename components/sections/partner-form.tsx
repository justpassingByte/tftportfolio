'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Handshake, Gamepad2, User, Mail, MessageSquare, Trophy, Link as LinkIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerForm({ isOpen, onClose }: PartnerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    game: 'TFT',
    discord_facebook: '',
    achievements: '',
    message: '',
  });

  const { t } = useI18n();
  const pt = t.partner_form as Record<string, string>;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setErrorMsg('');
      setFormData({ name: '', email: '', game: 'TFT', discord_facebook: '', achievements: '', message: '' });
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: formData.name,
          email: formData.email,
          discord: formData.discord_facebook,
          game: formData.game,
          message: formData.achievements + '\n\n' + formData.message
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent showCloseButton={false} className="bg-slate-950/90 backdrop-blur-2xl border-white/10 sm:max-w-md shadow-2xl shadow-blue-900/20">
          <DialogDescription className="sr-only">Application Submitted Successfully</DialogDescription>
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/30 to-teal-500/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Handshake className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-3">{pt.success_title || "Request Sent Successfully!"}</h3>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {pt.success_desc || "We have received your partner application. We will review it and contact you shortly."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="bg-slate-950/90 backdrop-blur-2xl border-white/10 sm:max-w-xl w-[95vw] p-0 overflow-hidden shadow-2xl shadow-blue-900/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300">
        <DialogDescription className="sr-only">Partner Application Form to partner with TacticianClimb</DialogDescription>
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="relative shrink-0 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-teal-900/5 px-6 py-5">
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
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Handshake className="w-6 h-6 text-blue-400" />
                </div>
                {pt.title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-400 mt-3 max-w-md leading-relaxed">
              {pt.subtitle}
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto px-6 py-6 custom-scrollbar">
            <div className="space-y-6">
            
              {/* Game Selection visually */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{pt.game}</label>
                <div className="grid grid-cols-3 gap-3">
                  {['TFT', 'League of Legends', 'Valorant'].map((g) => {
                    const isSelected = formData.game === g;
                    const displayName = g === 'League of Legends' ? 'LOL' : g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, game: g })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all min-w-0 ${
                          isSelected 
                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-blue-200' 
                            : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/10 hover:text-slate-200'
                        }`}
                      >
                        <Gamepad2 className={`w-5 h-5 mb-1.5 shrink-0 ${isSelected ? 'text-blue-400' : 'opacity-70'}`} />
                        <span className="text-[10px] sm:text-xs font-medium text-center uppercase tracking-wide leading-tight truncate w-full">
                          {displayName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">{pt.name}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      required
                      placeholder={pt.name_placeholder || "Booster Name"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">{pt.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      type="email"
                      required
                      placeholder={pt.email_placeholder || "you@example.com"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">{pt.discord || "Contact"}</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      required
                      placeholder={pt.discord_placeholder || "Username or Link"}
                      value={formData.discord_facebook}
                      onChange={(e) => setFormData({ ...formData, discord_facebook: e.target.value })}
                      className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">{pt.rank || "Highest Rank / Peak"}</label>
                  <div className="relative">
                    <Trophy className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      required
                      placeholder={pt.rank_placeholder || "e.g. Challenger 1000LP"}
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">{pt.message}</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Textarea
                    required
                    placeholder={pt.message_placeholder || "Tell us a bit about your boosting experience..."}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="pl-10 pt-4 min-h-[100px] bg-slate-900/50 border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {errorMsg}
                </div>
              )}
            </div>
            
            <div className="mt-8 shrink-0">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-blue-600 hover:from-blue-500 to-teal-500 hover:to-teal-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (pt.submitting || 'SUBMITTING...') : pt.submit}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
