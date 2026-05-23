// ============================================
// Campaign Engine
// ============================================
import { Campaign, Customer } from './types';
import { mockCampaigns, getActiveCampaigns, getCampaignSummary } from '@/data/mock-campaigns';
import { mockCustomers } from '@/data/mock-customers';

export interface CampaignPerformance {
  campaign: Campaign;
  performance: 'Excellent' | 'Good' | 'Average' | 'Below Average';
  metrics: {
    conversionRate: number;
    revenuePerTarget: number;
    leadsPerCall: number;
  };
  recommendations: string[];
}

export interface RemarketingCandidate {
  customer: Customer;
  campaignId: string;
  campaignName: string;
  reason: string;
  suggestedChannel: string;
}

export function analyzeCampaignPerformance(): CampaignPerformance[] {
  const performances: CampaignPerformance[] = [];

  mockCampaigns.forEach(campaign => {
    let performance: 'Excellent' | 'Good' | 'Average' | 'Below Average';
    const recommendations: string[] = [];

    // Determine performance based on conversion rate
    if (campaign.conversionRate >= 35) {
      performance = 'Excellent';
      recommendations.push('Consider scaling this campaign');
      recommendations.push('Apply learnings to other campaigns');
    } else if (campaign.conversionRate >= 25) {
      performance = 'Good';
      recommendations.push('Campaign performing well');
    } else if (campaign.conversionRate >= 15) {
      performance = 'Average';
      recommendations.push('Consider A/B testing creative');
      recommendations.push('Review targeting criteria');
    } else {
      performance = 'Below Average';
      recommendations.push('Review campaign strategy');
      recommendations.push('Consider pausing and redesigning');
    }

    // Additional recommendations based on metrics
    if (campaign.conversionRate > 0 && campaign.customersTargeted > 0) {
      const revenuePerTarget = campaign.revenueEstimate / campaign.customersTargeted;
      if (revenuePerTarget < 500000) {
        recommendations.push('Revenue per target is low - review offer value');
      }
    }

    if (campaign.leadsGenerated < campaign.customersTargeted * 0.1) {
      recommendations.push('Lead generation is low - improve outreach');
    }

    performances.push({
      campaign,
      performance,
      metrics: {
        conversionRate: campaign.conversionRate,
        revenuePerTarget: campaign.customersTargeted > 0 
          ? Math.round(campaign.revenueEstimate / campaign.customersTargeted) 
          : 0,
        leadsPerCall: campaign.customersTargeted > 0 
          ? Math.round((campaign.leadsGenerated / campaign.customersTargeted) * 100) 
          : 0,
      },
      recommendations,
    });
  });

  return performances.sort((a, b) => b.campaign.conversionRate - a.campaign.conversionRate);
}

export function generateRemarketingList(campaignId: string): RemarketingCandidate[] {
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  if (!campaign) return [];

  const candidates: RemarketingCandidate[] = [];

  // Find customers who were targeted but didn't convert
  mockCustomers.forEach(customer => {
    // Simulate non-conversion based on churn risk and segment
    const mightConvert = Math.random() > 0.7; // 30% chance of non-conversion
    
    if (mightConvert) {
      const reason = generateRemarketingReason(customer, campaign);
      
      candidates.push({
        customer,
        campaignId: campaign.id,
        campaignName: campaign.name,
        reason,
        suggestedChannel: getBestChannel(customer),
      });
    }
  });

  return candidates.sort((a, b) => {
    // Prioritize by churn risk and opportunity
    return b.customer.churnRiskScore - a.customer.churnRiskScore;
  }).slice(0, 20);
}

export function generateCampaignLeads(campaignId: string): Customer[] {
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  if (!campaign) return [];

  const leads: Customer[] = [];

  // Find customers matching campaign target segment
  mockCustomers.forEach(customer => {
    const segmentMatch = customer.segment === campaign.targetSegment || 
                        customer.microSegment === campaign.targetSegment;
    
    if (segmentMatch && leads.length < campaign.leadsGenerated) {
      leads.push(customer);
    }
  });

  return leads;
}

function generateRemarketingReason(customer: Customer, campaign: Campaign): string {
  const reasons: string[] = [];

  // Why they might convert on re-engagement
  if (customer.transactionTrend3M > 0) {
    reasons.push('Account showing positive activity');
  }

  if (customer.digitalAdoptionScore > 70) {
    reasons.push('Active digital user - responsive to digital outreach');
  }

  if (customer.churnRiskScore < 30) {
    reasons.push('Low churn risk - still engaged with bank');
  }

  if (customer.opportunityScore > 60) {
    reasons.push('High opportunity score - good product fit');
  }

  if (reasons.length === 0) {
    reasons.push('Met campaign targeting criteria');
  }

  return reasons.join('. ');
}

function getBestChannel(customer: Customer): string {
  if (customer.digitalAdoptionScore > 80) return 'Email';
  if (customer.churnRiskScore > 50) return 'Call';
  if (customer.segment === 'Priority' || customer.segment === 'Affluent') return 'Meeting';
  return 'App Notification';
}

export function getCampaignAnalytics(): {
  summary: ReturnType<typeof getCampaignSummary>;
  bySegment: { segment: string; campaigns: number; avgConversion: number }[];
  topProducts: { product: string; campaigns: number; totalRevenue: number }[];
  trend: { month: string; campaigns: number; conversions: number }[];
} {
  const summary = getCampaignSummary();

  // Segment performance
  const segmentMap = new Map<string, { count: number; totalConversion: number }>();
  mockCampaigns.forEach(c => {
    const segment = c.targetSegment;
    const existing = segmentMap.get(segment) || { count: 0, totalConversion: 0 };
    existing.count++;
    existing.totalConversion += c.conversionRate;
    segmentMap.set(segment, existing);
  });

  const bySegment = Array.from(segmentMap.entries()).map(([segment, data]) => ({
    segment,
    campaigns: data.count,
    avgConversion: Math.round(data.totalConversion / data.count),
  }));

  // Top products
  const productMap = new Map<string, { count: number; revenue: number }>();
  mockCampaigns.forEach(c => {
    const product = c.productName || 'Unknown Product';
    const existing = productMap.get(product) || { count: 0, revenue: 0 };
    existing.count++;
    existing.revenue += c.revenueEstimate;
    productMap.set(product, existing);
  });

  const topProducts = Array.from(productMap.entries())
    .map(([product, data]) => ({
      product,
      campaigns: data.count,
      totalRevenue: data.revenue,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Trend (simulated monthly data)
  const months = ['Mar 2026', 'Apr 2026', 'May 2026'];
  const trend = months.map((month, i) => ({
    month,
    campaigns: 15 + i * 2,
    conversions: 180 + i * 25,
  }));

  return {
    summary,
    bySegment,
    topProducts,
    trend,
  };
}
