import { NextResponse } from 'next/server';
import { mockCustomers, getCustomerById } from '@/data/mock-customers';

// Intelligent customer detection from query
function detectCustomerFromQuery(query: string): { id: string; name: string } | null {
  const lowerQuery = query.toLowerCase().trim();
  
  // Exact match first
  for (const customer of mockCustomers) {
    const nameLower = customer.name.toLowerCase();
    
    // Full name match
    if (nameLower === lowerQuery || nameLower.includes(lowerQuery) || lowerQuery.includes(nameLower)) {
      return { id: customer.id, name: customer.name };
    }
    
    // Individual name parts (first name, last name)
    const nameParts = customer.name.toLowerCase().split(' ');
    for (const part of nameParts) {
      if (part.length > 2 && (lowerQuery === part || lowerQuery.includes(part) || part.includes(lowerQuery))) {
        return { id: customer.id, name: customer.name };
      }
    }
    
    // Customer ID match
    if (lowerQuery.includes(customer.id)) {
      return { id: customer.id, name: customer.name };
    }
  }
  
  return null;
}

// Detect intent from query
function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('tóm tắt') || lowerQuery.includes('summarize') || lowerQuery.includes('brief')) {
    return 'summarize';
  }
  if (lowerQuery.includes('hành động') || lowerQuery.includes('next action') || lowerQuery.includes('tiếp theo')) {
    return 'action';
  }
  if (lowerQuery.includes('sản phẩm') || lowerQuery.includes('product') || lowerQuery.includes('offer')) {
    return 'product';
  }
  if (lowerQuery.includes('gọi') || lowerQuery.includes('call script') || lowerQuery.includes('kịch bản')) {
    return 'call';
  }
  if (lowerQuery.includes('email') || lowerQuery.includes('sms') || lowerQuery.includes('zalo')) {
    return 'email';
  }
  if (lowerQuery.includes('rủi ro') || lowerQuery.includes('credit risk')) {
    return 'credit_risk';
  }
  if (lowerQuery.includes('churn') || lowerQuery.includes('mất khách')) {
    return 'churn';
  }
  if (lowerQuery.includes('cross') || lowerQuery.includes('bán chéo')) {
    return 'cross_sell';
  }
  if (lowerQuery.includes('upsell') || lowerQuery.includes('nâng cấp')) {
    return 'upsell';
  }
  if (lowerQuery.includes('task') || lowerQuery.includes('công việc')) {
    return 'task';
  }
  if (lowerQuery.includes('fraud') || lowerQuery.includes('lừa')) {
    return 'fraud';
  }
  if (lowerQuery.includes('lead') || lowerQuery.includes('tiềm năng')) {
    return 'lead';
  }
  
  return 'general';
}

