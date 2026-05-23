// ============================================
// Assistant Engine
// ============================================
import { 
  AssistantAction, 
  AssistantResponse, 
  Customer, 
  Task,
  Lead,
  Offer,
  CustomerBrief,
  NextBestAction
} from './types';
import { getCustomerById } from '@/data/mock-customers';
import { generateCustomerBrief, summarizeCustomerHistory } from './customer-intelligence-engine';
import { generateNextBestOffer, generateCrossSellOffers, generateUpsellOffers, generatePreApprovedOffers } from './sales-recommendation-engine';
import { generateNextBestAction, createTaskFromAction } from './next-best-action-engine';
import { calculateChurnRisk } from './retention-engine';
import { calculateCreditRiskScore, detectFraudRiskSignals, explainRisk } from './risk-engine';
import { scoreLead, qualifyLead } from './lead-engine';
import { mockRMs } from '@/data/mock-rms';
import { mockLeads } from '@/data/mock-leads';

let taskIdCounter = 100;

export async function handleAssistantAction(
  action: AssistantAction,
  customerId: string,
  payload?: Record<string, unknown>
): Promise<AssistantResponse> {
  const customer = getCustomerById(customerId);
  if (!customer) {
    return { message: 'Customer not found. Please provide a valid customer ID.' };
  }

  switch (action) {
    case 'summarize_customer':
      return summarizeCustomerAction(customer);
    
    case 'summarize_history':
      return summarizeHistoryAction(customer);
    
    case 'suggest_next_best_action':
      return suggestNextBestActionAction(customer);
    
    case 'suggest_next_best_offer':
      return suggestNextBestOfferAction(customer);
    
    case 'suggest_cross_sell':
      return suggestCrossSellAction(customer);
    
    case 'suggest_upsell':
      return suggestUpsellAction(customer);
    
    case 'generate_call_script':
      return generateCallScriptAction(customer, payload?.productToExplain as string);
    
    case 'generate_email_script':
      return generateEmailScriptAction(customer, payload?.productToExplain as string);
    
    case 'summarize_conversation':
      return summarizeConversationAction(customer, payload?.meetingNote as string);
    
    case 'create_follow_up_task':
      return createFollowUpTaskAction(customer, payload?.taskDetails as Record<string, string>);
    
    case 'explain_credit_risk':
      return explainCreditRiskAction(customer);
    
    case 'explain_churn_risk':
      return explainChurnRiskAction(customer);
    
    case 'explain_fraud_signal':
      return explainFraudSignalAction(customer);
    
    case 'check_missing_documents':
      return checkMissingDocumentsAction(customer);
    
    case 'generate_preapproved_offer':
      return generatePreApprovedOfferAction(customer);
    
    case 'route_lead':
      return routeLeadAction(customer);
    
    default:
      return { message: `Action "${action}" is not recognized.` };
  }
}

function summarizeCustomerAction(customer: Customer): AssistantResponse {
  const brief = generateCustomerBrief(customer.id);
  if (!brief) {
    return { message: 'Unable to generate customer summary.' };
  }

  const message = `## Customer Brief: ${customer.name}

**Segment:** ${customer.segment} | **Micro-segment:** ${customer.microSegment}

### Summary
${brief.summary}

### Key Insights
${brief.keyInsights.map((i, idx) => `${idx + 1}. ${i}`).join('\n') || 'None'}

### Risk Factors
${brief.riskFactors.map((r, idx) => `${idx + 1}. ${r}`).join('\n') || 'None identified'}

### Opportunities
${brief.opportunities.map((o, idx) => `${idx + 1}. ${o}`).join('\n') || 'None identified'}

### Quick Stats
- Products: ${customer.productCount}
- Balance: ${formatCurrency(customer.averageBalance)}
- Digital Score: ${customer.digitalAdoptionScore}/100
- Last Contact: ${customer.lastInteractionDate}
`;

  return { message };
}

function summarizeHistoryAction(customer: Customer): AssistantResponse {
  const history = summarizeCustomerHistory(customer.id);
  return { message: history, summary: history };
}

function suggestNextBestActionAction(customer: Customer): AssistantResponse {
  const action = generateNextBestAction(customer.id);
  if (!action) {
    return { message: 'Unable to generate next best action.' };
  }

  const message = `## Next Best Action for ${customer.name}

**Action:** ${action.title}
**Priority:** ${action.priority}
**Recommended Channel:** ${action.recommendedChannel}
**Due Date:** ${action.dueDateSuggestion}

### Reasoning
${action.reason}

### Recommended Script Opening
"${getScriptOpening(customer, action.recommendedChannel)}"
`;

  return { message };
}

