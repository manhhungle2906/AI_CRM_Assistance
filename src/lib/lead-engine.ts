// ============================================
// Lead Engine
// ============================================
import { Lead, LeadStatus, LeadQualification, LeadSource } from './types';
import { Customer } from './types';
import { mockLeads, getLeadById, getLeadsByCustomer } from '@/data/mock-leads';
import { getCustomerById, mockCustomers } from '@/data/mock-customers';
import { getProductById, getProductsForSegment } from '@/data/mock-products';

let leadIdCounter = 100;

export function generateLeads(): Lead[] {
  const generatedLeads: Lead[] = [];
  
  mockCustomers.forEach(customer => {
    // Check for product gaps and generate leads
    const potentialLeads = analyzeProductGaps(customer);
    potentialLeads.forEach(productId => {
      const existingLeads = getLeadsByCustomer(customer.id);
      const hasActiveLead = existingLeads.some(
        l => l.suggestedProductId === productId && !['Lost', 'Disqualified', 'Converted'].includes(l.status)
      );
      
      if (!hasActiveLead) {
        const lead = createLead(customer, productId, 'AI Generated');
        if (lead) {
          generatedLeads.push(lead);
        }
      }
    });
  });
  
  return generatedLeads;
}

export function analyzeProductGaps(customer: Customer): string[] {
  const gaps: string[] = [];
  const existingProducts = customer.products.map(p => p.toLowerCase());
  
  // Credit Card gap
  if (customer.segment !== 'Corporate' && customer.segment !== 'SME' &&
      !existingProducts.some(p => p.includes('credit card'))) {
    if (customer.averageBalance > 50000000 || customer.monthlyIncome) {
      gaps.push('prod_001'); // Ocean Credit Card
    }
  }
  
  // Insurance gap
  if (!existingProducts.some(p => p.includes('insurance')) &&
      customer.averageBalance > 100000000) {
    gaps.push('prod_008'); // Life Insurance
  }
  
  // Deposit gap
  if (!existingProducts.some(p => p.includes('deposit')) && !existingProducts.some(p => p.includes('saving')) &&
      customer.averageBalance > 200000000) {
    gaps.push('prod_006'); // Term Deposit
  }
  
  // Digital Banking gap
  if (customer.digitalAdoptionScore < 50 && customer.segment !== 'Affluent') {
    gaps.push('prod_010'); // Digital Banking
  }
  
  // SME specific gaps
  if (customer.segment === 'SME') {
    // Overdraft gap
    if (!existingProducts.some(p => p.includes('overdraft')) &&
        customer.transactionTrend3M > 10) {
      gaps.push('prod_005'); // SME Overdraft
    }
    
    // Working Capital gap
    if (!existingProducts.some(p => p.includes('working capital')) &&
        customer.transactionTrend3M > 15) {
      gaps.push('prod_012'); // Working Capital Loan
    }
    
    // Business Card gap
    if (!existingProducts.some(p => p.includes('business card')) &&
        customer.averageBalance > 200000000) {
      gaps.push('prod_011'); // Ocean Business Card
    }
  }
  
  // Corporate specific gaps
  if (customer.segment === 'Corporate') {
    // Trade Finance gap
    if (customer.internationalTransactionCount > 20 &&
        !existingProducts.some(p => p.includes('trade'))) {
      gaps.push('prod_018'); // Trade Finance
    }
    
    // FX gap
    if (customer.internationalTransactionCount > 30 &&
        !existingProducts.some(p => p.includes('fx'))) {
      gaps.push('prod_020'); // FX Services
    }
  }
  
  // Priority/Affluent specific gaps
  if (customer.segment === 'Priority' || customer.segment === 'Affluent') {
    // Wealth Management gap
    if (customer.averageBalance > 2000000000 &&
        !existingProducts.some(p => p.includes('wealth'))) {
      gaps.push('prod_024'); // Wealth Management
    }
    
    // Investment Account gap
    if (customer.averageBalance > 1000000000 &&
        !existingProducts.some(p => p.includes('investment'))) {
      gaps.push('prod_025'); // Investment Account
    }
  }
  
  return gaps;
}

