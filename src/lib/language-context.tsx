// ============================================
// Language Context Provider
// ============================================
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'vi' | 'en';

type TranslationKey = string;

type TranslationMap = Record<Language, Record<TranslationKey, string>>;

const translations: TranslationMap = {
  vi: {
    // General
    'app.name': 'OceanBank AI CRM Assistant',
    'app.welcome': 'Chào mừng bạn!',
    'app.loading': 'Đang tải...',
    'app.save': 'Lưu',
    'app.cancel': 'Hủy',
    'app.search': 'Tìm kiếm',
    'app.filter': 'Lọc',
    'app.export': 'Xuất',
    'app.refresh': 'Làm mới',
    'app.delete': 'Xóa',
    'app.edit': 'Sửa',
    'app.view': 'Xem',
    'app.add': 'Thêm',
    'app.close': 'Đóng',
    'app.confirm': 'Xác nhận',
    'app.success': 'Thành công',
    'app.error': 'Lỗi',
    'app.warning': 'Cảnh báo',
    'app.info': 'Thông tin',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.customer360': 'Khách hàng 360',
    'nav.leads': 'Leads',
    'nav.salesAI': 'Bán hàng AI',
    'nav.automation': 'Tự động hóa',
    'nav.assistant': 'AI Assistant',
    'nav.retention': 'Giữ chân',
    'nav.riskCenter': 'Rủi ro',
    'nav.omnichannel': 'Đa kênh',
    'nav.campaigns': 'Chiến dịch',
    'nav.rmPerformance': 'Hiệu suất RM',
    'nav.tasks': 'Công việc',
    'nav.reports': 'Báo cáo',
    'nav.settings': 'Cài đặt',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalCustomers': 'Tổng khách hàng',
    'dashboard.aiLeads': 'Lead từ AI',
    'dashboard.highPriority': 'Ưu tiên cao',
    'dashboard.crossSell': 'Cross-sell',
    'dashboard.upsell': 'Upsell',
    'dashboard.retentionAlerts': 'Cảnh báo giữ chân',
    'dashboard.riskAlerts': 'Cảnh báo rủi ro',
    'dashboard.overdueTasks': 'Công việc quá hạn',
    'dashboard.dailyBriefing': 'Tin tức hàng ngày',
    'dashboard.todayTasks': 'Công việc hôm nay',
    'dashboard.hotLeads': 'Hot Leads',
    'dashboard.priorityCustomers': 'Khách hàng ưu tiên',

    // Customer
    'customer.profile': 'Hồ sơ',
    'customer.products': 'Sản phẩm',
    'customer.transactions': 'Giao dịch',
    'customer.interactions': 'Tương tác',
    'customer.documents': 'Tài liệu',
    'customer.recommendations': 'Gợi ý',
    'customer.risk': 'Rủi ro',
    'customer.tasks': 'Công việc',
    'customer.segment': 'Phân khúc',
    'customer.microSegment': 'Micro-phân khúc',
    'customer.balance': 'Số dư',
    'customer.lastContact': 'Liên hệ cuối',

    // AI Assistant
    'assistant.title': 'AI Assistant',
    'assistant.quickActions': 'Hành động nhanh',
    'assistant.summarize': 'Tóm tắt KH',
    'assistant.nextAction': 'Hành động tiếp',
    'assistant.productOffer': 'Gợi ý sản phẩm',
    'assistant.callScript': 'Kịch bản gọi',
    'assistant.emailScript': 'Kịch bản email',
    'assistant.creditRisk': 'Rủi ro tín dụng',
    'assistant.churnRisk': 'Rủi ro mất khách',
    'assistant.createTask': 'Tạo công việc',
    'assistant.placeholder': 'Hỏi tôi về khách hàng, sản phẩm...',
    'assistant.rmDecision': 'AI là công cụ hỗ trợ. Quyết định cuối cùng thuộc về RM.',

    // Settings
    'settings.title': 'Cài đặt',
    'settings.aiMode': 'Chế độ AI',
    'settings.mockMode': 'Mock Mode',
    'settings.openaiMode': 'OpenAI Mode',
    'settings.apiKey': 'API Key',
    'settings.language': 'Ngôn ngữ',
    'settings.theme': 'Giao diện',
    'settings.notifications': 'Thông báo',
    'settings.about': 'Giới thiệu',

    // Lead Scoring
    'lead.score': 'Điểm lead',
    'lead.hot': 'Hot',
    'lead.warm': 'Warm',
    'lead.cold': 'Cold',
    'lead.disqualified': 'Không đạt',

    // Actions
    'action.call': 'Gọi điện',
    'action.email': 'Email',
    'action.meeting': 'Gặp mặt',
    'action.followup': 'Theo dõi',
    'action.renewal': 'Tái tục',

    // Risk
    'risk.low': 'Thấp',
    'risk.medium': 'Trung bình',
    'risk.high': 'Cao',

    // Status
    'status.pending': 'Đang chờ',
    'status.inProgress': 'Đang xử lý',
    'status.done': 'Hoàn thành',
    'status.overdue': 'Quá hạn',
  },
  en: {
    // General
    'app.name': 'OceanBank AI CRM Assistant',
    'app.welcome': 'Welcome!',
    'app.loading': 'Loading...',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.search': 'Search',
    'app.filter': 'Filter',
    'app.export': 'Export',
    'app.refresh': 'Refresh',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.view': 'View',
    'app.add': 'Add',
    'app.close': 'Close',
    'app.confirm': 'Confirm',
    'app.success': 'Success',
    'app.error': 'Error',
    'app.warning': 'Warning',
    'app.info': 'Information',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.customer360': 'Customer 360',
    'nav.leads': 'Leads',
    'nav.salesAI': 'Sales AI',
    'nav.automation': 'Automation',
    'nav.assistant': 'AI Assistant',
    'nav.retention': 'Retention',
    'nav.riskCenter': 'Risk Center',
    'nav.omnichannel': 'Omnichannel',
    'nav.campaigns': 'Campaigns',
    'nav.rmPerformance': 'RM Performance',
    'nav.tasks': 'Tasks',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalCustomers': 'Total Customers',
    'dashboard.aiLeads': 'AI Leads',
    'dashboard.highPriority': 'High Priority',
    'dashboard.crossSell': 'Cross-sell',
    'dashboard.upsell': 'Upsell',
    'dashboard.retentionAlerts': 'Retention Alerts',
    'dashboard.riskAlerts': 'Risk Alerts',
    'dashboard.overdueTasks': 'Overdue Tasks',
    'dashboard.dailyBriefing': 'Daily Briefing',
    'dashboard.todayTasks': "Today's Tasks",
    'dashboard.hotLeads': 'Hot Leads',
    'dashboard.priorityCustomers': 'Priority Customers',

    // Customer
    'customer.profile': 'Profile',
    'customer.products': 'Products',
    'customer.transactions': 'Transactions',
    'customer.interactions': 'Interactions',
    'customer.documents': 'Documents',
    'customer.recommendations': 'Recommendations',
    'customer.risk': 'Risk',
    'customer.tasks': 'Tasks',
    'customer.segment': 'Segment',
    'customer.microSegment': 'Micro-segment',
    'customer.balance': 'Balance',
    'customer.lastContact': 'Last Contact',

    // AI Assistant
    'assistant.title': 'AI Assistant',
    'assistant.quickActions': 'Quick Actions',
    'assistant.summarize': 'Summarize Customer',
    'assistant.nextAction': 'Next Best Action',
    'assistant.productOffer': 'Product Offer',
    'assistant.callScript': 'Call Script',
    'assistant.emailScript': 'Email Script',
    'assistant.creditRisk': 'Credit Risk',
    'assistant.churnRisk': 'Churn Risk',
    'assistant.createTask': 'Create Task',
    'assistant.placeholder': 'Ask me about customers, products...',
    'assistant.rmDecision': 'AI is a support tool. Final decisions are made by RM.',

    // Settings
    'settings.title': 'Settings',
    'settings.aiMode': 'AI Mode',
    'settings.mockMode': 'Mock Mode',
    'settings.openaiMode': 'OpenAI Mode',
    'settings.apiKey': 'API Key',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.about': 'About',

    // Lead Scoring
    'lead.score': 'Lead Score',
    'lead.hot': 'Hot',
    'lead.warm': 'Warm',
    'lead.cold': 'Cold',
    'lead.disqualified': 'Disqualified',

    // Actions
    'action.call': 'Call',
    'action.email': 'Email',
    'action.meeting': 'Meeting',
    'action.followup': 'Follow-up',
    'action.renewal': 'Renewal',

    // Risk
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',

    // Status
    'status.pending': 'Pending',
    'status.inProgress': 'In Progress',
    'status.done': 'Done',
    'status.overdue': 'Overdue',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    // Load language from localStorage or default
    const savedSettings = localStorage.getItem('crm_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) {
        setLanguageState(parsed.language);
        return;
      }
    }
    // Fallback to environment variable
    const envLang = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;
    if (envLang === 'en' || envLang === 'vi') {
      setLanguageState(envLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Save to localStorage
    const savedSettings = localStorage.getItem('crm_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.language = lang;
    localStorage.setItem('crm_settings', JSON.stringify(settings));
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
