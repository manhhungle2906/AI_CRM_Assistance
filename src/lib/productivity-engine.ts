// ============================================
// Productivity Engine
// ============================================
import { RM } from './types';
import { mockRMs, getRMById } from '@/data/mock-rms';
import { getTasksByRM } from '@/data/mock-tasks';
import { getLeadsByRM } from '@/data/mock-leads';

export interface RMProductivity {
  rm: RM;
  productivityScore: number;
  metrics: {
    calls: number;
    emails: number;
    meetings: number;
    tasksCompleted: number;
    activeLeads: number;
    conversionRate: number;
    revenueProgress: number;
    overdueTasks: number;
  };
  ranking: {
    overall: number;
    calls: number;
    meetings: number;
    conversion: number;
  };
  insights: string[];
}

export function calculateRMProductivity(rmId: string): RMProductivity | null {
  const rm = getRMById(rmId);
  if (!rm) return null;

  const tasks = getTasksByRM(rmId);
  const leads = getLeadsByRM(rmId);

  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
  const activeTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  
  const hotLeads = leads.filter(l => l.qualification === 'Hot' && !['Lost', 'Disqualified', 'Converted'].includes(l.status)).length;
  
  const revenueProgress = Math.round((rm.monthlyRevenue / rm.monthlyTarget) * 100);

  // Calculate productivity score (0-100)
  let score = 0;
  
  // Revenue progress (40% weight)
  score += Math.min(40, revenueProgress * 0.4);
  
  // Task completion (20% weight)
  const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  score += Math.min(20, taskCompletionRate * 0.2);
  
  // Conversion rate (20% weight)
  score += Math.min(20, rm.conversionRate * 50); // 40% = 20 points
  
  // Lead handling (20% weight)
  const leadScore = Math.min(20, (hotLeads / 10) * 20); // 10 hot leads = full score
  score += leadScore;

  // Penalty for overdue tasks
  if (overdueTasks > 3) {
    score -= 5;
  }

  const insights: string[] = [];
  
  if (revenueProgress >= 100) {
    insights.push('Monthly target exceeded!');
  } else if (revenueProgress >= 80) {
    insights.push('On track to meet monthly target');
  } else if (revenueProgress < 50) {
    insights.push('Below target - need focused effort');
  }

  if (overdueTasks > 5) {
    insights.push('High number of overdue tasks - prioritize completion');
  } else if (overdueTasks === 0) {
    insights.push('No overdue tasks - excellent task management');
  }

  if (rm.callsThisMonth > 50) {
    insights.push('High call volume - good customer engagement');
  }

  if (rm.conversionRate > 0.4) {
    insights.push('Strong conversion rate - effective selling');
  }

  return {
    rm,
    productivityScore: Math.round(score),
    metrics: {
      calls: rm.callsThisMonth,
      emails: rm.emailsThisMonth,
      meetings: rm.meetingsThisMonth,
      tasksCompleted: completedTasks,
      activeLeads: hotLeads,
      conversionRate: Math.round(rm.conversionRate * 100),
      revenueProgress,
      overdueTasks,
    },
    ranking: {
      overall: 0, // Will be calculated by rankRMs
      calls: 0,
      meetings: 0,
      conversion: 0,
    },
    insights,
  };
}

export function rankRMs(): RMProductivity[] {
  const productivities = mockRMs.map(rm => calculateRMProductivity(rm.id)).filter((p): p is RMProductivity => p !== null);
  
  // Sort by overall score
  productivities.sort((a, b) => b.productivityScore - a.productivityScore);
  
  // Assign rankings
  productivities.forEach((p, index) => {
    p.ranking.overall = index + 1;
  });

  // Sort by calls
  const byCalls = [...productivities].sort((a, b) => b.metrics.calls - a.metrics.calls);
  byCalls.forEach((p, index) => {
    const original = productivities.find(pr => pr.rm.id === p.rm.id);
    if (original) original.ranking.calls = index + 1;
  });

  // Sort by meetings
  const byMeetings = [...productivities].sort((a, b) => b.metrics.meetings - a.metrics.meetings);
  byMeetings.forEach((p, index) => {
    const original = productivities.find(pr => pr.rm.id === p.rm.id);
    if (original) original.ranking.meetings = index + 1;
  });

  // Sort by conversion
  const byConversion = [...productivities].sort((a, b) => b.metrics.conversionRate - a.metrics.conversionRate);
  byConversion.forEach((p, index) => {
    const original = productivities.find(pr => pr.rm.id === p.rm.id);
    if (original) original.ranking.conversion = index + 1;
  });

  return productivities;
}

export function generateRMPerformanceSummary(rmId: string): string {
  const productivity = calculateRMProductivity(rmId);
  if (!productivity) return 'RM not found';

  const { rm, metrics, productivityScore, insights } = productivity;

  let summary = `## Performance Summary: ${rm.name}\n\n`;
  
  summary += `**Overall Productivity Score:** ${productivityScore}/100\n\n`;
  
  summary += `### Activity Metrics\n`;
  summary += `- Calls: ${metrics.calls}\n`;
  summary += `- Emails: ${metrics.emails}\n`;
  summary += `- Meetings: ${metrics.meetings}\n`;
  summary += `- Tasks Completed: ${metrics.tasksCompleted}\n`;
  summary += `- Overdue Tasks: ${metrics.overdueTasks}\n\n`;
  
  summary += `### Sales Performance\n`;
  summary += `- Monthly Target: ${formatCurrency(rm.monthlyTarget)}\n`;
  summary += `- Monthly Revenue: ${formatCurrency(rm.monthlyRevenue)}\n`;
  summary += `- Progress: ${metrics.revenueProgress}%\n`;
  summary += `- Conversion Rate: ${metrics.conversionRate}%\n`;
  summary += `- Active Leads: ${metrics.activeLeads}\n\n`;
  
  summary += `### Insights\n`;
  insights.forEach(insight => {
    summary += `- ${insight}\n`;
  });

  return summary;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B VND';
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + 'M VND';
  return amount.toLocaleString() + ' VND';
}
