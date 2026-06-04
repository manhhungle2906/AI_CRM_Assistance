/**
 * AI Response Generator for CRM Assistant
 * Generates contextual responses based on customer data and intent
 */

import { mockCustomers, getCustomerById } from '@/data/mock-customers';

// Types
export interface CustomerContext {
  id: string;
  name: string;
  segment: string;
  microSegment: string;
  status: string;
  totalBalance: number; // alias for averageBalance
  averageBalance: number;
  digitalScore: number;
  churnRiskScore: number;
  creditRiskScore: number;
  complaintStatus: string;
  productCount: number;
  transactionTrend3M: number;
  lastInteractionDate: string;
  opportunityScore: number;
  segmentTier: string;
  tenure: number;
  engagementScore: number;
  channelPreference: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
}

export interface ResponseOptions {
  intent: string;
  message: string;
  customer: CustomerContext | null;
  language: 'vi' | 'en';
  conversationHistory?: Array<{ role: string; content: string }>;
}

// Format currency
function formatCurrency(amount: number, lang: 'vi' | 'en'): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B ${lang === 'vi' ? 'VND' : 'USD'}`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}M ${lang === 'vi' ? 'VND' : 'USD'}`;
  }
  return `${amount.toLocaleString()} ${lang === 'vi' ? 'VND' : 'USD'}`;
}

// Get risk level label
function getRiskLevel(score: number, lang: 'vi' | 'en'): string {
  if (score > 70) return lang === 'vi' ? 'Cao' : 'High';
  if (score > 40) return lang === 'vi' ? 'Trung bình' : 'Medium';
  return lang === 'vi' ? 'Thấp' : 'Low';
}

// Get churn risk label
function getChurnRiskLevel(score: number, lang: 'vi' | 'en'): string {
  if (score > 70) return lang === 'vi' ? 'Cao - Cần hành động ngay' : 'High - Act now';
  if (score > 40) return lang === 'vi' ? 'Trung bình - Theo dõi' : 'Medium - Monitor';
  return lang === 'vi' ? 'Thấp - Ổn định' : 'Low - Stable';
}

// Get segment opportunity
function getSegmentOpportunity(segment: string): string {
  const opportunities: Record<string, string> = {
    'VIP': 'Premium banking services, wealth management',
    'Mass Affluent': 'Investment products, premium cards',
    'Individual': 'Consumer loans, insurance, digital banking',
    'SME': 'Business loans, trade finance, cash management',
    'Corporate': 'Corporate banking, treasury, investment banking',
    'Mass Market': 'Basic deposits, digital adoption',
  };
  return opportunities[segment] || 'Multiple opportunities';
}

// Generate Customer Brief
function generateCustomerBrief(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  return isVi ? `## 📋 Tóm tắt khách hàng: ${customer.name}

### Thông tin cơ bản
- **Phân khúc:** ${customer.segment} - ${customer.microSegment}
- **Tier:** ${customer.segmentTier}
- **Trạng thái:** ${customer.status}
- **Thời gian gắn bó:** ${customer.tenure} năm

### Tài chính
- **Số dư:** ${formatCurrency(customer.totalBalance, lang)}
- **Xu hướng 3 tháng:** ${customer.transactionTrend3M >= 0 ? '📈 Tăng' : '📉 Giảm'} ${Math.abs(customer.transactionTrend3M)}%
- **Điểm cơ hội:** ${customer.opportunityScore}/100

### Sản phẩm & Tương tác
- **Số sản phẩm:** ${customer.productCount}
- **Digital Score:** ${customer.digitalScore}/100
- **Engagement:** ${customer.engagementScore}/100
- **Kênh ưa thích:** ${customer.channelPreference}
- **Tương tác cuối:** ${customer.lastInteractionDate}

### Rủi ro
- **Credit Risk:** ${getRiskLevel(customer.creditRiskScore, lang)} (${customer.creditRiskScore}/100)
- **Churn Risk:** ${getChurnRiskLevel(customer.churnRiskScore, lang)} (${customer.churnRiskScore}/100)
${customer.complaintStatus === 'Open' ? '\n⚠️ **CÓ KHIẾU NẠI ĐANG MỞ - Ưu tiên giải quyết!**' : ''}

### Cơ hội
${getSegmentOpportunity(customer.segment)}

---
*Bạn muốn tôi phân tích gì thêm về khách hàng này?*` : `## 📋 Customer Brief: ${customer.name}

### Basic Information
- **Segment:** ${customer.segment} - ${customer.microSegment}
- **Tier:** ${customer.segmentTier}
- **Status:** ${customer.status}
- **Tenure:** ${customer.tenure} years

### Financial
- **Balance:** ${formatCurrency(customer.totalBalance, lang)}
- **3-Month Trend:** ${customer.transactionTrend3M >= 0 ? '📈 Growing' : '📉 Declining'} ${Math.abs(customer.transactionTrend3M)}%
- **Opportunity Score:** ${customer.opportunityScore}/100

### Products & Engagement
- **Products:** ${customer.productCount}
- **Digital Score:** ${customer.digitalScore}/100
- **Engagement:** ${customer.engagementScore}/100
- **Preferred Channel:** ${customer.channelPreference}
- **Last Interaction:** ${customer.lastInteractionDate}

### Risk
- **Credit Risk:** ${getRiskLevel(customer.creditRiskScore, lang)} (${customer.creditRiskScore}/100)
- **Churn Risk:** ${getChurnRiskLevel(customer.churnRiskScore, lang)} (${customer.churnRiskScore}/100)
${customer.complaintStatus === 'Open' ? '\n⚠️ **OPEN COMPLAINT - Prioritize resolution!**' : ''}

### Opportunities
${getSegmentOpportunity(customer.segment)}

---
*What would you like me to analyze further?*`;
}

// Generate Customer Detail
function generateCustomerDetail(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  return isVi ? `## 📝 Chi tiết khách hàng: ${customer.name}

### Thông tin cá nhân
- **Họ và tên:** ${customer.name}
- **Phân khúc:** ${customer.segment}
- **Micro-segment:** ${customer.microSegment}
- **Tier:** ${customer.segmentTier}
- **Trạng thái:** ${customer.status}
- **Thời gian gắn bó:** ${customer.tenure} năm

### Thông tin doanh nghiệp
${customer.industry ? `- **Ngành:** ${customer.industry}` : ''}
${customer.employeeCount ? `- **Số nhân viên:** ${customer.employeeCount.toLocaleString()}` : ''}
${customer.annualRevenue ? `- **Doanh thu/năm:** ${formatCurrency(customer.annualRevenue, lang)}` : ''}

### Thông tin liên hệ
${customer.channelPreference ? `- **Kênh ưa thích:** ${customer.channelPreference}` : ''}
- **Tương tác cuối:** ${customer.lastInteractionDate}

### Điểm số
| Chỉ số | Giá trị |
|---------|---------|
| Digital Score | ${customer.digitalScore}/100 |
| Engagement | ${customer.engagementScore}/100 |
| Opportunity | ${customer.opportunityScore}/100 |
| Credit Risk | ${customer.creditRiskScore}/100 |
| Churn Risk | ${customer.churnRiskScore}/100 |

---
*Bạn muốn xem thêm thông tin nào?*` : `## 📝 Customer Details: ${customer.name}

### Personal Information
- **Full Name:** ${customer.name}
- **Segment:** ${customer.segment}
- **Micro-segment:** ${customer.microSegment}
- **Tier:** ${customer.segmentTier}
- **Status:** ${customer.status}
- **Tenure:** ${customer.tenure} years

### Business Information
${customer.industry ? `- **Industry:** ${customer.industry}` : ''}
${customer.employeeCount ? `- **Employees:** ${customer.employeeCount.toLocaleString()}` : ''}
${customer.annualRevenue ? `- **Annual Revenue:** ${formatCurrency(customer.annualRevenue, lang)}` : ''}

### Contact Information
${customer.channelPreference ? `- **Preferred Channel:** ${customer.channelPreference}` : ''}
- **Last Interaction:** ${customer.lastInteractionDate}

### Score Summary
| Metric | Value |
|---------|-------|
| Digital Score | ${customer.digitalScore}/100 |
| Engagement | ${customer.engagementScore}/100 |
| Opportunity | ${customer.opportunityScore}/100 |
| Credit Risk | ${customer.creditRiskScore}/100 |
| Churn Risk | ${customer.churnRiskScore}/100 |

---
*What else would you like to know?*`;
}