export function createLead(
  customer: Customer,
  productId: string,
  source: LeadSource
): Lead | null {
  const product = getProductById(productId);
  if (!product) return null;
  
  const leadScore = scoreLead(customer, productId);
  const qualification = qualifyLead(leadScore);
  
  leadIdCounter++;
  
  return {
    id: `lead_${leadIdCounter}`,
    customerId: customer.id,
    customerName: customer.name,
    source,
    suggestedProductId: productId,
    suggestedProductName: product.name,
    leadScore,
    qualification,
    status: 'New',
    reason: generateLeadReason(customer, product),
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export function scoreLead(customer: Customer, productId: string): number {
  let score = 0;
  
  // Stable transaction (+25 max)
  if (customer.transactionTrend3M > 15) score += 25;
  else if (customer.transactionTrend3M > 5) score += 15;
  else if (customer.transactionTrend3M > 0) score += 10;
  else if (customer.transactionTrend3M > -10) score += 5;
  
  // High balance (+20 max)
  if (customer.averageBalance > 1000000000) score += 20;
  else if (customer.averageBalance > 500000000) score += 15;
  else if (customer.averageBalance > 100000000) score += 10;
  else if (customer.averageBalance > 50000000) score += 5;
  
  // Product gap (+20 max)
  const hasProduct = customer.products.some(p => 
    p.toLowerCase().includes(getProductById(productId)?.name.toLowerCase() || '')
  );
  if (!hasProduct) score += 20;
  
  // Digital activity (+10 max)
  if (customer.digitalAdoptionScore > 80) score += 10;
  else if (customer.digitalAdoptionScore > 50) score += 5;
  
  // Segment priority (+10 max)
  if (customer.segment === 'Affluent' || customer.segment === 'Priority') score += 10;
  else if (customer.segment === 'Corporate') score += 8;
  else if (customer.segment === 'SME') score += 5;
  
  // Negative factors
  if (customer.creditRiskScore > 60) score -= 20;
  else if (customer.creditRiskScore > 40) score -= 10;
  
  if (customer.complaintStatus === 'Open') score -= 30;
  else if (customer.complaintStatus === 'Resolved') score += 5;
  
  if (customer.churnRiskScore > 60) score -= 15;
  
  // Recency of interaction
  const lastInteraction = new Date(customer.lastInteractionDate);
  const daysSinceInteraction = Math.floor((Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceInteraction < 30) score += 5;
  else if (daysSinceInteraction > 90) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

export function qualifyLead(leadScore: number): LeadQualification {
  if (leadScore >= 80) return 'Hot';
  if (leadScore >= 60) return 'Warm';
  if (leadScore >= 40) return 'Cold';
  return 'Disqualified';
}

export function qualifyLeadDetailed(lead: Lead): LeadQualification {
  const customer = getCustomerById(lead.customerId);
  if (!customer) return 'Disqualified';
  
  // Recalculate based on full customer profile
  const score = scoreLead(customer, lead.suggestedProductId);
  return qualifyLead(score);
}

export function disqualifyLead(lead: Lead, reason: string): Lead {
  return {
    ...lead,
    qualification: 'Disqualified',
    status: 'Disqualified',
    reason: `Disqualified: ${reason}. Original reason: ${lead.reason}`,
  };
}

export function generateLeadReason(customer: Customer, product: { id: string; name: string }): string {
  const reasons: string[] = [];
  
  if (customer.segment === 'SME') {
    if (product.id === 'prod_005') {
      reasons.push('Growing SME with positive cash flow');
      if (customer.transactionTrend3M > 15) {
        reasons.push(`${customer.transactionTrend3M}% transaction growth`);
      }
    }
    if (product.id === 'prod_011') {
      reasons.push('SME with business expense management needs');
    }
  }
  
  if (customer.segment === 'Individual' || customer.segment === 'Priority') {
    if (product.id === 'prod_001') {
      reasons.push('Individual customer with stable income');
      if (customer.digitalAdoptionScore > 70) {
        reasons.push('high digital adoption suggests product fit');
      }
    }
    if (product.id === 'prod_008') {
      reasons.push('Customer with insurance potential');
    }
  }
  
  if (customer.segment === 'Priority' || customer.segment === 'Affluent') {
    if (product.id === 'prod_024') {
      reasons.push(`High-value customer with ${formatBalance(customer.averageBalance)} balance`);
      reasons.push('No current wealth management relationship');
    }
  }
  
  if (customer.averageBalance > 500000000 && product.id === 'prod_006') {
    reasons.push('High balance customer suitable for term deposit');
  }
  
  if (customer.digitalAdoptionScore < 50 && product.id === 'prod_010') {
    reasons.push('Low digital adoption - activation opportunity');
  }
  
  return reasons.length > 0 
    ? reasons.join('. ') + '.'
    : 'Product opportunity identified based on customer profile.';
}

function formatBalance(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B';
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + 'M';
  return amount.toString();
}
