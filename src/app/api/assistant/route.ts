import { NextResponse } from 'next/server';
import { detectIntent, detectCustomerFromName } from '@/lib/ai/intent-detector';
import { generateResponse, convertToCustomerContext } from '@/lib/ai/response-generator';
import { getCustomerById } from '@/data/mock-customers';

// Types
interface ChatRequest {
  payload?: {
    query?: string;
    language?: 'vi' | 'en';
    customerId?: string;
  };
  action?: string;
  customerId?: string;
  message?: string;
  language?: 'vi' | 'en';
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
}

// Generate conversation ID
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    
    // Support both old format and new format
    let message: string;
    let language: 'vi' | 'en';
    let customerId: string | undefined;
    
    if (body.payload) {
      // Old format: { payload: { query, language, customerId } }
      message = body.payload.query || '';
      language = body.payload.language || 'vi';
      customerId = body.payload.customerId;
    } else {
      // New format: { message, language, customerId }
      message = body.message || '';
      language = body.language || 'vi';
      customerId = body.customerId;
    }

    // Validate message
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Detect intent from message
    const intentResult = detectIntent(message, language);
    const detectedIntent = intentResult.intent;
    const requiresCustomerContext = intentResult.requiresCustomerContext;

    // Get intent label
    const intentLabels: Record<string, { vi: string; en: string }> = {
      customer_brief: { vi: 'Tóm tắt khách hàng', en: 'Customer Brief' },
      next_best_action: { vi: 'Hành động tiếp theo', en: 'Next Best Action' },
      product_recommendation: { vi: 'Gợi ý sản phẩm', en: 'Product Recommendation' },
      cross_sell: { vi: 'Cross-sell', en: 'Cross-sell' },
      upsell: { vi: 'Upsell', en: 'Upsell' },
      pre_approved_offer: { vi: 'Pre-approved Offer', en: 'Pre-approved Offer' },
      call_script: { vi: 'Kịch bản gọi', en: 'Call Script' },
      email_template: { vi: 'Mẫu email', en: 'Email Template' },
      meeting_summary: { vi: 'Tóm tắt cuộc họp', en: 'Meeting Summary' },
      create_task: { vi: 'Tạo công việc', en: 'Create Task' },
      risk_analysis: { vi: 'Phân tích rủi ro', en: 'Risk Analysis' },
      churn_risk: { vi: 'Rủi ro churn', en: 'Churn Risk' },
      complaint_handling: { vi: 'Xử lý khiếu nại', en: 'Complaint Handling' },
      lead_qualification: { vi: 'Lead Qualification', en: 'Lead Qualification' },
      campaign_suggestion: { vi: 'Gợi ý chiến dịch', en: 'Campaign Suggestion' },
      explain_recommendation: { vi: 'Giải thích', en: 'Explain' },
      general_question: { vi: 'Câu hỏi chung', en: 'General Question' },
    };

    // Resolve customer
    let resolvedCustomerId = customerId;
    let resolvedCustomerName: string | undefined;

    // If no customerId provided, try to detect from message
    if (!resolvedCustomerId) {
      const { mockCustomers } = await import('@/data/mock-customers');
      const detectedCustomerId = detectCustomerFromName(message, mockCustomers);
      if (detectedCustomerId) {
        resolvedCustomerId = detectedCustomerId;
      }
    }

    // Check if customer is "SELECTED_CUSTOMER" placeholder
    if (resolvedCustomerId === 'SELECTED_CUSTOMER') {
      if (requiresCustomerContext) {
        return NextResponse.json({
          conversationId: generateConversationId(),
          intent: detectedIntent,
          intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
          response: language === 'vi'
            ? 'Bạn đang hỏi về "khách hàng này" nhưng chưa chọn khách hàng. Vui lòng chọn một khách hàng từ danh sách hoặc nhắn tên khách hàng cụ thể.\n\n**Ví dụ:** "tóm tắt Blue Ocean Logistics"'
            : 'You are asking about "this customer" but no customer is selected. Please select a customer from the list or mention a specific customer name.\n\n**Example:** "summarize Blue Ocean Logistics"',
          suggestedActions: [
            { label: language === 'vi' ? 'Chọn khách hàng' : 'Select Customer', action: 'select_customer' }
          ],
          requiresCustomer: true
        } as ChatResponse);
      }
    }

    // Get customer context if we have a customer ID
    let customerContext = null;
    if (resolvedCustomerId) {
      const customer = getCustomerById(resolvedCustomerId);
      if (customer) {
        customerContext = convertToCustomerContext(customer);
        resolvedCustomerName = customer.name;
      } else {
        return NextResponse.json({
          conversationId: generateConversationId(),
          intent: detectedIntent,
          intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
          response: language === 'vi'
            ? `Không tìm thấy khách hàng với ID: ${resolvedCustomerId}. Vui lòng chọn khách hàng từ danh sách.`
            : `Customer not found with ID: ${resolvedCustomerId}. Please select a customer from the list.`,
          suggestedActions: [
            { label: language === 'vi' ? 'Chọn khách hàng' : 'Select Customer', action: 'select_customer' }
          ],
          requiresCustomer: true
        } as ChatResponse);
      }
    }

    // Generate response
    const { response, suggestedActions } = generateResponse({
      intent: detectedIntent,
      message,
      customer: customerContext,
      language,
    });

    return NextResponse.json({
      conversationId: generateConversationId(),
      customerId: resolvedCustomerId,
      customerName: resolvedCustomerName,
      intent: detectedIntent,
      intentLabel: intentLabels[detectedIntent]?.[language] || detectedIntent,
      response,
      suggestedActions,
      requiresCustomer: requiresCustomerContext && !resolvedCustomerId
    } as ChatResponse);

  } catch (error) {
    console.error('Assistant API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'Đã xảy ra lỗi. Vui lòng thử lại.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'RM Copilot Assistant API - Use POST to chat'
  });
}