// Generate Customer Products
function generateCustomerProducts(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  // Sample products based on segment
  const sampleProducts: Record<string, string[]> = {
    'VIP': ['Premium Banking Package', 'Wealth Management', 'Platinum Credit Card', 'Private Investment'],
    'Mass Affluent': ['Priority Savings', 'Investment Fund', 'Premium Debit Card', 'Travel Insurance'],
    'Individual': ['Savings Account', 'Credit Card', 'Personal Loan', 'Basic Insurance'],
    'SME': ['Business Account', 'Business Credit', 'Working Capital Loan', 'Trade Finance'],
    'Corporate': ['Corporate Account', 'Corporate Credit Facility', 'Cash Management', 'Treasury Services'],
    'Mass Market': ['Basic Savings', 'Digital Account', 'Mobile Banking'],
  };
  
  const products = sampleProducts[customer.segment] || sampleProducts['Individual'];
  
  return isVi ? `## 💳 Sản phẩm đang sử dụng: ${customer.name}

### Tổng quan
- **Số sản phẩm:** ${customer.productCount}
- **Phân khúc:** ${customer.segment}

### Sản phẩm có thể có (dựa trên phân khúc)
${products.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

### Điểm số liên quan
- **Digital Score:** ${customer.digitalScore}/100
- **Engagement:** ${customer.engagementScore}/100

### Cơ hội mở rộng
${customer.opportunityScore > 60 ? '✅ Khách có tiềm năng mua thêm sản phẩm' : '⏳ Cần nuôi dưỡng thêm'}

---
*Nên tôi gợi ý sản phẩm cross-sell/upsell không?*` : `## 💳 Current Products: ${customer.name}

### Overview
- **Number of Products:** ${customer.productCount}
- **Segment:** ${customer.segment}

### Possible Products (based on segment)
${products.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

### Related Scores
- **Digital Score:** ${customer.digitalScore}/100
- **Engagement:** ${customer.engagementScore}/100

### Expansion Opportunity
${customer.opportunityScore > 60 ? '✅ Customer has potential to buy more products' : '⏳ Need more nurturing'}

---
*Should I suggest cross-sell/upsell products?*`;
}

// Generate Customer Interactions
function generateCustomerInteractions(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  return isVi ? `## 📅 Lịch sử tương tác: ${customer.name}

### Tổng quan
- **Tương tác cuối:** ${customer.lastInteractionDate}
- **Kênh ưa thích:** ${customer.channelPreference}
- **Engagement Score:** ${customer.engagementScore}/100

### Xu hướng tương tác
${customer.engagementScore > 70 ? '✅ **Tích cực** - Khách thường xuyên tương tác' : customer.engagementScore > 40 ? '⚠️ **Trung bình** - Cần tăng cường touchpoint' : '🔴 **Thấp** - Cần chủ động liên hệ'}

### Chiến lược tiếp cận
1. **Kênh:** ${customer.channelPreference}
2. **Tần suất:** ${customer.engagementScore > 70 ? '1-2 lần/tuần' : customer.engagementScore > 40 ? '1 lần/tuần' : '2-3 lần/tuần'}
3. **Nội dung:** ${customer.engagementScore > 70 ? 'Cập nhật sản phẩm mới, ưu đãi' : 'Thăm hỏi, cập nhật nhu cầu'}

### Khuyến nghị
${customer.churnRiskScore > 50 ? '⚠️ **Ưu tiên cao** - Tăng tần suất liên hệ' : '✅ Duy trì lịch liên hệ định kỳ'}

---
*Nên tôi tạo task follow-up không?*` : `## 📅 Interaction History: ${customer.name}

### Overview
- **Last Interaction:** ${customer.lastInteractionDate}
- **Preferred Channel:** ${customer.channelPreference}
- **Engagement Score:** ${customer.engagementScore}/100

### Interaction Trend
${customer.engagementScore > 70 ? '✅ **Active** - Customer engages regularly' : customer.engagementScore > 40 ? '⚠️ **Moderate** - Need more touchpoints' : '🔴 **Low** - Proactive outreach needed'}

### Approach Strategy
1. **Channel:** ${customer.channelPreference}
2. **Frequency:** ${customer.engagementScore > 70 ? '1-2 times/week' : customer.engagementScore > 40 ? '1 time/week' : '2-3 times/week'}
3. **Content:** ${customer.engagementScore > 70 ? 'Product updates, special offers' : 'Check-ins, needs updates'}

### Recommendations
${customer.churnRiskScore > 50 ? '⚠️ **High priority** - Increase contact frequency' : '✅ Maintain regular contact schedule'}

---
*Should I create a follow-up task?*`;
}

