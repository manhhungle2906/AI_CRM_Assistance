'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LanguageProvider } from '@/lib/language-context';
import { ThemeProvider } from '@/lib/theme-context';
import { FloatingChatProvider } from '@/lib/floating-chat-context';
import { FloatingChat } from '@/components/floating-chat/FloatingChat';
import { useFloatingChat } from '@/lib/floating-chat-context';

function FloatingChatWrapper() {
  const { isOpen, closeChat, toggleChat } = useFloatingChat();
  
  return (
    <FloatingChat
      isOpen={isOpen}
      onToggle={toggleChat}
      onClose={closeChat}
    />
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FloatingChatProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <Sidebar />
            <div className="lg:pl-64">
              <Topbar />
              <main className="p-4 lg:p-6">
                {children}
              </main>
            </div>
          </div>
          <FloatingChatWrapper />
        </FloatingChatProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
