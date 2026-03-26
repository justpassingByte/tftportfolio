'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileEdit,
  Layout,
  Image,
  Star,
  MessageSquare,
  Settings,
  Eye,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { id: 'edit', label: 'Edit Page', icon: FileEdit },
  { id: 'layout', label: 'Layout', icon: Layout },
  { id: 'proof', label: 'Proof', icon: Image },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'leads', label: 'Leads', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  username?: string;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  username,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-bold text-white truncate">Page Builder</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft
            className={cn(
              'w-5 h-5 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === item.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Preview link */}
      <div className="p-3 border-t border-slate-800">
        {username ? (
          <Link href={`/u/${username}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800',
                collapsed ? 'px-2' : ''
              )}
            >
              <Eye className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="ml-2">Preview Page</span>}
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className={cn('w-full border-slate-700 text-slate-500', collapsed ? 'px-2' : '')}
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="ml-2">Preview Page</span>}
          </Button>
        )}
      </div>
    </aside>
  );
}