// Generate Customer Financial
function generateCustomerFinancial(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  return isVi ? `## 💰 Tình hình tài chính: ${customer.name}

### Số dư & Giao dịch
- **Số dư TB:** ${formatCurrency(customer.totalBalance, lang)}
- **Xu hướng 3 tháng:** ${customer.transactionTrend3M >= 0 ? '📈 Tăng' : '📉 Giảm'} ${Math.abs(customer.transactionTrend3M)}%

### Phân tích
${customer.transactionTrend3M >= 0 ? '✅ **Xu hướng tích cực** - Số dư và hoạt động giao dịch tăng' : '⚠️ **Cần theo dõi** - Số dư có xu hướng giảm'}

### Điểm số liên quan
| Chỉ số | Giá trị | Đánh giá |
|---------|---------|-----------|
| Credit Risk | ${customer.creditRiskScore}/100 | ${customer.creditRiskScore > 70 ? '⚠️ Cao' : customer.creditRiskScore > 40 ? '⚠️ TB' : '✅ Thấp'} |
| Opportunity | ${customer.opportunityScore}/100 | ${customer.opportunityScore > 70 ? '✅ Cao' : customer.opportunityScore > 40 ? '⚠️ TB' : '❌ Thấp'} |
| Churn Risk | ${customer.churnRiskScore}/100 | ${customer.churnRiskScore > 70 ? '⚠️ Cao' : customer.churnRiskScore > 40 ? '⚠️ TB' : '✅ Thấp'} |

### Khuyến nghị sản phẩm
${customer.opportunityScore > 60 && customer.creditRiskScore < 60 ? '✅ Phù hợp với các sản phẩm tín dụng và đầu tư' : '⚠️ Thận trọng với sản phẩm tín dụng'}

---
*Nên tôi phân tích rủi ro chi tiết hơn không?*` : `## 💰 Financial Status: ${customer.name}

### Balance & Transactions
- **Average Balance:** ${formatCurrency(customer.totalBalance, lang)}
- **3-Month Trend:** ${customer.transactionTrend3M >= 0 ? '📈 Increasing' : '📉 Decreasing'} ${Math.abs(customer.transactionTrend3M)}%

### Analysis
${customer.transactionTrend3M >= 0 ? '✅ **Positive Trend** - Balance and transaction activity increasing' : '⚠️ **Monitor** - Balance showing declining trend'}

### Related Scores
| Metric | Value | Assessment |
|--------|-------|------------|
| Credit Risk | ${customer.creditRiskScore}/100 | ${customer.creditRiskScore > 70 ? '⚠️ High' : customer.creditRiskScore > 40 ? '⚠️ Med' : '✅ Low'} |
| Opportunity | ${customer.opportunityScore}/100 | ${customer.opportunityScore > 70 ? '✅ High' : customer.opportunityScore > 40 ? '⚠️ Med' : '❌ Low'} |
| Churn Risk | ${customer.churnRiskScore}/100 | ${customer.churnRiskScore > 70 ? '⚠️ High' : customer.churnRiskScore > 40 ? '⚠️ Med' : '✅ Low'} |

### Product Recommendations
${customer.opportunityScore > 60 && customer.creditRiskScore < 60 ? '✅ Suitable for credit and investment products' : '⚠️ Be cautious with credit products'}

---
*Should I analyze risk in more detail?*`;
}

// Generate Next Best Action
function generateNextBestAction(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  // Determine priority action based on customer state
  let priorityAction: string;
  let reasoning: string;
  
  if (customer.complaintStatus === 'Open') {
    priorityAction = isVi ? '🔴 Ưu tiên giải quyết khiếu nại' : '🔴 Prioritize complaint resolution';
    reasoning = isVi ? 'Khách có khiếu nại chưa xử lý - ảnh hưởng đến satisfaction và có thể gây churn' : 'Customer has unresolved complaint - affects satisfaction and may cause churn';
  } else if (customer.churnRiskScore > 60) {
    priorityAction = isVi ? '🟠 Gọi điện retention trong 24h' : '🟠 Call for retention within 24h';
    reasoning = isVi ? 'Churn risk cao - cần liên hệ sớm để giữ chân khách' : 'High churn risk - need to contact soon to retain customer';
  } else if (customer.creditRiskScore > 70) {
    priorityAction = isVi ? '🟡 Thận trọng với credit products' : '🟡 Be cautious with credit products';
    reasoning = isVi ? 'Credit risk cao - cần đánh giá kỹ trước khi đề xuất tín dụng' : 'High credit risk - need careful assessment before credit proposals';
  } else if (customer.opportunityScore > 70) {
    priorityAction = isVi ? '🟢 Đề xuất sản phẩm mới' : '🟢 Propose new products';
    reasoning = isVi ? 'Cơ hội cross-sell/upsell cao - khách có tiềm năng mua thêm' : 'High cross-sell/upsell opportunity - customer has potential to buy more';
  } else {
    priorityAction = isVi ? '🔵 Duy trì touchpoint định kỳ' : '🔵 Maintain regular touchpoints';
    reasoning = isVi ? 'Khách ổn định - duy trì mối quan hệ và cập nhật thông tin' : 'Customer is stable - maintain relationship and update information';
  }
  
  return isVi ? `## 🎯 Hành động đề xuất cho ${customer.name}

### Hành động ưu tiên
**${priorityAction}**

### Lý do
${reasoning}

### Phân tích chi tiết
- **Satisfaction Score:** ${customer.engagementScore}/100
- **Opportunity Score:** ${customer.opportunityScore}/100
- **Digital Readiness:** ${customer.digitalScore}/100

### Kênh liên lạc khuyến nghị
${customer.channelPreference}

### Script mở đầu cuộc gọi
> "Xin chào ${customer.name}, đây là [Tên RM] từ OceanBank. Tôi muốn trao đổi về tài khoản và các sản phẩm của quý khách."

### Bước tiếp theo
1. ${customer.channelPreference.includes('Phone') || customer.channelPreference.includes('Điện thoại') ? 'Gọi điện' : 'Gửi message'} cho khách
2. Xác nhận nhu cầu hiện tại
3. Đề xuất sản phẩm phù hợp (nếu không có complaint)
4. Lên lịch follow-up

---
*Cần tôi tạo kịch bản gọi chi tiết hoặc tạo task không?*` : `## 🎯 Recommended Next Action for ${customer.name}

### Priority Action
**${priorityAction}**

### Reasoning
${reasoning}

### Detailed Analysis
- **Satisfaction Score:** ${customer.engagementScore}/100
- **Opportunity Score:** ${customer.opportunityScore}/100
- **Digital Readiness:** ${customer.digitalScore}/100

### Recommended Contact Channel
${customer.channelPreference}

### Opening Script
> "Hello ${customer.name}, this is [RM Name] from OceanBank. I'd like to discuss your account and our products."

### Next Steps
1. ${customer.channelPreference.includes('Phone') || customer.channelPreference.includes('Phone') ? 'Call' : 'Send message'} the customer
2. Confirm current needs
3. Propose suitable products (if no complaint)
4. Schedule follow-up

---
*Should I generate a detailed call script or create a task?*`;
}

