'use client';

import { useEffect, useState, useRef } from 'react';
import { Bot, Send, Sparkles, MessageSquare, FileText, Phone, Mail, Calendar, CheckCircle, User, Loader2, RefreshCw, AlertTriangle, Zap, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/lib/language-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: string;
}

interface QuickAction {
  id: string;
  labelVi: string;
  labelEn: string;
  icon: any;
  descriptionVi: string;
  descriptionEn: string;
  action: string;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('cus_001');
  const [loading, setLoading] = useState(false);
  const [aiMode, setAIMode] = useState<'mock' | 'openai'>('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const customers = [
    { id: 'cus_001', name: 'Nguyen Van A - Personal' },
    { id: 'cus_002', name: 'Tran Thi B - Retail' },
    { id: 'cus_010', name: 'Bui Thi K - Wealth' },
    { id: 'cus_012', name: 'Blue Ocean Logistics - SME' },
    { id: 'cus_013', name: 'Minh An Retail' },
    { id: 'cus_014', name: 'Lotus Food Service' },
  ];

  const quickActions: QuickAction[] = [
    { id: 'summarize_customer', labelVi: 'Tóm tắt KH', labelEn: 'Customer Brief', icon: MessageSquare, descriptionVi: 'Xem thông tin tổng quan', descriptionEn: 'View customer overview', action: 'summarize_customer' },
    { id: 'suggest_next_best_action', labelVi: 'Hành động', labelEn: 'Next Action', icon: Sparkles, descriptionVi: 'Gợi ý hành động tiếp theo', descriptionEn: 'Suggest next action', action: 'suggest_next_best_action' },
    { id: 'suggest_next_best_offer', labelVi: 'Sản phẩm', labelEn: 'Products', icon: FileText, descriptionVi: 'Gợi ý sản phẩm phù hợp', descriptionEn: 'Suggest products', action: 'suggest_next_best_offer' },
    { id: 'generate_call_script', labelVi: 'Kịch bản gọi', labelEn: 'Call Script', icon: Phone, descriptionVi: 'Tạo kịch bản gọi điện', descriptionEn: 'Generate call script', action: 'generate_call_script' },
    { id: 'generate_email_script', labelVi: 'Mẫu email', labelEn: 'Email Template', icon: Mail, descriptionVi: 'Tạo mẫu email', descriptionEn: 'Generate email', action: 'generate_email_script' },
    { id: 'explain_credit_risk', labelVi: 'Phân tích rủi ro', labelEn: 'Risk Analysis', icon: AlertTriangle, descriptionVi: 'Đánh giá rủi ro tín dụng', descriptionEn: 'Assess credit risk', action: 'explain_credit_risk' },
    { id: 'explain_churn_risk', labelVi: 'Churn Risk', labelEn: 'Churn Risk', icon: User, descriptionVi: 'Đánh giá khả năng mất KH', descriptionEn: 'Assess churn probability', action: 'explain_churn_risk' },
    { id: 'create_follow_up_task', labelVi: 'Tạo Task', labelEn: 'Create Task', icon: CheckCircle, descriptionVi: 'Tạo công việc theo dõi', descriptionEn: 'Create follow-up task', action: 'create_follow_up_task' },
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem('crm_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.aiMode) setAIMode(parsed.aiMode);
    }
    
    const welcomeMsg = language === 'vi' 
      ? `Xin chào! Tôi là AI Assistant của OceanBank CRM. 

Tôi có thể giúp bạn:
• Tóm tắt thông tin khách hàng
• Gợi ý sản phẩm và hành động tiếp theo
• Tạo kịch bản gọi điện hoặc email
• Phân tích rủi ro và khả năng churn
• Tạo công việc theo dõi

**Chọn một khách hàng** và nhắn tin hoặc sử dụng **Quick Actions** để bắt đầu!`
      : `Hello! I'm the OceanBank CRM AI Assistant.

I can help you with:
• Summarize customer information
• Suggest products and next actions
• Generate call or email scripts
• Analyze risks and churn probability
• Create follow-up tasks

**Select a customer** and start chatting or use **Quick Actions** to begin!`;

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
          customerId: selectedCustomer,
          action: 'chat',
          payload: { query: currentInput, language },
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message || (language === 'vi' ? 'Xin lỗi, tôi không thể xử lý yêu cầu này.' : 'Sorry, I cannot process this request.'),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: language === 'vi' ? 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.' : 'Connection error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    setLoading(true);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: language === 'vi' ? action.descriptionVi : action.descriptionEn,
      timestamp: new Date(),
      action: action.id,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer,
          action: action.action,
          payload: { language },
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: data.message || (language === 'vi' ? 'Không có phản hồi.' : 'No response.'),
        timestamp: new Date(),
        action: action.id,
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: language === 'vi' ? 'Đã xảy ra lỗi.' : 'An error occurred.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const welcomeMsg = language === 'vi' 
      ? `Đã xóa cuộc trò chuyện! Bạn có thể bắt đầu mới.`
      : `Chat cleared! You can start fresh.`;

    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('assistant.title')}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 text-sm">{language === 'vi' ? 'Nhận gợi ý từ AI' : 'Get AI-powered insights'}</p>
            <Badge variant={aiMode === 'openai' ? 'success' : 'warning'} className="text-xs">
              {aiMode === 'openai' ? '🤖 GPT-4' : '📋 AI'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="w-4 h-4 mr-1" />
            {language === 'vi' ? 'Xóa' : 'Clear'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Quick Actions Sidebar */}
        <Card className="w-72 flex-shrink-0 hidden lg:flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('assistant.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto flex-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-2"
                  onClick={() => handleQuickAction(action)}
                  disabled={loading}
                >
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-xs">{language === 'vi' ? action.labelVi : action.labelEn}</div>
                    <div className="text-xs text-slate-500">{language === 'vi' ? action.descriptionVi : action.descriptionEn}</div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl p-4 ${
                  message.role === 'user' 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === 'assistant' && <Bot className="w-4 h-4 text-sky-500" />}
                    <span className="text-xs opacity-70">
                      {message.role === 'assistant' ? 'AI' : (language === 'vi' ? 'Bạn' : 'You')}
                    </span>
                    {message.action && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        message.role === 'assistant' ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300' : 'bg-white/20'
                      }`}>
                        {quickActions.find(a => a.id === message.action)?.labelVi || message.action}
                      </span>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Bot className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">{language === 'vi' ? 'Đang xử lý...' : 'Processing...'}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('assistant.placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mobile Quick Actions */}
            <div className="flex gap-2 mt-3 lg:hidden overflow-x-auto pb-2">
              {quickActions.slice(0, 4).map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3" />
                    {language === 'vi' ? action.labelVi : action.labelEn}
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-slate-400 mt-2">
              💡 {t('assistant.rmDecision')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
