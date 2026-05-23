// ============================================
// Sales Recommendation Engine
// ============================================
import { Offer, OfferType, Customer } from './types';
import { getCustomerById, mockCustomers } from '@/data/mock-customers';
import { getProductById, getProductsForSegment } from '@/data/mock-products';
import { analyzeProductGaps } from './lead-engine';

let offerIdCounter = 100;

export function generateNextBestOffer(customerId: string): Offer | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  const productGaps = analyzeProductGaps(customer);
  if (productGaps.length === 0) return null;

  // Get the most relevant product
  const productId = productGaps[0];
  const product = getProductById(productId);
  if (!product) return null;

  const score = calculateOfferScore(customer, productId);
  const eligibility = checkEligibility(customer, productId);
  const reason = generateOfferReason(customer, product.name);

  offerIdCounter++;

  return {
    id: `offer_${offerIdCounter}`,
    customerId,
    customerName: customer.name,
    productId,
    productName: product.name,
    offerType: 'Next Best Offer',
    score,
    eligibility,
    reason,
    riskWarning: eligibility === 'Need Review' ? 'Credit review required for this product.' : undefined,
    suggestedChannel: getSuggestedChannel(customer),
    suggestedScript: generateOfferScript(customer, product.name),
  };
}

export function generateCrossSellOffers(customerId: string): Offer[] {
  const customer = getCustomerById(customerId);
  if (!customer) return [];

  const existingProducts = customer.products.map(p => p.toLowerCase());
  const offers: Offer[] = [];

  // Product-specific cross-sell recommendations
  const crossSellMap: Record<string, string[]> = {
    'salary account': ['prod_001', 'prod_006', 'prod_008'],
    'business account': ['prod_011', 'prod_005', 'prod_012'],
    'credit card': ['prod_008', 'prod_006'],
    'personal loan': ['prod_001', 'prod_010'],
    'home loan': ['prod_008', 'prod_006'],
    'term deposit': ['prod_007', 'prod_024'],
    'savings account': ['prod_008', 'prod_001'],
  };

  Object.entries(crossSellMap).forEach(([existingProduct, crossSellProducts]) => {
    if (existingProducts.some(p => p.includes(existingProduct))) {
      crossSellProducts.forEach(productId => {
        if (!existingProducts.some(p => p.includes(getProductById(productId)?.name.toLowerCase() || ''))) {
          const product = getProductById(productId);
          if (product) {
            const score = calculateOfferScore(customer, productId);
            const eligibility = checkEligibility(customer, productId);

            offers.push({
              id: `offer_${++offerIdCounter}`,
              customerId,
              customerName: customer.name,
              productId,
              productName: product.name,
              offerType: 'Cross-sell',
              score,
              eligibility,
              reason: `Customer has ${existingProduct}. ${product.name} complements this product.`,
              suggestedChannel: getSuggestedChannel(customer),
            });
          }
        }
      });
    }
  });

  return offers.sort((a, b) => b.score - a.score);
}

export function generateUpsellOffers(customerId: string): Offer[] {
  const customer = getCustomerById(customerId);
  if (!customer) return [];

  const offers: Offer[] = [];

  // Upsell mappings
  const upsellMap: [string, string, string][] = [
    ['Ocean Credit Card', 'prod_002', 'Upgrade to Platinum Card for exclusive benefits'],
    ['Ocean Business Card', 'prod_002', 'Upgrade to Platinum for business'],
    ['Personal Loan', 'prod_004', 'Upgrade to Home Loan for larger needs'],
    ['Term Deposit', 'prod_024', 'Upgrade to Wealth Management for higher returns'],
    ['Savings Account', 'prod_025', 'Upgrade to Investment Account'],
  ];

  upsellMap.forEach(([currentProduct, upsellProductId, reason]) => {
    if (customer.products.some(p => p.includes(currentProduct))) {
      const product = getProductById(upsellProductId);
      if (product) {
        const score = calculateOfferScore(customer, upsellProductId) + 10; // Bonus for upsell
        const eligibility = checkEligibility(customer, upsellProductId);

        offers.push({
          id: `offer_${++offerIdCounter}`,
          customerId,
          customerName: customer.name,
          productId: upsellProductId,
          productName: product.name,
          offerType: 'Upsell',
          score: Math.min(score, 100),
          eligibility,
          reason,
          suggestedChannel: 'Call',
        });
      }
    }
  });

  return offers.sort((a, b) => b.score - a.score);
}

