// ============================================
// OceanBank AI CRM Assistant - Mock Interactions
// ============================================
import { Interaction, InteractionChannel } from '../lib/types';

export const mockInteractions: Interaction[] = [
  // ABC Trading Co.
  {
    id: 'int_001',
    customerId: 'cus_011',
    channel: 'Meeting',
    date: '2026-05-15',
    topic: 'Quarterly Business Review',
    summary: 'Discussed Q1 performance, highlighted 18% transaction growth. Customer mentioned expansion plans for Northern region.',
    sentiment: 'Positive',
    nextStep: 'Prepare SME Overdraft proposal for Q2 cash flow needs',
  },
  {
    id: 'int_002',
    customerId: 'cus_011',
    channel: 'Call',
    date: '2026-04-20',
    topic: 'Product Introduction',
    summary: 'Introduced Trade Finance services. Customer interested in import financing for new supplier relationships.',
    sentiment: 'Positive',
    nextStep: 'Send Trade Finance brochure and fee schedule',
  },
  // Nguyen Van A (Individual)
  {
    id: 'int_003',
    customerId: 'cus_001',
    channel: 'App',
    date: '2026-05-18',
    topic: 'App Usage Query',
    summary: 'Customer inquired about mobile app features for international transfers.',
    sentiment: 'Neutral',
    nextStep: 'Send tutorial video for international transfer feature',
  },
  // Blue Ocean Logistics
  {
    id: 'int_004',
    customerId: 'cus_012',
    channel: 'Email',
    date: '2026-05-10',
    topic: 'FX Rate Inquiry',
    summary: 'Customer requested FX rates for USD/VND and EUR/VND. Planning to hedge exposure from new European contracts.',
    sentiment: 'Positive',
    nextStep: 'Schedule FX consultation meeting',
  },
  {
    id: 'int_005',
    customerId: 'cus_012',
    channel: 'Meeting',
    date: '2026-04-28',
    topic: 'Business Credit Card Renewal',
    summary: 'Discussed card renewal and upgrade options. Customer satisfied with current service.',
    sentiment: 'Positive',
  },
  // Minh An Retail (Complaint)
  {
    id: 'int_006',
    customerId: 'cus_013',
    channel: 'Call',
    date: '2026-05-18',
    topic: 'Complaint: Transaction Delay',
    summary: 'Customer complained about delayed payment to supplier. Investigated and found processing issue.',
    sentiment: 'Negative',
    unresolvedIssue: 'Compensation request for late payment penalty',
    nextStep: 'Escalate to operations team for resolution',
  },
  // Pham Thi D
  {
    id: 'int_007',
    customerId: 'cus_008',
    channel: 'Branch',
    date: '2026-05-05',
    topic: 'ATM Card Issue',
    summary: 'Customer reported ATM card not working at partner ATMs. Card replaced.',
    sentiment: 'Negative',
    nextStep: 'Follow up on new card delivery',
  },
  // Viet Steel Corporation
  {
    id: 'int_008',
    customerId: 'cus_021',
    channel: 'Meeting',
    date: '2026-05-12',
    topic: 'Working Capital Review',
    summary: 'Reviewed Q1 working capital utilization. Customer expanding production capacity.',
    sentiment: 'Positive',
    nextStep: 'Prepare increased credit facility proposal',
  },
  // Bui Thi K (Affluent)
  {
    id: 'int_009',
    customerId: 'cus_010',
    channel: 'Meeting',
    date: '2026-05-21',
    topic: 'Wealth Planning',
    summary: 'Discussed investment portfolio rebalancing. Customer interested in alternative investments.',
    sentiment: 'Positive',
    nextStep: 'Arrange meeting with wealth management specialist',
  },
  // Green Farm Agriculture (Churn Risk)
  {
    id: 'int_010',
    customerId: 'cus_015',
    channel: 'Call',
    date: '2026-02-10',
    topic: 'Seasonal Loan Inquiry',
    summary: 'Customer inquired about loan restructuring due to crop failure.',
    sentiment: 'Negative',
    nextStep: 'Follow up on loan restructuring options',
  },
  // More interactions to reach 200
  ...generateMoreInteractions(190),
];

function generateMoreInteractions(count: number): Interaction[] {
  const channels: InteractionChannel[] = ['Call', 'Email', 'Branch', 'App', 'Chatbot', 'Meeting', 'Contact Center', 'Website'];
  const topics = [
    'Account Inquiry',
    'Product Information',
    'Service Request',
    'Transaction Issue',
    'Loan Inquiry',
    'Card Application',
    'Fee Inquiry',
    'Statement Request',
    'Address Update',
    'Online Banking',
    'Credit Limit',
    'Deposit Maturity',
    'Insurance Inquiry',
    'Investment Query',
    'FX Services',
    'Trade Finance',
  ];
  const sentiments: ('Positive' | 'Neutral' | 'Negative')[] = ['Positive', 'Neutral', 'Negative'];
  
  const interactions: Interaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const customerId = `cus_${String((i % 50) + 1).padStart(3, '0')}`;
    const channel = channels[i % channels.length];
    const day = 1 + (i % 23);
    const month = 1 + (i % 5);
    
    interactions.push({
      id: `int_${11 + i}`,
      customerId,
      channel,
      date: `2026-0${month}-${String(day).padStart(2, '0')}`,
      topic: topics[i % topics.length],
      summary: `Routine interaction regarding ${topics[i % topics.length].toLowerCase()}. Customer inquiry addressed.`,
      sentiment: sentiments[i % 3],
      nextStep: i % 3 === 0 ? 'Follow up required' : undefined,
      unresolvedIssue: i % 7 === 0 ? 'Pending resolution' : undefined,
    });
  }
  
  return interactions;
}

// Helper functions
export function getInteractionsByCustomer(customerId: string): Interaction[] {
  return mockInteractions.filter((i) => i.customerId === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecentInteractions(customerId: string, limit: number = 10): Interaction[] {
  return getInteractionsByCustomer(customerId).slice(0, limit);
}

export function getInteractionsByChannel(channel: InteractionChannel): Interaction[] {
  return mockInteractions.filter((i) => i.channel === channel);
}

export function getUnresolvedInteractions(): Interaction[] {
  return mockInteractions.filter((i) => i.unresolvedIssue !== undefined);
}

export function getNegativeSentimentInteractions(): Interaction[] {
  return mockInteractions.filter((i) => i.sentiment === 'Negative');
}
