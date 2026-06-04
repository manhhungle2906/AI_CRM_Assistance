/**
 * Intent Detection Module for AI CRM Assistant
 * Detects user intent from natural language queries
 */

export interface IntentResult {
  intent: string;
  confidence: number;
  requiresCustomerContext: boolean;
  customerReference?: string;
  isPronounReference?: boolean;
}

// Pronouns that refer to the last mentioned customer
const PRONOUN_PATTERNS = [
  'nta', 'hắn', 'người đó', 'bạn ấy', 'anh ấy', 'chị ấy', 'ông ấy', 'bà ấy',
  'nó', 'họ', 'hắn ta', 'ng ta',
  'this one', 'that one', 'him', 'her', 'them', 'he', 'she',
  'người này', 'anh này', 'chị này'
];

// Intent definitions - ordered by priority
interface IntentConfig {
  keywords: string[];
  requiresCustomer: boolean;
}

const INTENTS: Record<string, IntentConfig> = {
  // Customer information intents - most specific first
  list_customers: {
    keywords: [
      'danh sách khách', 'liệt kê khách', 'list customer', 'xem khách', 'show customers',
      'tất cả khách', 'all customers', 'khách hàng nào', 'which customer',
      'có những ai', 'who are there', 'liệt kê', 'danh sach', 'danh sách'
    ],
    requiresCustomer: false
  },
  customer_brief: {
    keywords: [
      'tóm tắt', 'summarize', 'brief', 'thông tin', 'giới thiệu', 'profile', 'info',
      'khách hàng là ai', 'là ai', 'who is', 'who are', 'giới thiệu về'
    ],
    requiresCustomer: true
  },
  customer_detail: {
    keywords: [
      'chi tiết', 'detail', 'thông tin chi tiết', 'xem thêm', 'more info',
      'số dư', 'balance', 'tài khoản', 'account', 'liên hệ', 'contact',
      'sinh nhật', 'birthday', 'ngày sinh', 'địa chỉ', 'address', 'phone', 'điện thoại'
    ],
    requiresCustomer: true
  },
  customer_products: {
    keywords: [
      'sản phẩm đang dùng', 'đang sử dụng', 'products', 'dịch vụ', 'service',
      'tiết kiệm', 'savings', 'tín dụng', 'credit', 'thẻ', 'card',
      'vay', 'loan', 'bảo hiểm', 'insurance', 'đầu tư', 'investment'
    ],
    requiresCustomer: true
  },
  customer_interactions: {
    keywords: [
      'tương tác', 'interaction', 'lịch sử', 'history', 'giao dịch', 'transaction',
      'cuộc gọi', 'call', 'email', 'meeting', 'họp', 'lần cuối', 'last',
      'liên lạc', 'contacted', 'tiếp xúc'
    ],
    requiresCustomer: true
  },
  customer_financial: {
    keywords: [
      'tài chính', 'financial', 'thu nhập', 'income', 'chi tiêu', 'spending',
      'giao dịch', 'transaction', 'thanh toán', 'payment', 'ví', 'wallet',
      'ngân sách', 'budget', 'tiết kiệm', 'savings'
    ],
    requiresCustomer: true
  },
  next_best_action: {
    keywords: [
      'hành động', 'next action', 'nên làm gì', 'tiếp theo', 'next best',
      'gọi không', 'contact', 'nên liên hệ', 'should i call', 'what to do',
      'next step', 'bước tiếp theo', 'ưu tiên', 'priority'
    ],
    requiresCustomer: true
  },
  product_recommendation: {
    keywords: [
      'sản phẩm', 'bán gì', 'recommend', 'product', 'gợi ý sản phẩm',
      'nên bán', 'what to sell', 'offer', 'đề xuất', 'suggest'
    ],
    requiresCustomer: true
  },
  cross_sell: {
    keywords: [
      'cross sell', 'cross-sell', 'bán chéo', 'thêm sản phẩm', 'bán thêm',
      'additional product', 'sản phẩm bổ sung', 'mở rộng', 'expand'
    ],
    requiresCustomer: true
  },
  upsell: {
    keywords: [
      'upsell', 'nâng cấp', 'nâng hạng', 'upgrade', 'tăng gói',
      'mở rộng', 'premium', 'cao cấp', 'tier up'
    ],
    requiresCustomer: true
  },
  pre_approved_offer: {
    keywords: [
      'pre-approved', 'pre approved', 'duyệt trước', 'offer sẵn', 'approved offer',
      ' qualifies for', 'đủ điều kiện', 'eligible', 'ưu đãi sẵn'
    ],
    requiresCustomer: true
  },
  call_script: {
    keywords: [
      'kịch bản gọi', 'script gọi', 'call script', 'gọi điện', 'phone script',
      'nói gì', 'trao đổi gì', 'nội dung gọi', 'phone'
    ],
    requiresCustomer: true
  },
  email_template: {
    keywords: [
      'email', 'mẫu email', 'viết mail', 'gửi mail', 'compose', 'message template',
      'thư', 'gởi email', 'soạn email', 'draft'
    ],
    requiresCustomer: true
  },
  sms_template: {
    keywords: [
      'sms', 'tin nhắn', 'message', 'nhắn tin', 'zalo', 'zalo message',
      'zns', 'viber', 'whatsapp'
    ],
    requiresCustomer: true
  },
  meeting_summary: {
    keywords: [
      'tóm tắt cuộc họp', 'meeting summary', 'ghi chú crm', 'crm note',
      'call note', 'ghi chú cuộc họp', 'biên bản', 'notes'
    ],
    requiresCustomer: true
  },
  create_task: {
    keywords: [
      'task', 'nhắc tôi', 'follow-up', 'tạo việc', 'tạo task', 'lên lịch',
      'schedule', 'reminder', 'tạo công việc', 'tạo task', 'lịch hẹn',
      'appointment', 'hẹn gặp'
    ],
    requiresCustomer: true
  },
  view_tasks: {
    keywords: [
      'xem task', 'danh sách việc', 'view tasks', 'công việc', 'tasks',
      'việc cần làm', 'to do', 'pending', 'chưa xong'
    ],
    requiresCustomer: true
  },
  risk_analysis: {
    keywords: [
      'rủi ro', 'risk', 'fraud', 'tín dụng', 'credit risk', 'phân tích rủi ro',
      'risk analysis', 'điểm rủi ro', 'risk score'
    ],
    requiresCustomer: true
  },
  churn_risk: {
    keywords: [
      'churn', 'rời bỏ', 'giữ chân', 'bỏ đi', 'churn risk', 'retention',
      'lose customer', 'defect', 'bỏ đi', 'nghỉ', 'dừng'
    ],
    requiresCustomer: true
  },
  complaint_handling: {
    keywords: [
      'khiếu nại', 'complaint', 'phàn nàn', 'issue', 'problem', 'giải quyết',
      'complaint handling', 'satisfaction', 'hài lòng', 'không hài lòng'
    ],
    requiresCustomer: true
  },
  lead_qualification: {
    keywords: [
      'lead', 'lead score', 'qualify', 'đủ điều kiện', 'tiềm năng', 'potential',
      'lead qualification', 'hot lead', 'warm lead', 'cold lead'
    ],
    requiresCustomer: true
  },
  campaign_suggestion: {
    keywords: [
      'campaign', 'chiến dịch', 'marketing', 'khuyến mãi', 'promotion',
      'offer', 'ưu đãi', 'deal'
    ],
    requiresCustomer: false
  },
  sales_pipeline: {
    keywords: [
      'pipeline', 'bán hàng', 'sales', 'deal', 'opportunity', 'cơ hội',
      'closing', 'đóng deal', 'proposal', 'báo giá'
    ],
    requiresCustomer: true
  },
  explain_recommendation: {
    keywords: [
      'vì sao', 'why', 'giải thích', 'tại sao', 'explain', 'tại sao gợi ý',
      'reason', 'lý do', 'tại sao lại', 'explain why'
    ],
    requiresCustomer: true
  },
  help: {
    keywords: [
      'help', 'trợ giúp', 'giúp', 'hướng dẫn', 'guide', 'command',
      'lệnh', 'cách dùng', 'how to', 'what can', 'làm gì được'
    ],
    requiresCustomer: false
  },
  general_question: {
    keywords: [],
    requiresCustomer: false
  }
};

