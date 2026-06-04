'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Bot, Send, User, X, MessageSquare, Phone, Shield, Zap, Plus, ChevronDown, Calendar, Mail, BarChart3, Sparkles, Users, List } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { mockCustomers, getCustomerById } from '@/data/mock-customers';

// Types
interface MentionedCustomer {
  customerId: string;
  customerName: string;
}

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

interface CustomerContext {
  id: string;
  name: string;
  segment: string;
  microSegment: string;
  totalBalance: number;
  churnRiskScore: number;
  creditRiskScore: number;
  complaintStatus: string;
  opportunityScore: number;
  digitalScore: number;
  engagementScore: number;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Storage keys
const STORAGE_KEY = 'rm_copilot_conversations_v2';
const SELECTED_CUSTOMER_KEY = 'rm_copilot_selected_customer_v2';

function AssistantPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerContext | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [mentionedCustomers, setMentionedCustomers] = useState<MentionedCustomer[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  
  const { language } = useLanguage();
  const isVi = language === 'vi';

  // Load selected customer from storage or URL
  useEffect(() => {
    const customerIdFromUrl = searchParams.get('customerId');
    
    if (customerIdFromUrl) {
      const customer = getCustomerById(customerIdFromUrl);
      if (customer) {
        const customerContext: CustomerContext = {
          id: customer.id,
          name: customer.name,
          segment: customer.segment || 'Individual',
          microSegment: customer.microSegment || '',
          totalBalance: customer.averageBalance || 0,
          churnRiskScore: customer.churnRiskScore || 30,
          creditRiskScore: customer.creditRiskScore || 30,
          complaintStatus: customer.complaintStatus || 'Resolved',
          opportunityScore: customer.opportunityScore || 50,
          digitalScore: customer.digitalAdoptionScore || 50,
          engagementScore: 60,
        };
        setSelectedCustomer(customerContext);
        localStorage.setItem(SELECTED_CUSTOMER_KEY, customerIdFromUrl);
      }
    } else {
      // Try to load from storage
      const savedCustomerId = localStorage.getItem(SELECTED_CUSTOMER_KEY);
      if (savedCustomerId) {
        const customer = getCustomerById(savedCustomerId);
        if (customer) {
          const customerContext: CustomerContext = {
            id: customer.id,
            name: customer.name,
            segment: customer.segment || 'Individual',
            microSegment: customer.microSegment || '',
            totalBalance: customer.averageBalance || 0,
            churnRiskScore: customer.churnRiskScore || 30,
            creditRiskScore: customer.creditRiskScore || 30,
            complaintStatus: customer.complaintStatus || 'Resolved',
            opportunityScore: customer.opportunityScore || 50,
            digitalScore: customer.digitalAdoptionScore || 50,
            engagementScore: 60,
          };
          setSelectedCustomer(customerContext);
        }
      }
    }
  }, [searchParams]);

  // Load conversation history from global storage
  useEffect(() => {
    // Try to load from global storage first
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    if (savedConversations) {
      const conversations = JSON.parse(savedConversations);
      const globalConversation = conversations['__global__'];
      if (globalConversation && globalConversation.messages && globalConversation.messages.length > 0) {
        setConversationId(globalConversation.id);
        setMessages(globalConversation.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
        
        // Extract mentioned customers from loaded messages
        const mentioned: MentionedCustomer[] = [];
        globalConversation.messages.forEach((m: any) => {
          if (m.customerId && m.customerName) {
            if (!mentioned.find(c => c.customerId === m.customerId)) {
              mentioned.push({ customerId: m.customerId, customerName: m.customerName });
            }
          }
        });
        setMentionedCustomers(mentioned);
        return;
      }
    }
    
    // Welcome message when no history
    const welcomeMsg = isVi
      ? `Xin chào! 👋

Tôi là **RM Copilot** - Trợ lý AI của OceanBank.

Tôi có thể giúp bạn:

• **Tóm tắt** - Thông tin tổng quan khách hàng
• **Hành động** - Gợi ý bước tiếp theo  
• **Sản phẩm** - Cross-sell & upsell
• **Rủi ro** - Credit & churn risk
• **Kịch bản** - Script gọi/email
• **Task** - Tạo công việc follow-up

${selectedCustomer ? `📌 **Đang phân tích:** ${selectedCustomer.name}\n\n` : ''}Nhắn "danh sách khách" hoặc chọn khách hàng để bắt đầu!`
      : `Hello! 👋

I'm **RM Copilot** - OceanBank's AI assistant.

I can help you with:

• **Brief** - Customer overview
• **Action** - Next best action
• **Products** - Cross-sell & upsell
• **Risk** - Credit & churn risk
• **Script** - Call/email scripts
• **Task** - Create follow-up tasks

${selectedCustomer ? `📌 **Analyzing:** ${selectedCustomer.name}\n\n` : ''}Say "customer list" or select a customer to start!`;

    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date(),
    }]);
  }, [selectedCustomer, isVi]);

  // Save ALL conversation messages to storage (global, not per-customer)
  const saveConversation = useCallback((msgs: Message[], convId: string) => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    const conversations = savedConversations ? JSON.parse(savedConversations) : {};
    
    // Save the global conversation (includes all customers)
    conversations['__global__'] = {
      id: convId,
      messages: msgs.map(m => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
      })),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close selector on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowCustomerSelector(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const currentConversationId = conversationId || `conv_${generateId()}`;
    setConversationId(currentConversationId);
    setInput('');
    setLoading(true);

    try {
      // Build history with customer context
      const historyWithContext = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
        customerId: m.customerId,
        customerName: m.customerName
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          customerId: selectedCustomer?.id,
          conversationId: currentConversationId,
          language,
          history: historyWithContext
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
        // Save ALL messages to global storage
        saveConversation(newMessages, currentConversationId);
        return newMessages;
      });

      // Update mentioned customers from API response
      if (data.conversationContext?.mentionedCustomers) {
        setMentionedCustomers(data.conversationContext.mentionedCustomers);
      }

      // ALWAYS update selected customer when a NEW customer is detected from the message
      // This allows switching between customers mid-conversation
      if (data.customerId && data.customerName) {
        const customer = getCustomerById(data.customerId);
        if (customer) {
          const customerContext: CustomerContext = {
            id: customer.id,
            name: customer.name,
            segment: customer.segment || 'Individual',
            microSegment: customer.microSegment || '',
            totalBalance: customer.averageBalance || 0,
            churnRiskScore: customer.churnRiskScore || 30,
            creditRiskScore: customer.creditRiskScore || 30,
            complaintStatus: customer.complaintStatus || 'Resolved',
            opportunityScore: customer.opportunityScore || 50,
            digitalScore: customer.digitalAdoptionScore || 50,
            engagementScore: 60,
          };
          setSelectedCustomer(customerContext);
          localStorage.setItem(SELECTED_CUSTOMER_KEY, data.customerId);
          
          // Add to mentioned customers list
          setMentionedCustomers(prev => {
            if (prev.find(c => c.customerId === data.customerId)) return prev;
            return [...prev, { customerId: data.customerId, customerName: data.customerName }];
          });
        }
      }
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
    { id: 'list_customers', icon: List, label: isVi ? 'DS Khách' : 'List', query: 'danh sách khách hàng' },
    { id: 'customer_brief', icon: MessageSquare, label: isVi ? 'Tóm tắt' : 'Brief', query: 'tóm tắt khách hàng này' },
    { id: 'next_best_action', icon: Zap, label: isVi ? 'Hành động' : 'Action', query: 'hành động tiếp theo cho khách này' },
    { id: 'product_recommendation', icon: Sparkles, label: isVi ? 'Sản phẩm' : 'Products', query: 'gợi ý sản phẩm cho khách này' },
    { id: 'risk_analysis', icon: Shield, label: isVi ? 'Rủi ro' : 'Risk', query: 'phân tích rủi ro khách này' },
    { id: 'call_script', icon: Phone, label: isVi ? 'Kịch bản' : 'Script', query: 'tạo kịch bản gọi cho khách này' },
    { id: 'email_template', icon: Mail, label: isVi ? 'Email' : 'Email', query: 'viết mẫu email cho khách này' },
    { id: 'create_task', icon: Calendar, label: isVi ? 'Task' : 'Task', query: 'tạo task follow-up cho khách này' },
    { id: 'churn_risk', icon: BarChart3, label: isVi ? 'Churn' : 'Churn', query: 'phân tích churn risk khách này' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.query);
    setTimeout(() => handleSend(), 100);
  };

  // Select customer - NOT clearing conversation, just switch context
  const handleSelectCustomer = (customerId: string) => {
    const customer = getCustomerById(customerId);
    if (customer) {
      const customerContext: CustomerContext = {
        id: customer.id,
        name: customer.name,
        segment: customer.segment || 'Individual',
        microSegment: customer.microSegment || '',
        totalBalance: customer.averageBalance || 0,
        churnRiskScore: customer.churnRiskScore || 30,
        creditRiskScore: customer.creditRiskScore || 30,
        complaintStatus: customer.complaintStatus || 'Resolved',
        opportunityScore: customer.opportunityScore || 50,
        digitalScore: customer.digitalAdoptionScore || 50,
        engagementScore: 60,
      };
      setSelectedCustomer(customerContext);
      localStorage.setItem(SELECTED_CUSTOMER_KEY, customerId);
      setShowCustomerSelector(false);

      // Add customer to mentioned customers list
      setMentionedCustomers(prev => {
        const exists = prev.find(c => c.customerId === customerId);
        if (exists) return prev;
        return [...prev, { customerId, customerName: customer.name }];
      });

      // Add a brief system message about the switch
      const switchMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: isVi
          ? `🔄 Đã chuyển sang phân tích: **${customer.name}**\n\nBạn có thể hỏi tôi về khách hàng này!`
          : `🔄 Switched to: **${customer.name}**\n\nYou can ask me about this customer!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, switchMessage]);

      // Clear URL params
      router.push('/assistant', { scroll: false });
    }
  };

  // Clear chat - resets everything
  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SELECTED_CUSTOMER_KEY);
    setSelectedCustomer(null);
    setMentionedCustomers([]);
    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: isVi 
        ? `Xin chào! 👋

Tôi là **RM Copilot** - Trợ lý AI của OceanBank.

Tôi có thể giúp bạn:

• **Tóm tắt** - Thông tin tổng quan khách hàng
• **Hành động** - Gợi ý bước tiếp theo
• **Sản phẩm** - Cross-sell & upsell
• **Rủi ro** - Credit & churn risk
• **Kịch bản** - Script gọi/email
• **Task** - Tạo công việc follow-up

Nhắn "danh sách khách" hoặc chọn khách hàng để bắt đầu!`
        : `Hello! 👋

I'm **RM Copilot** - OceanBank's AI assistant.

I can help you with:

• **Brief** - Customer overview
• **Action** - Next best action
• **Products** - Cross-sell & upsell
• **Risk** - Credit & churn risk
• **Script** - Call/email scripts
• **Task** - Create follow-up tasks

Say "customer list" or select a customer to start!`,
      timestamp: new Date(),
    }]);
    setConversationId('');
  };

  // Format balance
  const formatBalance = (amount: number) => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
    return amount.toLocaleString();
  };

  // Get risk color
  const getRiskColor = (score: number) => {
    if (score > 60) return 'text-red-500';
    if (score > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

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
                {isVi ? 'Trợ lý AI thông minh' : 'Smart AI Assistant'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Customer Selector */}
            <div className="relative" ref={selectorRef}>
              <button
                onClick={() => setShowCustomerSelector(!showCustomerSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {selectedCustomer ? (
                  <>
                    <User className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {selectedCustomer.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {isVi ? 'Chọn khách hàng' : 'Select Customer'}
                    </span>
                  </>
                )}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              
              {/* Dropdown */}
              {showCustomerSelector && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder={isVi ? 'Tìm khách hàng...' : 'Search customer...'}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700">
                    {mockCustomers.slice(0, 20).map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => handleSelectCustomer(customer.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          selectedCustomer?.id === customer.id ? 'bg-sky-50 dark:bg-sky-900/30' : ''
                        }`}
                      >
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.segment} • {customer.microSegment}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {selectedCustomer && (
              <button
                onClick={clearChat}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-3 py-2"
              >
                {isVi ? 'Xóa' : 'Clear'}
              </button>
            )}
          </div>
        </div>
        
        {/* Customer Context Card */}
        {/* Customer Context Card - Shows all customers in conversation */}
        {(selectedCustomer || mentionedCustomers.length > 0) && (
          <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              
              {/* Currently Selected Customer */}
              {selectedCustomer && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {selectedCustomer.name}
                    </span>
                    <span className="text-xs text-emerald-500">✓ Active</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase">{isVi ? 'Phân khúc' : 'Segment'}</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedCustomer.segment}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Opportunity</p>
                    <p className="text-sm font-semibold text-sky-600">{selectedCustomer.opportunityScore}/100</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500">{isVi ? 'Số dư' : 'Balance'}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatBalance(selectedCustomer.totalBalance)} VND
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Churn</p>
                    <p className={`text-sm font-semibold ${getRiskColor(selectedCustomer.churnRiskScore)}`}>
                      {selectedCustomer.churnRiskScore}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Credit</p>
                    <p className={`text-sm font-semibold ${getRiskColor(selectedCustomer.creditRiskScore)}`}>
                      {selectedCustomer.creditRiskScore}
                    </p>
                  </div>
                  
                  {selectedCustomer.complaintStatus === 'Open' && (
                    <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        ⚠️ Complaint
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Other Mentioned Customers in this conversation */}
            {mentionedCustomers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {isVi ? 'Khách hàng đã hỏi trong cuộc trò chuyện:' : 'Customers mentioned in this conversation:'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentionedCustomers
                    .filter(c => c.customerId !== selectedCustomer?.id)
                    .map((customer) => (
                      <button
                        key={customer.customerId}
                        onClick={() => {
                          const c = getCustomerById(customer.customerId);
                          if (c) {
                            setSelectedCustomer({
                              id: c.id,
                              name: c.name,
                              segment: c.segment || 'Individual',
                              microSegment: c.microSegment || '',
                              totalBalance: c.averageBalance || 0,
                              churnRiskScore: c.churnRiskScore || 30,
                              creditRiskScore: c.creditRiskScore || 30,
                              complaintStatus: c.complaintStatus || 'Resolved',
                              opportunityScore: c.opportunityScore || 50,
                              digitalScore: c.digitalAdoptionScore || 50,
                              engagementScore: 60,
                            });
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
                      >
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {customer.customerName}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar */}
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            {/* Message */}
            <div className={`max-w-[75%] ${message.role === 'user' ? 'order-1' : ''}`}>
              {/* Intent tag */}
              {message.intentLabel && message.role === 'assistant' && (
                <div className="inline-block px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 rounded text-xs text-sky-600 dark:text-sky-400 mb-1">
                  {message.intentLabel}
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
              
              {/* Suggested Actions */}
              {message.suggestedActions && message.suggestedActions.length > 0 && message.role === 'assistant' && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestedActions.slice(0, 6).map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Check if it's a quick action with customer ID (quick_brief_cus_xxx)
                        if (action.action.startsWith('quick_brief_')) {
                          const customerId = action.action.replace('quick_brief_', '');
                          const customer = getCustomerById(customerId);
                          if (customer) {
                            const customerContext: CustomerContext = {
                              id: customer.id,
                              name: customer.name,
                              segment: customer.segment || 'Individual',
                              microSegment: customer.microSegment || '',
                              totalBalance: customer.averageBalance || 0,
                              churnRiskScore: customer.churnRiskScore || 30,
                              creditRiskScore: customer.creditRiskScore || 30,
                              complaintStatus: customer.complaintStatus || 'Resolved',
                              opportunityScore: customer.opportunityScore || 50,
                              digitalScore: customer.digitalAdoptionScore || 50,
                              engagementScore: 60,
                            };
                            setSelectedCustomer(customerContext);
                            localStorage.setItem(SELECTED_CUSTOMER_KEY, customerId);
                            // Add to mentioned customers
                            setMentionedCustomers(prev => {
                              if (prev.find(c => c.customerId === customerId)) return prev;
                              return [...prev, { customerId, customerName: customer.name }];
                            });
                            // Send message with the customer context
                            setInput(isVi ? `tóm tắt ${customer.name}` : `summarize ${customer.name}`);
                            setTimeout(() => handleSend(), 100);
                          }
                        } else {
                          setInput(action.label);
                          inputRef.current?.focus();
                        }
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Timestamp */}
              <div className={`text-xs text-slate-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'} px-1`}>
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
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs whitespace-nowrap hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700 disabled:opacity-50 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-sky-500" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedCustomer 
              ? (isVi ? 'Nhắn tin hỏi về khách hàng này...' : 'Ask about this customer...')
              : (isVi ? 'Chọn khách hàng hoặc nhắn tên...' : 'Select customer or type name...')
            }
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
        
        {/* Hint */}
        <div className="max-w-4xl mx-auto mt-2">
          <p className="text-xs text-slate-400 text-center">
            💡 {isVi 
              ? 'Tự động nhận diện khách hàng từ tên. VD: "Tóm tắt Tran Thi B"'
              : 'Auto-detect customer from name. E.g.: "Summarize Tran Thi B"'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    }>
      <AssistantPageContent />
    </Suspense>
  );
}
