// ============================================
// Next Best Action Engine
// ============================================
import { Customer, NextBestAction, Task, TaskType } from './types';
import { getCustomerById } from '@/data/mock-customers';

export function generateNextBestAction(customerId: string): NextBestAction | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  let actionCounter = 0;

  // Priority 1: Active complaint - resolve first, no sales
  if (customer.complaintStatus === 'Open') {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Resolve Customer Complaint',
      actionType: 'Call',
      description: 'Customer has an open complaint. Resolution takes priority over any sales activity.',
      reason: 'Active complaint detected - immediate attention required.',
      estimatedOutcome: 'Complaint resolved, customer retained.',
      priority: 'High',
      recommendedChannel: 'Call',
      dueDateSuggestion: getDueDate(0),
    };
  }

  // Priority 2: High churn risk - retention action
  if (customer.churnRiskScore > 60) {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Retention Call - High Churn Risk',
      actionType: 'Retention',
      description: `Contact customer immediately to address churn risk factors. Score: ${customer.churnRiskScore}`,
      reason: `Churn risk score is ${customer.churnRiskScore}. Customer last interacted ${getDaysSince(customer.lastInteractionDate)} days ago.`,
      estimatedOutcome: 'Customer engagement restored, churn risk reduced.',
      priority: 'High',
      recommendedChannel: 'Call',
      dueDateSuggestion: getDueDate(1),
    };
  }

  // Priority 3: Loan renewal due
  if (customer.nextRenewalDate) {
    const daysUntilRenewal = getDaysUntil(customer.nextRenewalDate);
    if (daysUntilRenewal <= 30) {
      actionCounter++;
      return {
        id: `nba_${customerId}_${actionCounter}`,
        customerId,
        title: 'Loan Renewal Discussion',
        actionType: 'Renewal',
        description: `Schedule meeting to discuss loan renewal options. Due in ${daysUntilRenewal} days.`,
        reason: `Loan renewal due in ${daysUntilRenewal} days. Schedule renewal discussion.`,
        estimatedOutcome: 'Successful renewal, relationship maintained.',
        priority: 'High',
        recommendedChannel: 'Call',
        dueDateSuggestion: getDueDate(Math.max(0, daysUntilRenewal - 14)),
      };
    }
  }

  // Priority 4: SME with growth - working capital discussion
  if (customer.segment === 'SME' && customer.transactionTrend3M > 15) {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Working Capital Discussion',
      actionType: 'Cross-sell',
      description: `Schedule meeting to discuss working capital needs. Customer shows ${customer.transactionTrend3M}% growth.`,
      reason: `SME showing ${customer.transactionTrend3M}% growth. Potential working capital or overdraft need.`,
      estimatedOutcome: 'Working capital facility opened.',
      priority: 'Medium',
      recommendedChannel: 'Meeting',
      dueDateSuggestion: getDueDate(7),
    };
  }

  // Priority 5: High balance - savings/wealth discussion
  if (customer.averageBalance > 1000000000 && customer.segment !== 'SME' && customer.segment !== 'Corporate') {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Wealth Management Opportunity',
      actionType: 'Upsell',
      description: 'High balance customer - introduce wealth management and investment products.',
      reason: 'Large CASA balance suggests wealth management potential.',
      estimatedOutcome: 'Wealth product cross-sold.',
      priority: 'Medium',
      recommendedChannel: customer.digitalAdoptionScore > 60 ? 'Email' : 'Meeting',
      dueDateSuggestion: getDueDate(14),
    };
  }

  // Priority 6: Low digital adoption - digital activation
  if (customer.digitalAdoptionScore < 50 && customer.segment !== 'Corporate') {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Digital Adoption Campaign',
      actionType: 'Reminder',
      description: 'Low digital adoption - promote mobile banking features.',
      reason: `Digital adoption score is ${customer.digitalAdoptionScore}. Customer may benefit from digital services.`,
      estimatedOutcome: 'Digital adoption increased, reduced service cost.',
      priority: 'Medium',
      recommendedChannel: 'Email',
      dueDateSuggestion: getDueDate(7),
    };
  }

  // Priority 7: Corporate with international transactions
  if (customer.segment === 'Corporate' && customer.internationalTransactionCount > 10) {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Trade Finance Opportunity',
      actionType: 'Cross-sell',
      description: 'Corporate with international transactions - offer trade finance and FX services.',
      reason: `${customer.internationalTransactionCount} international transactions detected. Trade finance opportunity.`,
      estimatedOutcome: 'Trade finance product activated.',
      priority: 'Medium',
      recommendedChannel: 'Meeting',
      dueDateSuggestion: getDueDate(14),
    };
  }

  // Priority 8: Low product count - cross-sell opportunity
  if (customer.productCount <= 2) {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Product Expansion Discussion',
      actionType: 'Cross-sell',
      description: 'Customer has few products - identify cross-sell opportunities.',
      reason: `Only ${customer.productCount} product(s). Cross-sell to deepen relationship.`,
      estimatedOutcome: 'At least one additional product cross-sold.',
      priority: 'Medium',
      recommendedChannel: 'Call',
      dueDateSuggestion: getDueDate(14),
    };
  }

  // Priority 9: Dormant customer - re-engagement
  if (getDaysSince(customer.lastInteractionDate) > 90) {
    actionCounter++;
    return {
      id: `nba_${customerId}_${actionCounter}`,
      customerId,
      title: 'Re-engagement Campaign',
      actionType: 'Follow-up',
      description: 'Customer has not interacted in over 90 days - re-engagement needed.',
      reason: `Last interaction ${getDaysSince(customer.lastInteractionDate)} days ago. Dormant customer.`,
      estimatedOutcome: 'Customer re-engaged, next interaction scheduled.',
      priority: 'Low',
      recommendedChannel: 'Email',
      dueDateSuggestion: getDueDate(7),
    };
  }

  // Default action - regular follow-up
  actionCounter++;
  return {
    id: `nba_${customerId}_${actionCounter}`,
    customerId,
    title: 'Regular Follow-up',
    actionType: 'Follow-up',
    description: 'Regular customer touchpoint - check satisfaction and identify needs.',
    reason: 'Routine follow-up for relationship maintenance.',
    estimatedOutcome: 'Satisfaction confirmed, no issues.',
    priority: 'Low',
    recommendedChannel: customer.digitalAdoptionScore > 70 ? 'Email' : 'Call',
    dueDateSuggestion: getDueDate(30),
  };
}

export function generateActionQueue(customerIds: string[]): NextBestAction[] {
  const actions: NextBestAction[] = [];

  customerIds.forEach(customerId => {
    const action = generateNextBestAction(customerId);
    if (action) {
      actions.push(action);
    }
  });

  // Sort by priority
  const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export function createTaskFromAction(action: NextBestAction): Task {
  const taskType: TaskType = 
    action.actionType === 'Call' ? 'Call' :
    action.actionType === 'Email' ? 'Email' :
    action.actionType === 'Meeting' ? 'Meeting' :
    action.actionType === 'Renewal' ? 'Renewal' :
    action.actionType === 'Retention' ? 'Campaign Follow-up' :
    action.actionType === 'Cross-sell' ? 'Campaign Follow-up' :
    action.actionType === 'Upsell' ? 'Campaign Follow-up' : 'Follow-up' as TaskType;

  return {
    id: `task_${action.id}`,
    customerId: action.customerId,
    title: action.title,
    description: action.description,
    type: taskType,
    dueDate: action.dueDateSuggestion,
    priority: action.priority,
    status: 'Pending',
    assignedRMId: '',
    createdBy: 'AI Assistant',
  };
}

function getDueDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

function getDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
