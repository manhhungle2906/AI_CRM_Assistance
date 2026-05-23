// ============================================
// Automation Engine
// ============================================
import { CustomerDocument, DocumentType, DocumentStatus } from './types';
import { getCustomerById } from '@/data/mock-customers';
import { mockDocuments } from '@/data/mock-documents';

export interface LimitRenewalResult {
  customerId: string;
  customerName: string;
  currentLimit: number;
  eligibility: 'Eligible' | 'Need Review' | 'Not Eligible';
  suggestedNewLimit: number;
  reason: string;
  warnings: string[];
}

export interface PreApprovedResult {
  customerId: string;
  customerName: string;
  eligibility: 'Eligible' | 'Need Review' | 'Not Eligible';
  suggestedAmount: number;
  reason: string;
  riskWarning?: string;
}

export interface DocumentExtractionResult {
  documentId: string;
  extractedFields: Record<string, string>;
  confidence: number;
  needsReview: string[];
}

export interface MissingDocumentCheck {
  customerId: string;
  customerName: string;
  customerType: 'Individual' | 'SME' | 'Corporate';
  requiredDocuments: DocumentType[];
  uploadedDocuments: DocumentType[];
  missingDocuments: DocumentType[];
  expiredDocuments: DocumentType[];
  reviewRequired: DocumentType[];
}

// Limit Renewal Eligibility
export function reviewLimitRenewalEligibility(customerId: string): LimitRenewalResult | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  const currentLimit = customer.averageBalance * 0.8; // Simulated current limit
  let eligibility: 'Eligible' | 'Need Review' | 'Not Eligible';
  let suggestedNewLimit = currentLimit;
  const warnings: string[] = [];

  // Determine eligibility based on various factors
  if (customer.creditRiskScore > 60 || customer.churnRiskScore > 70) {
    eligibility = 'Not Eligible';
    warnings.push('Credit risk too high for limit increase');
  } else if (customer.creditRiskScore > 40 || customer.churnRiskScore > 50) {
    eligibility = 'Need Review';
    suggestedNewLimit = currentLimit; // Keep same
    warnings.push('RM review required before approval');
  } else if (customer.transactionTrend3M > 15 && customer.complaintStatus !== 'Open') {
    eligibility = 'Eligible';
    // Increase limit based on growth
    suggestedNewLimit = currentLimit * 1.2;
  } else if (customer.transactionTrend3M > 5) {
    eligibility = 'Eligible';
    suggestedNewLimit = currentLimit * 1.1;
  } else {
    eligibility = 'Need Review';
    warnings.push('Transaction growth below threshold for automatic approval');
  }

  // Segment-specific adjustments
  if (customer.segment === 'Corporate' && customer.creditRiskScore < 30) {
    eligibility = 'Eligible';
    suggestedNewLimit = currentLimit * 1.3;
  }

  // Warning about existing complaints
  if (customer.complaintStatus === 'Open') {
    eligibility = 'Need Review';
    warnings.push('Open complaint must be resolved before limit increase');
  }

  let reason = '';
  switch (eligibility) {
    case 'Eligible':
      reason = `Customer shows ${customer.transactionTrend3M > 15 ? 'strong' : 'stable'} account growth and good risk profile.`;
      break;
    case 'Need Review':
      reason = 'Account requires RM review due to one or more risk factors.';
      break;
    case 'Not Eligible':
      reason = 'Customer does not meet criteria for limit increase at this time.';
      break;
  }

  return {
    customerId,
    customerName: customer.name,
    currentLimit,
    eligibility,
    suggestedNewLimit,
    reason,
    warnings,
  };
}

// Pre-approved Offer Generation
export function generatePreApprovedOffer(customerId: string): PreApprovedResult | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  let eligibility: 'Eligible' | 'Need Review' | 'Not Eligible';
  let suggestedAmount: number;
  let reason: string;

  // Calculate eligibility score
  let score = 50; // Base score
  
  if (customer.creditRiskScore < 25) score += 20;
  else if (customer.creditRiskScore < 40) score += 10;
  else if (customer.creditRiskScore > 50) score -= 30;

  if (customer.churnRiskScore < 20) score += 15;
  else if (customer.churnRiskScore > 50) score -= 20;

  if (customer.transactionTrend3M > 10) score += 15;
  else if (customer.transactionTrend3M < -10) score -= 15;

  if (customer.complaintStatus === 'None') score += 10;
  else if (customer.complaintStatus === 'Open') score -= 25;

  // Segment-based amount calculation
  switch (customer.segment) {
    case 'Corporate':
      suggestedAmount = customer.averageBalance * 0.3;
      break;
    case 'SME':
      suggestedAmount = Math.min(customer.averageBalance * 0.5, 2000000000);
      break;
    case 'Priority':
      suggestedAmount = Math.min(customer.averageBalance * 0.4, 500000000);
      break;
    case 'Affluent':
      suggestedAmount = Math.min(customer.averageBalance * 0.3, 1000000000);
      break;
    default:
      suggestedAmount = Math.min(customer.averageBalance * 0.3, 200000000);
  }

  // Adjust for eligibility
  if (score >= 80) {
    eligibility = 'Eligible';
    reason = 'Strong account performance and risk profile meet pre-approval criteria.';
  } else if (score >= 60) {
    eligibility = 'Need Review';
    suggestedAmount = suggestedAmount * 0.7;
    reason = 'Account meets most criteria but requires RM review.';
  } else {
    eligibility = 'Not Eligible';
    suggestedAmount = 0;
    reason = 'Account does not meet pre-approval criteria at this time.';
  }

  // Risk warning for simulation
  const riskWarning = eligibility !== 'Not Eligible'
    ? 'This is a simulated pre-approval for academic demonstration purposes only. No actual credit approval is granted.'
    : undefined;

  return {
    customerId,
    customerName: customer.name,
    eligibility,
    suggestedAmount: Math.round(suggestedAmount / 1000000) * 1000000, // Round to nearest million
    reason,
    riskWarning,
  };
}