// Generate Product Recommendation
function generateProductRecommendation(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  // Block sales if complaint is open
  if (customer.complaintStatus === 'Open') {
    return isVi ? `## ❌ Không đề xuất bán hàng lúc này

**Lý do:** Khách hàng ${customer.name} đang có khiếu nại chưa được giải quyết.

⚠️ **Nguyên tắc an toàn:** Ưu tiên giải quyết khiếu nại trước khi bán hàng.

### Hành động khuyến nghị
1. Giải quyết khiếu nại của khách
2. Xác nhận khách hài lòng sau khi xử lý
3. Sau đó mới đề xuất sản phẩm mới

---
*Cần tôi hỗ trợ xử lý khiếu nại không?*` : `## ❌ Not recommending sales at this time

**Reason:** Customer ${customer.name} has an unresolved complaint.

⚠️ **Safety rule:** Prioritize complaint resolution before sales.

### Recommended Actions
1. Resolve customer's complaint
2. Confirm customer satisfaction after resolution
3. Then propose new products

---
*Need help with complaint handling?*`;
  }
  
  // Segment-specific recommendations
  const segmentProducts: Record<string, { crossSell: string[]; upsell: string[] }> = {
    'VIP': {
      crossSell: ['Wealth Management', 'Premium Credit Card', 'Private Banking Services', 'Investment Advisory'],
      upsell: ['Upgrade to Priority Banking', 'Family Package', 'Premium Insurance']
    },
    'Mass Affluent': {
      crossSell: ['Investment Fund', 'Life Insurance', 'Premium Debit Card', 'Travel Insurance'],
      upsell: ['Upgrade to VIP', 'Premium Package', 'Wealth Management Lite']
    },
    'Individual': {
      crossSell: ['Credit Card', 'Personal Loan', 'Online Savings', 'Mobile Insurance'],
      upsell: ['Premium Credit Card', 'Education Loan', 'Home Loan']
    },
    'SME': {
      crossSell: ['Business Credit Card', 'Working Capital Loan', 'Trade Finance', 'Payroll Service'],
      upsell: ['Enterprise Package', 'International Trade Services', 'Treasury Management']
    },
    'Corporate': {
      crossSell: ['Corporate Credit Facility', 'Cash Management', 'Trade Finance', 'Supply Chain Finance'],
      upsell: ['Global Banking Services', 'Investment Banking', 'M&A Advisory']
    },
    'Mass Market': {
      crossSell: ['Savings Account Upgrade', 'Basic Insurance', 'Mobile Recharge Service'],
      upsell: ['Digital Savings', 'Basic Investment', 'Premium Account']
    }
  };
  
  const products = segmentProducts[customer.segment] || segmentProducts['Individual'];
  
  return isVi ? `## 🛒 Gợi ý sản phẩm cho ${customer.name}

### Phân khúc: ${customer.segment}
**Điểm cơ hội:** ${customer.opportunityScore}/100

### Cross-sell opportunities (${products.crossSell.length})
${products.crossSell.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

### Upsell opportunities (${products.upsell.length})
${products.upsell.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

### Điểm sẵn sàng
| Tiêu chí | Điểm |
|----------|------|
| Digital Score | ${customer.digitalScore}/100 |
| Engagement | ${customer.engagementScore}/100 |
| Credit Risk | ${customer.creditRiskScore}/100 |
| Sản phẩm hiện tại | ${customer.productCount} sản phẩm |

### Ưu tiên
${customer.opportunityScore > 70 ? '✅ **Ưu tiên cao** - Khách có tiềm năng mua thêm' : '⏳ **Ưu tiên trung bình** - Tiếp tục nuôi dưỡng'}

### Lưu ý
${customer.creditRiskScore > 60 ? '⚠️ Thận trọng với sản phẩm tín dụng' : '✅ Phù hợp với các sản phẩm tiêu dùng'}

---
*Cần tôi tạo email giới thiệu sản phẩm hoặc kịch bản gọi không?*` : `## 🛒 Product Recommendations for ${customer.name}

### Segment: ${customer.segment}
**Opportunity Score:** ${customer.opportunityScore}/100

### Cross-sell opportunities (${products.crossSell.length})
${products.crossSell.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

### Upsell opportunities (${products.upsell.length})
${products.upsell.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

### Readiness Score
| Criteria | Score |
|----------|-------|
| Digital Score | ${customer.digitalScore}/100 |
| Engagement | ${customer.engagementScore}/100 |
| Credit Risk | ${customer.creditRiskScore}/100 |
| Current Products | ${customer.productCount} products |

### Priority
${customer.opportunityScore > 70 ? '✅ **High priority** - Customer has potential to buy more' : '⏳ **Medium priority** - Continue nurturing'}

### Note
${customer.creditRiskScore > 60 ? '⚠️ Be cautious with credit products' : '✅ Suitable for consumer products'}

---
*Should I create a product introduction email or call script?*`;
}

// Generate Call Script
function generateCallScript(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  let openingContext: string;
  let mainTopic: string;
  
  if (customer.complaintStatus === 'Open') {
    openingContext = isVi ? 'Hỗ trợ giải quyết khiếu nại' : 'Support with complaint resolution';
    mainTopic = isVi ? 'Lắng nghe và giải quyết khiếu nại của khách' : 'Listen and resolve customer complaint';
  } else if (customer.churnRiskScore > 60) {
    openingContext = isVi ? 'Retention - Giữ chân khách' : 'Retention - Retain customer';
    mainTopic = isVi ? 'Thăm hỏi và giới thiệu sản phẩm mới' : 'Check in and introduce new products';
  } else {
    openingContext = isVi ? 'Relationship - Duy trì mối quan hệ' : 'Relationship - Maintain relationship';
    mainTopic = isVi ? 'Cập nhật nhu cầu và giới thiệu sản phẩm' : 'Update needs and introduce products';
  }
  
  return isVi ? `## 📞 Kịch bản gọi cho ${customer.name}

### Context: ${openingContext}
### Phân khúc: ${customer.segment} | ${customer.segmentTier}

---

### 1. Mở đầu (30 giây)
> "Xin chào ${customer.name}, đây là [Tên RM] từ OceanBank. Tôi đang liên hệ để ${mainTopic}. Quý khách có 5 phút trò chuyện không ạ?"

**Nếu khách đồng ý:** Tiếp tục
**Nếu khách không tiện:** "Vậy tôi sẽ hẹn lịch gọi lại vào thời gian thuận tiện cho quý khách."

---

### 2. Nội dung chính (3-5 phút)
${customer.complaintStatus === 'Open' ? `
**Xử lý khiếu nại:**
1. Lắng nghe toàn bộ vấn đề của khách
2. Ghi nhận và cam kết thời gian xử lý
3. Hỏi về mong muốn của khách
4. Xác nhận lại thông tin và hẹn follow-up
` : `
**Cập nhật thông tin:**
1. Hỏi tình hình hiện tại của khách/doanh nghiệp
2. Xác nhận nhu cầu sản phẩm hiện tại
3. ${customer.opportunityScore > 60 ? 'Giới thiệu 1-2 sản phẩm phù hợp' : 'Cập nhật thông tin tài khoản'}
4. Hỏi về kế hoạch tương lai
`}

---

### 3. Xử lý phản đối
| Phản đối | Trả lời |
|----------|---------|
| "Tôi không có thời gian" | "Chỉ mất 5 phút thôi ạ, tôi sẽ rất ngắn gọn" |
| "Tôi đã có đầy đủ sản phẩm" | "Đó là điều tuyệt vời, tôi chỉ muốn cập nhật thông tin thôi ạ" |
| "Gửi email cho tôi" | "Vâng, tôi sẽ gửi email chi tiết ngay sau cuộc gọi này" |

---

### 4. Kết thúc
> "Cảm ơn quý khách đã dành thời gian. Tôi sẽ gửi email tóm tắt và liên hệ lại sau. Chúc quý khách một ngày tốt lành!"

**Ghi chú sau cuộc gọi:**
- ${customer.complaintStatus === 'Open' ? 'Cập nhật trạng thái khiếu nại' : 'Tạo follow-up task nếu cần'}
- Ghi lại các thông tin khách cung cấp

---
*Cần tôi tạo email mẫu sau cuộc gọi không?*` : `## 📞 Call Script for ${customer.name}

### Context: ${openingContext}
### Segment: ${customer.segment} | ${customer.segmentTier}

---

### 1. Opening (30 seconds)
> "Hello ${customer.name}, this is [RM Name] from OceanBank. I'm calling to ${mainTopic}. Do you have 5 minutes to chat?"

**If customer agrees:** Continue
**If customer is busy:** "I'll schedule a call back at a more convenient time."

---

### 2. Main Content (3-5 minutes)
${customer.complaintStatus === 'Open' ? `
**Complaint Handling:**
1. Listen to the customer's full concern
2. Document and commit to resolution timeline
3. Ask about customer's expectations
4. Confirm information and schedule follow-up
` : `
**Update Information:**
1. Ask about customer's current situation
2. Confirm current product needs
3. ${customer.opportunityScore > 60 ? 'Introduce 1-2 suitable products' : 'Update account information'}
4. Ask about future plans
`}

---

### 3. Objection Handling
| Objection | Response |
|-----------|----------|
| "I don't have time" | "It will only take 5 minutes, I'll be quick" |
| "I already have enough products" | "That's great, I just want to update your information" |
| "Send me an email" | "Yes, I'll send a detailed email after this call" |

---

### 4. Closing
> "Thank you for your time. I'll send a summary email and follow up later. Have a great day!"

**Post-call notes:**
- ${customer.complaintStatus === 'Open' ? 'Update complaint status' : 'Create follow-up task if needed'}
- Record any information customer provided

---
*Should I create a follow-up email template?*`;
}

