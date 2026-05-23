// ============================================
// OceanBank AI CRM Assistant - Type Definitions
// ============================================

// Customer Segmentation Types
export type CustomerSegment = 'Individual' | 'SME' | 'Corporate' | 'Priority' | 'Mass' | 'Affluent';

export type MicroSegment =
  | 'Salary Young Professional'
  | 'Dormant High Balance'
  | 'SME Logistics'
  | 'SME Retail'
  | 'Import Export Corporate'
  | 'Digital Low Adoption'
  | 'Loan Renewal Due'
  | 'Complaint Sensitive'
  | 'High CASA Potential'
  | 'Insurance Potential';

export type RiskLevel = 'Low' | 'Medium' | 'High';

// Customer Model
export type Customer = {
  id: string;
  name: string;
  segment: CustomerSegment;
  microSegment: MicroSegment;
  industry?: string;
  region: string;
  assignedRMId: string;
  age?: number;
  monthlyIncome?: number;
  averageBalance: number;
  casaBalance: number;
  transactionTrend3M: number;
  internationalTransactionCount: number;
  products: string[];
  productCount: number;
  digitalAdoptionScore: number;
  complaintStatus: 'None' | 'Open' | 'Resolved';
  lastInteractionDate: string;
  nextRenewalDate?: string;
  churnRiskScore: number;
  creditRiskScore: number;
  fraudSignalScore: number;
  opportunityScore: number;
};

// Product Model
export type ProductCategory =
  | 'Card'
  | 'Loan'
  | 'Deposit'
  | 'Insurance'
  | 'SME Banking'
  | 'Trade Finance'
  | 'FX'
  | 'Digital Banking'
  | 'Wealth'
  | 'Payment';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  targetSegments: CustomerSegment[];
  description: string;
  crossSellWith?: string[];
  upsellFrom?: string[];
};

// Lead Model
export type LeadStatus =
  | 'New'
  | 'Qualified'
  | 'Disqualified'
  | 'Assigned'
  | 'Contacted'
  | 'Converted'
  | 'Lost';

export type LeadSource = 'AI Generated' | 'Campaign' | 'Website' | 'App' | 'Branch' | 'Contact Center' | 'Chatbot' | 'Meeting';

export type LeadQualification = 'Hot' | 'Warm' | 'Cold' | 'Disqualified';

export type Lead = {
  id: string;
  customerId: string;
  customerName?: string;
  source: LeadSource;
  suggestedProductId: string;
  suggestedProductName?: string;
  leadScore: number;
  qualification: LeadQualification;
  assignedRMId?: string;
  assignedRMName?: string;
  status: LeadStatus;
  reason: string;
  createdAt: string;
};

// RM (Relationship Manager) Model
export type RM = {
  id: string;
  name: string;
  region: string;
  expertise: ProductCategory[];
  activeLeads: number;
  monthlyTarget: number;
  monthlyRevenue: number;
  callsThisMonth: number;
  emailsThisMonth: number;
  meetingsThisMonth: number;
  tasksCompleted: number;
  conversionRate: number;
};

// Interaction Model
export type InteractionChannel = 'Call' | 'Email' | 'Branch' | 'App' | 'Chatbot' | 'Website' | 'Meeting' | 'Contact Center' | 'App Notification';

export type Interaction = {
  id: string;
  customerId: string;
  channel: InteractionChannel;
  date: string;
  topic: string;
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  unresolvedIssue?: string;
  nextStep?: string;
};

// Transaction Summary
export type TransactionSummary = {
  customerId: string;
  month: string;
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
  internationalCount: number;
  anomalyFlag: boolean;
};

// Customer Document
export type DocumentType = 'ID Card' | 'Business License' | 'Bank Statement' | 'Financial Statement' | 'Tax Document' | 'Loan Application' | 'Trade Document';

export type DocumentStatus = 'Uploaded' | 'Missing' | 'Expired' | 'Needs Review';

export type CustomerDocument = {
  id: string;
  customerId: string;
  type: DocumentType;
  status: DocumentStatus;
  extractedFields?: Record<string, string>;
};

// Offer Model
export type OfferType = 'Next Best Offer' | 'Cross-sell' | 'Upsell' | 'Pre-approved';

export type OfferEligibility = 'Eligible' | 'Need Review' | 'Not Eligible';

export type Offer = {
  id: string;
  customerId: string;
  customerName?: string;
  productId: string;
  productName?: string;
  offerType: OfferType;
  score: number;
  eligibility: OfferEligibility;
  reason: string;
  riskWarning?: string;
  suggestedChannel: InteractionChannel;
  suggestedScript?: string;
};

// Task Model
export type TaskType = 'Call' | 'Email' | 'Meeting' | 'Document Check' | 'Complaint Resolution' | 'Renewal' | 'Campaign Follow-up' | 'Risk Review';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Pending' | 'In Progress' | 'Done' | 'Overdue';

export type Task = {
  id: string;
  customerId: string;
  customerName?: string;
  assignedRMId: string;
  assignedRMName?: string;
  title: string;
  description: string;
  type: TaskType;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: 'RM' | 'AI Assistant';
};

// Campaign Model
export type Campaign = {
  id: string;
  name: string;
  productId: string;
  productName?: string;
  targetSegment: CustomerSegment | MicroSegment;
  customersTargeted: number;
  leadsGenerated: number;
  conversions: number;
  conversionRate: number;
  revenueEstimate: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Planned';
};

// Channel Event
export type ChannelEventType = 'Inquiry' | 'Complaint' | 'Product Click' | 'Failed Transaction' | 'Loan Interest' | 'Card Interest' | 'Deposit Interest';

