// ============================================
// OceanBank AI CRM Assistant - Mock Documents
// ============================================
import { CustomerDocument, DocumentType, DocumentStatus } from '../lib/types';

export const mockDocuments: CustomerDocument[] = [
  // Individual Customer Documents
  {
    id: 'doc_001',
    customerId: 'cus_001',
    type: 'ID Card',
    status: 'Uploaded',
    extractedFields: {
      fullName: 'Nguyen Van A',
      dateOfBirth: '1994-03-15',
      idNumber: '025894123456',
      issueDate: '2019-01-15',
      address: '123 Nguyen Trai St, District 1, HCMC',
    },
  },
  {
    id: 'doc_002',
    customerId: 'cus_001',
    type: 'Bank Statement',
    status: 'Uploaded',
    extractedFields: {
      avgMonthlyBalance: '180,000,000',
      totalTransactions: '45',
      avgMonthlyInflow: '35,000,000',
    },
  },
  {
    id: 'doc_003',
    customerId: 'cus_002',
    type: 'ID Card',
    status: 'Uploaded',
    extractedFields: {
      fullName: 'Tran Thi B',
      dateOfBirth: '1998-07-22',
      idNumber: '031987654321',
      issueDate: '2020-03-10',
      address: '456 Le Loi St, Hanoi',
    },
  },
  {
    id: 'doc_004',
    customerId: 'cus_003',
    type: 'ID Card',
    status: 'Uploaded',
    extractedFields: {
      fullName: 'Le Van C',
      dateOfBirth: '1981-12-05',
      idNumber: '015478963258',
      issueDate: '2018-06-20',
      address: '789 Tran Hung Dao St, Da Nang',
    },
  },
  {
    id: 'doc_005',
    customerId: 'cus_006',
    type: 'Loan Application',
    status: 'Needs Review',
    extractedFields: {
      loanAmount: '500,000,000',
      loanPurpose: 'Home renovation',
      tenure: '60 months',
      propertyAddress: '456 Lam Son St, Can Tho',
    },
  },
  {
    id: 'doc_006',
    customerId: 'cus_006',
    type: 'ID Card',
    status: 'Uploaded',
    extractedFields: {
      fullName: 'Vu Thi F',
      dateOfBirth: '1984-05-18',
      idNumber: '026845197523',
      issueDate: '2019-09-15',
      address: '456 Lam Son St, Can Tho',
    },
  },
  // SME Customer Documents
  {
    id: 'doc_007',
    customerId: 'cus_011',
    type: 'Business License',
    status: 'Uploaded',
    extractedFields: {
      companyName: 'ABC Trading Co.',
      registrationNumber: '0102345678',
      issueDate: '2015-03-15',
      businessType: 'Trading',
      address: '100 Trade Center, District 5, HCMC',
    },
  },
  {
    id: 'doc_008',
    customerId: 'cus_011',
    type: 'Financial Statement',
    status: 'Uploaded',
    extractedFields: {
      revenue: '15,000,000,000',
      netProfit: '1,200,000,000',
      totalAssets: '8,500,000,000',
    },
  },
  {
    id: 'doc_009',
    customerId: 'cus_011',
    type: 'Bank Statement',
    status: 'Uploaded',
    extractedFields: {
      avgBalance: '850,000,000',
      monthlyTurnover: '3,500,000,000',
    },
  },
  {
    id: 'doc_010',
    customerId: 'cus_011',
    type: 'Tax Document',
    status: 'Uploaded',
    extractedFields: {
      taxCode: '024589765431',
      lastFilingDate: '2026-04-20',
      taxPaid: '180,000,000',
    },
  },
  {
    id: 'doc_011',
    customerId: 'cus_012',
    type: 'Business License',
    status: 'Uploaded',
    extractedFields: {
      companyName: 'Blue Ocean Logistics Co.',
      registrationNumber: '0103456789',
      issueDate: '2012-08-10',
      businessType: 'Logistics Services',
      address: '200 Port Area, District 7, HCMC',
    },
  },
  {
    id: 'doc_012',
    customerId: 'cus_012',
    type: 'Financial Statement',
    status: 'Uploaded',
    extractedFields: {
      revenue: '45,000,000,000',
      netProfit: '3,800,000,000',
      totalAssets: '25,000,000,000',
    },
  },
  {
    id: 'doc_013',
    customerId: 'cus_012',
    type: 'Trade Document',
    status: 'Uploaded',
    extractedFields: {
      importVolume: '12,000,000,000',
      exportVolume: '18,000,000,000',
      mainMarkets: 'USA, Europe, Japan',
    },
  },
  // Corporate Documents
  {
    id: 'doc_014',
    customerId: 'cus_021',
    type: 'Business License',
    status: 'Uploaded',
    extractedFields: {
      companyName: 'Viet Steel Corporation',
      registrationNumber: '0101234567',
      issueDate: '2005-01-15',
      businessType: 'Steel Manufacturing',
      address: '1 Industrial Park, Binh Duong',
    },
  },
  {
    id: 'doc_015',
    customerId: 'cus_021',
    type: 'Financial Statement',
    status: 'Uploaded',
    extractedFields: {
      revenue: '250,000,000,000',
      netProfit: '22,000,000,000',
      totalAssets: '150,000,000,000',
    },
  },
  {
    id: 'doc_016',
    customerId: 'cus_021',
    type: 'Tax Document',
    status: 'Uploaded',
    extractedFields: {
      taxCode: '012345678901',
      lastFilingDate: '2026-04-15',
      taxPaid: '5,500,000,000',
    },
  },
  {
    id: 'doc_017',
    customerId: 'cus_022',
    type: 'Business License',
    status: 'Uploaded',
    extractedFields: {
      companyName: 'VN Oil Energy Group',
      registrationNumber: '0109876543',
      issueDate: '2000-06-20',
      businessType: 'Energy',
      address: '100 Nguyen Du St, District 1, HCMC',
    },
  },
  {
    id: 'doc_018',
    customerId: 'cus_022',
    type: 'Financial Statement',
    status: 'Uploaded',
    extractedFields: {
      revenue: '850,000,000,000',
      netProfit: '85,000,000,000',
      totalAssets: '500,000,000,000',
    },
  },
  // Missing Documents
  {
    id: 'doc_019',
    customerId: 'cus_013',
    type: 'Business License',
    status: 'Missing',
  },
  {
    id: 'doc_020',
    customerId: 'cus_013',
    type: 'Bank Statement',
    status: 'Expired',
    extractedFields: {
      avgBalance: '320,000,000',
      period: 'Q4 2025',
    },
  },
  {
    id: 'doc_021',
    customerId: 'cus_009',
    type: 'Financial Statement',
    status: 'Missing',
  },
  {
    id: 'doc_022',
    customerId: 'cus_050',
    type: 'Tax Document',
    status: 'Missing',
  },
  // More documents
  ...generateMoreDocuments(28),
];