// Generate Risk Analysis
function generateRiskAnalysis(customer: CustomerContext, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  const creditRiskLevel = getRiskLevel(customer.creditRiskScore, lang);
  const churnRiskLevel = customer.churnRiskScore > 70 ? (isVi ? 'Cao' : 'High') : 
                          customer.churnRiskScore > 40 ? (isVi ? 'Trung bình' : 'Medium') : 
                          (isVi ? 'Thấp' : 'Low');
  
  return isVi ? `## ⚠️ Phân tích rủi ro: ${customer.name}

### Credit Risk Score: ${customer.creditRiskScore}/100
**Mức độ:** ${creditRiskLevel}

**Các yếu tố đánh giá:**
${customer.creditRiskScore > 60 ? '- ⚠️ Điểm rủi ro cao - cần thận trọng' : '- ✅ Điểm rủi ro ở mức chấp nhận được'}
${customer.transactionTrend3M < 0 ? '- ⚠️ Số giao dịch giảm 3 tháng gần đây' : '- ✅ Xu hướng giao dịch ổn định/tăng'}
${customer.engagementScore < 50 ? '- ⚠️ Engagement thấp - có thể không hài lòng' : '- ✅ Engagement tốt'}

### Churn Risk Score: ${customer.churnRiskScore}/100
**Mức độ:** ${churnRiskLevel}

**Dấu hiệu cảnh báo:**
${customer.churnRiskScore > 60 ? '- 🔴 Rủi ro churn cao - cần hành động ngay' : customer.churnRiskScore > 40 ? '- 🟡 Rủi ro trung bình - theo dõi' : '- 🟢 Rủi ro thấp - ổn định'}
${customer.digitalScore < 50 ? '- ⚠️ Digital adoption thấp - có thể không hài lòng với digital channels' : '- ✅ Digital adoption tốt'}
${customer.lastInteractionDate ? `- 📅 Lần tương tác cuối: ${customer.lastInteractionDate}` : ''}

### Khuyến nghị
| Loại rủi ro | Hành động |
|-------------|-----------|
| Credit | ${customer.creditRiskScore > 70 ? '❌ Không đề xuất credit products mới' : customer.creditRiskScore > 50 ? '⚠️ Thận trọng, đánh giá kỹ' : '✅ Có thể đề xuất'} |
| Churn | ${customer.churnRiskScore > 60 ? '🔴 Gọi retention trong 24h' : '⏳ Lên lịch call định kỳ'} |

### Cảnh báo rủi ro
${customer.complaintStatus === 'Open' ? '⚠️ **CÓ KHIẾU NẠI ĐANG MỞ** - Ưu tiên xử lý complaint trước' : ''}

---
*Cần tôi phân tích chi tiết hơn hoặc tạo kịch bản retention không?*` : `## ⚠️ Risk Analysis: ${customer.name}

### Credit Risk Score: ${customer.creditRiskScore}/100
**Level:** ${creditRiskLevel}

**Assessment factors:**
${customer.creditRiskScore > 60 ? '- ⚠️ High risk score - be cautious' : '- ✅ Risk score within acceptable range'}
${customer.transactionTrend3M < 0 ? '- ⚠️ Transaction volume decreased in last 3 months' : '- ✅ Stable/growing transaction trend'}
${customer.engagementScore < 50 ? '- ⚠️ Low engagement - may be dissatisfied' : '- ✅ Good engagement'}

### Churn Risk Score: ${customer.churnRiskScore}/100
**Level:** ${churnRiskLevel}

**Warning signs:**
${customer.churnRiskScore > 60 ? '- 🔴 High churn risk - need immediate action' : customer.churnRiskScore > 40 ? '- 🟡 Medium churn risk - monitor' : '- 🟢 Low churn risk - stable'}
${customer.digitalScore < 50 ? '- ⚠️ Low digital adoption - may be dissatisfied with digital channels' : '- ✅ Good digital adoption'}
${customer.lastInteractionDate ? `- 📅 Last interaction: ${customer.lastInteractionDate}` : ''}

### Recommendations
| Risk Type | Action |
|-----------|--------|
| Credit | ${customer.creditRiskScore > 70 ? '❌ Do not propose new credit products' : customer.creditRiskScore > 50 ? '⚠️ Be cautious, evaluate carefully' : '✅ Can propose'} |
| Churn | ${customer.churnRiskScore > 60 ? '🔴 Call for retention within 24h' : '⏳ Schedule regular calls'} |

### Risk Warnings
${customer.complaintStatus === 'Open' ? '⚠️ **OPEN COMPLAINT** - Prioritize complaint resolution first' : ''}

---
*Need me to analyze further or create a retention script?*`;
}

