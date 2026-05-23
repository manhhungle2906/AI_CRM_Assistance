// ============================================
// Retention Engine
// ============================================
import { Customer, RetentionAlert, CareSchedule, RiskLevel, InteractionChannel } from './types';
import { getCustomerById, mockCustomers } from '@/data/mock-customers';
import { getRMById } from '@/data/mock-rms';

export function calculateChurnRisk(customerId: string): { score: number; level: RiskLevel; factors: string[] } {
  const customer = getCustomerById(customerId);
  if (!customer) return { score: 0, level: 'Low', factors: [] };

  let score = 0;
  const factors: string[] = [];

  // Transaction trend (most important)
  if (customer.transactionTrend3M < -20) {
    score += 35;
    factors.push('Severe transaction decline (>20%)');
  } else if (customer.transactionTrend3M < -10) {
    score += 25;
    factors.push('Transaction decline (-10 to -20%)');
  } else if (customer.transactionTrend3M < 0) {
    score += 10;
    factors.push('Slight transaction decline');
  }

  // Last interaction
  const daysSinceInteraction = getDaysSince(customer.lastInteractionDate);
  if (daysSinceInteraction > 90) {
    score += 25;
    factors.push(`No interaction in ${daysSinceInteraction} days`);
  } else if (daysSinceInteraction > 60) {
    score += 20;
    factors.push('No interaction in 60-90 days');
  } else if (daysSinceInteraction > 45) {
    score += 10;
    factors.push('No interaction in 45-60 days');
  }

  // Complaint status
  if (customer.complaintStatus === 'Open') {
    score += 30;
    factors.push('Open complaint unresolved');
  } else if (customer.complaintStatus === 'Resolved') {
    score -= 5; // Slight reduction for resolved complaints
  }

  // Digital adoption
  if (customer.digitalAdoptionScore < 30) {
    score += 20;
    factors.push('Very low digital adoption');
  } else if (customer.digitalAdoptionScore < 40) {
    score += 15;
    factors.push('Low digital adoption');
  }

  // Balance dropping (implied by churn risk field)
  if (customer.churnRiskScore > 50) {
    score += 15;
    factors.push('Historical churn risk indicator');
  }

  // Dormant behavior
  if (customer.transactionTrend3M < -5 && customer.averageBalance > 100000000) {
    score += 10;
    factors.push('High balance but declining activity');
  }

  // Determine level
  let level: RiskLevel;
  if (score >= 60) level = 'High';
  else if (score >= 35) level = 'Medium';
  else level = 'Low';

  return {
    score: Math.min(100, Math.max(0, score)),
    level,
    factors,
  };
}

export function generateRetentionAlerts(): RetentionAlert[] {
  const alerts: RetentionAlert[] = [];

  mockCustomers.forEach(customer => {
    const churnRisk = calculateChurnRisk(customer.id);
    
    if (churnRisk.level === 'High' || (churnRisk.level === 'Medium' && churnRisk.score > 40)) {
      const action = getRetentionAction(customer, churnRisk);
      
      alerts.push({
        id: `ret_alert_${customer.id}`,
        customerId: customer.id,
        customerName: customer.name,
        churnRiskScore: churnRisk.score,
        churnRiskLevel: churnRisk.level,
        reason: churnRisk.factors.join('. '),
        recommendedAction: action.action,
        recommendedChannel: action.channel,
        dueDate: action.dueDate,
      });
    }
  });

  return alerts.sort((a, b) => b.churnRiskScore - a.churnRiskScore);
}

export function generateCareSchedule(customerId: string): CareSchedule | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  const events: CareSchedule['events'] = [];

  // Birthday (simulated - using customer age as proxy)
  if (customer.age) {
    // Simulate birthday 6 months from now
    const birthdayMonth = (customer.age % 12) + 1;
    events.push({
      type: 'Birthday',
      date: `2026-${String(birthdayMonth).padStart(2, '0')}-${String((customer.age * 3) % 28 + 1).padStart(2, '0')}`,
      description: `${customer.age}th birthday milestone - opportunity for special offer`,
    });
  }

  // Loan renewal
  if (customer.nextRenewalDate) {
    events.push({
      type: 'Renewal',
      date: customer.nextRenewalDate,
      description: 'Loan renewal due - review account and discuss options',
    });
  }

  // Follow-up based on last interaction
  const daysSinceInteraction = getDaysSince(customer.lastInteractionDate);
  if (daysSinceInteraction > 30) {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);
    events.push({
      type: 'Follow-up',
      date: followUpDate.toISOString().split('T')[0],
      description: `Last interaction ${daysSinceInteraction} days ago - schedule check-in`,
    });
  }

  // Deposit maturity (simulated)
  if (customer.products.some(p => p.toLowerCase().includes('deposit'))) {
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + 3);
    events.push({
      type: 'Deposit Maturity',
      date: maturityDate.toISOString().split('T')[0],
      description: 'Term deposit maturing - discuss renewal or reinvestment',
    });
  }

  return {
    customerId,
    customerName: customer.name,
    events: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  };
}

export function generateRemarketingCandidates(): Customer[] {
  const candidates: Customer[] = [];

  mockCustomers.forEach(customer => {
    // Check if customer was targeted by campaign but didn't convert
    // For simulation, we'll use customers with churn risk 35-60 and declining activity
    
    if (customer.churnRiskScore >= 35 && 
        customer.churnRiskScore <= 60 && 
        customer.transactionTrend3M < 5 &&
        customer.complaintStatus !== 'Open') {
      candidates.push(customer);
    }
  });

  return candidates.sort((a, b) => b.churnRiskScore - a.churnRiskScore);
}

function getRetentionAction(customer: Customer, churnRisk: { score: number; level: RiskLevel; factors: string[] }): {
  action: string;
  channel: InteractionChannel;
  dueDate: string;
} {
  const dueDate = new Date();
  
  if (churnRisk.level === 'High') {
    dueDate.setDate(dueDate.getDate() + 2);
    return {
      action: `Urgent retention call required. Score: ${churnRisk.score}. ${churnRisk.factors[0] || 'Multiple risk factors detected.'} Consider personal visit or executive engagement for Priority/Affluent customers.`,
      channel: 'Call',
      dueDate: dueDate.toISOString().split('T')[0],
    };
  }

  dueDate.setDate(dueDate.getDate() + 7);
  
  if (customer.segment === 'Affluent' || customer.segment === 'Priority') {
    return {
      action: `Schedule personal meeting to discuss needs and address concerns. Consider exclusive offer or loyalty reward.`,
      channel: 'Meeting',
      dueDate: dueDate.toISOString().split('T')[0],
    };
  }

  if (customer.digitalAdoptionScore > 60) {
    return {
      action: `Send personalized email with relevant offers. Consider app notification with special promotion.`,
      channel: 'Email',
      dueDate: dueDate.toISOString().split('T')[0],
    };
  }

  return {
    action: `Phone call to check in and understand any issues. Prepare retention offer based on customer profile.`,
    channel: 'Call',
    dueDate: dueDate.toISOString().split('T')[0],
  };
}

function getDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  return Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}
