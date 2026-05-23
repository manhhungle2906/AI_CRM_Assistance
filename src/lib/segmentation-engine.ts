// ============================================
// Segmentation Engine
// ============================================
import { Customer, CustomerSegment, MicroSegment } from './types';
import { mockCustomers } from '@/data/mock-customers';

export function assignSegment(customer: Customer): CustomerSegment {
  // Corporate: Large businesses with high volume
  if (customer.segment === 'Corporate') return 'Corporate';
  
  // Priority/Affluent: High value individual customers
  if (customer.segment === 'Priority') return 'Priority';
  if (customer.segment === 'Affluent') return 'Affluent';
  
  // SME: Business accounts with multiple products or high volume
  if (customer.segment === 'SME') return 'SME';
  
  // Mass: Low balance, low activity individuals
  if (customer.averageBalance < 50000000 && customer.digitalAdoptionScore < 50) {
    return 'Mass';
  }
  
  // Default to Individual
  return 'Individual';
}

export function assignMicroSegment(customer: Customer): MicroSegment {
  // Dormant High Balance
  if (customer.transactionTrend3M < -10 && customer.averageBalance > 500000000) {
    return 'Dormant High Balance';
  }
  
  // Complaint Sensitive
  if (customer.complaintStatus === 'Open') {
    return 'Complaint Sensitive';
  }
  
  // Loan Renewal Due
  if (customer.nextRenewalDate) {
    const renewalDate = new Date(customer.nextRenewalDate);
    const today = new Date();
    const daysUntilRenewal = Math.floor((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilRenewal <= 60) {
      return 'Loan Renewal Due';
    }
  }
  
  // Digital Low Adoption
  if (customer.digitalAdoptionScore < 40) {
    return 'Digital Low Adoption';
  }
  
  // SME specific segments
  if (customer.segment === 'SME') {
    const industry = customer.industry?.toLowerCase() || '';
    
    if (['logistics', 'transportation', 'distribution'].some(i => industry.includes(i))) {
      return 'SME Logistics';
    }
    
    if (['import', 'export', 'trading'].some(i => industry.includes(i))) {
      return 'Import Export Corporate';
    }
    
    return 'SME Retail';
  }
  
  // Corporate Import/Export
  if (customer.segment === 'Corporate' && customer.internationalTransactionCount > 30) {
    return 'Import Export Corporate';
  }
  
  // Individual segments
  if (customer.age && customer.age < 35 && customer.monthlyIncome && customer.monthlyIncome > 15000000) {
    return 'Salary Young Professional';
  }
  
  // Insurance Potential
  if (customer.industry && ['medical', 'healthcare', 'legal', 'education'].some(i => customer.industry!.toLowerCase().includes(i))) {
    if (customer.monthlyIncome && customer.monthlyIncome > 20000000) {
      return 'Insurance Potential';
    }
  }
  
  // High CASA Potential
  if (customer.casaBalance > 500000000 && customer.averageBalance > 1000000000) {
    return 'High CASA Potential';
  }
  
  // Default based on age for individuals
  if (customer.segment === 'Individual' || customer.segment === 'Priority' || customer.segment === 'Affluent') {
    return 'High CASA Potential';
  }
  
  return 'SME Retail';
}

export function getSegmentCounts(): Record<CustomerSegment, number> {
  const counts: Record<CustomerSegment, number> = {
    Individual: 0,
    SME: 0,
    Corporate: 0,
    Priority: 0,
    Mass: 0,
    Affluent: 0,
  };
  
  mockCustomers.forEach(customer => {
    counts[customer.segment]++;
  });
  
  return counts;
}

export function getMicroSegmentCounts(): Record<MicroSegment, number> {
  const counts: Record<MicroSegment, number> = {
    'Salary Young Professional': 0,
    'Dormant High Balance': 0,
    'SME Logistics': 0,
    'SME Retail': 0,
    'Import Export Corporate': 0,
    'Digital Low Adoption': 0,
    'Loan Renewal Due': 0,
    'Complaint Sensitive': 0,
    'High CASA Potential': 0,
    'Insurance Potential': 0,
  };
  
  mockCustomers.forEach(customer => {
    const microSegment = assignMicroSegment(customer);
    if (counts[microSegment] !== undefined) {
      counts[microSegment]++;
    }
  });
  
  return counts;
}

export function getSegmentDescription(segment: CustomerSegment): string {
  const descriptions: Record<CustomerSegment, string> = {
    Individual: 'Individual retail customers with personal banking needs',
    SME: 'Small and medium enterprises with business banking requirements',
    Corporate: 'Large corporate customers with complex banking needs',
    Priority: 'High-value individual customers with premium banking needs',
    Mass: 'Mass market customers with basic banking needs',
    Affluent: 'Ultra-high-net-worth customers with wealth management needs',
  };
  
  return descriptions[segment] || '';
}

export function getMicroSegmentDescription(microSegment: MicroSegment): string {
  const descriptions: Record<MicroSegment, string> = {
    'Salary Young Professional': 'Young employees (under 35) with stable salary income, typically digital-savvy',
    'Dormant High Balance': 'Customers with high balances but declining activity, retention risk',
    'SME Logistics': 'Logistics and transportation businesses with fleet and trade needs',
    'SME Retail': 'Retail and small businesses with day-to-day banking needs',
    'Import Export Corporate': 'Businesses engaged in international trade with FX and trade finance needs',
    'Digital Low Adoption': 'Customers with low digital engagement, requiring personal service',
    'Loan Renewal Due': 'Customers with upcoming loan renewals, opportunity for relationship review',
    'Complaint Sensitive': 'Customers with active complaints requiring immediate attention',
    'High CASA Potential': 'Customers with high CASA balances, potential for wealth services',
    'Insurance Potential': 'Customers in professional sectors with insurance product needs',
  };
  
  return descriptions[microSegment] || '';
}

export function getSegmentRecommendations(segment: CustomerSegment): string[] {
  const recommendations: Record<CustomerSegment, string[]> = {
    Individual: [
      'Credit Card - for spending and rewards',
      'Personal Loan - for flexible financing',
      'Savings Products - for wealth building',
      'Digital Banking - for convenience',
    ],
    SME: [
      'Business Account - core banking service',
      'SME Overdraft - for cash flow management',
      'Working Capital Loan - for growth financing',
      'Business Credit Card - for expenses',
    ],
    Corporate: [
      'Corporate Account - comprehensive banking',
      'Trade Finance - for import/export',
      'FX Services - for currency management',
      'Cash Management - for liquidity',
    ],
    Priority: [
      'Priority Banking - premium service',
      'Credit Cards - exclusive benefits',
      'Investment Products - wealth growth',
      'Insurance - protection planning',
    ],
    Mass: [
      'Basic Savings - for financial security',
      'Digital Banking - to build engagement',
      'Remittance - for money transfer needs',
    ],
    Affluent: [
      'Wealth Management - dedicated advisor',
      'Investment Account - exclusive products',
      'Home Loan - premium rates',
      'Insurance - comprehensive coverage',
    ],
  };
  
  return recommendations[segment] || [];
}
