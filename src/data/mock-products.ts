// ============================================
// OceanBank AI CRM Assistant - Mock Products
// ============================================
import { Product, ProductCategory } from '../lib/types';

export const mockProducts: Product[] = [
  // Card Products
  {
    id: 'prod_001',
    name: 'Ocean Credit Card',
    category: 'Card',
    targetSegments: ['Individual', 'Priority', 'Affluent'],
    description: 'Premium credit card with cashback up to 5%, airport lounge access, and travel insurance',
    crossSellWith: ['prod_002', 'prod_010'],
    upsellFrom: ['prod_011'],
  },
  {
    id: 'prod_002',
    name: 'Ocean Platinum Card',
    category: 'Card',
    targetSegments: ['Priority', 'Affluent'],
    description: 'Platinum credit card with exclusive benefits, concierge service, and premium rewards',
    upsellFrom: ['prod_001'],
  },
  {
    id: 'prod_011',
    name: 'Ocean Business Card',
    category: 'Card',
    targetSegments: ['SME', 'Corporate'],
    description: 'Business credit card with expense management, fuel discounts, and travel benefits',
    crossSellWith: ['prod_004', 'prod_005'],
  },
  // Loan Products
  {
    id: 'prod_003',
    name: 'Personal Loan',
    category: 'Loan',
    targetSegments: ['Individual', 'Priority'],
    description: 'Flexible personal loan with competitive interest rates, up to 500 million VND',
    crossSellWith: ['prod_001', 'prod_008'],
  },
  {
    id: 'prod_004',
    name: 'Home Loan',
    category: 'Loan',
    targetSegments: ['Individual', 'Priority'],
    description: 'Competitive home loan with long tenure, flexible repayment options',
    crossSellWith: ['prod_001', 'prod_010'],
  },
  {
    id: 'prod_005',
    name: 'SME Overdraft',
    category: 'SME Banking',
    targetSegments: ['SME'],
    description: 'Flexible overdraft facility for short-term cash flow needs, instant access',
    crossSellWith: ['prod_012', 'prod_013'],
  },
  {
    id: 'prod_012',
    name: 'Working Capital Loan',
    category: 'SME Banking',
    targetSegments: ['SME', 'Corporate'],
    description: 'Financing for day-to-day business operations with flexible tenure',
    crossSellWith: ['prod_005', 'prod_013'],
  },
  {
    id: 'prod_013',
    name: 'Term Loan',
    category: 'SME Banking',
    targetSegments: ['SME'],
    description: 'Medium to long-term loan for business expansion and equipment purchase',
    crossSellWith: ['prod_005', 'prod_012'],
  },
  {
    id: 'prod_014',
    name: 'Project Finance',
    category: 'SME Banking',
    targetSegments: ['Corporate'],
    description: 'Large-scale financing for major projects with structured repayment',
  },
  {
    id: 'prod_015',
    name: 'Vehicle Loan',
    category: 'Loan',
    targetSegments: ['Individual', 'SME'],
    description: 'Competitive financing for car and motorcycle purchases',
    crossSellWith: ['prod_001'],
  },
  // Deposit Products
  {
    id: 'prod_006',
    name: 'Term Deposit',
    category: 'Deposit',
    targetSegments: ['Individual', 'SME', 'Priority', 'Affluent'],
    description: 'Secure term deposit with guaranteed returns, flexible tenure from 1-36 months',
    crossSellWith: ['prod_007', 'prod_008'],
  },
  {
    id: 'prod_007',
    name: 'Savings Account Plus',
    category: 'Deposit',
    targetSegments: ['Individual', 'Priority'],
    description: 'High-interest savings account with flexible withdrawal and bonus rates',
    crossSellWith: ['prod_006', 'prod_010'],
  },
  {
    id: 'prod_016',
    name: 'Corporate Current Account',
    category: 'Deposit',
    targetSegments: ['SME', 'Corporate'],
    description: 'Business account with cash management and competitive interest',
    crossSellWith: ['prod_012', 'prod_017'],
  },
  // Insurance Products
  {
    id: 'prod_008',
    name: 'Life Insurance Premium',
    category: 'Insurance',
    targetSegments: ['Individual', 'Priority', 'Affluent'],
    description: 'Comprehensive life insurance with savings component and health coverage',
    crossSellWith: ['prod_006', 'prod_004'],
  },
  {
    id: 'prod_009',
    name: 'Health Insurance Plus',
    category: 'Insurance',
    targetSegments: ['Individual', 'Priority'],
    description: 'Comprehensive health insurance with dental and vision coverage',
    crossSellWith: ['prod_008'],
  },
  {
    id: 'prod_017',
    name: 'Business Insurance Package',
    category: 'Insurance',
    targetSegments: ['SME', 'Corporate'],
    description: 'Comprehensive business insurance covering assets, liability, and key person',
    crossSellWith: ['prod_012', 'prod_016'],
  },
  // SME Banking Products
  {
    id: 'prod_018',
    name: 'Trade Finance',
    category: 'Trade Finance',
    targetSegments: ['SME', 'Corporate'],
    description: 'Import/export financing, letters of credit, and trust receipt',
    crossSellWith: ['prod_019', 'prod_013'],
  },
  {
    id: 'prod_019',
    name: 'Supply Chain Finance',
    category: 'Trade Finance',
    targetSegments: ['Corporate'],
    description: 'Financing solutions for supply chain optimization and working capital',
    crossSellWith: ['prod_018', 'prod_016'],
  },
  // FX Products
  {
    id: 'prod_020',
    name: 'FX Services',
    category: 'FX',
    targetSegments: ['SME', 'Corporate'],
    description: 'Foreign exchange services, hedging solutions, and cross-border payments',
    crossSellWith: ['prod_018', 'prod_021'],
  },
  {
    id: 'prod_021',
    name: 'Treasury Services',
    category: 'FX',
    targetSegments: ['Corporate'],
    description: 'Corporate treasury management, cash pooling, and liquidity solutions',
    crossSellWith: ['prod_020', 'prod_016'],
  },
  // Digital Banking Products
  {
    id: 'prod_010',
    name: 'Digital Banking Activation',
    category: 'Digital Banking',
    targetSegments: ['Individual', 'SME', 'Corporate', 'Priority', 'Affluent'],
    description: 'Mobile and internet banking with 24/7 access, bill payment, and transfers',
    crossSellWith: ['prod_001', 'prod_006', 'prod_007'],
  },
  {
    id: 'prod_022',
    name: 'BIZ Banking',
    category: 'Digital Banking',
    targetSegments: ['SME', 'Corporate'],
    description: 'Business digital banking platform with multi-user access and approval workflow',
    crossSellWith: ['prod_011', 'prod_016'],
  },
  {
    id: 'prod_023',
    name: 'Payroll Services',
    category: 'Payment',
    targetSegments: ['SME', 'Corporate'],
    description: 'Automated salary disbursement, tax calculation, and employee card management',
    crossSellWith: ['prod_016', 'prod_022'],
  },
  // Wealth Products
  {
    id: 'prod_024',
    name: 'Wealth Management',
    category: 'Wealth',
    targetSegments: ['Priority', 'Affluent'],
    description: 'Premium wealth management with dedicated advisor, exclusive products, and family office services',
    crossSellWith: ['prod_006', 'prod_007', 'prod_008'],
  },
  {
    id: 'prod_025',
    name: 'Investment Account',
    category: 'Wealth',
    targetSegments: ['Priority', 'Affluent'],
    description: 'Investment account with access to mutual funds, bonds, and structured products',
    crossSellWith: ['prod_024', 'prod_006'],
  },
  {
    id: 'prod_026',
    name: 'Corporate Credit',
    category: 'Loan',
    targetSegments: ['Corporate'],
    description: 'Revolving credit facility for corporate liquidity management',
    crossSellWith: ['prod_016', 'prod_021'],
  },
  {
    id: 'prod_027',
    name: 'Cash Management',
    category: 'Payment',
    targetSegments: ['Corporate'],
    description: 'Enterprise cash management with sweeping, concentration, and zero balancing',
    crossSellWith: ['prod_021', 'prod_023'],
  },
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return mockProducts.filter((p) => p.category === category);
}

export function getProductsForSegment(segment: string): Product[] {
  return mockProducts.filter((p) => p.targetSegments.includes(segment as typeof p.targetSegments[number]));
}

export function getCrossSellProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product?.crossSellWith) return [];
  return product.crossSellWith.map(id => getProductById(id)).filter((p): p is Product => p !== undefined);
}

export function getUpsellProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product?.upsellFrom) return [];
  return product.upsellFrom.map(id => getProductById(id)).filter((p): p is Product => p !== undefined);
}