export type ChannelEvent = {
  id: string;
  customerId: string;
  customerName?: string;
  channel: 'Mobile App' | 'Website' | 'Hotline' | 'Branch' | 'Email' | 'Chatbot' | 'Callbot';
  eventType: ChannelEventType;
  date: string;
  detail: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  handoverRequired: boolean;
  detectedIntent?: string;
  conversationSummary?: string;
};

// Deal/Pipeline Model
export type Deal = {
  id: string;
  customerId: string;
  customerName?: string;
  productId: string;
  productName?: string;
  rmId: string;
  rmName?: string;
  value: number;
  stage: 'Inquiry' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  winProbability: number;
  expectedCloseDate: string;
  createdAt: string;
};

// AI Assistant Types
export type AssistantAction =
  | 'summarize_customer'
  | 'summarize_history'
  | 'suggest_next_best_action'
  | 'suggest_next_best_offer'
  | 'suggest_cross_sell'
  | 'suggest_upsell'
  | 'generate_call_script'
  | 'generate_email_script'
  | 'summarize_conversation'
  | 'create_follow_up_task'
  | 'explain_credit_risk'
  | 'explain_churn_risk'
  | 'explain_fraud_signal'
  | 'check_missing_documents'
  | 'generate_preapproved_offer'
  | 'route_lead';

export type AssistantRequest = {
  customerId: string;
  action: AssistantAction;
  meetingNote?: string;
  productToExplain?: string;
  payload?: Record<string, unknown>;
};

export type AssistantResponse = {
  message: string;
  action?: AssistantAction;
  task?: Partial<Task>;
  offer?: Partial<Offer>;
  script?: string;
  summary?: string;
};

// Dashboard Types
export type DashboardKPIs = {
  totalCustomers: number;
  aiGeneratedLeads: number;
  highPriorityLeads: number;
  crossSellOpportunities: number;
  upsellOpportunities: number;
  retentionAlerts: number;
  riskAlerts: number;
  overdueFollowUps: number;
};

export type DashboardData = {
  kpis: DashboardKPIs;
  priorityCustomers: Customer[];
  hotLeads: Lead[];
  riskAlerts: Customer[];
  todaysTasks: Task[];
  dailyBriefing: string;
  segmentDistribution: { name: string; value: number; color: string }[];
  leadPriorityDistribution: { name: string; value: number }[];
  pipelineForecast: { month: string; forecast: number }[];
  campaignConversion: { name: string; rate: number }[];
  rmProductivity: { name: string; calls: number; emails: number; meetings: number }[];
};

// Risk Types
export type EarlyWarningSignal = {
  id: string;
  customerId: string;
  customerName: string;
  signalType: 'Cash Flow Drop' | 'Overdue Loan' | 'International Anomaly' | 'High Value Transfer' | 'Complaint Related' | 'Credit Risk High';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  suggestedAction: string;
  detectedAt: string;
};

export type CreditRiskAssessment = {
  customerId: string;
  customerName: string;
  score: number;
  level: RiskLevel;
  mainFactors: string[];
  warningForSales?: string;
};

export type FraudSignal = {
  customerId: string;
  customerName: string;
  score: number;
  anomalyType: string;
  transactionSignal: string;
  recommendedReview: string;
};

// Retention Types
export type RetentionAlert = {
  id: string;
  customerId: string;
  customerName: string;
  churnRiskScore: number;
  churnRiskLevel: RiskLevel;
  reason: string;
  recommendedAction: string;
  recommendedChannel: InteractionChannel;
  dueDate: string;
};

export type CareSchedule = {
  customerId: string;
  customerName: string;
  events: {
    type: 'Birthday' | 'Renewal' | 'Follow-up' | 'Meeting' | 'Deposit Maturity';
    date: string;
    description: string;
  }[];
};

// Handover Types
export type HandoverRequest = {
  id: string;
  customerId: string;
  customerName: string;
  originalChannel: string;
  detectedIntent: string;
  conversationSummary: string;
  urgency: 'Low' | 'Medium' | 'High';
  assignedRMId?: string;
  assignedRMName?: string;
  handoverReason: string;
  createdAt: string;
};

// Contact Center Insight
export type ContactCenterInsight = {
  id: string;
  customerId: string;
  customerName: string;
  callTopic: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  unresolvedIssue?: string;
  recommendedFollowUp: string;
  date: string;
};

// Dashboard Daily Briefing
export type DailyBriefing = {
  totalLeads: number;
  highPriorityOpportunities: number;
  retentionAlerts: number;
  riskWarnings: number;
  topCustomer: {
    name: string;
    reason: string;
  };
  summary: string;
};

// ============================================
// Next Best Action Types
// ============================================
export type NextBestAction = {
  id: string;
  customerId: string;
  title: string;
  actionType: 'Call' | 'Email' | 'Meeting' | 'Cross-sell' | 'Upsell' | 'Retention' | 'Follow-up' | 'Renewal' | 'Reminder';
  priority: TaskPriority;
  description: string;
  reason: string;
  estimatedOutcome: string;
  recommendedChannel: InteractionChannel;
  dueDateSuggestion: string;
};

// ============================================
// Customer Brief Type
// ============================================
export type CustomerBrief = {
  customerId: string;
  customerName: string;
  segment: CustomerSegment;
  riskProfile: string;
  keyInsight: string;
  summary: string;
  keyInsights: string[];
  opportunities: string[];
  opportunityFits: string[];
  riskFactors: string[];
  nextBestActions: string[];
};
