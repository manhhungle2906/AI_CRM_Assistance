'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Bot, Send, X, Minimize2, MessageSquare, Phone, Shield, Zap, Calendar, Mail, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  intentLabel?: string;
  customerId?: string;
  customerName?: string;
  suggestedActions?: Array<{ label: string; action: string }>;
}

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

// Storage keys
const STORAGE_KEY = 'rm_copilot_floating_conversations';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function FloatingChat({ isOpen, onToggle, onClose }: FloatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const isVi = language === 'vi';

  // Load conversation from storage
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setConversationId(data.id);
        setMessages(data.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
        return;
      }
      
      // Welcome message
      const welcomeMsg = isVi
        ? `Xin chào! 👋

Tôi là **RM Copilot** - Trợ lý AI của OceanBank.

Chỉ cần nhắn tin hỏi về khách hàng, tôi sẽ tự nhận diện!

Ví dụ:
• "tóm tắt khách này"
• "khách này nên bán gì"
• "phân tích rủi ro"`
        : `Hello! 👋

I'm **RM Copilot** - OceanBank's AI assistant.

Just chat about customers, I'll auto-detect!

Examples:
• "summarize this customer"
• "what to sell this customer"
• "analyze risk"`;

      setMessages([{
        id: generateId(),
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, isVi, messages.length]);

  // Save conversation
  const saveConversation = useCallback((msgs: Message[], convId: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      id: convId,
      messages: msgs.map(m => ({
        ...m,
        timestamp: m.timestamp.toISOString()
      })),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentConversationId = conversationId || `fconv_${generateId()}`;
    setConversationId(currentConversationId);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationId: currentConversationId,
          language,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response || (isVi ? 'Xin lỗi, tôi không thể xử lý.' : 'Sorry, I cannot process this.'),
        timestamp: new Date(),
        intent: data.intent,
        intentLabel: data.intentLabel,
        customerId: data.customerId,
        customerName: data.customerName,
        suggestedActions: data.suggestedActions,
      };

      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        saveConversation(newMessages, currentConversationId);
        return newMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: isVi ? 'Đã xảy ra lỗi. Vui lòng thử lại.' : 'An error occurred. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // Quick actions
  const quickActions = [
    { id: 'customer_brief', icon: MessageSquare, label: isVi ? 'Tóm tắt' : 'Brief', query: 'tóm tắt khách hàng này' },
    { id: 'next_best_action', icon: Zap, label: isVi ? 'Hành động' : 'Action', query: 'hành động tiếp theo' },
    { id: 'product_recommendation', icon: Sparkles, label: isVi ? 'Sản phẩm' : 'Products', query: 'gợi ý sản phẩm' },
    { id: 'risk_analysis', icon: Shield, label: isVi ? 'Rủi ro' : 'Risk', query: 'phân tích rủi ro' },
    { id: 'call_script', icon: Phone, label: isVi ? 'Gọi' : 'Call', query: 'tạo kịch bản gọi' },
    { id: 'create_task', icon: Calendar, label: isVi ? 'Task' : 'Task', query: 'tạo task follow-up' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.query);
    setTimeout(() => handleSend(), 100);
  };

  // Clear chat
  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversationId('');
    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: isVi ? 'Đã xóa! Bắt đầu mới thôi. 👋' : 'Cleared! Starting fresh. 👋',
      timestamp: new Date(),
    }]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
        aria-label="Open RM Copilot"
      >
        <Bot className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all z-50 border border-slate-200 dark:border-slate-700 ${
        isMinimized ? 'w-14 h-14' : 'w-[380px] h-[520px] max-h-[75vh]'
      }`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          {!isMinimized && (
            <span className="font-semibold">RM Copilot</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && messages.length > 1 && (
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-sky-600 rounded-lg transition-colors text-xs"
              title={isVi ? 'Xóa chat' : 'Clear chat'}
            >
              {isVi ? 'Xóa' : 'Clear'}
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-sky-600 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-sky-600 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Avatar */}
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                {/* Message */}
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  {/* Intent tag */}
                  {message.intentLabel && message.role === 'assistant' && (
                    <div className="inline-block px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 rounded text-xs text-sky-600 dark:text-sky-400 mb-1">
                      {message.intentLabel}
                    </div>
                  )}
                  
                  {/* Bubble */}
                  <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-sky-500 text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md'
                  }`}>
                    {message.content}
                  </div>
                  
                  {/* Suggested Actions */}
                  {message.suggestedActions && message.suggestedActions.length > 0 && message.role === 'assistant' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestedActions.slice(0, 3).map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInput(action.label);
                            inputRef.current?.focus();
                          }}
                          className="px-2 py-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded text-xs text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <div className={`text-xs text-slate-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString(isVi ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {/* User Avatar */}
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {isVi ? 'B' : 'Y'}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs whitespace-nowrap hover:bg-sky-100 dark:hover:bg-sky-900/50 disabled:opacity-50 transition-colors"
                  >
                    <Icon className="w-3 h-3 text-sky-500" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={isVi ? 'Hỏi về khách hàng...' : 'Ask about customers...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