// Document Field Extraction (Simulation)
export function extractDocumentFields(documentId: string): DocumentExtractionResult | null {
  const doc = mockDocuments.find(d => d.id === documentId);
  if (!doc) return null;

  // Simulated extraction based on document type
  const extractedFields: Record<string, string> = {};
  const needsReview: string[] = [];

  switch (doc.type) {
    case 'ID Card':
      extractedFields['fullName'] = 'Nguyen Van A';
      extractedFields['dateOfBirth'] = '1994-03-15';
      extractedFields['idNumber'] = '025894123456';
      extractedFields['issueDate'] = '2019-01-15';
      extractedFields['expiryDate'] = '2029-01-15';
      extractedFields['address'] = '123 Example St, City';
      break;
    
    case 'Business License':
      extractedFields['companyName'] = 'ABC Trading Co.';
      extractedFields['registrationNumber'] = '0102345678';
      extractedFields['issueDate'] = '2015-03-15';
      extractedFields['businessType'] = 'Trading';
      extractedFields['registeredCapital'] = '1,000,000,000 VND';
      needsReview.push('Verify registration number with official records');
      break;
    
    case 'Bank Statement':
      extractedFields['period'] = 'Q1 2026';
      extractedFields['avgBalance'] = '850,000,000 VND';
      extractedFields['totalInflow'] = '3,500,000,000 VND';
      extractedFields['totalOutflow'] = '3,200,000,000 VND';
      extractedFields['transactionCount'] = '145';
      break;
    
    case 'Financial Statement':
      extractedFields['revenue'] = '15,000,000,000 VND';
      extractedFields['netProfit'] = '1,200,000,000 VND';
      extractedFields['totalAssets'] = '8,500,000,000 VND';
      extractedFields['totalLiabilities'] = '4,200,000,000 VND';
      needsReview.push('Verify figures with audited statement');
      break;
    
    case 'Tax Document':
      extractedFields['taxCode'] = '024589765431';
      extractedFields['lastFilingDate'] = '2026-04-20';
      extractedFields['taxPaid'] = '180,000,000 VND';
      break;
    
    case 'Loan Application':
      extractedFields['loanAmount'] = '500,000,000 VND';
      extractedFields['loanPurpose'] = 'Business expansion';
      extractedFields['tenure'] = '36 months';
      extractedFields[' collateral'] = 'Real estate';
      needsReview.push('Verify collateral documentation');
      break;
    
    default:
      extractedFields['status'] = 'Document type not recognized';
  }

  // Calculate confidence based on document quality (simulated)
  const confidence = doc.status === 'Uploaded' ? 92 : 75;

  return {
    documentId,
    extractedFields,
    confidence,
    needsReview,
  };
}

// Missing Document Check
export function checkMissingDocuments(customerId: string): MissingDocumentCheck | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  const customerType: 'Individual' | 'SME' | 'Corporate' = 
    customer.segment === 'Individual' ? 'Individual' :
    customer.segment === 'Corporate' ? 'Corporate' : 'SME';

  // Define required documents by customer type
  const requiredByType: Record<string, DocumentType[]> = {
    Individual: ['ID Card', 'Bank Statement'],
    SME: ['ID Card', 'Business License', 'Bank Statement', 'Financial Statement', 'Tax Document'],
    Corporate: ['ID Card', 'Business License', 'Financial Statement', 'Tax Document', 'Trade Document'],
  };

  const requiredDocuments = requiredByType[customerType];
  
  // Get customer's uploaded documents
  const customerDocs = mockDocuments.filter(d => d.customerId === customerId);
  const uploadedDocs = customerDocs
    .filter(d => d.status === 'Uploaded')
    .map(d => d.type);
  
  const expiredDocs = customerDocs
    .filter(d => d.status === 'Expired')
    .map(d => d.type);
  
  const reviewDocs = customerDocs
    .filter(d => d.status === 'Needs Review')
    .map(d => d.type);

  // Find missing documents
  const missingDocuments = requiredDocuments.filter(
    doc => !uploadedDocs.includes(doc) && !expiredDocs.includes(doc)
  );

  return {
    customerId,
    customerName: customer.name,
    customerType,
    requiredDocuments,
    uploadedDocuments: uploadedDocs,
    missingDocuments,
    expiredDocuments: expiredDocs,
    reviewRequired: reviewDocs,
  };
}
