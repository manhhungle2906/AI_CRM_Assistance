'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LanguageProvider } from '@/lib/language-context';
import { ThemeProvider } from '@/lib/theme-context';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
          <Sidebar />
          <div className="lg:pl-64">
            <Topbar />
            <main className="p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
