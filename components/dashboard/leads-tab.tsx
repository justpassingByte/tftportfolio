'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import type { Lead } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface LeadsTabProps {
  userId?: string;
}

export default function LeadsTab({ userId }: LeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, [userId]);

  const loadLeads = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const boosterId = userId ?? user?.id;
    if (!boosterId) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('booster_id', boosterId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data.map(l => ({
        id: l.id,
        booster_id: l.booster_id,
        contact_info: l.contact_info,
        current_rank: l.current_rank ?? '',
        desired_rank: l.desired_rank ?? '',
        message: l.message ?? '',
        status: l.status ?? 'new',
        created_at: l.created_at,
      })));
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: Lead['status']) => {
    const supabase = createClient();
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    }
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

  const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    contacted: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
    completed: 'bg-green-600/20 text-green-300 border-green-500/30',
  };

  const newLeads = leads.filter((l) => l.status === 'new');
  const otherLeads = leads.filter((l) => l.status !== 'new');

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
        <h2 className="text-2xl font-bold text-white">Leads</h2>
        <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500/30">
          {newLeads.length} New
        </Badge>
      </div>

      <p className="text-slate-400 text-sm bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
        💡 Khi khách hàng gửi form từ trang profile của bạn, lead sẽ xuất hiện ở đây. Bạn có thể theo dõi và cập nhật trạng thái.
      </p>

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
          <p className="text-slate-400">Chưa có lead nào. Chia sẻ trang profile để bắt đầu nhận khách!</p>
        </div>
      )}
    </div>
  );
}
