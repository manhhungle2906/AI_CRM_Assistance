import { NextResponse } from 'next/server';
import { mockCustomers, getHighPriorityCustomers, getRetentionRiskCustomers } from '@/data/mock-customers';
import { mockLeads, getHotLeads } from '@/data/mock-leads';
import { mockTasks, getTodaysTasks, getOverdueTasks } from '@/data/mock-tasks';
import { getSegmentDistribution } from '@/data/mock-customers';

export async function GET() {
  // Calculate KPIs
  const totalCustomers = mockCustomers.length;
  const aiGeneratedLeads = mockLeads.filter(l => l.source === 'AI Generated').length;
  const highPriorityLeads = getHotLeads().length;
  const crossSellOpportunities = mockCustomers.filter(c => c.productCount === 1 || c.productCount === 2).length;
  const upsellOpportunities = mockCustomers.filter(c => c.productCount >= 3 && c.opportunityScore > 70).length;
  const retentionAlerts = getRetentionRiskCustomers().length;
  const riskAlerts = mockCustomers.filter(c => c.creditRiskScore > 40 || c.fraudSignalScore > 15).length;
  const overdueFollowUps = getOverdueTasks().length;

  // Get data for dashboard
  const priorityCustomers = getHighPriorityCustomers().slice(0, 5);
  const hotLeads = getHotLeads().slice(0, 5);
  const todaysTasks = getTodaysTasks().slice(0, 5);
  const overdueTasks = getOverdueTasks();

  // Segment distribution for charts
  const segmentDistribution = getSegmentDistribution();

  // Lead priority distribution
  const leadDist = mockLeads.reduce((acc, l) => {
    acc[l.qualification] = (acc[l.qualification] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadPriorityDistribution = [
    { name: 'Hot', value: leadDist['Hot'] || 0 },
    { name: 'Warm', value: leadDist['Warm'] || 0 },
    { name: 'Cold', value: leadDist['Cold'] || 0 },
    { name: 'Disqualified', value: leadDist['Disqualified'] || 0 },
  ];

  // Pipeline forecast
  const pipelineForecast = [
    { month: 'May 2026', forecast: 8500000000 },
    { month: 'Jun 2026', forecast: 10200000000 },
    { month: 'Jul 2026', forecast: 11800000000 },
    { month: 'Aug 2026', forecast: 13500000000 },
  ];

  // Campaign conversion
  const campaignConversion = [
    { name: 'Credit Card', rate: 16.8 },
    { name: 'SME Banking', rate: 26.9 },
    { name: 'Wealth', rate: 32.4 },
    { name: 'Insurance', rate: 22.4 },
    { name: 'Working Capital', rate: 33.7 },
  ];

  // RM productivity
  const rmProductivity = [
    { name: 'Nguyen Van A', calls: 45, emails: 68, meetings: 12 },
    { name: 'Tran Thi B', calls: 38, emails: 55, meetings: 18 },
    { name: 'Le Van C', calls: 52, emails: 72, meetings: 15 },
    { name: 'Pham Thi D', calls: 30, emails: 45, meetings: 22 },
    { name: 'Hoang Van E', calls: 58, emails: 80, meetings: 10 },
  ];

  // Generate daily briefing
  const dailyBriefing = `Good morning! Today you have ${todaysTasks.length + overdueTasks.length} tasks requiring attention. ` +
    `There are ${highPriorityLeads} high-priority leads ready for outreach, ` +
    `${retentionAlerts} customers at retention risk, and ${riskAlerts} risk alerts to review. ` +
    `Your pipeline shows strong momentum with potential revenue of ${(13500000000 / 1000000000).toFixed(1)}B VND.`;

  return NextResponse.json({
    kpis: {
      totalCustomers,
      aiGeneratedLeads,
      highPriorityLeads,
      crossSellOpportunities,
      upsellOpportunities,
      retentionAlerts,
      riskAlerts,
      overdueFollowUps,
    },
    priorityCustomers,
    hotLeads,
    riskAlerts: getRetentionRiskCustomers().slice(0, 5),
    todaysTasks,
    overdueTasks,
    dailyBriefing,
    segmentDistribution,
    leadPriorityDistribution,
    pipelineForecast,
    campaignConversion,
    rmProductivity,
  });
}