function generateMoreDocuments(count: number): CustomerDocument[] {
  const types: DocumentType[] = ['ID Card', 'Business License', 'Bank Statement', 'Financial Statement', 'Tax Document', 'Loan Application'];
  const statuses: DocumentStatus[] = ['Uploaded', 'Uploaded', 'Uploaded', 'Needs Review'];
  const documents: CustomerDocument[] = [];
  
  for (let i = 0; i < count; i++) {
    const customerId = `cus_${String((i % 50) + 1).padStart(3, '0')}`;
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    
    documents.push({
      id: `doc_${23 + i}`,
      customerId,
      type,
      status,
      extractedFields: status === 'Uploaded' || status === 'Needs Review' ? {
        documentNumber: `DOC${String(1000 + i).padStart(6, '0')}`,
        issueDate: `202${4 + (i % 3)}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
      } : undefined,
    });
  }
  
  return documents;
}

// Helper functions
export function getDocumentsByCustomer(customerId: string): CustomerDocument[] {
  return mockDocuments.filter((d) => d.customerId === customerId);
}

export function getMissingDocuments(): CustomerDocument[] {
  return mockDocuments.filter((d) => d.status === 'Missing');
}

export function getExpiredDocuments(): CustomerDocument[] {
  return mockDocuments.filter((d) => d.status === 'Expired');
}

export function getDocumentsNeedingReview(): CustomerDocument[] {
  return mockDocuments.filter((d) => d.status === 'Needs Review');
}
