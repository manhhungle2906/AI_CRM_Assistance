'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';
import {
  LayoutDashboard,
  Users,
  Target,
  Sparkles,
  Bot,
  RefreshCw,
  AlertTriangle,
  Layers,
  Megaphone,
  BarChart3,
  CheckSquare,
  FileText,
  Settings,
  X,
  Menu,
  Brain,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, t } = useLanguage();

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav.customer360'), href: '/customer-360', icon: Users },
    { name: t('nav.leads'), href: '/leads', icon: Target },
    { name: t('nav.salesAI'), href: '/sales-ai', icon: Sparkles },
    { name: t('nav.automation'), href: '/automation', icon: RefreshCw },
    { name: t('nav.assistant'), href: '/assistant', icon: Bot },
    { name: t('nav.retention'), href: '/retention', icon: RefreshCw },
    { name: t('nav.riskCenter'), href: '/risk-center', icon: AlertTriangle },
    { name: t('nav.omnichannel'), href: '/omnichannel', icon: Layers },
    { name: t('nav.campaigns'), href: '/campaigns', icon: Megaphone },
    { name: t('nav.rmPerformance'), href: '/rm-performance', icon: BarChart3 },
    { name: t('nav.tasks'), href: '/tasks', icon: CheckSquare },
    { name: t('nav.reports'), href: '/reports', icon: FileText },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-slate-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 to-slate-800 w-64 transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">OceanBank</h1>
              <p className="text-xs text-slate-400">AI CRM Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-sky-400' : 'text-slate-400')} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer - RM Profile */}
          <div className="px-3 py-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <span className="text-sm font-semibold text-white">NV</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Nguyen Van A</p>
                <p className="text-xs text-slate-400 truncate">Relationship Manager</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-3">
              Powered by AI Assistant
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
