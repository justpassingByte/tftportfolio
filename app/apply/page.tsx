'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const [form, setForm] = useState({
    display_name: '',
    email: '',
    discord: '',
    game: 'TFT',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Submitted!</h1>
          <p className="text-slate-400 mb-6">
            We&apos;ll review your application and get back to you via Discord or email.
            This usually takes 1-2 business days.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white mb-1">TacticianClimb</h1>
          </Link>
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            Want your own booster page?
          </h2>
          <p className="text-sm text-slate-500">
            Fill out this form and we&apos;ll set up a personalized landing page for you
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-1.5 block text-sm">Display Name *</Label>
              <Input
                value={form.display_name}
                onChange={(e) => update('display_name', e.target.value)}
                required
                placeholder="Your booster name"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5 block text-sm">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                placeholder="you@example.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5 block text-sm">Discord</Label>
              <Input
                value={form.discord}
                onChange={(e) => update('discord', e.target.value)}
                placeholder="YourName#1234 or Discord server link"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5 block text-sm">Game</Label>
              <select
                value={form.game}
                onChange={(e) => update('game', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="TFT">Teamfight Tactics</option>
                <option value="LoL">League of Legends</option>
                <option value="Valorant">Valorant</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5 block text-sm">Tell us about yourself</Label>
              <Textarea
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Your experience, rank, why you want a page..."
                className="bg-slate-800 border-slate-700 text-white resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-10"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
