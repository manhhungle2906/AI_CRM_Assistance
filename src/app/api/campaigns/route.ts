import { NextResponse } from 'next/server';
import { getActiveCampaigns, getTopPerformingCampaigns, getCampaignSummary, mockCampaigns } from '@/data/mock-campaigns';
import { analyzeCampaignPerformance, generateRemarketingList, getCampaignAnalytics } from '@/lib/campaign-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const action = searchParams.get('action');
  const campaignId = searchParams.get('campaignId');

  if (action === 'active') {
    return NextResponse.json({
      campaigns: getActiveCampaigns(),
      total: getActiveCampaigns().length,
    });
  }

  if (action === 'top') {
    return NextResponse.json({
      campaigns: getTopPerformingCampaigns(),
      total: getTopPerformingCampaigns().length,
    });
  }

  if (action === 'performance') {
    const performance = analyzeCampaignPerformance();
    return NextResponse.json({
      performance,
      total: performance.length,
    });
  }

  if (action === 'analytics') {
    const analytics = getCampaignAnalytics();
    return NextResponse.json(analytics);
  }

  if (campaignId && action === 'remarketing') {
    const remarketing = generateRemarketingList(campaignId);
    return NextResponse.json({
      campaignId,
      candidates: remarketing,
      total: remarketing.length,
    });
  }

  // Default: return all campaigns with summary
  const summary = getCampaignSummary();

  return NextResponse.json({
    campaigns: mockCampaigns,
    summary,
  });
}
