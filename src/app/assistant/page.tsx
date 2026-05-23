'use client';

import { useEffect, useState, useRef } from 'react';
import { Bot, Send, User, Sparkles, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { mockCustomers } from '@/data/mock-customers';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  detectedCustomer?: { id: string; name: string };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedCustomer, setDetectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const isVietnamese = language === 'vi';

  useEffect(() => {
    const welcomeMsg = isVietnamese
      ? `Xin chào! 👋

Tôi là **RM Copilot** - Trợ lý AI của OceanBank.

Bạn chỉ cần nhắn tin hỏi về khách hàng, tôi sẽ tự nhận diện!

Ví dụ:
• "Tóm tắt khách hàng Tran Thi B"
• "Phân tích rủi ro Bui Thi K"
• "Gợi ý sản phẩm cho Blue Ocean Logistics"

Hoặc hỏi chung:
• "Tóm tắt khách hàng này"
• "Gợi ý hành động tiếp theo"
• "Tạo kịch bản gọi"`

      : `Hello! 👋

I'm **RM Copilot** - OceanBank's AI assistant.

Just chat about customers, I'll automatically detect!

Examples:
• "Summarize customer Tran Thi B"
• "Analyze risk for Bui Thi K"
• "Suggest products for Blue Ocean Logistics"

Or ask generally:
• "Summarize this customer"
• "Suggest next action"
• "Generate call script"`;

    setMessages([{
      id: '1',
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date(),
    }]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      if (data.error && !data.detectedCustomer && !detectedCustomer) {
        // No customer detected - ask user
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: isVietnamese
            ? `Tôi chưa nhận diện được khách hàng. Bạn vui lòng nhập tên khách hàng cụ thể nhé!\n\nVí dụ: "Tóm tắt khách hàng Tran Thi B"`
            : `I couldn't detect a customer. Please mention a specific customer name!\n\nExample: "Summarize customer Tran Thi B"`,
          timestamp: new Date(),
        }]);
        setLoading(false);
        return;
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message || (isVietnamese ? 'Xin lỗi, tôi không thể xử lý.' : 'Sorry, I cannot process this.'),
        timestamp: new Date(),
        intent: data.intent,
        detectedCustomer: data.detectedCustomer,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.detectedCustomer) {
        setDetectedCustomer(data.detectedCustomer);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: isVietnamese ? 'Đã xảy ra lỗi. Vui lòng thử lại.' : 'An error occurred. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setDetectedCustomer(null);
    const welcomeMsg = isVietnamese
      ? `Đã xóa cuộc trò chuyện! Bắt đầu mới thôi. 👋`
      : `Chat cleared! Starting fresh. 👋`;

    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date(),
    }]);
  };

  // Quick suggestion chips
  const suggestions = isVietnamese
    ? [
        'Tóm tắt khách hàng Tran Thi B',
        'Phân tích rủi ro Bui Thi K',
        'Gợi ý sản phẩm cho SME',
        'Tạo kịch bản gọi cho khách VIP',
      ]
    : [
        'Summarize customer Tran Thi B',
        'Analyze risk for Bui Thi K',
        'Suggest products for SME',
        'Generate call script for VIP customer',
      ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">RM Copilot</h1>
              <p className="text-sm text-slate-500">
                {isVietnamese ? 'Trợ lý AI thông minh' : 'Smart AI Assistant'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {detectedCustomer && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {detectedCustomer.name}
                </span>
                <button
                  onClick={() => setDetectedCustomer(null)}
                  className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            )}
            <button
              onClick={clearChat}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {isVietnamese ? 'Xóa' : 'Clear'}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages - Messenger Style */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar for assistant */}
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            {/* Message Bubble */}
            <div className={`max-w-[75%] ${message.role === 'user' ? 'order-1' : ''}`}>
              {/* Customer tag */}
              {message.detectedCustomer && (
                <div className="flex items-center gap-1 mb-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <User className="w-3 h-3" />
                  <span>{message.detectedCustomer.name}</span>
                </div>
              )}
              
              {/* Intent tag */}
              {message.intent && (
                <div className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs text-slate-500 mb-1">
                  {message.intent.replace(/_/g, ' ')}
                </div>
              )}
              
              {/* Bubble */}
              <div className={`rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed text-sm ${
                message.role === 'user'
                  ? 'bg-sky-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md shadow-sm border border-slate-200 dark:border-slate-700'
              }`}>
                {message.content}
              </div>
              
              {/* Timestamp */}
              <div className={`text-xs text-slate-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'} px-1`}>
                {message.timestamp.toLocaleTimeString(isVietnamese ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {/* Avatar for user */}
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {isVietnamese ? 'B' : 'Y'}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md shadow-sm border border-slate-200 dark:border-slate-700 px-4 py-3">
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

      {/* Suggestions - Only show when no messages or just welcome */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-400 mb-2">{isVietnamese ? 'Gợi ý:' : 'Suggestions:'}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder={isVietnamese ? 'Nhắn tin hỏi về khách hàng...' : 'Ask about any customer...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Customer list hint */}
        <div className="max-w-4xl mx-auto mt-2">
          <p className="text-xs text-slate-400 text-center">
            💡 {isVietnamese 
              ? 'Tự động nhận diện khách hàng từ tên trong câu hỏi. VD: "Tóm tắt Tran Thi B"'
              : 'Auto-detect customer from name. E.g.: "Summarize Tran Thi B"'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