// Generate response based on intent and customer
function generateResponse(intent: string, customer: any, language: string): string {
  const isVi = language === 'vi';
  
  if (!customer) {
    return isVi 
      ? 'Tôi chưa nhận diện được khách hàng. Bạn vui lòng nhập tên khách hàng cụ thể nhé!'
      : 'I could not detect a customer. Please mention a specific customer name!';
  }
  
  const name = customer.name;
  const segment = customer.segment;
  const balance = (customer.averageBalance / 1000000).toFixed(0);
  const products = customer.productCount;
  const creditRisk = customer.creditRiskScore > 70 ? 'Cao' : customer.creditRiskScore > 40 ? 'Trung bình' : 'Thấp';
  const churnRisk = customer.churnRiskScore > 70 ? 'Cao' : customer.churnRiskScore > 40 ? 'Trung bình' : 'Thấp';
  
  switch (intent) {
    case 'summarize':
      return isVi ? `## Tóm tắt khách hàng: ${name}

**Phân khúc:** ${segment} - ${customer.microSegment}
**Số dư:** ${balance}M VND
**Sản phẩm:** ${products} sản phẩm
**Điểm số Digital:** ${customer.digitalAdoptionScore}/100
**Tương tác cuối:** ${customer.lastInteractionDate}

**Rủi ro tín dụng:** ${creditRisk} (${customer.creditRiskScore}/100)
**Rủi ro churn:** ${churnRisk} (${customer.churnRiskScore}/100)
${customer.complaintStatus === 'Open' ? '\n⚠️ **CÓ KHIẾU NẠI ĐANG MỞ - Ưu tiên giải quyết!**' : ''}

---
*Tôi có thể giúp gì thêm với khách hàng này?*` : `## Customer Summary: ${name}

**Segment:** ${segment} - ${customer.microSegment}
**Balance:** ${balance}M VND
**Products:** ${products} products
**Digital Score:** ${customer.digitalAdoptionScore}/100
**Last Interaction:** ${customer.lastInteractionDate}

**Credit Risk:** ${creditRisk} (${customer.creditRiskScore}/100)
**Churn Risk:** ${churnRisk} (${customer.churnRiskScore}/100)
${customer.complaintStatus === 'Open' ? '\n⚠️ **OPEN COMPLAINT - Prioritize resolution!**' : ''}

---
*How can I help with this customer?*`;
      
    case 'action':
      return isVi ? `## Gợi ý hành động cho ${name}

**Hành động đề xuất:** ${customer.complaintStatus === 'Open' ? 'Giải quyết khiếu nại trước' : 'Gọi điện kiểm tra tình hình'}

**Kênh liên lạc:** ${customer.complaintStatus === 'Open' ? 'Điện thoại hoặc gặp trực tiếp' : 'Gọi điện'}

**Lý do:**
- ${customer.complaintStatus === 'Open' ? 'Có khiếu nại chưa giải quyết - ưu tiên cao' : 'Cập nhật thông tin và duy trì mối quan hệ'}
- ${customer.churnRiskScore > 50 ? 'Churn risk cao - cần liên lạc sớm' : 'Duy trì touchpoint định kỳ'}

**Script mở đầu:**
"Xin chào ${name}, đây là [Tên RM] từ OceanBank. Tôi muốn trao đổi về tài khoản của quý khách."

---
*Cần tôi tạo kịch bản gọi chi tiết không?*` : `## Suggested action for ${name}

**Recommended action:** ${customer.complaintStatus === 'Open' ? 'Resolve complaint first' : 'Call to check in'}

**Channel:** ${customer.complaintStatus === 'Open' ? 'Phone or in-person' : 'Phone call'}

**Reasoning:**
- ${customer.complaintStatus === 'Open' ? 'Active complaint - high priority' : 'Update info and maintain relationship'}
- ${customer.churnRiskScore > 50 ? 'High churn risk - contact soon' : 'Maintain regular touchpoints'}

**Opening script:**
"Hello ${name}, this is [RM Name] from OceanBank. I want to discuss your account."

---
*Should I generate a detailed call script?*`;
      
    case 'product':
      return isVi ? `## Gợi ý sản phẩm cho ${name}

**Phân khúc:** ${segment}
**Sản phẩm hiện có:** ${products} sản phẩm

${customer.complaintStatus === 'Open' ? '⚠️ **KHÔNG NÊN BÁN** - Cần giải quyết khiếu nại trước!' : ''}

**Cơ hội cross-sell:**
${segment === 'Individual' ? '- Thẻ tín dụng cao cấp\n- Bảo hiểm nhân thọ\n- Tiết kiệm trực tuyến' : segment === 'SME' ? '- Vay vốn lưu động\n- Bảo hiểm doanh nghiệp\n- Dịch vụ thanh toán quốc tế' : '- Trade finance\n- Corporate cash management\n- Investment products'}

**Ưu tiên:** ${products < 3 ? 'Cao - Khách còn ít sản phẩm' : 'Trung bình'}

---
*Hỏi tôi về cross-sell hoặc upsell cụ thể nhé!*` : `## Product suggestions for ${name}

**Segment:** ${segment}
**Current products:** ${products} products

${customer.complaintStatus === 'Open' ? '⚠️ **DO NOT SELL** - Resolve complaint first!' : ''}

**Cross-sell opportunities:**
${segment === 'Individual' ? '- Premium credit card\n- Life insurance\n- Online savings' : segment === 'SME' ? '- Working capital loan\n- Business insurance\n- International payment services' : '- Trade finance\n- Corporate cash management\n- Investment products'}

**Priority:** ${products < 3 ? 'High - Customer has few products' : 'Medium'}

---
*Ask me about specific cross-sell or upsell!*`;
      
    case 'call':
      return isVi ? `## Kịch bản gọi cho ${name}

**Mở đầu:**
"Xin chào ${name}, đây là [Tên RM] từ OceanBank. Tôi đang liên hệ để ${customer.complaintStatus === 'Open' ? 'hỗ trợ giải quyết vấn đề của quý khách' : 'cập nhật thông tin và giới thiệu sản phẩm mới'}."

**Nội dung chính:**
1. ${customer.complaintStatus === 'Open' ? 'Lắng nghe và ghi nhận khiếu nại' : 'Kiểm tra nhu cầu hiện tại'}
2. ${customer.complaintStatus === 'Open' ? 'Cam kết thời gian xử lý' : 'Giới thiệu sản phẩm phù hợp'}
3. ${customer.complaintStatus === 'Open' ? 'Hẹn lịch follow-up' : 'Hẹn lịch tư vấn chi tiết'}

**Xử lý phản đối:**
- "Tôi sẽ gửi email chi tiết ngay sau cuộc gọi"
- "Tôi có thể sắp xếp gặp trực tiếp để thảo luận"

**Kết thúc:**
"Cảm ơn quý khách đã dành thời gian. Tôi sẽ liên hệ lại sau."

---
*Cần tôi tạo mẫu email không?*` : `## Call script for ${name}

**Opening:**
"Hello ${name}, this is [RM Name] from OceanBank. I'm calling to ${customer.complaintStatus === 'Open' ? 'help resolve your issue' : 'update information and introduce new products'}."

**Key points:**
1. ${customer.complaintStatus === 'Open' ? 'Listen and document the complaint' : 'Check current needs'}
2. ${customer.complaintStatus === 'Open' ? 'Commit to resolution timeline' : 'Introduce relevant products'}
3. ${customer.complaintStatus === 'Open' ? 'Schedule follow-up' : 'Schedule detailed consultation'}

**Objection handling:**
- "I'll send detailed email right after this call"
- "I can arrange an in-person meeting to discuss"

**Closing:**
"Thank you for your time. I'll follow up after."

---
*Should I generate an email template?*`;
      
    case 'credit_risk':
      return isVi ? `## Phân tích rủi ro tín dụng: ${name}

**Điểm rủi ro:** ${customer.creditRiskScore}/100
**Mức độ:** ${creditRisk}

**Các yếu tố chính:**
${customer.creditRiskScore > 60 ? '- Điểm rủi ro cao - cần thận trọng' : '- Điểm rủi ro ở mức chấp nhận được'}
${customer.churnRiskScore > 50 ? '- Có dấu hiệu giảm tương tác' : '- Tương tác ổn định'}
${customer.transactionTrend3M < 0 ? '- Số giao dịch giảm 3 tháng gần đây' : '- Xu hướng giao dịch ổn định'}

**Khuyến nghị:**
- ${customer.creditRiskScore > 70 ? 'Không đề xuất sản phẩm tín dụng mới' : 'Cân nhắc kỹ trước khi approve'}
- Theo dõi sát tình hình tài chính

---
*Cần phân tích churn risk không?*` : `## Credit risk analysis: ${name}

**Risk score:** ${customer.creditRiskScore}/100
**Level:** ${creditRisk}

**Key factors:**
${customer.creditRiskScore > 60 ? '- High risk score - be cautious' : '- Risk score within acceptable range'}
${customer.churnRiskScore > 50 ? '- Signs of declining engagement' : '- Stable engagement'}
${customer.transactionTrend3M < 0 ? '- Transaction volume decreased in last 3 months' : '- Stable transaction trend'}

**Recommendations:**
- ${customer.creditRiskScore > 70 ? 'Do not propose new credit products' : 'Consider carefully before approving'}
- Monitor financial situation closely

---
*Need churn risk analysis?*`;
      
    case 'churn':
      return isVi ? `## Phân tích churn risk: ${name}

**Điểm churn:** ${customer.churnRiskScore}/100
**Mức độ:** ${churnRisk}

**Dấu hiệu cảnh báo:**
${customer.churnRiskScore > 60 ? '- Rủi ro churn cao - cần hành động ngay' : '- Rủi ro ở mức chấp nhận được'}
${customer.lastInteractionDate ? `- Lần tương tác cuối: ${customer.lastInteractionDate}` : ''}
${customer.digitalAdoptionScore < 50 ? '- Digital adoption thấp - có thể không hài lòng' : '- Digital adoption tốt'}

**Hành động khuyến nghị:**
1. Gọi điện thăm hỏi trong 24-48h
2. Cập nhật sản phẩm mới phù hợp
3. Xem xét ưu đãi đặc biệt nếu phù hợp

---
*Cần tôi tạo task follow-up không?*` : `## Churn risk analysis: ${name}

**Churn score:** ${customer.churnRiskScore}/100
**Level:** ${churnRisk}

**Warning signs:**
${customer.churnRiskScore > 60 ? '- High churn risk - need immediate action' : '- Risk within acceptable range'}
${customer.lastInteractionDate ? `- Last interaction: ${customer.lastInteractionDate}` : ''}
${customer.digitalAdoptionScore < 50 ? '- Low digital adoption - may be dissatisfied' : '- Good digital adoption'}

**Recommended actions:**
1. Call to check in within 24-48 hours
2. Update on new relevant products
3. Consider special offers if appropriate

---
*Should I create a follow-up task?*`;
      
    default:
      return isVi ? `## RM Copilot - ${name}

Tôi có thể giúp bạn với khách hàng này:

• **Tóm tắt** - Xem thông tin tổng quan
• **Hành động** - Gợi ý bước tiếp theo
• **Sản phẩm** - Gợi ý cross-sell/upsell
• **Kịch bản gọi** - Tạo script cho cuộc gọi
• **Phân tích rủi ro** - Credit risk & churn risk

Bạn muốn tôi làm gì?` : `## RM Copilot - ${name}

I can help you with this customer:

• **Summarize** - View overview
• **Action** - Suggest next steps
• **Products** - Cross-sell/upsell suggestions
• **Call script** - Generate call script
• **Risk analysis** - Credit & churn risk

What would you like me to do?`;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payload } = body;
    const language = payload?.language || 'vi';
    const query = payload?.query || '';

    // Detect customer from query
    const detectedCustomer = detectCustomerFromQuery(query);
    const customer = detectedCustomer ? getCustomerById(detectedCustomer.id) : null;

    // Detect intent
    const intent = detectIntent(query);

    // Generate response
    const message = generateResponse(intent, customer, language);

    return NextResponse.json({
      message,
      detectedCustomer,
      intent
    });

  } catch (error) {
    console.error('Assistant error:', error);
    return NextResponse.json(
      { 
        message: 'Đã xảy ra lỗi. Vui lòng thử lại.' 
      },
      { status: 500 }
    );
  }
}