// Generate Create Task response
function generateCreateTask(customer: CustomerContext, intent: string, message: string, lang: 'vi' | 'en'): string {
  const isVi = lang === 'vi';
  
  // Parse due date from message if available
  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Default 3 days
  
  if (/sau\s*(\d+)\s*ngày/i.test(message) || /in\s*(\d+)\s*days?/i.test(message)) {
    const match = message.match(/(\d+)/);
    if (match) {
      dueDate.setDate(dueDate.getDate() + parseInt(match[1]));
    }
  } else if (/tuần\s*này|this week/i.test(message)) {
    const daysUntilFriday = 5 - new Date().getDay();
    dueDate.setDate(dueDate.getDate() + (daysUntilFriday > 0 ? daysUntilFriday : 7));
  } else if (/ngày|mai|tomorrow|next/i.test(message)) {
    dueDate.setDate(dueDate.getDate() + 1);
  }
  
  const dueDateStr = dueDate.toISOString().split('T')[0];
  
  let taskTitle: string;
  let taskType: string;
  let priority: string;
  
  if (customer.complaintStatus === 'Open') {
    taskTitle = isVi ? `Giải quyết khiếu nại - ${customer.name}` : `Resolve complaint - ${customer.name}`;
    taskType = 'Complaint';
    priority = 'High';
  } else if (customer.churnRiskScore > 60) {
    taskTitle = isVi ? `Retention call - ${customer.name}` : `Retention call - ${customer.name}`;
    taskType = 'Call';
    priority = 'High';
  } else if (intent === 'call_script' || /gọi|call/i.test(message)) {
    taskTitle = isVi ? `Gọi điện tư vấn - ${customer.name}` : `Consultation call - ${customer.name}`;
    taskType = 'Call';
    priority = 'Medium';
  } else if (/email|mail/i.test(message)) {
    taskTitle = isVi ? `Gửi email - ${customer.name}` : `Send email - ${customer.name}`;
    taskType = 'Email';
    priority = 'Medium';
  } else {
    taskTitle = isVi ? `Follow-up - ${customer.name}` : `Follow-up - ${customer.name}`;
    taskType = 'Follow-up';
    priority = 'Medium';
  }
  
  return isVi ? `## ✅ Đã tạo Task

### Task Details
| Trường | Giá trị |
|--------|---------|
| **Tiêu đề** | ${taskTitle} |
| **Khách hàng** | ${customer.name} |
| **Loại** | ${taskType} |
| **Ưu tiên** | ${priority} |
| **Hạn** | ${dueDateStr} |
| **Created By** | AI Assistant |

### Ghi chú
Task đã được tạo. Bạn có thể chỉnh sửa hoặc xóa trong trang Tasks.

### Hành động tiếp theo
1. Thực hiện task theo lịch
2. Cập nhật kết quả sau khi hoàn thành
3. Tạo task mới nếu cần

---
*Bạn muốn tôi làm gì thêm?*` : `## ✅ Task Created

### Task Details
| Field | Value |
|-------|-------|
| **Title** | ${taskTitle} |
| **Customer** | ${customer.name} |
| **Type** | ${taskType} |
| **Priority** | ${priority} |
| **Due Date** | ${dueDateStr} |
| **Created By** | AI Assistant |

### Notes
Task has been created. You can edit or delete in the Tasks page.

### Next Actions
1. Complete task on schedule
2. Update results after completion
3. Create new tasks if needed

---
*What else can I help you with?*`;
}