function suggestNextBestOfferAction(customer: Customer): AssistantResponse {
  const offer = generateNextBestOffer(customer.id);
  if (!offer) {
    return { message: 'No specific offer recommendation at this time. Consider cross-sell or upsell opportunities.' };
  }

  const message = `## Next Best Offer for ${customer.name}

**Product:** ${offer.productName}
**Score:** ${offer.score}/100
**Type:** ${offer.offerType}
**Channel:** ${offer.suggestedChannel}
**Eligibility:** ${offer.eligibility}

### Why This Product?
${offer.reason}

${offer.riskWarning ? `⚠️ **Risk Warning:** ${offer.riskWarning}` : ''}

### Suggested Approach
${offer.suggestedScript || 'Reach out via ' + offer.suggestedChannel + ' to discuss this product opportunity.'}
`;

  return { message, offer };
}

function suggestCrossSellAction(customer: Customer): AssistantResponse {
  const offers = generateCrossSellOffers(customer.id);
  if (offers.length === 0) {
    return { message: 'No cross-sell opportunities identified at this time.' };
  }

  const topOffers = offers.slice(0, 3);
  const message = `## Cross-Sell Opportunities for ${customer.name}

${topOffers.map((offer, idx) => `
### ${idx + 1}. ${offer.productName}
- **Score:** ${offer.score}/100
- **Reason:** ${offer.reason}
- **Channel:** ${offer.suggestedChannel}
`).join('\n')}
`;

  return { message };
}

function suggestUpsellAction(customer: Customer): AssistantResponse {
  const offers = generateUpsellOffers(customer.id);
  if (offers.length === 0) {
    return { message: 'No upsell opportunities identified at this time.' };
  }

  const message = `## Upsell Opportunities for ${customer.name}

${offers.map((offer, idx) => `
### ${idx + 1}. ${offer.productName}
- **Score:** ${offer.score}/100
- **Reason:** ${offer.reason}
- **Channel:** ${offer.suggestedChannel}
`).join('\n')}
`;

  return { message };
}

function generateCallScriptAction(customer: Customer, productToExplain?: string): AssistantResponse {
  const script = `## Call Script for ${customer.name}

### Opening
"Xin chào ${customer.name}, đây là [Tên RM] từ OceanBank. Tôi đang gọi để trao đổi về một số sản phẩm và dịch vụ mà tôi nghĩ có thể hữu ích cho anh/chị."

### Key Points
${productToExplain ? getProductKeyPoints(customer, productToExplain) : getGeneralKeyPoints(customer)}

### Handling Objections
- Giá: "Chúng tôi có nhiều gói với mức phí linh hoạt phù hợp với nhu cầu của anh/chị"
- Thời gian: "Tôi có thể sắp xếp cuộc họp trực tiếp nếu anh/chị cần thảo luận chi tiết hơn"

### Closing
"Cảm ơn anh/chị đã dành thời gian. Tôi sẽ gửi email với thông tin chi tiết và sẽ liên hệ lại sau."
`;

  return { message: script, script };
}

function generateEmailScriptAction(customer: Customer, productToExplain?: string): AssistantResponse {
  const script = `## Email Template for ${customer.name}

**Subject:** Cập nhật sản phẩm từ OceanBank - ${new Date().toLocaleDateString('vi-VN')}

Kính gửi ${customer.name},

Tôi là [Tên RM], phụ trách tài khoản của quý khách tại OceanBank.

${productToExplain ? getEmailProductBody(customer, productToExplain) : getEmailGeneralBody(customer)}

Nếu anh/chị có bất kỳ câu hỏi nào, xin vui lòng liên hệ với tôi qua email này hoặc số điện thoại [SĐT].

Trân trọng,
[Tên RM]
OceanBank CRM Assistant
`;

  return { message: script, script };
}

function summarizeConversationAction(customer: Customer, meetingNote?: string): AssistantResponse {
  if (!meetingNote) {
    return { message: 'Please provide meeting notes to summarize.' };
  }

  const summary = `## Conversation Summary for ${customer.name}

**Date:** ${new Date().toLocaleDateString('vi-VN')}
**Channel:** Meeting

### Summary
${meetingNote.substring(0, 200)}${meetingNote.length > 200 ? '...' : ''}

### Detected Topics
- Product inquiry
- Service discussion
${meetingNote.toLowerCase().includes('complaint') ? '- Complaint raised' : ''}
${meetingNote.toLowerCase().includes('problem') || meetingNote.toLowerCase().includes('issue') ? '- Issue reported' : ''}

### Customer Sentiment
${meetingNote.toLowerCase().includes('happy') || meetingNote.toLowerCase().includes('satisfied') ? 'Positive - Customer seems satisfied' : ''}
${meetingNote.toLowerCase().includes('unhappy') || meetingNote.toLowerCase().includes('frustrat') ? 'Negative - Customer appears frustrated' : ''}
${meetingNote.toLowerCase().includes('neutral') ? 'Neutral' : 'To be determined from follow-up'}

### Recommended Next Steps
1. Send summary email to customer
2. Create follow-up task based on discussed items
3. ${meetingNote.toLowerCase().includes('complaint') ? 'Prioritize complaint resolution' : 'Continue with product/service discussion'}
`;

  return { message: summary, summary };
}

