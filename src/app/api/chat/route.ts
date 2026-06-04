import { NextResponse } from 'next/server';
import { detectIntent, detectCustomerFromName, isPronounReference } from '@/lib/ai/intent-detector';
import { generateResponse, convertToCustomerContext } from '@/lib/ai/response-generator';
import { mockCustomers, getCustomerById } from '@/data/mock-customers';

// Types
interface ChatRequest {
  message: string;
  intent?: string;
  customerId?: string;
  conversationId?: string;
  language?: 'vi' | 'en';
  history?: Array<{ role: string; content: string; customerId?: string; customerName?: string }>;
}

interface ChatResponse {
  conversationId: string;
  customerId?: string;
  customerName?: string;
  intent: string;
  intentLabel: string;
  response: string;
  suggestedActions: Array<{ label: string; action: string }>;
  requiresCustomer: boolean;
  conversationContext?: {
    lastCustomerId?: string;
    lastCustomerName?: string;
    mentionedCustomers: Array<{ customerId: string; customerName: string }>;
  };
}

// Generate conversation ID
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * KEY FUNCTION: Find customer from message
 * Priority:
 * 1. Explicit name in message (Nguyen Van A, Tran Thi B, etc.)
 * 2. Pronoun reference (nta, hắn, "người đó") -> last from history
 * 3. "khách này" / "this customer" -> last from history
 * 4. Customer ID passed from frontend
 */
function resolveCustomerFromMessage(
  message: string,
  history: Array<{ role: string; content: string; customerId?: string; customerName?: string }>,
  initialCustomerId?: string
): { customerId: string; customerName: string } | null {
  
  // STEP 1: Check if message has pronoun reference
  if (isPronounReference(message)) {
    // Find last customer from history
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.customerId && msg.customerName) {
        return { customerId: msg.customerId, customerName: msg.customerName };
      }
    }
    return null;
  }
  
  // STEP 2: Try to find explicit customer name in message
  const detectedId = detectCustomerFromName(message, mockCustomers);
  if (detectedId && detectedId !== 'USE_LAST_CUSTOMER') {
    const customer = getCustomerById(detectedId);
    if (customer) {
      return { customerId: customer.id, customerName: customer.name };
    }
  }
  
  // STEP 3: Check for "this customer" / "khách này" pattern
  if (/\b(khách này|anh này|chị này|bà này|ông này|this customer|this client)\b/i.test(message)) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.customerId && msg.customerName) {
        return { customerId: msg.customerId, customerName: msg.customerName };
      }
    }
  }
  
  // STEP 4: Use initial customer from frontend
  if (initialCustomerId) {
    const customer = getCustomerById(initialCustomerId);
    if (customer) {
      return { customerId: customer.id, customerName: customer.name };
    }
  }
  
  return null;
}

/**
 * Get all customers mentioned in conversation
 */
function getMentionedCustomers(
  history: Array<{ role: string; content: string; customerId?: string; customerName?: string }>,
  currentCustomerId?: string,
  currentCustomerName?: string
): Array<{ customerId: string; customerName: string }> {
  const seen = new Map<string, { customerId: string; customerName: string }>();
  
  // Add current customer first (most recent)
  if (currentCustomerId && currentCustomerName) {
    seen.set(currentCustomerId, { customerId: currentCustomerId, customerName: currentCustomerName });
  }
  
  // Add from history (newest to oldest)
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg.customerId && msg.customerName && !seen.has(msg.customerId)) {
      seen.set(msg.customerId, { customerId: msg.customerId, customerName: msg.customerName });
    }
  }
  
  return Array.from(seen.values());
}

