// ============================================
// OceanBank AI CRM Assistant - Mock Deals
// ============================================
import { Deal } from '../lib/types';

export const mockDeals: Deal[] = [
  {
    id: 'deal_001',
    customerId: 'cus_001',
    customerName: 'Nguyen Van A',
    productId: 'prod_001',
    productName: 'Ocean Credit Card',
    rmId: 'rm_001',
    rmName: 'Nguyen Van A',
    value: 5000000,
    stage: 'Negotiation',
    winProbability: 85,
    expectedCloseDate: '2026-05-28',
    createdAt: '2026-05-15',
  },
  {
    id: 'deal_002',
    customerId: 'cus_010',
    customerName: 'Bui Thi K',
    productId: 'prod_024',
    productName: 'Wealth Management',
    rmId: 'rm_007',
    rmName: 'Dao Van G',
    value: 500000000,
    stage: 'Proposal',
    winProbability: 75,
    expectedCloseDate: '2026-06-15',
    createdAt: '2026-05-10',
  },
  {
    id: 'deal_003',
    customerId: 'cus_012',
    customerName: 'Blue Ocean Logistics',
    productId: 'prod_005',
    productName: 'SME Overdraft',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 1000000000,
    stage: 'Qualification',
    winProbability: 60,
    expectedCloseDate: '2026-06-30',
    createdAt: '2026-05-20',
  },
  {
    id: 'deal_004',
    customerId: 'cus_016',
    customerName: 'Sunrise Tech Solutions',
    productId: 'prod_022',
    productName: 'BIZ Banking',
    rmId: 'rm_001',
    rmName: 'Nguyen Van A',
    value: 150000000,
    stage: 'Closed Won',
    winProbability: 100,
    expectedCloseDate: '2026-05-22',
    createdAt: '2026-05-05',
  },
  {
    id: 'deal_005',
    customerId: 'cus_022',
    customerName: 'VN Oil Energy Group',
    productId: 'prod_019',
    productName: 'Supply Chain Finance',
    rmId: 'rm_004',
    rmName: 'Pham Thi D',
    value: 15000000000,
    stage: 'Proposal',
    winProbability: 70,
    expectedCloseDate: '2026-07-15',
    createdAt: '2026-05-12',
  },
  {
    id: 'deal_006',
    customerId: 'cus_026',
    customerName: 'Pham Van D',
    productId: 'prod_024',
    productName: 'Wealth Management',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 300000000,
    stage: 'Negotiation',
    winProbability: 80,
    expectedCloseDate: '2026-06-01',
    createdAt: '2026-05-08',
  },
  {
    id: 'deal_007',
    customerId: 'cus_029',
    customerName: 'Le Thi N',
    productId: 'prod_024',
    productName: 'Wealth Management',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 450000000,
    stage: 'Inquiry',
    winProbability: 40,
    expectedCloseDate: '2026-07-30',
    createdAt: '2026-05-18',
  },
  {
    id: 'deal_008',
    customerId: 'cus_020',
    customerName: 'Saigon Electronics',
    productId: 'prod_012',
    productName: 'Working Capital Loan',
    rmId: 'rm_003',
    rmName: 'Le Van C',
    value: 2000000000,
    stage: 'Proposal',
    winProbability: 65,
    expectedCloseDate: '2026-06-20',
    createdAt: '2026-05-14',
  },
  {
    id: 'deal_009',
    customerId: 'cus_023',
    customerName: 'OceanBank Corp',
    productId: 'prod_021',
    productName: 'Treasury Services',
    rmId: 'rm_008',
    rmName: 'Trinh Van H',
    value: 8000000000,
    stage: 'Qualification',
    winProbability: 55,
    expectedCloseDate: '2026-08-01',
    createdAt: '2026-05-05',
  },
  {
    id: 'deal_010',
    customerId: 'cus_030',
    customerName: 'Hoang Van P',
    productId: 'prod_024',
    productName: 'Wealth Management',
    rmId: 'rm_003',
    rmName: 'Le Van C',
    value: 380000000,
    stage: 'Negotiation',
    winProbability: 78,
    expectedCloseDate: '2026-06-10',
    createdAt: '2026-05-15',
  },
  {
    id: 'deal_011',
    customerId: 'cus_046',
    customerName: 'Hanoi Software Park',
    productId: 'prod_022',
    productName: 'BIZ Banking',
    rmId: 'rm_001',
    rmName: 'Nguyen Van A',
    value: 200000000,
    stage: 'Closed Won',
    winProbability: 100,
    expectedCloseDate: '2026-05-20',
    createdAt: '2026-05-01',
  },
  {
    id: 'deal_012',
    customerId: 'cus_018',
    customerName: 'Viet Textile Co.',
    productId: 'prod_020',
    productName: 'FX Services',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 500000000,
    stage: 'Proposal',
    winProbability: 72,
    expectedCloseDate: '2026-06-25',
    createdAt: '2026-05-10',
  },
  {
    id: 'deal_013',
    customerId: 'cus_045',
    customerName: 'Mekong Seafood Export',
    productId: 'prod_018',
    productName: 'Trade Finance',
    rmId: 'rm_003',
    rmName: 'Le Van C',
    value: 3500000000,
    stage: 'Negotiation',
    winProbability: 68,
    expectedCloseDate: '2026-07-01',
    createdAt: '2026-05-08',
  },
  {
    id: 'deal_014',
    customerId: 'cus_025',
    customerName: 'Sai Gon Retail Group',
    productId: 'prod_027',
    productName: 'Cash Management',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 1200000000,
    stage: 'Qualification',
    winProbability: 58,
    expectedCloseDate: '2026-07-15',
    createdAt: '2026-05-12',
  },
  {
    id: 'deal_015',
    customerId: 'cus_024',
    customerName: 'VN Telecom Inc.',
    productId: 'prod_018',
    productName: 'Trade Finance',
    rmId: 'rm_001',
    rmName: 'Nguyen Van A',
    value: 4500000000,
    stage: 'Inquiry',
    winProbability: 45,
    expectedCloseDate: '2026-08-15',
    createdAt: '2026-05-15',
  },
  {
    id: 'deal_016',
    customerId: 'cus_037',
    customerName: 'Tran Van X',
    productId: 'prod_007',
    productName: 'Savings Account Plus',
    rmId: 'rm_001',
    rmName: 'Nguyen Van A',
    value: 80000000,
    stage: 'Closed Won',
    winProbability: 100,
    expectedCloseDate: '2026-05-19',
    createdAt: '2026-05-10',
  },
  {
    id: 'deal_017',
    customerId: 'cus_003',
    customerName: 'Le Van C',
    productId: 'prod_008',
    productName: 'Life Insurance Premium',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 120000000,
    stage: 'Negotiation',
    winProbability: 82,
    expectedCloseDate: '2026-06-05',
    createdAt: '2026-05-12',
  },
  {
    id: 'deal_018',
    customerId: 'cus_009',
    customerName: 'Green Farm Agriculture',
    productId: 'prod_012',
    productName: 'Working Capital Loan',
    rmId: 'rm_002',
    rmName: 'Tran Thi B',
    value: 500000000,
    stage: 'Closed Lost',
    winProbability: 0,
    expectedCloseDate: '2026-05-15',
    createdAt: '2026-04-20',
  },
  {
    id: 'deal_019',
    customerId: 'cus_048',
    customerName: 'Viet Nam Furniture Co.',
    productId: 'prod_018',
    productName: 'Trade Finance',
    rmId: 'rm_003',
    rmName: 'Le Van C',
    value: 1800000000,
    stage: 'Proposal',
    winProbability: 62,
    expectedCloseDate: '2026-06-30',
    createdAt: '2026-05-05',
  },
  {
    id: 'deal_020',
    customerId: 'cus_004',
    customerName: 'Pham Thi D',
    productId: 'prod_008',
    productName: 'Life Insurance Premium',
    rmId: 'rm_001',
    rmName: 'Nguyen Van A',
    value: 90000000,
    stage: 'Inquiry',
    winProbability: 35,
    expectedCloseDate: '2026-07-20',
    createdAt: '2026-05-18',
  },
  // More deals to reach 40
  ...generateMoreDeals(20),
];

