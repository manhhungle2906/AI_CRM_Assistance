'use client';

import { useEffect, useState, useRef } from 'react';
import { Bot, Send, X, Minimize2, Sparkles, MessageSquare, Phone, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  initialCustomerId?: string;
  contextInfo?: {
    customerName?: string;
    customerId?: string;
    pageType?: string;
  };
}

export function FloatingChat({ isOpen, onToggle, onClose, initialCustomerId, contextInfo }: FloatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  // Initialize with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = language === 'vi'
        ? `Xin chào! Tôi là AI Assistant của OceanBank CRM. Tôi có thể giúp bạn về khách hàng, sản phẩm, rủi ro và nhiều hơn nữa.\n\n${contextInfo?.customerName ? `📌 **Khách hàng hiện tại:** ${contextInfo.customerName}\n\n` : ''}Hãy nhắn tin hoặc chọn Quick Action bên dưới!`
        : `Hello! I'm the OceanBank CRM AI Assistant. I can help you with customers, products, risks, and more.\n\n${contextInfo?.customerName ? `📌 **Current customer:** ${contextInfo.customerName}\n\n` : ''}Type a message or use Quick Actions below!`;
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, language, contextInfo]);

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
      // Use context customer ID or default
      const customerId = contextInfo?.customerId || initialCustomerId || 'cus_001';
      
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          action: 'chat',
          payload: { query: currentInput, language },
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'assistant',
        content: data.message || (language === 'vi' ? 'Xin lỗi, tôi không thể xử lý yêu cầu này.' : 'Sorry, I cannot process this request.'),
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'assistant',
        content: language === 'vi' ? 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.' : 'Connection error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'summarize', icon: MessageSquare, label: language === 'vi' ? 'Tóm tắt' : 'Brief', query: contextInfo?.customerName ? `Tóm tắt khách hàng ${contextInfo.customerName}` : 'Tóm tắt khách hàng' },
    { id: 'action', icon: Sparkles, label: language === 'vi' ? 'Hành động' : 'Action', query: contextInfo?.customerName ? `Gợi ý hành động cho ${contextInfo.customerName}` : 'Gợi ý hành động tiếp theo' },
    { id: 'call', icon: Phone, label: language === 'vi' ? 'Gọi' : 'Call', query: contextInfo?.customerName ? `Tạo kịch bản gọi cho ${contextInfo.customerName}` : 'Tạo kịch bản gọi điện' },
    { id: 'task', icon: CheckCircle, label: language === 'vi' ? 'Task' : 'Task', query: contextInfo?.customerName ? `Tạo task cho ${contextInfo.customerName}` : 'Tạo công việc theo dõi' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.query);
    handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all z-50 ${
        isMinimized ? 'w-14 h-14' : 'w-96 h-[500px] max-h-[70vh]'
      }`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {/* Header */}
      <div className="bg-sky-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          {!isMinimized && <span className="font-semibold">AI Assistant</span>}
        </div>
        <div className="flex items-center gap-1">
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
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Bot className="w-4 h-4 animate-pulse" />
                    <span className="text-xs">{language === 'vi' ? 'Đang xử lý...' : 'Processing...'}</span>
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
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs whitespace-nowrap hover:bg-sky-100 dark:hover:bg-sky-900 disabled:opacity-50 transition-colors"
                  >
                    <Icon className="w-3 h-3" />
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
                placeholder={language === 'vi' ? 'Nhắn tin hỏi AI...' : 'Ask AI anything...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
