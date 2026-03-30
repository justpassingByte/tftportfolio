'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Loader2, Trash2 } from 'lucide-react';
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

  const deleteLead = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá lead này? Khách hàng sẽ bị xoá vĩnh viễn.')) return;
    
    const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLeads(leads.filter((l) => l.id !== id));
    } else {
      alert('Không thể xoá lead. Vui lòng thử lại.');
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

  const getPreviousRequestsCount = (contact: string, currentDate: string) => {
    return leads.filter(l => l.contact_info === contact && new Date(l.created_at).getTime() < new Date(currentDate).getTime()).length;
  };

  const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    read: 'bg-slate-600/20 text-slate-300 border-slate-500/30',
    contacted: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
    completed: 'bg-green-600/20 text-green-300 border-green-500/30',
  };

  const newLeads = leads.filter((l) => l.status === 'new');
  const otherLeads = leads.filter((l) => l.status !== 'new');
  
  const [visibleCount, setVisibleCount] = useState(10);
  const displayedOtherLeads = otherLeads.slice(0, visibleCount);

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
        💡 Khi khách hàng gửi form từ trang profile của bạn, lead sẽ xuất hiện ở đây. Hệ thống tự động nhận diện "Khách Quen" nếu họ đã từng nhắn cho bạn.
      </p>

      {/* New Leads */}
      {newLeads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> New Messages
          </h3>
          {newLeads.map((lead) => {
            const prevCount = getPreviousRequestsCount(lead.contact_info, lead.created_at);
            return (
            <div
              key={lead.id}
              className="bg-blue-900/10 rounded-lg border border-blue-500/20 p-5 relative overflow-hidden"
            >
              {prevCount > 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600/40 to-transparent px-8 py-1 rounded-bl-xl border-b border-l border-purple-500/20 text-xs font-bold text-purple-300 uppercase tracking-widest">
                  Returning Client
                </div>
              )}
              <div className="flex items-start justify-between mb-3 mt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-lg">{lead.contact_info}</p>
                    {prevCount > 0 && (
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 px-1.5 py-0 text-[10px]">
                        Lần thứ {prevCount + 1}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{getTimeAgo(lead.created_at)}</p>
                </div>
                <Badge className={STATUS_STYLES[lead.status]}>
                  {lead.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3 text-sm">
                <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300">{lead.game || 'TFT'}</Badge>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-sm">
                  <span className="text-slate-400">{lead.current_rank}</span>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">{lead.desired_rank}</span>
                </div>
              </div>
              {lead.message && (
                <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 text-slate-300 text-sm mb-4">
                  {lead.message}
                </div>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <Button size="sm" onClick={() => updateStatus(lead.id, 'read')} className="bg-slate-700 hover:bg-slate-600 text-white">
                  Mark as Read
                </Button>
                <Button size="sm" onClick={() => updateStatus(lead.id, 'contacted')} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Mark Contacted
                </Button>
                <Button size="sm" onClick={() => updateStatus(lead.id, 'completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Mark Completed
                </Button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Other Leads */}
      {otherLeads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300 pt-4 border-t border-slate-800">
            Processed history
          </h3>
          <div className="space-y-3">
            {displayedOtherLeads.map((lead) => {
              const prevCount = getPreviousRequestsCount(lead.contact_info, lead.created_at);
              return (
              <div
                key={lead.id}
                className={`rounded-lg border p-4 opacity-70 hover:opacity-100 transition-opacity ${
                  lead.status === 'completed' 
                    ? 'bg-emerald-950/10 border-emerald-900/30' 
                    : lead.status === 'read'
                    ? 'bg-slate-900/30 border-slate-800'
                    : 'bg-slate-900/30 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-200 font-medium">{lead.contact_info}</p>
                    {prevCount > 0 && (
                      <Badge className="bg-purple-900/20 text-purple-400 border-purple-900/30 px-1.5 py-0 text-[10px]">
                        Lần thứ {prevCount + 1}
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500">[{lead.game || 'TFT'}]</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{getTimeAgo(lead.created_at)}</span>
                    <Badge className={STATUS_STYLES[lead.status]}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{lead.current_rank}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-300 font-medium">{lead.desired_rank}</span>
                  </div>
                  
                  <div className="flex gap-2 ml-auto">
                    {lead.status !== 'read' && (
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-slate-400 hover:text-white" onClick={() => updateStatus(lead.id, 'read')}>
                        Make Read
                      </Button>
                    )}
                    {lead.status !== 'contacted' && (
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-yellow-400/70 hover:text-yellow-400" onClick={() => updateStatus(lead.id, 'contacted')}>
                        Make Contacted
                      </Button>
                    )}
                    {lead.status !== 'completed' && (
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-emerald-400/70 hover:text-emerald-400" onClick={() => updateStatus(lead.id, 'completed')}>
                        Make Completed
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-red-400/70 hover:text-red-400" onClick={() => deleteLead(lead.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          
          {visibleCount < otherLeads.length && (
            <div className="flex justify-center pt-4 pb-8">
              <Button 
                variant="outline" 
                className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setVisibleCount(v => v + 10)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}

      {leads.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">Chưa có khách hàng nào</h3>
          <p className="text-slate-500 mt-2">Khi có người gửi form trên profile, thông báo sẽ hiện ở đây.</p>
        </div>
      )}
    </div>
  );
}