/**
 * Check if message contains pronoun references to last customer
 */
export function isPronounReference(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  for (const pronoun of PRONOUN_PATTERNS) {
    if (lowerMessage.includes(pronoun)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detect customer reference in the message
 */
function detectCustomerReference(message: string): string | undefined {
  const lowerMessage = message.toLowerCase();
  
  // Check for pronoun references first
  if (isPronounReference(message)) {
    return 'USE_LAST_CUSTOMER';
  }
  
  // Check for explicit customer names in the message
  const namePatterns = [
    /(?:tóm tắt|brief|summarize|phân tích|xem|liệt kê)\s+(.+?)(?:\s|$|\?|!)/i,
    /(?:khách hàng|anh|chị|bà|ông|doanh nghiệp|customer|company)\s+(.+?)(?:\s|$|\?|!)/i,
    /(?:về|dành cho|cho)\s+(.+?)(?:\s|$|\?|!)/i,
  ];
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1] && match[1].length > 2 && match[1].length < 50) {
      return match[1].trim();
    }
  }
  
  // Check for "this customer", "khách này", etc.
  if (/\b(khách này|anh này|chị này|bà này|ông này|this customer|this client|this person|doanh nghiệp này)\b/i.test(message)) {
    return 'SELECTED_CUSTOMER';
  }
  
  return undefined;
}

