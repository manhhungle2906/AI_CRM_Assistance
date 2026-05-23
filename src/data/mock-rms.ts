// ============================================
// OceanBank AI CRM Assistant - Mock RMs
// ============================================
import { RM, ProductCategory } from '../lib/types';

export const mockRMs: RM[] = [
  {
    id: 'rm_001',
    name: 'Nguyen Van A',
    region: 'Ho Chi Minh City',
    expertise: ['SME Banking', 'Loan', 'Digital Banking', 'Card'] as ProductCategory[],
    activeLeads: 18,
    monthlyTarget: 1500000000,
    monthlyRevenue: 1250000000,
    callsThisMonth: 45,
    emailsThisMonth: 68,
    meetingsThisMonth: 12,
    tasksCompleted: 28,
    conversionRate: 0.35,
  },
  {
    id: 'rm_002',
    name: 'Tran Thi B',
    region: 'Hanoi',
    expertise: ['Wealth', 'Insurance', 'Card', 'Deposit'] as ProductCategory[],
    activeLeads: 15,
    monthlyTarget: 2000000000,
    monthlyRevenue: 1850000000,
    callsThisMonth: 38,
    emailsThisMonth: 55,
    meetingsThisMonth: 18,
    tasksCompleted: 32,
    conversionRate: 0.42,
  },
  {
    id: 'rm_003',
    name: 'Le Van C',
    region: 'Da Nang',
    expertise: ['SME Banking', 'Trade Finance', 'FX', 'Loan'] as ProductCategory[],
    activeLeads: 22,
    monthlyTarget: 1800000000,
    monthlyRevenue: 1680000000,
    callsThisMonth: 52,
    emailsThisMonth: 72,
    meetingsThisMonth: 15,
    tasksCompleted: 35,
    conversionRate: 0.38,
  },
  {
    id: 'rm_004',
    name: 'Pham Thi D',
    region: 'Ho Chi Minh City',
    expertise: ['Corporate', 'Trade Finance', 'FX', 'Payment'] as ProductCategory[],
    activeLeads: 12,
    monthlyTarget: 3000000000,
    monthlyRevenue: 2850000000,
    callsThisMonth: 30,
    emailsThisMonth: 45,
    meetingsThisMonth: 22,
    tasksCompleted: 25,
    conversionRate: 0.48,
  },
  {
    id: 'rm_005',
    name: 'Hoang Van E',
    region: 'Can Tho',
    expertise: ['SME Banking', 'Loan', 'Insurance'] as ProductCategory[],
    activeLeads: 25,
    monthlyTarget: 1200000000,
    monthlyRevenue: 980000000,
    callsThisMonth: 58,
    emailsThisMonth: 80,
    meetingsThisMonth: 10,
    tasksCompleted: 38,
    conversionRate: 0.28,
  },
  {
    id: 'rm_006',
    name: 'Vu Thi F',
    region: 'Hai Phong',
    expertise: ['SME Banking', 'Trade Finance', 'Digital Banking'] as ProductCategory[],
    activeLeads: 19,
    monthlyTarget: 1400000000,
    monthlyRevenue: 1320000000,
    callsThisMonth: 42,
    emailsThisMonth: 62,
    meetingsThisMonth: 14,
    tasksCompleted: 30,
    conversionRate: 0.36,
  },
  {
    id: 'rm_007',
    name: 'Dao Van G',
    region: 'Ho Chi Minh City',
    expertise: ['Wealth', 'Insurance', 'Card', 'Deposit', 'Wealth'] as ProductCategory[],
    activeLeads: 10,
    monthlyTarget: 2500000000,
    monthlyRevenue: 2420000000,
    callsThisMonth: 25,
    emailsThisMonth: 40,
    meetingsThisMonth: 20,
    tasksCompleted: 22,
    conversionRate: 0.52,
  },
  {
    id: 'rm_008',
    name: 'Trinh Van H',
    region: 'Hanoi',
    expertise: ['Corporate', 'Payment', 'FX', 'Trade Finance'] as ProductCategory[],
    activeLeads: 14,
    monthlyTarget: 3500000000,
    monthlyRevenue: 3380000000,
    callsThisMonth: 32,
    emailsThisMonth: 48,
    meetingsThisMonth: 25,
    tasksCompleted: 28,
    conversionRate: 0.45,
  },
  {
    id: 'rm_009',
    name: 'Bui Thi I',
    region: 'Da Nang',
    expertise: ['SME Banking', 'Insurance', 'Card', 'Loan'] as ProductCategory[],
    activeLeads: 20,
    monthlyTarget: 1600000000,
    monthlyRevenue: 1480000000,
    callsThisMonth: 48,
    emailsThisMonth: 65,
    meetingsThisMonth: 12,
    tasksCompleted: 33,
    conversionRate: 0.33,
  },
  {
    id: 'rm_010',
    name: 'Nguyen Van J',
    region: 'Ho Chi Minh City',
    expertise: ['Digital Banking', 'Card', 'SME Banking', 'Loan'] as ProductCategory[],
    activeLeads: 16,
    monthlyTarget: 1800000000,
    monthlyRevenue: 1720000000,
    callsThisMonth: 40,
    emailsThisMonth: 58,
    meetingsThisMonth: 16,
    tasksCompleted: 29,
    conversionRate: 0.40,
  },
];

// Helper functions
export function getRMById(id: string): RM | undefined {
  return mockRMs.find((rm) => rm.id === id);
}

export function getRMsByRegion(region: string): RM[] {
  return mockRMs.filter((rm) => rm.region === region);
}

export function getRMsByExpertise(expertise: ProductCategory): RM[] {
  return mockRMs.filter((rm) => rm.expertise.includes(expertise));
}

export function getAvailableRMs(): RM[] {
  return mockRMs.filter((rm) => rm.activeLeads < 25).sort((a, b) => a.activeLeads - b.activeLeads);
}

export function getTopPerformingRMs(): RM[] {
  return [...mockRMs].sort((a, b) => b.conversionRate - a.conversionRate);
}
