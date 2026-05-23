'use client';

import { useEffect, useState, useRef } from 'react';
import { Bot, Send, X, Minimize2, MessageSquare, Phone, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  detectedCustomer?: { id: string; name: string };
}

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function FloatingChat({ isOpen, onToggle, onClose }: FloatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [detectedCustomer, setDetectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const isVi = language === 'vi';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = isVi
        ? `Xin chào! 👋

Tôi là **RM Copilot** - Trợ lý AI của OceanBank.

Chỉ cần nhắn tin hỏi về khách hàng, tôi sẽ tự nhận diện!

Ví dụ:
• "Tóm tắt Tran Thi B"
• "Kịch bản gọi Bui Thi K"
• "Phân tích rủi ro Minh An"`
        : `Hello! 👋

I'm **RM Copilot** - OceanBank's AI assistant.

Just chat about customers, I'll auto-detect!

Examples:
• "Summarize Tran Thi B"
• "Call script for Bui Thi K"
• "Analyze risk for Minh An"`;
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          payload: { query: currentInput, language },
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'assistant',
        content: data.message || (isVi ? 'Xin lỗi, tôi không thể xử lý.' : 'Sorry, I cannot process this.'),
        timestamp: new Date(),
        detectedCustomer: data.detectedCustomer,
      }]);

      if (data.detectedCustomer) {
        setDetectedCustomer(data.detectedCustomer);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'assistant',
        content: isVi ? 'Đã xảy ra lỗi. Vui lòng thử lại.' : 'An error occurred. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'brief', icon: MessageSquare, label: isVi ? 'Tóm tắt' : 'Brief', query: 'Tóm tắt khách hàng này' },
    { id: 'action', icon: Zap, label: isVi ? 'Hành động' : 'Action', query: 'Gợi ý hành động tiếp theo' },
    { id: 'call', icon: Phone, label: isVi ? 'Gọi' : 'Call', query: 'Tạo kịch bản gọi' },
    { id: 'risk', icon: Shield, label: isVi ? 'Rủi ro' : 'Risk', query: 'Phân tích rủi ro' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.query);
    setTimeout(() => handleSend(), 100);
  };

  const clearChat = () => {
    setDetectedCustomer(null);
    const welcomeMsg = isVi
      ? `Đã xóa! Bắt đầu cuộc trò chuyện mới. 👋`
      : `Cleared! Starting fresh. 👋`;

    setMessages([{
      id: `${Date.now()}`,
      role: 'assistant',
      content: welcomeMsg,
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
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          {!isMinimized && (
            <span className="font-semibold">RM Copilot</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && detectedCustomer && (
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

      {/* Detected Customer Tag */}
      {!isMinimized && detectedCustomer && (
        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <span className="font-medium">📌 {detectedCustomer.name}</span>
          </div>
        </div>
      )}

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
                
                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-sky-500 text-white rounded-br-md order-1'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md'
                }`}>
                  {/* Detected customer tag */}
                  {message.detectedCustomer && message.role === 'assistant' && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-medium">
                      📌 {message.detectedCustomer.name}
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-sky-100' : 'text-slate-400'}`}>
                    {message.timestamp.toLocaleTimeString(isVi ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {/* User avatar */}
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
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs whitespace-nowrap hover:bg-sky-100 dark:hover:bg-sky-900 disabled:opacity-50 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-sky-500" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isVi ? 'Hỏi về khách hàng...' : 'Ask about customers...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
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
