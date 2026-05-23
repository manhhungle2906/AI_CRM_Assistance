// ============================================
// OceanBank AI CRM Assistant - Mock Channel Events
// ============================================
import { ChannelEvent } from '../lib/types';

export const mockChannelEvents: ChannelEvent[] = [
  // Mobile App Events
  {
    id: 'evt_001',
    customerId: 'cus_001',
    customerName: 'Nguyen Van A',
    channel: 'Mobile App',
    eventType: 'Product Click',
    date: '2026-05-22',
    detail: 'Customer browsed Credit Card section for 5 minutes',
    sentiment: 'Positive',
    handoverRequired: false,
  },
  {
    id: 'evt_002',
    customerId: 'cus_002',
    customerName: 'Tran Thi B',
    channel: 'Mobile App',
    eventType: 'Loan Interest',
    date: '2026-05-21',
    detail: 'Customer inquired about Personal Loan eligibility',
    sentiment: 'Positive',
    handoverRequired: true,
  },
  {
    id: 'evt_003',
    customerId: 'cus_008',
    customerName: 'Nguyen Thi H',
    channel: 'Mobile App',
    eventType: 'Failed Transaction',
    date: '2026-05-20',
    detail: 'Payment failed 3 times at merchant POS',
    sentiment: 'Negative',
    handoverRequired: true,
  },
  // Chatbot Events
  {
    id: 'evt_004',
    customerId: 'cus_016',
    customerName: 'Sunrise Tech Solutions',
    channel: 'Chatbot',
    eventType: 'Inquiry',
    date: '2026-05-21',
    detail: 'Chatbot conversation: Customer asked about SME overdraft limit increase',
    sentiment: 'Positive',
    handoverRequired: true,
    detectedIntent: 'Increase overdraft limit',
    conversationSummary: 'SME owner inquiring about increasing overdraft facility from 500M to 1B VND',
  },
  {
    id: 'evt_005',
    customerId: 'cus_020',
    customerName: 'Saigon Electronics',
    channel: 'Chatbot',
    eventType: 'Product Click',
    date: '2026-05-20',
    detail: 'Customer viewed Working Capital Loan calculator',
    sentiment: 'Positive',
    handoverRequired: false,
  },
  {
    id: 'evt_006',
    customerId: 'cus_033',
    customerName: 'Nguyen Van S',
    channel: 'Chatbot',
    eventType: 'Complaint',
    date: '2026-05-18',
    detail: 'Customer complained about difficulty using mobile app',
    sentiment: 'Negative',
    handoverRequired: true,
    detectedIntent: 'Complaint about app usability',
    conversationSummary: 'Customer frustrated with app login issues and transfer delays',
  },
  // Hotline Events
  {
    id: 'evt_007',
    customerId: 'cus_013',
    customerName: 'Minh An Retail',
    channel: 'Hotline',
    eventType: 'Complaint',
    date: '2026-05-18',
    detail: 'Customer called to complain about delayed supplier payment',
    sentiment: 'Negative',
    handoverRequired: true,
    detectedIntent: 'Complaint',
    conversationSummary: 'Payment to supplier delayed by 5 days, causing cash flow issues',
  },
  {
    id: 'evt_008',
    customerId: 'cus_021',
    customerName: 'Viet Steel Corporation',
    channel: 'Hotline',
    eventType: 'Inquiry',
    date: '2026-05-15',
    detail: 'Customer inquired about trade finance documentation requirements',
    sentiment: 'Neutral',
    handoverRequired: false,
  },
  // Website Events
  {
    id: 'evt_009',
    customerId: 'cus_035',
    customerName: 'Le Van U',
    channel: 'Website',
    eventType: 'Product Click',
    date: '2026-05-22',
    detail: 'Customer visited Term Deposit product page',
    sentiment: 'Positive',
    handoverRequired: false,
  },
  {
    id: 'evt_010',
    customerId: 'cus_039',
    customerName: 'Vu Van Z',
    channel: 'Website',
    eventType: 'Loan Interest',
    date: '2026-05-21',
    detail: 'Customer submitted loan inquiry form',
    sentiment: 'Positive',
    handoverRequired: true,
    detectedIntent: 'Personal loan inquiry',
    conversationSummary: 'Customer interested in personal loan for home renovation',
  },
  // Branch Events
  {
    id: 'evt_011',
    customerId: 'cus_029',
    customerName: 'Le Thi N',
    channel: 'Branch',
    eventType: 'Inquiry',
    date: '2026-05-18',
    detail: 'Customer visited branch to discuss wealth management services',
    sentiment: 'Positive',
    handoverRequired: true,
    detectedIntent: 'Wealth management consultation',
    conversationSummary: 'VIP customer interested in premium wealth management services',
  },
  {
    id: 'evt_012',
    customerId: 'cus_008',
    customerName: 'Nguyen Thi H',
    channel: 'Branch',
    eventType: 'Complaint',
    date: '2026-05-05',
    detail: 'Customer visited branch to follow up on ATM card complaint',
    sentiment: 'Negative',
    handoverRequired: true,
    detectedIntent: 'Complaint follow-up',
    conversationSummary: 'Customer following up on unresolved ATM card issue',
  },
  // Callbot Events
  {
    id: 'evt_013',
    customerId: 'cus_010',
    customerName: 'Bui Thi K',
    channel: 'Callbot',
    eventType: 'Product Click',
    date: '2026-05-20',
    detail: 'Outbound call: Customer expressed interest in alternative investments',
    sentiment: 'Positive',
    handoverRequired: true,
    detectedIntent: 'Investment inquiry',
    conversationSummary: 'Affluent customer interested in alternative investment products',
  },
  {
    id: 'evt_014',
    customerId: 'cus_005',
    customerName: 'Hoang Van E',
    channel: 'Callbot',
    eventType: 'Inquiry',
    date: '2026-05-15',
    detail: 'Outbound call: Customer not available, left voicemail',
    sentiment: 'Neutral',
    handoverRequired: false,
  },
  // Email Events
  {
    id: 'evt_015',
    customerId: 'cus_012',
    customerName: 'Blue Ocean Logistics',
    channel: 'Email',
    eventType: 'Product Click',
    date: '2026-05-10',
    detail: 'Customer opened FX Services promotional email',
    sentiment: 'Positive',
    handoverRequired: false,
  },
  {
    id: 'evt_016',
    customerId: 'cus_022',
    customerName: 'VN Oil Energy Group',
    channel: 'Email',
    eventType: 'Inquiry',
    date: '2026-05-12',
    detail: 'Customer replied to corporate banking email requesting meeting',
    sentiment: 'Positive',
    handoverRequired: true,
    detectedIntent: 'Schedule meeting',
    conversationSummary: 'Large corporate client requesting treasury services consultation',
  },
  // More events to reach 200
  ...generateMoreChannelEvents(184),
];