// Intent labels
function getIntentLabels(): Record<string, { vi: string; en: string }> {
  return {
    customer_brief: { vi: 'Tóm tắt khách hàng', en: 'Customer Brief' },
    customer_detail: { vi: 'Chi tiết khách hàng', en: 'Customer Details' },
    customer_products: { vi: 'Sản phẩm đang dùng', en: 'Current Products' },
    customer_interactions: { vi: 'Lịch sử tương tác', en: 'Interaction History' },
    customer_financial: { vi: 'Tình hình tài chính', en: 'Financial Status' },
    next_best_action: { vi: 'Hành động tiếp theo', en: 'Next Best Action' },
    product_recommendation: { vi: 'Gợi ý sản phẩm', en: 'Product Recommendation' },
    cross_sell: { vi: 'Cross-sell', en: 'Cross-sell' },
    upsell: { vi: 'Upsell', en: 'Upsell' },
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
}

// Handle list customers
function handleListCustomers(language: 'vi' | 'en', mentioned: any[]) {
  const isVi = language === 'vi';
  const samples = mockCustomers.slice(0, 12);
  
  const list = samples.map((c, i) => `${i + 1}. **${c.name}**`).join('\n');
  
  return {
    response: isVi 
      ? `## 📋 Danh sách khách hàng\n\nCó **${mockCustomers.length}** khách hàng.\n\n${list}\n\n${mentioned.length > 0 ? `\n**Đã hỏi:** ${mentioned.map(c => c.customerName).join(', ')}` : ''}\n\nNhắn tên khách để phân tích!`
      : `## 📋 Customer List\n\n**${mockCustomers.length}** customers.\n\n${list}\n\n${mentioned.length > 0 ? `\n**Mentioned:** ${mentioned.map(c => c.customerName).join(', ')}` : ''}\n\nMention a name to analyze!`,
    suggestedActions: samples.slice(0, 4).map(c => ({
      label: `${isVi ? 'Tóm tắt' : 'Summarize'} ${c.name}`,
      action: `quick_brief_${c.id}`
    }))
  };
}

// Handle help
function handleHelp(language: 'vi' | 'en') {
  const isVi = language === 'vi';
  return {
    response: isVi
      ? `## 🤖 RM Copilot\n\n**Cách hỏi:**\n• "thông tin Nguyen Van A"\n• "tóm tắt Tran Thi B"\n• "phân tích Le Van C"\n\n**Hoặc:**\n• "khách này" = khách hàng gần nhất\n• "nta" = khách hàng gần nhất\n\n**Tôi có thể:**\n• Tóm tắt khách hàng\n• Gợi ý sản phẩm\n• Phân tích rủi ro\n• Tạo kịch bản gọi/email\n• Tạo task follow-up`
      : `## 🤖 RM Copilot\n\n**How to ask:**\n• "info Nguyen Van A"\n• "summarize Tran Thi B"\n• "analyze Le Van C"\n\n**Or:**\n• "this customer" = last customer\n• "him/her" = last customer\n\n**I can:**\n• Summarize customers\n• Recommend products\n• Analyze risks\n• Create call/email scripts\n• Create follow-up tasks`,
    suggestedActions: [
      { label: isVi ? 'Danh sách khách' : 'Customer List', action: 'list_customers' }
    ]
  };
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, intent: explicitIntent, customerId: initialCustomerId, conversationId, language = 'vi', history = [] } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const isVi = language === 'vi';
    const intentLabels = getIntentLabels();
    
    // ====== CRITICAL: Resolve customer from message FIRST ======
    const resolvedCustomer = resolveCustomerFromMessage(message, history, initialCustomerId);
    const resolvedCustomerId = resolvedCustomer?.customerId;
    const resolvedCustomerName = resolvedCustomer?.customerName;
    
    // Get customer context if we have a customer
    let customerContext = null;
    if (resolvedCustomerId) {
      const customer = getCustomerById(resolvedCustomerId);
      if (customer) {
        customerContext = convertToCustomerContext(customer);
      }
    }
    
    // Detect intent
    const intentResult = detectIntent(message, language);
    const detectedIntent = explicitIntent || intentResult.intent;
    
    // Get all mentioned customers
    const allMentioned = getMentionedCustomers(history, resolvedCustomerId, resolvedCustomerName);
    
    // Handle list_customers intent
    if (detectedIntent === 'list_customers') {
      const result = handleListCustomers(language, allMentioned);
      return NextResponse.json({
        conversationId: conversationId || generateConversationId(),
        customerId: resolvedCustomerId,
        customerName: resolvedCustomerName,
        intent: detectedIntent,
        intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
        response: result.response,
        suggestedActions: result.suggestedActions,
        requiresCustomer: false,
        conversationContext: {
          lastCustomerId: resolvedCustomerId,
          lastCustomerName: resolvedCustomerName,
          mentionedCustomers: allMentioned
        }
      } as ChatResponse);
    }
    
    // Handle help intent
    if (detectedIntent === 'help') {
      const result = handleHelp(language);
      return NextResponse.json({
        conversationId: conversationId || generateConversationId(),
        customerId: resolvedCustomerId,
        customerName: resolvedCustomerName,
        intent: detectedIntent,
        intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
        response: result.response,
        suggestedActions: result.suggestedActions,
        requiresCustomer: false,
        conversationContext: {
          lastCustomerId: resolvedCustomerId,
          lastCustomerName: resolvedCustomerName,
          mentionedCustomers: allMentioned
        }
      } as ChatResponse);
    }
    
    // If customer required but not found
    if (!customerContext && intentResult.requiresCustomerContext) {
      // Try pronoun resolution one more time
      if (isPronounReference(message)) {
        for (let i = history.length - 1; i >= 0; i--) {
          const msg = history[i];
          if (msg.customerId) {
            const c = getCustomerById(msg.customerId);
            if (c) {
              customerContext = convertToCustomerContext(c);
              break;
            }
          }
        }
      }
      
      // Still no customer? Ask user
      if (!customerContext) {
        return NextResponse.json({
          conversationId: conversationId || generateConversationId(),
          intent: detectedIntent,
          intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
          response: isVi
            ? `Chưa rõ khách hàng. Nhắn tên cụ thể!\n\nVí dụ: "thông tin Tran Thi B"\n\n${allMentioned.length > 0 ? `Đã hỏi: ${allMentioned.map(c => c.customerName).join(', ')}` : ''}`
            : `Customer not clear. Mention a specific name!\n\nExample: "info Tran Thi B"\n\n${allMentioned.length > 0 ? `Mentioned: ${allMentioned.map(c => c.customerName).join(', ')}` : ''}`,
          suggestedActions: allMentioned.length > 0
            ? allMentioned.slice(0, 3).map(c => ({
                label: `${isVi ? 'Phân tích' : 'Analyze'} ${c.customerName}`,
                action: `quick_brief_${c.customerId}`
              }))
            : [{ label: isVi ? 'Danh sách khách' : 'Customer List', action: 'list_customers' }],
          requiresCustomer: true,
          conversationContext: {
            lastCustomerId: resolvedCustomerId,
            lastCustomerName: resolvedCustomerName,
            mentionedCustomers: allMentioned
          }
        } as ChatResponse);
      }
    }
    
    // Generate response
    const { response, suggestedActions } = generateResponse({
      intent: detectedIntent,
      message,
      customer: customerContext,
      language,
      conversationHistory: history.map(h => ({ role: h.role, content: h.content }))
    });
    
    // Add "list customers" to suggested actions if not already there
    const finalSuggestedActions = [
      ...suggestedActions,
      { label: isVi ? 'DS Khách' : 'List', action: 'list_customers' }
    ].slice(0, 6);

    return NextResponse.json({
      conversationId: conversationId || generateConversationId(),
      customerId: resolvedCustomerId,
      customerName: resolvedCustomerName,
      intent: detectedIntent,
      intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
      response,
      suggestedActions: finalSuggestedActions,
      requiresCustomer: !customerContext,
      conversationContext: {
        lastCustomerId: resolvedCustomerId,
        lastCustomerName: resolvedCustomerName,
        mentionedCustomers: allMentioned
      }
    } as ChatResponse);

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', response: 'Đã xảy ra lỗi. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'RM Copilot Chat API' });
}
