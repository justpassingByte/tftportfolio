'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export default function SettingsTab() {
  const [username, setUsername] = useState('villiant');
  const [displayName, setDisplayName] = useState('Villiant');
  const [discord, setDiscord] = useState('Villiant#0001');
  const [telegram, setTelegram] = useState('');
  const [discordServer, setDiscordServer] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save'}
        </Button>
      </div>

      {/* Profile */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Profile</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Username (URL slug)</Label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">/u/</span>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Display Name</Label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Contact Links */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Contact Links</h3>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Discord</Label>
          <Input
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="YourName#1234"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Telegram</Label>
          <Input
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@your_telegram"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Discord Server</Label>
          <Input
            value={discordServer}
            onChange={(e) => setDiscordServer(e.target.value)}
            placeholder="https://discord.gg/..."
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-1.5 block">Custom Link</Label>
          <Input
            value={customLink}
            onChange={(e) => setCustomLink(e.target.value)}
            placeholder="https://..."
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/10 rounded-xl border border-red-500/20 p-6">
        <h3 className="text-lg font-semibold text-red-300 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-400 mb-4">
          Permanently delete your page and all associated data.
        </p>
        <Button variant="destructive" size="sm">
          Delete Page
        </Button>
      </div>
    </div>
  );
}