export function generatePreApprovedOffers(customerId: string): Offer[] {
  const customer = getCustomerById(customerId);
  if (!customer) return [];

  const offers: Offer[] = [];

  // Check pre-approval eligibility
  const eligibilityScore = calculatePreApprovalScore(customer);

  if (eligibilityScore >= 70) {
    offers.push({
      id: `offer_${++offerIdCounter}`,
      customerId,
      customerName: customer.name,
      productId: 'prod_001',
      productName: 'Ocean Credit Card',
      offerType: 'Pre-approved',
      score: eligibilityScore,
      eligibility: 'Eligible',
      reason: `Pre-approved based on ${eligibilityScore}% eligibility score. Credit history and account standing meet criteria.`,
      riskWarning: 'This is a simulated pre-approval for academic demonstration purposes only.',
      suggestedChannel: 'Email',
    });
  }

  if (eligibilityScore >= 60 && customer.segment === 'SME') {
    offers.push({
      id: `offer_${++offerIdCounter}`,
      customerId,
      customerName: customer.name,
      productId: 'prod_005',
      productName: 'SME Overdraft',
      offerType: 'Pre-approved',
      score: eligibilityScore,
      eligibility: 'Eligible',
      reason: `Pre-approved overdraft facility based on business performance.`,
      riskWarning: 'This is a simulated pre-approval for academic demonstration purposes only.',
      suggestedChannel: 'Call',
    });
  }

  if (eligibilityScore >= 50 && customer.segment === 'Individual') {
    offers.push({
      id: `offer_${++offerIdCounter}`,
      customerId,
      customerName: customer.name,
      productId: 'prod_003',
      productName: 'Personal Loan',
      offerType: 'Pre-approved',
      score: eligibilityScore,
      eligibility: 'Need Review',
      reason: 'May be eligible pending credit review.',
      riskWarning: 'RM review required before final approval. This is a simulation only.',
      suggestedChannel: 'Email',
    });
  }

  return offers;
}

function calculateOfferScore(customer: Customer, productId: string): number {
  let score = 50; // Base score

  // Segment fit
  const product = getProductById(productId);
  if (product && product.targetSegments.includes(customer.segment)) {
    score += 20;
  }

  // Product gap
  if (!customer.products.some(p => p.toLowerCase().includes(product?.name.toLowerCase() || ''))) {
    score += 15;
  }

  // Balance potential
  if (customer.averageBalance > 1000000000) score += 10;
  else if (customer.averageBalance > 500000000) score += 5;

  // Growth signal
  if (customer.transactionTrend3M > 15) score += 10;
  else if (customer.transactionTrend3M > 0) score += 5;

  // Digital adoption
  if (customer.digitalAdoptionScore > 70) score += 5;

  // Risk adjustment
  if (customer.creditRiskScore > 50) score -= 20;
  else if (customer.creditRiskScore > 30) score -= 10;

  if (customer.churnRiskScore > 60) score -= 15;
  if (customer.complaintStatus === 'Open') score -= 25;

  return Math.max(0, Math.min(100, score));
}

function checkEligibility(customer: Customer, productId: string): 'Eligible' | 'Need Review' | 'Not Eligible' {
  if (customer.creditRiskScore > 60) return 'Not Eligible';
  if (customer.creditRiskScore > 40) return 'Need Review';
  if (customer.churnRiskScore > 70) return 'Not Eligible';
  if (customer.complaintStatus === 'Open') return 'Need Review';
  
  const product = getProductById(productId);
  if (product?.category === 'Loan' && customer.creditRiskScore > 30) return 'Need Review';
  
  return 'Eligible';
}

function calculatePreApprovalScore(customer: Customer): number {
  let score = 0;

  // Credit history proxy (based on risk scores)
  if (customer.creditRiskScore < 20) score += 30;
  else if (customer.creditRiskScore < 35) score += 20;
  else if (customer.creditRiskScore < 50) score += 10;

  // Account tenure (based on churn risk as proxy)
  if (customer.churnRiskScore < 20) score += 20;
  else if (customer.churnRiskScore < 40) score += 10;

  // Transaction behavior
  if (customer.transactionTrend3M > 0) score += 15;
  if (customer.transactionTrend3M > 10) score += 10;

  // Product relationship
  score += Math.min(customer.productCount * 5, 25);

  return Math.min(score, 100);
}

function generateOfferReason(customer: Customer, productName: string): string {
  const reasons: string[] = [];

  if (customer.transactionTrend3M > 10) {
    reasons.push('strong transaction growth');
  }

  if (customer.averageBalance > 500000000) {
    reasons.push('high account balance');
  }

  if (customer.digitalAdoptionScore > 70) {
    reasons.push('active digital user');
  }

  if (customer.segment === 'Priority' || customer.segment === 'Affluent') {
    reasons.push('premium customer');
  }

  if (customer.segment === 'SME') {
    reasons.push('business growth opportunity');
  }

  const baseReason = reasons.length > 0
    ? reasons.join(', ')
    : 'good product fit';

  return `${baseReason}. Recommended: ${productName}`;
}

function getSuggestedChannel(customer: Customer): 'Call' | 'Email' | 'Meeting' | 'App Notification' {
  if (customer.churnRiskScore > 50) return 'Call';
  if (customer.creditRiskScore > 40) return 'Meeting';
  if (customer.transactionTrend3M > 15) return 'Call';
  if (customer.digitalAdoptionScore > 70) return 'Email';
  return 'App Notification';
}

function generateOfferScript(customer: Customer, productName: string): string {
  return `Hello ${customer.name},\n\nI hope this message finds you well. I'm reaching out because we believe ${productName} could be a great fit for you based on your ${customer.segment} banking needs.\n\nWould you be interested in learning more? I'm happy to schedule a call or meeting at your convenience.\n\nBest regards,\nYour Relationship Manager`;
}
