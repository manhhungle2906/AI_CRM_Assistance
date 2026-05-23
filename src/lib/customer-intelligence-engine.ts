// ============================================
// Customer Intelligence Engine
// ============================================
import { CustomerBrief } from './types';
import { getCustomerById } from '@/data/mock-customers';
import { getInteractionsByCustomer } from '@/data/mock-interactions';

export function generateCustomerBrief(customerId: string): CustomerBrief | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const opportunities: string[] = [];

  // Analyze transaction trend
  if (customer.transactionTrend3M > 15) {
    keyInsights.push(`Strong transaction growth of ${customer.transactionTrend3M}% over 3 months`);
    opportunities.push('Ready for credit expansion and new product introduction');
  } else if (customer.transactionTrend3M < -10) {
    keyInsights.push(`Declining transaction trend of ${customer.transactionTrend3M}%`);
    riskFactors.push('High churn risk - immediate retention action required');
  }

  // Analyze digital adoption
  if (customer.digitalAdoptionScore < 40) {
    keyInsights.push('Low digital adoption score of ' + customer.digitalAdoptionScore);
    opportunities.push('Digital banking activation can improve engagement');
  } else if (customer.digitalAdoptionScore > 80) {
    keyInsights.push('High digital adoption - digital-first engagement recommended');
  }

  // Analyze products
  if (customer.productCount === 1) {
    opportunities.push('Single product customer - cross-sell opportunity');
  } else if (customer.productCount >= 4) {
    keyInsights.push('Multi-product relationship - high customer value');
  }

  // Analyze balance
  if (customer.averageBalance > 1000000000) {
    keyInsights.push('High value customer with balance over 1B VND');
    opportunities.push('Wealth management and investment products');
  }

  // Analyze complaint
  if (customer.complaintStatus === 'Open') {
    riskFactors.push('Active complaint - resolution priority');
  }

  // Segment-specific insights
  if (customer.segment === 'SME') {
    if (customer.microSegment === 'SME Logistics' && customer.internationalTransactionCount > 20) {
      opportunities.push('Export/import business - Trade Finance and FX services');
    }
    if (customer.transactionTrend3M > 20) {
      opportunities.push('Growing SME - working capital and overdraft facilities');
    }
  }

  if (customer.segment === 'Individual') {
    if (customer.age && customer.age < 35) {
      opportunities.push('Young professional - credit card and insurance products');
    }
    if (customer.microSegment === 'Insurance Potential') {
      opportunities.push('Insurance cross-sell opportunity');
    }
  }

  if (customer.segment === 'Priority' || customer.segment === 'Affluent') {
    opportunities.push('Premium segment - wealth management and exclusive services');
  }

  // Risk assessment
  if (customer.churnRiskScore > 50) {
    riskFactors.push('High churn risk score of ' + customer.churnRiskScore);
  }

  if (customer.creditRiskScore > 40) {
    riskFactors.push('Medium-High credit risk - new credit requires review');
  }

  // Generate risk profile
  let riskProfile = 'Low';
  if (customer.creditRiskScore > 50 || customer.fraudSignalScore > 30) {
    riskProfile = 'High';
  } else if (customer.creditRiskScore > 30 || customer.fraudSignalScore > 15) {
    riskProfile = 'Medium';
  }

  // Generate next best actions
  const nextBestActions: string[] = [];
  if (opportunities.length > 0) {
    nextBestActions.push(`Suggest ${opportunities[0]}`);
  }
  if (riskFactors.length > 0) {
    nextBestActions.push(`Address: ${riskFactors[0]}`);
  }
  if (customer.complaintStatus === 'Open') {
    nextBestActions.push('Resolve customer complaint immediately');
  }

  return {
    customerId: customer.id,
    customerName: customer.name,
    segment: customer.segment,
    riskProfile,
    keyInsight: keyInsights[0] || 'No significant insights',
    summary: `${customer.name} is a ${customer.segment} customer${customer.industry ? ' in ' + customer.industry : ''} with ${customer.productCount} product(s). ${keyInsights.length > 0 ? keyInsights.join('. ') + '.' : ''}`,
    keyInsights,
    opportunities,
    opportunityFits: opportunities,
    riskFactors,
    nextBestActions,
  };
}

export function summarizeCustomerHistory(customerId: string): string {
  const customer = getCustomerById(customerId);
  if (!customer) return 'Customer not found';

  const interactions = getInteractionsByCustomer(customerId).slice(0, 5);
  
  let summary = `Customer Profile: ${customer.name}\n`;
  summary += `Segment: ${customer.segment} | Micro-segment: ${customer.microSegment}\n`;
  summary += `Products: ${customer.products.join(', ')}\n\n`;
  
  if (interactions.length > 0) {
    summary += `Recent Interactions:\n`;
    interactions.forEach((int) => {
      summary += `- ${int.date}: ${int.channel} - ${int.topic}\n`;
      summary += `  Sentiment: ${int.sentiment}\n`;
      if (int.nextStep) {
        summary += `  Next Step: ${int.nextStep}\n`;
      }
    });
  } else {
    summary += `No recent interactions recorded.\n`;
  }

  summary += `\nKey Metrics:\n`;
  summary += `- Transaction Trend (3M): ${customer.transactionTrend3M}%\n`;
  summary += `- Average Balance: ${formatCurrency(customer.averageBalance)}\n`;
  summary += `- Digital Adoption Score: ${customer.digitalAdoptionScore}/100\n`;
  summary += `- Churn Risk Score: ${customer.churnRiskScore}/100\n`;
  summary += `- Credit Risk Score: ${customer.creditRiskScore}/100\n`;

  if (customer.complaintStatus !== 'None') {
    summary += `\nComplaint Status: ${customer.complaintStatus}\n`;
  }

  return summary;
}

export function calculateOpportunityScore(customerId: string): number {
  const customer = getCustomerById(customerId);
  if (!customer) return 0;

  let score = 0;

  // Product gap (no products)
  if (customer.productCount === 1) score += 25;
  else if (customer.productCount === 2) score += 15;
  else if (customer.productCount === 3) score += 5;

  // Balance potential
  if (customer.averageBalance > 1000000000) score += 20;
  else if (customer.averageBalance > 500000000) score += 15;
  else if (customer.averageBalance > 100000000) score += 10;

  // Growth signal
  if (customer.transactionTrend3M > 20) score += 25;
  else if (customer.transactionTrend3M > 10) score += 15;
  else if (customer.transactionTrend3M > 0) score += 5;

  // Digital adoption
  if (customer.digitalAdoptionScore > 80) score += 15;
  else if (customer.digitalAdoptionScore > 50) score += 10;

  // Segment priority
  if (customer.segment === 'Priority' || customer.segment === 'Affluent') score += 15;
  else if (customer.segment === 'Corporate') score += 10;
  else if (customer.segment === 'SME') score += 8;

  // Risk adjustment
  if (customer.churnRiskScore > 50) score -= 15;
  if (customer.creditRiskScore > 60) score -= 10;
  if (customer.complaintStatus === 'Open') score -= 20;

  return Math.max(0, Math.min(100, score));
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + 'B VND';
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(0) + 'M VND';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K VND';
  }
  return amount + ' VND';
}