/**
 * Calculate keyword match score for an intent
 */
function calculateIntentScore(message: string, keywords: string[]): number {
  if (keywords.length === 0) return 0;
  
  const lowerMessage = message.toLowerCase();
  let score = 0;
  let matchedKeywords = 0;
  
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    
    // Exact match
    if (lowerMessage.includes(lowerKeyword)) {
      score += 1;
      matchedKeywords++;
      
      // Bonus for word boundary match
      try {
        const regex = new RegExp(`\\b${escapeRegex(lowerKeyword)}\\b`, 'i');
        if (regex.test(lowerMessage)) {
          score += 0.5;
        }
      } catch {
        // If regex fails, just continue
      }
    }
  }
  
  return matchedKeywords > 0 ? score / keywords.length : 0;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main intent detection function
 */
export function detectIntent(message: string, language: 'vi' | 'en' = 'vi'): IntentResult {
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for pronoun reference first
  const pronounRef = isPronounReference(message);
  
  // Calculate scores for each intent
  const scores: { intent: string; score: number; requiresCustomer: boolean }[] = [];
  
  for (const [intentName, config] of Object.entries(INTENTS)) {
    const score = calculateIntentScore(lowerMessage, config.keywords);
    scores.push({
      intent: intentName,
      score,
      requiresCustomer: config.requiresCustomer
    });
  }
  
  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  
  // Get best match
  const bestMatch = scores[0];
  const secondMatch = scores[1];
  
  const customerRef = detectCustomerReference(message);
  
  // If no keywords matched, detect general intent
  if (bestMatch.score === 0) {
    // Check for question patterns
    if (lowerMessage.includes('?')) {
      if (lowerMessage.includes('who') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
        return {
          intent: 'general_question',
          confidence: 0.5,
          requiresCustomerContext: INTENTS.general_question.requiresCustomer,
          customerReference: customerRef,
          isPronounReference: pronounRef
        };
      }
    }
    
    // If it's just a pronoun reference, don't force customer context
    if (pronounRef && customerRef === 'USE_LAST_CUSTOMER') {
      return {
        intent: 'general_question',
        confidence: 0.3,
        requiresCustomerContext: true,
        customerReference: customerRef,
        isPronounReference: pronounRef
      };
    }
    
    return {
      intent: 'general_question',
      confidence: 0.3,
      requiresCustomerContext: pronounRef,
      customerReference: customerRef,
      isPronounReference: pronounRef
    };
  }
  
  // Determine confidence based on score
  let confidence: number;
  if (bestMatch.score >= 1) {
    confidence = 0.95;
  } else if (bestMatch.score >= 0.5) {
    confidence = 0.8;
  } else if (bestMatch.score >= 0.3) {
    confidence = 0.6;
  } else {
    confidence = 0.4;
  }
  
  // Boost confidence if multiple intents have similar scores
  if (secondMatch && secondMatch.score > 0 && (bestMatch.score - secondMatch.score) < 0.2) {
    confidence -= 0.1;
  }
  
  // If it's a pronoun reference, the intent is about the last customer
  const requiresContext = pronounRef ? true : bestMatch.requiresCustomer;
  
  return {
    intent: bestMatch.intent,
    confidence,
    requiresCustomerContext: requiresContext,
    customerReference: customerRef,
    isPronounReference: pronounRef
  };
}