function generateMoreChannelEvents(count: number): ChannelEvent[] {
  const channels: ChannelEvent['channel'][] = ['Mobile App', 'Website', 'Hotline', 'Branch', 'Email', 'Chatbot', 'Callbot'];
  const eventTypes: ChannelEvent['eventType'][] = ['Inquiry', 'Complaint', 'Product Click', 'Failed Transaction', 'Loan Interest', 'Card Interest', 'Deposit Interest'];
  const sentiments: ChannelEvent['sentiment'][] = ['Positive', 'Neutral', 'Negative'];
  
  const events: ChannelEvent[] = [];
  
  for (let i = 0; i < count; i++) {
    const customerId = `cus_${String((i % 50) + 1).padStart(3, '0')}`;
    const customerNames = [
      'Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E',
      'Vu Thi F', 'Dao Van G', 'Nguyen Thi H', 'Trinh Van I', 'Bui Thi K',
      'ABC Trading Co.', 'Blue Ocean Logistics', 'Minh An Retail', 'Lotus Food Service',
      'Green Farm Agriculture', 'Sunrise Tech Solutions', 'Mekong Distribution', 'Viet Textile Co.',
      'Hanoi Construction JSC', 'Saigon Electronics', 'Viet Steel Corporation', 'VN Oil Energy Group',
      'OceanBank Corp', 'VN Telecom Inc.', 'Sai Gon Retail Group', 'Pham Van D',
      'Nguyen Thi L', 'Tran Van M', 'Le Thi N', 'Hoang Van P', 'Vu Van Q',
    ];
    
    const channel = channels[i % channels.length];
    const eventType = eventTypes[i % eventTypes.length];
    const sentiment = sentiments[i % 3];
    const day = 1 + (i % 23);
    const month = 1 + (i % 5);
    const customerName = customerNames[i % 50];
    
    events.push({
      id: `evt_${17 + i}`,
      customerId,
      customerName,
      channel,
      eventType,
      date: `2026-0${month}-${String(day).padStart(2, '0')}`,
      detail: `Routine ${eventType.toLowerCase()} via ${channel}`,
      sentiment,
      handoverRequired: i % 5 === 0,
      detectedIntent: i % 5 === 0 ? eventType : undefined,
      conversationSummary: i % 5 === 0 ? `${customerName} interaction via ${channel}` : undefined,
    });
  }
  
  return events;
}

// Helper functions
export function getChannelEventsByCustomer(customerId: string): ChannelEvent[] {
  return mockChannelEvents
    .filter((e) => e.customerId === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getChannelEventsByChannel(channel: string): ChannelEvent[] {
  return mockChannelEvents.filter((e) => e.channel === channel);
}

export function getHandoverRequiredEvents(): ChannelEvent[] {
  return mockChannelEvents.filter((e) => e.handoverRequired);
}

export function getNegativeSentimentEvents(): ChannelEvent[] {
  return mockChannelEvents.filter((e) => e.sentiment === 'Negative');
}

export function getEventsByDateRange(startDate: string, endDate: string): ChannelEvent[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return mockChannelEvents.filter((e) => {
    const date = new Date(e.date);
    return date >= start && date <= end;
  });
}
