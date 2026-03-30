'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Handshake } from 'lucide-react';

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerForm({ isOpen, onClose }: PartnerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    discord_facebook: '',
    achievements: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: '', discord_facebook: '', achievements: '', message: '' });
    }, 2500);
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-slate-700 sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center mb-4">
              <Handshake className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Sent Successfully!</h3>
            <p className="text-slate-400 text-center">
              We have received your partner application. We will review and contact you shortly to setup your custom portfolio page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-2xl flex items-center gap-2">
            <Handshake className="text-purple-400 w-6 h-6" /> Partner Application
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-400 mb-4">
            Become a partner and get your own verified booster profile page natively integrated with our tournament system.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
            <Input
              type="text"
              placeholder="Your Booster/Organizer Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contact Info (Discord / Facebook)</label>
            <Input
              type="text"
              placeholder="Link or Username"
              value={formData.discord_facebook}
              onChange={(e) => setFormData({ ...formData, discord_facebook: e.target.value })}
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Rank / Achievements</label>
            <Input
              type="text"
              placeholder="e.g., Challenger 1000LP"
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Why do you want to join?</label>
            <Textarea
              placeholder="Tell us about yourself and your goals..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg h-11 font-semibold shadow-lg shadow-purple-600/20"
          >
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
