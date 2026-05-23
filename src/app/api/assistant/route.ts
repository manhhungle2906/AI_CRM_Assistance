import { NextResponse } from 'next/server';
import { handleAssistantAction } from '@/lib/assistant-engine';
import type { AssistantAction } from '@/lib/types';

// Intelligent chat handler that analyzes user query
async function handleChat(query: string, customerId: string, language: string = 'vi') {
  const lowerQuery = query.toLowerCase();
  const customer = await import('@/data/mock-customers').then(m => m.getCustomerById(customerId));
  
  // Analyze query to determine action
  if (lowerQuery.includes('tóm tắt') || lowerQuery.includes('summarize') || lowerQuery.includes('brief') || lowerQuery.includes('thông tin')) {
    return handleAssistantAction('summarize_customer', customerId);
  }
  
  if (lowerQuery.includes('hành động') || lowerQuery.includes('action') || lowerQuery.includes('tiếp theo') || lowerQuery.includes('next')) {
    return handleAssistantAction('suggest_next_best_action', customerId);
  }
  
  if (lowerQuery.includes('sản phẩm') || lowerQuery.includes('product') || lowerQuery.includes('offer') || lowerQuery.includes('gợi ý')) {
    return handleAssistantAction('suggest_next_best_offer', customerId);
  }
  
  if (lowerQuery.includes('gọi') || lowerQuery.includes('call') || lowerQuery.includes('điện') || lowerQuery.includes('script')) {
    return handleAssistantAction('generate_call_script', customerId);
  }
  
  if (lowerQuery.includes('email') || lowerQuery.includes('mail') || lowerQuery.includes('thư')) {
    return handleAssistantAction('generate_email_script', customerId);
  }
  
  if (lowerQuery.includes('rủi ro') || lowerQuery.includes('risk') || lowerQuery.includes('credit')) {
    return handleAssistantAction('explain_credit_risk', customerId);
  }
  
  if (lowerQuery.includes('churn') || lowerQuery.includes('mất') || lowerQuery.includes('giữ') || lowerQuery.includes('retention')) {
    return handleAssistantAction('explain_churn_risk', customerId);
  }
  
  if (lowerQuery.includes('task') || lowerQuery.includes('công việc') || lowerQuery.includes('follow') || lowerQuery.includes('theo dõi')) {
    return handleAssistantAction('create_follow_up_task', customerId);
  }
  
  if (lowerQuery.includes('fraud') || lowerQuery.includes('lừa') || lowerQuery.includes('gian')) {
    return handleAssistantAction('explain_fraud_signal', customerId);
  }
  
  if (lowerQuery.includes('cross') || lowerQuery.includes('bán chéo')) {
    return handleAssistantAction('suggest_cross_sell', customerId);
  }
  
  if (lowerQuery.includes('upsell') || lowerQuery.includes('nâng cấp')) {
    return handleAssistantAction('suggest_upsell', customerId);
  }
  
  // Default: summarize customer with welcome
  if (customer) {
    const brief = await handleAssistantAction('summarize_customer', customerId);
    return {
      ...brief,
      message: language === 'vi' 
        ? `Tôi đã tìm thấy thông tin về ${customer.name}. Đây là tóm tắt:\n\n${brief.message}`
        : `I found information about ${customer.name}. Here's the summary:\n\n${brief.message}`
    };
  }
  
  return { message: language === 'vi' 
    ? 'Xin lỗi, tôi không tìm thấy khách hàng này. Vui lòng chọn một khách hàng hợp lệ.'
    : 'Sorry, I could not find this customer. Please select a valid customer.'
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, action, payload } = body;
    const language = payload?.language || 'vi';

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 });
    }

    // Use API key from environment variable (server-side only)
    const apiKey = process.env.OPENAI_API_KEY;
    
    // For chat actions with OpenAI
    if ((action === 'chat' || action === 'general_chat') && apiKey && apiKey.startsWith('sk-')) {
      try {
        // Get customer data for context
        const { getCustomerById } = await import('@/data/mock-customers');
        const customer = getCustomerById(customerId);
        
        // Build context from customer data
        let contextInfo = '';
        if (customer) {
          contextInfo = `
Customer Information:
- Name: ${customer.name}
- Segment: ${customer.segment}
- Micro-segment: ${customer.microSegment}
- Products: ${customer.productCount} products
- Balance: ${(customer.averageBalance / 1000000).toFixed(0)}M VND
- Digital Score: ${customer.digitalAdoptionScore}/100
- Region: ${customer.region}
- Last Interaction: ${customer.lastInteractionDate}
- Risk Level: ${customer.riskLevel || 'N/A'}
`;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an expert AI CRM assistant for OceanBank, helping relationship managers (RMs) with customer relationship management.

You help with:
- Customer analysis and summaries
- Product recommendations (cross-sell, upsell)
- Call and email scripts
- Risk analysis (credit, churn, fraud)
- Task creation and follow-ups
- Lead scoring

Response Guidelines:
- Always respond in the same language as the user's question (Vietnamese or English)
- Use clear headers and bullet points
- Be concise but informative
- Focus on actionable insights
- Format with **bold** for important information
- Never make up specific customer data - use the provided context only
${language === 'vi' ? '- Respond in Vietnamese with Vietnamese punctuation' : '- Respond in English with English punctuation'}`
              },
              {
                role: 'user',
                content: `Context:\n${contextInfo}\n\nUser Question: ${payload?.query || 'Hello, what can you help me with?'}`
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            message: data.choices[0]?.message?.content || 'No response from AI',
            source: 'openai'
          });
        }
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
      }
    }
    
    // Fallback to intelligent mock handler
    if (action === 'chat' || action === 'general_chat') {
      const result = await handleChat(payload?.query || '', customerId, language);
      return NextResponse.json({ ...result, source: 'ai' });
    }

    // Handle other actions through the engine
    const result = await handleAssistantAction(action as AssistantAction, customerId, payload);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Assistant error:', error);
    return NextResponse.json(
      { message: 'An error occurred processing your request.' },
      { status: 500 }
    );
  }
}
