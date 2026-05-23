'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface FloatingChatContextType {
  isOpen: boolean;
  openChat: (context?: { customerName?: string; customerId?: string; pageType?: string }) => void;
  closeChat: () => void;
  toggleChat: () => void;
  contextInfo: {
    customerName?: string;
    customerId?: string;
    pageType?: string;
  } | null;
}

const FloatingChatContext = createContext<FloatingChatContextType | undefined>(undefined);

export function FloatingChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contextInfo, setContextInfo] = useState<{
    customerName?: string;
    customerId?: string;
    pageType?: string;
  } | null>(null);

  const openChat = useCallback((context?: { customerName?: string; customerId?: string; pageType?: string }) => {
    if (context) {
      setContextInfo(context);
    }
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <FloatingChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, contextInfo }}>
      {children}
    </FloatingChatContext.Provider>
  );
}

export function useFloatingChat() {
  const context = useContext(FloatingChatContext);
  if (context === undefined) {
    throw new Error('useFloatingChat must be used within a FloatingChatProvider');
  }
  return context;
}