function generateMoreDeals(count: number): Deal[] {
  const stages: Deal['stage'][] = ['Inquiry', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const customerNames = [
    'Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E',
    'ABC Trading Co.', 'Lotus Food Service', 'Mekong Distribution', 'Viet Textile Co.',
    'Hanoi Construction JSC', 'Central Electronics Corp', 'Highland Coffee Chain',
    'Central Pharmacy Group', 'Saigon Gym Fitness', 'North Express Transport',
    'Nguyen Thi L', 'Tran Van M', 'Hoang Thi V', 'Dao Thi Y', 'Vu Van Q',
  ];
  const products = [
    { id: 'prod_001', name: 'Ocean Credit Card' },
    { id: 'prod_003', name: 'Personal Loan' },
    { id: 'prod_006', name: 'Term Deposit' },
    { id: 'prod_008', name: 'Life Insurance Premium' },
    { id: 'prod_010', name: 'Digital Banking Activation' },
    { id: 'prod_011', name: 'Ocean Business Card' },
    { id: 'prod_012', name: 'Working Capital Loan' },
    { id: 'prod_005', name: 'SME Overdraft' },
    { id: 'prod_022', name: 'BIZ Banking' },
    { id: 'prod_024', name: 'Wealth Management' },
  ];
  
  const deals: Deal[] = [];
  
  for (let i = 0; i < count; i++) {
    const customerIndex = i % 20;
    const product = products[i % products.length];
    const stage = stages[i % stages.length];
    const rmIndex = i % 10;
    let winProbability: number;
    
    switch (stage) {
      case 'Closed Won':
        winProbability = 100;
        break;
      case 'Closed Lost':
        winProbability = 0;
        break;
      case 'Negotiation':
        winProbability = 70 + (i % 20);
        break;
      case 'Proposal':
        winProbability = 50 + (i % 30);
        break;
      case 'Qualification':
        winProbability = 30 + (i % 30);
        break;
      default:
        winProbability = 10 + (i % 30);
    }
    
    const value = 50000000 + Math.floor(Math.random() * 5000000000);
    const day = 1 + (i % 25);
    const month = 1 + (i % 3);
    
    deals.push({
      id: `deal_${21 + i}`,
      customerId: `cus_${String((i % 50) + 1).padStart(3, '0')}`,
      customerName: customerNames[customerIndex],
      productId: product.id,
      productName: product.name,
      rmId: `rm_${String(rmIndex + 1).padStart(3, '0')}`,
      rmName: ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E', 'Vu Thi F', 'Dao Van G', 'Trinh Van H', 'Bui Thi I', 'Nguyen Van J'][rmIndex],
      value,
      stage,
      winProbability: Math.min(winProbability, 95),
      expectedCloseDate: `2026-0${month + 5}-${String(day).padStart(2, '0')}`,
      createdAt: `2026-05-${String(day).padStart(2, '0')}`,
    });
  }
  
  return deals;
}

// Helper functions
export function getDealById(id: string): Deal | undefined {
  return mockDeals.find((d) => d.id === id);
}

export function getDealsByRM(rmId: string): Deal[] {
  return mockDeals.filter((d) => d.rmId === rmId);
}

export function getDealsByStage(stage: Deal['stage']): Deal[] {
  return mockDeals.filter((d) => d.stage === stage);
}

export function getActiveDeals(): Deal[] {
  return mockDeals.filter((d) => !['Closed Won', 'Closed Lost'].includes(d.stage));
}

export function getPipelineValue(): { stage: string; value: number }[] {
  const stages: Deal['stage'][] = ['Inquiry', 'Qualification', 'Proposal', 'Negotiation'];
  return stages.map((stage) => ({
    stage,
    value: mockDeals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + d.value, 0),
  }));
}

export function getForecastValue(): { month: string; value: number }[] {
  const months = ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'];
  return months.map((month, index) => ({
    month,
    value: mockDeals
      .filter((d) => {
        const closeDate = new Date(d.expectedCloseDate);
        const now = new Date('2026-05-23');
        const future = new Date(now);
        future.setMonth(future.getMonth() + index + 1);
        return closeDate <= future && !['Closed Lost'].includes(d.stage);
      })
      .reduce((sum, d) => sum + d.value * (d.winProbability / 100), 0),
  }));
}
