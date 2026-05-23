// ============================================
// OceanBank AI CRM Assistant - Mock Leads
// ============================================
import { Lead, LeadStatus, LeadSource, LeadQualification } from '../lib/types';

export const mockLeads: Lead[] = [
  // Hot Leads
  {
    id: 'lead_001',
    customerId: 'cus_001',
    customerName: 'Nguyen Van A',
    source: 'AI Generated',
    suggestedProductId: 'prod_001',
    suggestedProductName: 'Ocean Credit Card',
    leadScore: 85,
    qualification: 'Hot',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    status: 'New',
    reason: 'Salary account customer with high income, no credit card. High digital adoption suggests product fit.',
    createdAt: '2026-05-22',
  },
  {
    id: 'lead_002',
    customerId: 'cus_003',
    customerName: 'Le Van C',
    source: 'Campaign',
    suggestedProductId: 'prod_008',
    suggestedProductName: 'Life Insurance Premium',
    leadScore: 92,
    qualification: 'Hot',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    status: 'Contacted',
    reason: 'High CASA balance customer, no insurance product. Strong investment profile.',
    createdAt: '2026-05-20',
  },
  {
    id: 'lead_003',
    customerId: 'cus_012',
    customerName: 'Blue Ocean Logistics',
    source: 'AI Generated',
    suggestedProductId: 'prod_005',
    suggestedProductName: 'SME Overdraft',
    leadScore: 88,
    qualification: 'Hot',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    status: 'New',
    reason: 'Growing SME with increasing transaction volume. Clear working capital need.',
    createdAt: '2026-05-23',
  },
  {
    id: 'lead_004',
    customerId: 'cus_016',
    customerName: 'Sunrise Tech Solutions',
    source: 'Chatbot',
    suggestedProductId: 'prod_005',
    suggestedProductName: 'SME Overdraft',
    leadScore: 90,
    qualification: 'Hot',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    status: 'Qualified',
    reason: 'High-growth tech SME with positive cash flow. Potential for overdraft facility.',
    createdAt: '2026-05-21',
  },
  {
    id: 'lead_005',
    customerId: 'cus_026',
    customerName: 'Pham Van D',
    source: 'AI Generated',
    suggestedProductId: 'prod_024',
    suggestedProductName: 'Wealth Management',
    leadScore: 95,
    qualification: 'Hot',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    status: 'Contacted',
    reason: 'Priority customer with 8B balance, no wealth management. High upsell opportunity.',
    createdAt: '2026-05-19',
  },
  // Warm Leads
  {
    id: 'lead_006',
    customerId: 'cus_002',
    customerName: 'Tran Thi B',
    source: 'App',
    suggestedProductId: 'prod_003',
    suggestedProductName: 'Personal Loan',
    leadScore: 72,
    qualification: 'Warm',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    status: 'New',
    reason: 'Young professional showing interest in loan products on mobile app.',
    createdAt: '2026-05-22',
  },
  {
    id: 'lead_007',
    customerId: 'cus_004',
    customerName: 'Pham Thi D',
    source: 'Campaign',
    suggestedProductId: 'prod_008',
    suggestedProductName: 'Life Insurance Premium',
    leadScore: 68,
    qualification: 'Warm',
    status: 'New',
    reason: 'Healthcare worker with stable income. Insurance potential segment.',
    createdAt: '2026-05-21',
  },
  {
    id: 'lead_008',
    customerId: 'cus_020',
    customerName: 'Saigon Electronics',
    source: 'AI Generated',
    suggestedProductId: 'prod_012',
    suggestedProductName: 'Working Capital Loan',
    leadScore: 78,
    qualification: 'Warm',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    status: 'Assigned',
    reason: 'Growing electronics SME with seasonal inventory needs.',
    createdAt: '2026-05-20',
  },
  {
    id: 'lead_009',
    customerId: 'cus_029',
    customerName: 'Le Thi N',
    source: 'Branch',
    suggestedProductId: 'prod_024',
    suggestedProductName: 'Wealth Management',
    leadScore: 80,
    qualification: 'Warm',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    status: 'Contacted',
    reason: 'High-net-worth customer with real estate income. Wealth opportunity.',
    createdAt: '2026-05-18',
  },
  {
    id: 'lead_010',
    customerId: 'cus_035',
    customerName: 'Le Van U',
    source: 'Website',
    suggestedProductId: 'prod_006',
    suggestedProductName: 'Term Deposit',
    leadScore: 65,
    qualification: 'Warm',
    status: 'New',
    reason: 'Young engineer with growing savings. Deposit product fit.',
    createdAt: '2026-05-22',
  },
  // Cold Leads
  {
    id: 'lead_011',
    customerId: 'cus_005',
    customerName: 'Hoang Van E',
    source: 'Campaign',
    suggestedProductId: 'prod_010',
    suggestedProductName: 'Digital Banking Activation',
    leadScore: 45,
    qualification: 'Cold',
    status: 'New',
    reason: 'Dormant high-balance customer. Low digital adoption. Nurture needed.',
    createdAt: '2026-05-15',
  },
  {
    id: 'lead_012',
    customerId: 'cus_007',
    customerName: 'Dao Van G',
    source: 'AI Generated',
    suggestedProductId: 'prod_010',
    suggestedProductName: 'Digital Banking Activation',
    leadScore: 42,
    qualification: 'Cold',
    status: 'New',
    reason: 'Low digital adoption. May need personal outreach for activation.',
    createdAt: '2026-05-18',
  },
  {
    id: 'lead_013',
    customerId: 'cus_033',
    customerName: 'Nguyen Van S',
    source: 'Contact Center',
    suggestedProductId: 'prod_006',
    suggestedProductName: 'Term Deposit',
    leadScore: 48,
    qualification: 'Cold',
    status: 'New',
    reason: 'Agriculture worker with declining transactions. Retention opportunity.',
    createdAt: '2026-05-16',
  },
  // Disqualified Leads
  {
    id: 'lead_014',
    customerId: 'cus_009',
    customerName: 'Green Farm Agriculture',
    source: 'Campaign',
    suggestedProductId: 'prod_012',
    suggestedProductName: 'Working Capital Loan',
    leadScore: 25,
    qualification: 'Disqualified',
    status: 'Disqualified',
    reason: 'High churn risk, declining transactions, open loan. Not suitable for new credit.',
    createdAt: '2026-05-10',
  },
  {
    id: 'lead_015',
    customerId: 'cus_050',
    customerName: 'Northern Construction Ltd',
    source: 'AI Generated',
    suggestedProductId: 'prod_005',
    suggestedProductName: 'SME Overdraft',
    leadScore: 18,
    qualification: 'Disqualified',
    status: 'Disqualified',
    reason: 'High credit risk, open complaint, declining business. Not suitable for credit expansion.',
    createdAt: '2026-05-08',
  },
  // More Hot Leads
  {
    id: 'lead_016',
    customerId: 'cus_010',
    customerName: 'Bui Thi K',
    source: 'AI Generated',
    suggestedProductId: 'prod_024',
    suggestedProductName: 'Wealth Management',
    leadScore: 98,
    qualification: 'Hot',
    assignedRMId: 'rm_007',
    assignedRMName: 'Dao Van G',
    status: 'Qualified',
    reason: 'Affluent customer with 8.5B balance. No wealth management. Premium opportunity.',
    createdAt: '2026-05-23',
  },
  {
    id: 'lead_017',
    customerId: 'cus_022',
    customerName: 'VN Oil Energy Group',
    source: 'Meeting',
    suggestedProductId: 'prod_019',
    suggestedProductName: 'Supply Chain Finance',
    leadScore: 94,
    qualification: 'Hot',
    assignedRMId: 'rm_004',
    assignedRMName: 'Pham Thi D',
    status: 'Contacted',
    reason: 'Large corporate with complex supply chain. Treasury solution opportunity.',
    createdAt: '2026-05-21',
  },
  {
    id: 'lead_018',
    customerId: 'cus_030',
    customerName: 'Hoang Van P',
    source: 'AI Generated',
    suggestedProductId: 'prod_024',
    suggestedProductName: 'Wealth Management',
    leadScore: 89,
    qualification: 'Hot',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    status: 'New',
    reason: 'Tech entrepreneur with 3.8B balance. Growing wealth opportunity.',
    createdAt: '2026-05-22',
  },
  {
    id: 'lead_019',
    customerId: 'cus_046',
    customerName: 'Hanoi Software Park',
    source: 'Campaign',
    suggestedProductId: 'prod_022',
    suggestedProductName: 'BIZ Banking',
    leadScore: 85,
    qualification: 'Hot',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    status: 'Qualified',
    reason: 'High-tech SME with 95% digital adoption. Perfect for BIZ Banking.',
    createdAt: '2026-05-20',
  },
  {
    id: 'lead_020',
    customerId: 'cus_037',
    customerName: 'Tran Van X',
    source: 'Chatbot',
    suggestedProductId: 'prod_007',
    suggestedProductName: 'Savings Account Plus',
    leadScore: 82,
    qualification: 'Hot',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    status: 'Contacted',
    reason: 'Consultant with 800M balance. High savings potential.',
    createdAt: '2026-05-21',
  },
  // Campaign Leads
  {
    id: 'lead_021',
    customerId: 'cus_031',
    customerName: 'Vu Van Q',
    source: 'Campaign',
    suggestedProductId: 'prod_001',
    suggestedProductName: 'Ocean Credit Card',
    leadScore: 75,
    qualification: 'Hot',
    assignedRMId: 'rm_001',
    assignedRMName: 'Nguyen Van A',
    status: 'New',
    reason: 'Young marketing professional. Credit card campaign target.',
    createdAt: '2026-05-22',
  },
  {
    id: 'lead_022',
    customerId: 'cus_032',
    customerName: 'Trinh Thi R',
    source: 'Campaign',
    suggestedProductId: 'prod_008',
    suggestedProductName: 'Life Insurance Premium',
    leadScore: 70,
    qualification: 'Warm',
    status: 'New',
    reason: 'Education sector with stable income. Insurance campaign fit.',
    createdAt: '2026-05-21',
  },
  {
    id: 'lead_023',
    customerId: 'cus_039',
    customerName: 'Vu Van Z',
    source: 'Campaign',
    suggestedProductId: 'prod_010',
    suggestedProductName: 'Digital Banking Activation',
    leadScore: 68,
    qualification: 'Warm',
    assignedRMId: 'rm_003',
    assignedRMName: 'Le Van C',
    status: 'New',
    reason: 'Legal professional with high digital adoption. Premium services opportunity.',
    createdAt: '2026-05-20',
  },
  {
    id: 'lead_024',
    customerId: 'cus_018',
    customerName: 'Viet Textile Co.',
    source: 'AI Generated',
    suggestedProductId: 'prod_020',
    suggestedProductName: 'FX Services',
    leadScore: 88,
    qualification: 'Hot',
    assignedRMId: 'rm_002',
    assignedRMName: 'Tran Thi B',
    status: 'Contacted',
    reason: 'Textile exporter with 45 international transactions. FX services needed.',
    createdAt: '2026-05-19',
  },
  {
    id: 'lead_025',
    customerId: 'cus_023',
    customerName: 'OceanBank Corp',
    source: 'AI Generated',
    suggestedProductId: 'prod_021',
    suggestedProductName: 'Treasury Services',
    leadScore: 96,
    qualification: 'Hot',
    assignedRMId: 'rm_008',
    assignedRMName: 'Trinh Van H',
    status: 'Qualified',
    reason: 'Large corporate with treasury needs. Full banking relationship opportunity.',
    createdAt: '2026-05-18',
  },
  // Additional leads to reach 100 total
  ...generateAdditionalLeads(25),
];

