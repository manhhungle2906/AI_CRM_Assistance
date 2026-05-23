// ============================================
// Lead Routing Engine
// ============================================
import { Lead, RM, ProductCategory } from './types';
import { mockRMs, getRMById, getAvailableRMs } from '@/data/mock-rms';
import { getCustomerById } from '@/data/mock-customers';

export interface RoutingRecommendation {
  recommendedRM: RM;
  alternativeRMs: RM[];
  reason: string;
  score: number;
}

export function routeLeadToRM(lead: Lead): RoutingRecommendation {
  const customer = getCustomerById(lead.customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const candidates = rankRMCandidates(lead, mockRMs);
  
  if (candidates.length === 0) {
    throw new Error('No available RMs for routing');
  }

  return {
    recommendedRM: candidates[0],
    alternativeRMs: candidates.slice(1, 4),
    reason: generateRoutingReason(candidates[0], lead, customer),
    score: calculateRoutingScore(candidates[0], lead, customer),
  };
}

export function rankRMCandidates(lead: Lead, rms: RM[]): RM[] {
  const customer = getCustomerById(lead.customerId);
  
  const scored = rms.map(rm => ({
    rm,
    score: calculateRoutingScore(rm, lead, customer),
  }));

  // Sort by score descending
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.rm);
}

function calculateRoutingScore(rm: RM, lead: Lead, customer: ReturnType<typeof getCustomerById>): number {
  if (!customer) return 0;
  
  let score = 0;

  // Region match (most important)
  if (rm.region === customer.region) {
    score += 40;
  }

  // Product expertise match
  const productCategories = getProductCategories(lead.suggestedProductId);
  const hasExpertise = productCategories.some(cat => rm.expertise.includes(cat));
  if (hasExpertise) {
    score += 30;
  }

  // Workload - prefer RMs with lower active leads
  if (rm.activeLeads < 15) {
    score += 20;
  } else if (rm.activeLeads < 20) {
    score += 10;
  } else if (rm.activeLeads >= 25) {
    score -= 10; // Penalize overloaded RMs
  }

  // Conversion rate bonus
  if (rm.conversionRate > 0.4) {
    score += 15;
  } else if (rm.conversionRate > 0.3) {
    score += 10;
  } else if (rm.conversionRate > 0.2) {
    score += 5;
  }

  // Existing relationship preference
  if (customer.assignedRMId === rm.id) {
    score += 25; // Strong preference for existing relationship
  }

  // Segment expertise
  if (customer.segment === 'Corporate' && rm.expertise.includes('Corporate' as never)) {
    score += 15;
  }
  if (customer.segment === 'SME' && rm.expertise.includes('SME Banking')) {
    score += 15;
  }
  if ((customer.segment === 'Priority' || customer.segment === 'Affluent') && 
      (rm.expertise.includes('Wealth') || rm.expertise.includes('Insurance'))) {
    score += 20;
  }

  return Math.max(0, score);
}

function generateRoutingReason(rm: RM, lead: Lead, customer: ReturnType<typeof getCustomerById>): string {
  if (!customer) return 'Customer not found';

  const reasons: string[] = [];

  // Region
  if (rm.region === customer.region) {
    reasons.push(`same region (${customer.region})`);
  }

  // Expertise
  const productCategories = getProductCategories(lead.suggestedProductId);
  const matchedExpertise = productCategories.filter(cat => rm.expertise.includes(cat));
  if (matchedExpertise.length > 0) {
    reasons.push(`expertise in ${matchedExpertise.join(', ')}`);
  }

  // Workload
  if (rm.activeLeads < 20) {
    reasons.push(`manageable workload (${rm.activeLeads} active leads)`);
  }

  // Existing relationship
  if (customer.assignedRMId === rm.id) {
    reasons.push('existing customer relationship');
  }

  // Performance
  if (rm.conversionRate > 0.35) {
    reasons.push(`strong conversion rate (${(rm.conversionRate * 100).toFixed(0)}%)`);
  }

  return reasons.length > 0 
    ? `Matched because: ${reasons.join(', ')}.`
    : 'No strong matching criteria found.';
}

function getProductCategories(productId: string): ProductCategory[] {
  const productCategories: Record<string, ProductCategory[]> = {
    'prod_001': ['Card'],
    'prod_002': ['Card'],
    'prod_003': ['Loan'],
    'prod_004': ['Loan'],
    'prod_005': ['SME Banking'],
    'prod_006': ['Deposit'],
    'prod_007': ['Deposit'],
    'prod_008': ['Insurance'],
    'prod_009': ['Insurance'],
    'prod_010': ['Digital Banking'],
    'prod_011': ['Card'],
    'prod_012': ['SME Banking', 'Loan'],
    'prod_013': ['SME Banking', 'Loan'],
    'prod_014': ['SME Banking', 'Loan'],
    'prod_015': ['Loan'],
    'prod_016': ['Deposit'],
    'prod_017': ['Insurance'],
    'prod_018': ['Trade Finance'],
    'prod_019': ['Trade Finance'],
    'prod_020': ['FX', 'Trade Finance'],
    'prod_021': ['FX'],
    'prod_022': ['Digital Banking'],
    'prod_023': ['Payment'],
    'prod_024': ['Wealth'],
    'prod_025': ['Wealth'],
    'prod_026': ['Loan'],
    'prod_027': ['Payment'],
  };

  return productCategories[productId] || [];
}

export function getWorkloadComparison(rMId: string): {
  rm: RM;
  comparison: string;
} {
  const rm = getRMById(rMId);
  if (!rm) throw new Error('RM not found');

  const avgLeads = mockRMs.reduce((sum, r) => sum + r.activeLeads, 0) / mockRMs.length;
  
  let comparison: string;
  if (rm.activeLeads < avgLeads * 0.8) {
    comparison = `${rm.name} has below-average workload (${rm.activeLeads} vs ${avgLeads.toFixed(0)} avg)`;
  } else if (rm.activeLeads > avgLeads * 1.2) {
    comparison = `${rm.name} has above-average workload (${rm.activeLeads} vs ${avgLeads.toFixed(0)} avg)`;
  } else {
    comparison = `${rm.name} has average workload (${rm.activeLeads} vs ${avgLeads.toFixed(0)} avg)`;
  }

  return { rm, comparison };
}
