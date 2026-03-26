'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadForm({ isOpen, onClose }: LeadFormProps) {
  const [formData, setFormData] = useState({
    contact: '',
    currentRank: '',
    targetRank: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ contact: '', currentRank: '', targetRank: '', message: '' });
    }, 2000);
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-slate-700 sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500 flex items-center justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message received</h3>
            <p className="text-slate-400 text-center">
              I&apos;ll check your info and get back to you fast.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-2xl">Tell me your goal</DialogTitle>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Discord or Telegram
            </label>
            <Input
              type="text"
              placeholder="your_username#1234"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500"
            />
          </div>

          {/* Current rank */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current rank
            </label>
            <Select value={formData.currentRank} onValueChange={(value) => setFormData({ ...formData, currentRank: value })}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Select your rank" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {ranks.map((rank) => (
                  <SelectItem key={rank} value={rank} className="text-white">
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target rank */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target rank
            </label>
            <Select value={formData.targetRank} onValueChange={(value) => setFormData({ ...formData, targetRank: value })}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Where do you want to go?" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {ranks.map((rank) => (
                  <SelectItem key={rank} value={rank} className="text-white">
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Anything else?
            </label>
            <Textarea
              placeholder="Tell me about your playstyle or any concerns..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 resize-none"
              rows={4}
            />
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-400 italic">
            Tell me your goal, I&apos;ll handle the rest.
          </p>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-11 font-semibold border border-purple-500/50"
          >
            Send message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