function generateAdditionalLeads(count: number): Lead[] {
  const sources: LeadSource[] = ['AI Generated', 'Campaign', 'Website', 'App', 'Branch', 'Contact Center', 'Chatbot'];
  const products = [
    { id: 'prod_001', name: 'Ocean Credit Card' },
    { id: 'prod_003', name: 'Personal Loan' },
    { id: 'prod_006', name: 'Term Deposit' },
    { id: 'prod_008', name: 'Life Insurance Premium' },
    { id: 'prod_010', name: 'Digital Banking Activation' },
    { id: 'prod_005', name: 'SME Overdraft' },
    { id: 'prod_012', name: 'Working Capital Loan' },
    { id: 'prod_024', name: 'Wealth Management' },
  ];
  
  const customerIds = [
    { id: 'cus_040', name: 'Nguyen Thi AA' },
    { id: 'cus_041', name: 'Central Electronics Corp' },
    { id: 'cus_042', name: 'Highland Coffee Chain' },
    { id: 'cus_043', name: 'North Express Transport' },
    { id: 'cus_044', name: 'Saigon Printing House' },
    { id: 'cus_045', name: 'Mekong Seafood Export' },
    { id: 'cus_047', name: 'Central Pharmacy Group' },
    { id: 'cus_048', name: 'Viet Nam Furniture Co.' },
    { id: 'cus_049', name: 'Saigon Gym Fitness' },
    { id: 'cus_024', name: 'VN Telecom Inc.' },
    { id: 'cus_025', name: 'Sai Gon Retail Group' },
    { id: 'cus_027', name: 'Nguyen Thi L' },
    { id: 'cus_028', name: 'Tran Van M' },
    { id: 'cus_036', name: 'Hoang Thi V' },
    { id: 'cus_038', name: 'Dao Thi Y' },
  ];
  
  const leads: Lead[] = [];
  const statuses: LeadStatus[] = ['New', 'Assigned', 'Contacted', 'Qualified'];
  const qualifications: LeadQualification[] = ['Hot', 'Warm', 'Cold'];
  
  for (let i = 0; i < count; i++) {
    const customer = customerIds[i % customerIds.length];
    const product = products[i % products.length];
    const score = 30 + Math.floor(Math.random() * 70);
    let qualification: LeadQualification;
    if (score >= 80) qualification = 'Hot';
    else if (score >= 60) qualification = 'Warm';
    else qualification = 'Cold';
    
    const rmIndex = i % 10;
    
    leads.push({
      id: `lead_${26 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      source: sources[i % sources.length],
      suggestedProductId: product.id,
      suggestedProductName: product.name,
      leadScore: score,
      qualification,
      assignedRMId: `rm_${String(rmIndex + 1).padStart(3, '0')}`,
      assignedRMName: ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E', 'Vu Thi F', 'Dao Van G', 'Trinh Van H', 'Bui Thi I', 'Nguyen Van J'][rmIndex],
      status: statuses[i % statuses.length],
      reason: `Product opportunity identified based on customer profile and transaction patterns.`,
      createdAt: `2026-05-${String(10 + (i % 13)).padStart(2, '0')}`,
    });
  }
  
  return leads;
}

// Helper functions
export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((l) => l.id === id);
}

export function getLeadsByCustomer(customerId: string): Lead[] {
  return mockLeads.filter((l) => l.customerId === customerId);
}

export function getLeadsByRM(rmId: string): Lead[] {
  return mockLeads.filter((l) => l.assignedRMId === rmId);
}

export function getHotLeads(): Lead[] {
  return mockLeads.filter((l) => l.qualification === 'Hot').sort((a, b) => b.leadScore - a.leadScore);
}

export function getLeadsByStatus(status: LeadStatus): Lead[] {
  return mockLeads.filter((l) => l.status === status);
}

export function getLeadsByQualification(qualification: LeadQualification): Lead[] {
  return mockLeads.filter((l) => l.qualification === qualification);
}

export function getLeadDistribution(): { name: string; value: number }[] {
  const hot = mockLeads.filter((l) => l.qualification === 'Hot').length;
  const warm = mockLeads.filter((l) => l.qualification === 'Warm').length;
  const cold = mockLeads.filter((l) => l.qualification === 'Cold').length;
  const disqualified = mockLeads.filter((l) => l.qualification === 'Disqualified').length;
  
  return [
    { name: 'Hot', value: hot },
    { name: 'Warm', value: warm },
    { name: 'Cold', value: cold },
    { name: 'Disqualified', value: disqualified },
  ];
}
