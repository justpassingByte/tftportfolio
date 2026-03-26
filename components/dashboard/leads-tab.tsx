'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight } from 'lucide-react';
import type { Lead } from '@/lib/types';

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    booster_id: 'mock-1',
    contact_info: 'Player#1234',
    current_rank: 'Gold',
    desired_rank: 'Platinum',
    message: 'Looking for a smooth climb to Plat. Available anytime.',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    booster_id: 'mock-1',
    contact_info: 'GamerDude#5678',
    current_rank: 'Diamond',
    desired_rank: 'Master',
    message: 'Need Master before end of season. Budget flexible.',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    booster_id: 'mock-1',
    contact_info: 'TFTFan#9999',
    current_rank: 'Platinum',
    desired_rank: 'Diamond',
    message: 'Already talked on Discord, just filling the form.',
    status: 'contacted',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
  completed: 'bg-green-600/20 text-green-300 border-green-500/30',
};

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const updateStatus = (id: string, newStatus: Lead['status']) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const newLeads = leads.filter((l) => l.status === 'new');
  const otherLeads = leads.filter((l) => l.status !== 'new');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Leads</h2>
        <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500/30">
          {newLeads.length} New
        </Badge>
      </div>

      {/* New Leads */}
      {newLeads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> New Messages
          </h3>
          {newLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-blue-900/10 rounded-lg border border-blue-500/20 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-lg">{lead.contact_info}</p>
                  <p className="text-sm text-slate-400">{getTimeAgo(lead.created_at)}</p>
                </div>
                <Badge className={STATUS_STYLES[lead.status]}>
                  {lead.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3 text-sm">
                <span className="text-slate-300">{lead.current_rank}</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-medium">{lead.desired_rank}</span>
              </div>
              {lead.message && (
                <p className="text-slate-300 bg-slate-900/50 rounded-lg p-3 text-sm mb-4">
                  {lead.message}
                </p>
              )}
              <Button
                size="sm"
                onClick={() => updateStatus(lead.id, 'contacted')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Mark as Contacted
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Other Leads */}
      {otherLeads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300">Previous</h3>
          {otherLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-800/50 rounded-lg border border-slate-700 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-medium">{lead.contact_info}</p>
                  <p className="text-xs text-slate-500">{getTimeAgo(lead.created_at)}</p>
                </div>
                <Badge className={STATUS_STYLES[lead.status]}>
                  {lead.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">{lead.current_rank}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-slate-300">{lead.desired_rank}</span>
              </div>
              {lead.message && (
                <p className="text-slate-400 text-sm mt-2 truncate">{lead.message}</p>
              )}
              {lead.status === 'contacted' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateStatus(lead.id, 'completed')}
                  className="text-green-400 hover:text-green-300 mt-2 text-xs"
                >
                  Mark Completed
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {leads.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No leads yet. Share your page to start receiving messages!</p>
        </div>
      )}
    </div>
  );
}