/**
 * Detect customer from name in message
 */
export function detectCustomerFromName(message: string, customers: Array<{ id: string; name: string }>): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Check for pronoun - return special marker
  if (isPronounReference(message)) {
    return 'USE_LAST_CUSTOMER';
  }
  
  for (const customer of customers) {
    const lowerName = customer.name.toLowerCase();
    const nameParts = customer.name.split(' ');
    
    // Exact name match
    if (lowerMessage.includes(lowerName)) {
      return customer.id;
    }
    
    // Partial match - any name part (at least 3 chars)
    for (const part of nameParts) {
      if (part.length >= 3 && lowerMessage.includes(part.toLowerCase())) {
        return customer.id;
      }
    }
    
    // Customer ID match
    if (lowerMessage.includes(customer.id.toLowerCase())) {
      return customer.id;
    }
  }
  
  return null;
}

/**
 * Get human-readable intent label
 */
export function getIntentLabel(intent: string, language: 'vi' | 'en' = 'vi'): string {
  const labels: Record<string, { vi: string; en: string }> = {
    customer_brief: { vi: 'Tóm tắt khách hàng', en: 'Customer Brief' },
    customer_detail: { vi: 'Chi tiết khách hàng', en: 'Customer Details' },
    customer_products: { vi: 'Sản phẩm đang dùng', en: 'Current Products' },
    customer_interactions: { vi: 'Lịch sử tương tác', en: 'Interaction History' },
    customer_financial: { vi: 'Tình hình tài chính', en: 'Financial Status' },
    next_best_action: { vi: 'Hành động tiếp theo', en: 'Next Best Action' },
    product_recommendation: { vi: 'Gợi ý sản phẩm', en: 'Product Recommendation' },
    cross_sell: { vi: 'Cross-sell', en: 'Cross-sell Opportunity' },
    upsell: { vi: 'Upsell', en: 'Upsell Opportunity' },
    pre_approved_offer: { vi: 'Pre-approved Offer', en: 'Pre-approved Offer' },
    call_script: { vi: 'Kịch bản gọi', en: 'Call Script' },
    email_template: { vi: 'Mẫu email', en: 'Email Template' },
    sms_template: { vi: 'Mẫu SMS', en: 'SMS Template' },
    meeting_summary: { vi: 'Tóm tắt cuộc họp', en: 'Meeting Summary' },
    create_task: { vi: 'Tạo công việc', en: 'Create Task' },
    view_tasks: { vi: 'Xem công việc', en: 'View Tasks' },
    risk_analysis: { vi: 'Phân tích rủi ro', en: 'Risk Analysis' },
    churn_risk: { vi: 'Rủi ro churn', en: 'Churn Risk' },
    complaint_handling: { vi: 'Xử lý khiếu nại', en: 'Complaint Handling' },
    lead_qualification: { vi: 'Lead Qualification', en: 'Lead Qualification' },
    campaign_suggestion: { vi: 'Gợi ý chiến dịch', en: 'Campaign Suggestion' },
    sales_pipeline: { vi: 'Sales Pipeline', en: 'Sales Pipeline' },
    explain_recommendation: { vi: 'Giải thích', en: 'Explain' },
    list_customers: { vi: 'Danh sách khách hàng', en: 'Customer List' },
    help: { vi: 'Trợ giúp', en: 'Help' },
    general_question: { vi: 'Câu hỏi chung', en: 'General Question' },
  };
  
  return labels[intent]?.[language] || intent;
}