function createFollowUpTaskAction(customer: Customer, taskDetails?: Record<string, string>): AssistantResponse {
  const action = generateNextBestAction(customer.id);
  
  const task: Partial<Task> = {
    id: `task_${++taskIdCounter}`,
    customerId: customer.id,
    customerName: customer.name,
    title: taskDetails?.title || action?.title || 'Follow-up with customer',
    description: taskDetails?.description || action?.reason || 'Follow up based on AI recommendation',
    type: (taskDetails?.type as Task['type']) || (action?.recommendedChannel === 'Email' ? 'Email' : 'Call'),
    dueDate: taskDetails?.dueDate || action?.dueDateSuggestion || getDefaultDueDate(7),
    priority: (taskDetails?.priority as Task['priority']) || action?.priority || 'Medium',
    status: 'Pending',
    createdBy: 'AI Assistant',
  };

  return { 
    message: `## Follow-up Task Created for ${customer.name}

**Title:** ${task.title}
**Type:** ${task.type}
**Due Date:** ${task.dueDate}
**Priority:** ${task.priority}

**Description:** ${task.description}

Task has been added to your task list.`,
    task 
  };
}

function explainCreditRiskAction(customer: Customer): AssistantResponse {
  const creditRisk = calculateCreditRiskScore(customer.id);
  if (!creditRisk) {
    return { message: 'Unable to calculate credit risk.' };
  }

  const message = `## Credit Risk Assessment for ${customer.name}

**Risk Level:** ${creditRisk.level}
**Score:** ${creditRisk.score}/100

### Main Factors
${creditRisk.mainFactors.map((f, idx) => `${idx + 1}. ${f}`).join('\n')}

${creditRisk.warningForSales ? `### ⚠️ Sales Warning\n${creditRisk.warningForSales}` : ''}
`;

  return { message };
}

function explainChurnRiskAction(customer: Customer): AssistantResponse {
  const churnRisk = calculateChurnRisk(customer.id);

  const message = `## Churn Risk Assessment for ${customer.name}

**Risk Level:** ${churnRisk.level}
**Score:** ${churnRisk.score}/100

### Risk Factors
${churnRisk.factors.length > 0 
  ? churnRisk.factors.map((f, idx) => `${idx + 1}. ${f}`).join('\n')
  : 'No significant risk factors identified.'}

### Recommended Actions
${churnRisk.level === 'High' 
  ? '- Immediate retention outreach required\n- Consider special offer or incentive\n- Personal contact preferred'
  : churnRisk.level === 'Medium'
  ? '- Schedule check-in within 7 days\n- Review recent interactions\n- Consider personalized offer'
  : '- Maintain regular touchpoints\n- Continue relationship building'}
`;

  return { message };
}

function explainFraudSignalAction(customer: Customer): AssistantResponse {
  const fraudSignal = detectFraudRiskSignals(customer.id);

  if (!fraudSignal) {
    return { message: `No significant fraud signals detected for ${customer.name}. Account appears normal.` };
  }

  const message = `## Fraud Risk Analysis for ${customer.name}

**Fraud Score:** ${fraudSignal.score}/100

### Anomaly Type
${fraudSignal.anomalyType}

### Transaction Signal
${fraudSignal.transactionSignal}

### Recommended Review
${fraudSignal.recommendedReview}

⚠️ **Note:** This is a simulated fraud risk indicator for academic demonstration purposes only. Actual fraud detection requires integration with real-time transaction monitoring systems.
`;

  return { message };
}

function checkMissingDocumentsAction(customer: Customer): AssistantResponse {
  const message = `## Document Status for ${customer.name}

### Current Documents
- ID Card: Present
- Bank Statement: Present
${customer.segment === 'SME' || customer.segment === 'Corporate' ? '- Business License: Present\n- Financial Statement: Present\n- Tax Document: Present' : ''}

### Recommendations
${customer.complaintStatus === 'Open' ? '⚠️ Customer has an open complaint. Document any resolution communications.' : 'All required documents appear to be on file.'}

For a complete document audit, please use the Automation page.
`;

  return { message };
}

function generatePreApprovedOfferAction(customer: Customer): AssistantResponse {
  const offers = generatePreApprovedOffers(customer.id);

  if (offers.length === 0) {
    return { message: `No pre-approved offers available for ${customer.name} at this time. Consider a full credit review.` };
  }

  const message = `## Pre-Approved Offers for ${customer.name}

${offers.map((offer: Offer) => `
### ${offer.productName}
- **Eligibility:** ${offer.eligibility}
- **Score:** ${offer.score}/100
- **Reason:** ${offer.reason}
${offer.riskWarning ? `\n⚠️ **Important:** ${offer.riskWarning}` : ''}
`).join('\n')}

**Disclaimer:** These are simulated pre-approvals for academic demonstration purposes only. No actual credit decisions are made.
`;

  return { message };
}

function routeLeadAction(customer: Customer): AssistantResponse {
  // Find or create a lead for this customer
  const lead = mockLeads.find(l => l.customerId === customer.id);
  
  if (!lead) {
    // Create a simulated lead routing
    const score = scoreLead(customer, 'prod_001');
    const qualification = qualifyLead(score);
    
    return {
      message: `## Lead Routing for ${customer.name}

**Customer:** ${customer.name}
**Segment:** ${customer.segment}

**Recommended Route:** Based on customer profile and segment, this customer should be assigned to:
- **RM:** ${getRecommendedRM(customer).name}
- **Reason:** ${getRecommendedRMReason(customer)}
- **Lead Score:** ${score}
- **Qualification:** ${qualification}

**Alternative RMs:**
${mockRMs.slice(0, 3).map((rm, idx) => `${idx + 1}. ${rm.name} (${rm.region})`).join('\n')}
`
    };
  }

  return {
    message: `## Lead Routing for ${customer.name}

**Current Lead Status:** ${lead.status}
**Assigned RM:** ${lead.assignedRMName || 'Not assigned'}
**Lead Score:** ${lead.leadScore}
**Qualification:** ${lead.qualification}

**Recommendation:** ${lead.assignedRMName ? 'Current assignment appears appropriate.' : 'Assign to ' + getRecommendedRM(customer).name}
`
  };
}

// Helper functions
function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B VND';
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + 'M VND';
  return amount.toLocaleString() + ' VND';
}

function getRecommendedRM(customer: Customer) {
  // Simple routing - match by region first, then by expertise
  const regionMatch = mockRMs.find(rm => rm.region === customer.region);
  if (regionMatch) return regionMatch;
  return mockRMs[0];
}

function getRecommendedRMReason(customer: Customer): string {
  const rm = getRecommendedRM(customer);
  const expertise = rm.expertise.slice(0, 2).join(', ');
  return `Same region (${customer.region}) and expertise in ${expertise}. Current workload: ${rm.activeLeads} active leads.`;
}

function getScriptOpening(customer: Customer, channel: string): string {
  return `Xin chào ${customer.name}, đây là [Tên RM] từ OceanBank, ${channel === 'Call' ? 'tôi đang gọi' : 'tôi viết'} để trao đổi về ${customer.segment === 'Individual' ? 'các sản phẩm cá nhân' : 'các giải pháp ngân hàng cho doanh nghiệp'}.`;
}

function getProductKeyPoints(customer: Customer, product: string): string {
  return `- Sản phẩm: ${product}
- Phù hợp với: ${customer.segment} - ${customer.microSegment}
- Lợi ích chính: Theo nhu cầu của khách hàng
- Điều kiện: Theo chính sách ngân hàng hiện tại`;
}

function getGeneralKeyPoints(customer: Customer): string {
  return `- Cập nhật sản phẩm mới
- Kiểm tra nhu cầu hiện tại
- Giải đáp thắc mắc (nếu có)`;
}

function getEmailProductBody(customer: Customer, product: string): string {
  return `Tôi muốn giới thiệu đến anh/chị sản phẩm ${product} - một giải pháp tài chính phù hợp với nhu cầu của anh/chị dựa trên hồ sơ tài khoản hiện tại.

Đặc biệt, với tư cách khách hàng ${customer.segment === 'Individual' ? 'cá nhân' : 'doanh nghiệp'}, anh/chị có thể được hưởng nhiều ưu đãi hấp dẫn.`;
}

function getEmailGeneralBody(customer: Customer): string {
  return `Tôi muốn cập nhật anh/chị về các sản phẩm và dịch vụ mới tại OceanBank mà có thể mang lại lợi ích cho anh/chị.

Như một phần trong cam kết chăm sóc khách hàng của chúng tôi, tôi sẽ thường xuyên chia sẻ thông tin về các sản phẩm phù hợp với nhu cầu của anh/chị.`;
}

function getDefaultDueDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}