// Main response generator
export function generateResponse(options: ResponseOptions): { 
  response: string; 
  suggestedActions: Array<{ label: string; action: string }>;
} {
  const { intent, message, customer, language, conversationHistory } = options;
  const isVi = language === 'vi';
  
  // If no customer context
  if (!customer) {
    return {
      response: isVi 
        ? 'Vui lòng chọn một khách hàng trước để AI có thể phân tích chính xác.\n\nBạn có thể:\n1. Chọn khách hàng từ danh sách\n2. Nhắn tên khách hàng cụ thể (VD: "tóm tắt Blue Ocean Logistics")'
        : 'Please select a customer first so AI can analyze accurately.\n\nYou can:\n1. Select a customer from the list\n2. Mention a specific customer name (e.g., "summarize Blue Ocean Logistics")',
      suggestedActions: [
        { label: isVi ? 'Chọn khách hàng' : 'Select Customer', action: 'select_customer' }
      ]
    };
  }
  
  // Generate response based on intent
  let response: string;
  let suggestedActions: Array<{ label: string; action: string }> = [];
  
  switch (intent) {
    case 'customer_brief':
    case 'summarize':
      response = generateCustomerBrief(customer, language);
      suggestedActions = [
        { label: isVi ? 'Hành động tiếp theo' : 'Next Best Action', action: 'next_best_action' },
        { label: isVi ? 'Gợi ý sản phẩm' : 'Product Recommendation', action: 'product_recommendation' },
        { label: isVi ? 'Phân tích rủi ro' : 'Risk Analysis', action: 'risk_analysis' },
        { label: isVi ? 'Tạo task' : 'Create Task', action: 'create_task' }
      ];
      break;
      
    case 'customer_detail':
      response = generateCustomerDetail(customer, language);
      suggestedActions = [
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' },
        { label: isVi ? 'Sản phẩm' : 'Products', action: 'customer_products' },
        { label: isVi ? 'Tài chính' : 'Financial', action: 'customer_financial' }
      ];
      break;
      
    case 'customer_products':
      response = generateCustomerProducts(customer, language);
      suggestedActions = [
        { label: isVi ? 'Gợi ý sản phẩm' : 'Product Recommendation', action: 'product_recommendation' },
        { label: isVi ? 'Cross-sell' : 'Cross-sell', action: 'cross_sell' },
        { label: isVi ? 'Upsell' : 'Upsell', action: 'upsell' }
      ];
      break;
      
    case 'customer_interactions':
      response = generateCustomerInteractions(customer, language);
      suggestedActions = [
        { label: isVi ? 'Tạo task follow-up' : 'Create Follow-up', action: 'create_task' },
        { label: isVi ? 'Kịch bản gọi' : 'Call Script', action: 'call_script' },
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' }
      ];
      break;
      
    case 'customer_financial':
      response = generateCustomerFinancial(customer, language);
      suggestedActions = [
        { label: isVi ? 'Phân tích rủi ro' : 'Risk Analysis', action: 'risk_analysis' },
        { label: isVi ? 'Gợi ý sản phẩm' : 'Product Recommendation', action: 'product_recommendation' },
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' }
      ];
      break;
      
    case 'next_best_action':
      response = generateNextBestAction(customer, language);
      suggestedActions = [
        { label: isVi ? 'Kịch bản gọi' : 'Call Script', action: 'call_script' },
        { label: isVi ? 'Tạo task' : 'Create Task', action: 'create_task' },
        { label: isVi ? 'Gợi ý sản phẩm' : 'Product Recommendation', action: 'product_recommendation' }
      ];
      break;
      
    case 'product_recommendation':
    case 'cross_sell':
    case 'upsell':
    case 'pre_approved_offer':
      response = generateProductRecommendation(customer, language);
      suggestedActions = [
        { label: isVi ? 'Kịch bản gọi' : 'Call Script', action: 'call_script' },
        { label: isVi ? 'Email mẫu' : 'Email Template', action: 'email_template' },
        { label: isVi ? 'Tạo task follow-up' : 'Create Follow-up', action: 'create_task' }
      ];
      break;
      
    case 'call_script':
      response = generateCallScript(customer, language);
      suggestedActions = [
        { label: isVi ? 'Email mẫu' : 'Email Template', action: 'email_template' },
        { label: isVi ? 'Tạo task' : 'Create Task', action: 'create_task' },
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' }
      ];
      break;
      
    case 'email_template':
      response = isVi 
        ? `## 📧 Mẫu Email cho ${customer.name}

### Subject: Cập nhật tài khoản OceanBank - ${new Date().toLocaleDateString('vi-VN')}

---

Kính gửi ${customer.name},

Cảm ơn quý khách đã sử dụng dịch vụ của OceanBank.

Trong thời gian tới, chúng tôi muốn cập nhật thông tin và giới thiệu các sản phẩm mới phù hợp với quý khách.

${customer.opportunityScore > 60 ? `Chúng tôi nhận thấy quý khách có thể quan tâm đến:\n- [Sản phẩm phù hợp]\n- [Ưu đãi đặc biệt]` : 'Chúng tôi luôn sẵn sàng hỗ trợ quý khách về mọi vấn đề liên quan đến tài khoản.'}

Xin vui lòng liên hệ lại nếu có thắc mắc.

Trân trọng,
[Tên RM]
OceanBank`

        : `## 📧 Email Template for ${customer.name}

### Subject: OceanBank Account Update - ${new Date().toLocaleDateString('en-US')}

---

Dear ${customer.name},

Thank you for banking with OceanBank.

We would like to update your information and introduce new products suitable for you.

${customer.opportunityScore > 60 ? `We noticed you might be interested in:\n- [Suitable product]\n- [Special offer]` : 'We are always ready to assist you with any account-related matters.'}

Please feel free to reach out if you have any questions.

Best regards,
[RM Name]
OceanBank`;

      suggestedActions = [
        { label: isVi ? 'Kịch bản gọi' : 'Call Script', action: 'call_script' },
        { label: isVi ? 'Tạo task' : 'Create Task', action: 'create_task' }
      ];
      break;
      
    case 'risk_analysis':
    case 'churn_risk':
      response = generateRiskAnalysis(customer, language);
      suggestedActions = [
        { label: isVi ? 'Hành động tiếp theo' : 'Next Best Action', action: 'next_best_action' },
        { label: isVi ? 'Kịch bản retention' : 'Retention Script', action: 'call_script' },
        { label: isVi ? 'Tạo task ưu tiên' : 'Create Priority Task', action: 'create_task' }
      ];
      break;
      
    case 'create_task':
      response = generateCreateTask(customer, intent, message, language);
      suggestedActions = [
        { label: isVi ? 'Xem Tasks' : 'View Tasks', action: 'view_tasks' },
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' }
      ];
      break;
      
    case 'meeting_summary':
      response = isVi 
        ? `## 📝 Tóm tắt cuộc họp/thoại

### Khách hàng: ${customer.name}
### Ngày: ${new Date().toLocaleDateString('vi-VN')}
### Người ghi: AI Assistant

---

### Điểm chính thảo luận:
(Vui lòng nhập nội dung cuộc họp để tôi tạo tóm tắt)

### Hành động cần thực hiện:
- [ ]

### Follow-up cần thiết:
- [ ]

---

*Bạn có thể dán nội dung cuộc họp để tôi tạo tóm tắt chi tiết hơn.*`
        : `## 📝 Meeting/Call Summary

### Customer: ${customer.name}
### Date: ${new Date().toLocaleDateString('en-US')}
### Recorded by: AI Assistant

---

### Key Discussion Points:
(Please paste meeting content for me to create a detailed summary)

### Actions Required:
- [ ]

### Follow-up Needed:
- [ ]

---

*You can paste meeting content for me to create a more detailed summary.*`;
      suggestedActions = [
        { label: isVi ? 'Tạo task follow-up' : 'Create Follow-up Task', action: 'create_task' },
        { label: isVi ? 'Tạo CRM note' : 'Create CRM Note', action: 'create_note' }
      ];
      break;
      
    case 'complaint_handling':
      response = isVi
        ? `## 🔧 Hướng dẫn xử lý khiếu nại: ${customer.name}

${customer.complaintStatus === 'Open' ? '⚠️ **KHÁCH HÀNG ĐANG CÓ KHIẾU NẠI CHƯA GIẢI QUYẾT**' : '✅ Khách hàng không có khiếu nại đang mở'}

### Nguyên tắc xử lý:
1. **Lắng nghe** - Để khách trình bày hết vấn đề
2. **Empathy** - Thể hiện sự thấu hiểu
3. **Cam kết** - Đưa ra timeline cụ thể
4. **Follow-up** - Liên hệ lại sau khi xử lý

### Script:
> "Tôi rất tiếc khi nghe về trải nghiệm không tốt của quý khách. Tôi hiểu sự bất tiện này đã gây ra. Tôi cam kết sẽ xử lý và liên hệ lại quý khách trong vòng [X] ngày."

### Bước tiếp theo:
1. Ghi nhận chi tiết khiếu nại
2. Tạo task xử lý ưu tiên cao
3. Liên hệ bộ phận liên quan
4. Cập nhật trạng thái cho khách

---
*Cần tôi tạo task xử lý khiếu nại không?*`
        : `## 🔧 Complaint Handling Guide: ${customer.name}

${customer.complaintStatus === 'Open' ? '⚠️ **CUSTOMER HAS UNRESOLVED COMPLAINT**' : '✅ Customer has no open complaints'}

### Handling Principles:
1. **Listen** - Let customer explain the full issue
2. **Empathy** - Show understanding
3. **Commit** - Provide specific timeline
4. **Follow-up** - Contact after resolution

### Script:
> "I'm sorry to hear about your negative experience. I understand the inconvenience this has caused. I commit to resolving this and will follow up with you within [X] days."

### Next Steps:
1. Document complaint details
2. Create high-priority task
3. Contact relevant department
4. Update status for customer

---
*Should I create a complaint handling task?*`;
      suggestedActions = [
        { label: isVi ? 'Tạo task ưu tiên' : 'Create Priority Task', action: 'create_task' },
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' }
      ];
      break;
      
    case 'lead_qualification':
      response = isVi
        ? `## 🎯 Lead Qualification: ${customer.name}

### Lead Score: ${customer.opportunityScore}/100
**Phân loại:** ${customer.opportunityScore > 70 ? 'Hot Lead - Ưu tiên cao' : customer.opportunityScore > 50 ? 'Warm Lead - Theo dõi' : 'Cold Lead - Nuôi dưỡng'}

### BANT Assessment:
- **Budget (Ngân sách):** ${customer.totalBalance > 1000000000 ? '✅ Cao' : customer.totalBalance > 100000000 ? '⚠️ Trung bình' : '❌ Thấp'}
- **Authority (Quyết định):** ⚠️ Cần xác minh
- **Need (Nhu cầu):** ${customer.opportunityScore > 60 ? '✅ Rõ ràng' : '⚠️ Cần khám phá thêm'}
- **Timeline (Thời gian):** ⚠️ Cần xác minh

### Khuyến nghị:
${customer.opportunityScore > 70 ? '✅ **Hot Lead** - Liên hệ trong 24h' : customer.opportunityScore > 50 ? '⏳ **Warm Lead** - Liên hệ trong tuần' : '❄️ **Cold Lead** - Nuôi dưỡng định kỳ'}`
        : `## 🎯 Lead Qualification: ${customer.name}

### Lead Score: ${customer.opportunityScore}/100
**Classification:** ${customer.opportunityScore > 70 ? 'Hot Lead - High Priority' : customer.opportunityScore > 50 ? 'Warm Lead - Follow up' : 'Cold Lead - Nurture'}

### BANT Assessment:
- **Budget:** ${customer.totalBalance > 1000000000 ? '✅ High' : customer.totalBalance > 100000000 ? '⚠️ Medium' : '❌ Low'}
- **Authority:** ⚠️ Need to verify
- **Need:** ${customer.opportunityScore > 60 ? '✅ Clear' : '⚠️ Need to explore more'}
- **Timeline:** ⚠️ Need to verify

### Recommendations:
${customer.opportunityScore > 70 ? '✅ **Hot Lead** - Contact within 24h' : customer.opportunityScore > 50 ? '⏳ **Warm Lead** - Contact this week' : '❄️ **Cold Lead** - Regular nurture'}`;
      suggestedActions = [
        { label: isVi ? 'Hành động tiếp theo' : 'Next Best Action', action: 'next_best_action' },
        { label: isVi ? 'Tạo task' : 'Create Task', action: 'create_task' }
      ];
      break;
      
    case 'campaign_suggestion':
      response = isVi
        ? `## 📢 Gợi ý chiến dịch cho ${customer.name}

### Phân khúc: ${customer.segment}

### Chiến dịch phù hợp:
1. **Cross-sell Campaign** - Giới thiệu sản phẩm bổ sung
2. **Retention Campaign** - ${customer.churnRiskScore > 50 ? '⚠️ Ưu tiên cao - Churn risk cao' : 'Duy trì khách hàng'}
3. **Digital Adoption** - Khuyến khích sử dụng digital channels
4. **Loyalty Program** - Tích điểm và ưu đãi

### Timing khuyến nghị:
${customer.lastInteractionDate ? `- Lần tương tác cuối: ${customer.lastInteractionDate}\n- Khuyến nghị: ${new Date(customer.lastInteractionDate) > new Date(Date.now() - 7*24*60*60*1000) ? '✅ Thời điểm phù hợp để tiếp cận' : '⏳ Có thể tiếp cận lại'}` : ''}`
        : `## 📢 Campaign Suggestions for ${customer.name}

### Segment: ${customer.segment}

### Suitable Campaigns:
1. **Cross-sell Campaign** - Introduce additional products
2. **Retention Campaign** - ${customer.churnRiskScore > 50 ? '⚠️ High priority - High churn risk' : 'Customer retention'}
3. **Digital Adoption** - Encourage digital channel usage
4. **Loyalty Program** - Points and rewards

### Recommended Timing:
${customer.lastInteractionDate ? `- Last interaction: ${customer.lastInteractionDate}\n- Recommendation: ${new Date(customer.lastInteractionDate) > new Date(Date.now() - 7*24*60*60*1000) ? '✅ Good time to reach out' : '⏳ Can reach out again'}` : ''}`;
      suggestedActions = [
        { label: isVi ? 'Tạo task campaign' : 'Create Campaign Task', action: 'create_task' },
        { label: isVi ? 'Xem Campaigns' : 'View Campaigns', action: 'view_campaigns' }
      ];
      break;
      
    case 'explain_recommendation':
      response = isVi
        ? `## 💡 Giải thích đề xuất

Để có thể giải thích chi tiết, vui lòng cho tôi biết bạn đang hỏi về đề xuất nào.

Tôi có thể giải thích:
- Tại sao đề xuất sản phẩm này
- Tại sao khuyến nghị hành động này
- Lý do đưa ra risk warning
- Ý nghĩa của các chỉ số

**Ví dụ:** "Vì sao nên bán insurance cho khách này?"`
        : `## 💡 Explain Recommendation

To provide a detailed explanation, please tell me which recommendation you're asking about.

I can explain:
- Why this product is recommended
- Why this action is suggested
- The reasoning behind risk warnings
- The meaning of various scores

**Example:** "Why recommend insurance for this customer?"`;
      suggestedActions = [
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' },
        { label: isVi ? 'Gợi ý sản phẩm' : 'Product Recommendation', action: 'product_recommendation' }
      ];
      break;
      
    default:
      response = isVi
        ? `## 🤖 RM Copilot - ${customer.name}

Xin chào! Tôi có thể giúp bạn với khách hàng này:

### Các tính năng chính:
1. **Tóm tắt** - Xem thông tin tổng quan về khách hàng
2. **Hành động** - Gợi ý bước tiếp theo
3. **Sản phẩm** - Cross-sell & upsell opportunities
4. **Rủi ro** - Credit risk & churn risk analysis
5. **Kịch bản** - Tạo script gọi điện/email
6. **Task** - Tạo công việc follow-up

### Ví dụ câu hỏi:
- "tóm tắt khách này"
- "khách này nên bán gì"
- "phân tích rủi ro"
- "tạo task gọi lại sau 2 ngày"

Bạn muốn tôi làm gì?`
        : `## 🤖 RM Copilot - ${customer.name}

Hello! I can help you with this customer:

### Main Features:
1. **Brief** - View customer overview
2. **Action** - Suggest next steps
3. **Products** - Cross-sell & upsell opportunities
4. **Risk** - Credit risk & churn risk analysis
5. **Script** - Generate call/email scripts
6. **Task** - Create follow-up tasks

### Example Questions:
- "summarize this customer"
- "what to sell this customer"
- "analyze risk"
- "create task to call in 2 days"

What would you like me to do?`;
      suggestedActions = [
        { label: isVi ? 'Tóm tắt KH' : 'Customer Brief', action: 'customer_brief' },
        { label: isVi ? 'Hành động tiếp theo' : 'Next Best Action', action: 'next_best_action' },
        { label: isVi ? 'Gợi ý sản phẩm' : 'Product Recommendation', action: 'product_recommendation' }
      ];
  }
  
  return { response, suggestedActions };
}

// Convert mock customer to CustomerContext
export function convertToCustomerContext(mockCustomer: any): CustomerContext {
  return {
    id: mockCustomer.id,
    name: mockCustomer.name,
    segment: mockCustomer.segment || 'Individual',
    microSegment: mockCustomer.microSegment || '',
    status: mockCustomer.status || 'Active',
    totalBalance: mockCustomer.averageBalance || 0,
    averageBalance: mockCustomer.averageBalance || 0,
    digitalScore: mockCustomer.digitalAdoptionScore || mockCustomer.digitalScore || 50,
    churnRiskScore: mockCustomer.churnRiskScore || 30,
    creditRiskScore: mockCustomer.creditRiskScore || 30,
    complaintStatus: mockCustomer.complaintStatus || 'Resolved',
    productCount: mockCustomer.productCount || mockCustomer.products?.length || 1,
    transactionTrend3M: mockCustomer.transactionTrend3M || 0,
    lastInteractionDate: mockCustomer.lastInteractionDate || new Date().toISOString().split('T')[0],
    opportunityScore: mockCustomer.opportunityScore || 50,
    segmentTier: mockCustomer.segmentTier || mockCustomer.tier || 'Standard',
    tenure: mockCustomer.tenure || 1,
    engagementScore: mockCustomer.engagementScore || 60,
    channelPreference: mockCustomer.preferredChannel || mockCustomer.channelPreference || 'Phone',
    industry: mockCustomer.industry,
    employeeCount: mockCustomer.employeeCount,
    annualRevenue: mockCustomer.annualRevenue
  };
}
