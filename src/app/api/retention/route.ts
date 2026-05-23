import { NextResponse } from 'next/server';
import { generateRetentionAlerts, generateRemarketingCandidates, calculateChurnRisk } from '@/lib/retention-engine';
import { mockCustomers } from '@/data/mock-customers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const action = searchParams.get('action');

  switch (action) {
    case 'alerts':
      const alerts = generateRetentionAlerts();
      return NextResponse.json({ alerts, total: alerts.length });

    case 'remarketing':
      const remarketing = generateRemarketingCandidates();
      return NextResponse.json({ candidates: remarketing, total: remarketing.length });

    case 'churn_by_segment':
      const bySegment = mockCustomers.reduce((acc, c) => {
        const churn = calculateChurnRisk(c.id);
        if (!acc[c.segment]) {
          acc[c.segment] = { count: 0, totalScore: 0 };
        }
        acc[c.segment].count++;
        acc[c.segment].totalScore += churn.score;
        return acc;
      }, {} as Record<string, { count: number; totalScore: number }>);

      const segmentAnalysis = Object.entries(bySegment).map(([segment, data]) => ({
        segment,
        avgChurnRisk: Math.round(data.totalScore / data.count),
        customerCount: data.count,
      }));

      return NextResponse.json({ analysis: segmentAnalysis });

    default:
      // Return all retention data
      const allAlerts = generateRetentionAlerts();
      const remarketingCandidates = generateRemarketingCandidates();
      
      return NextResponse.json({
        alerts: allAlerts,
        remarketingCandidates,
        totalAlerts: allAlerts.length,
        totalRemarketing: remarketingCandidates.length,
        highRisk: allAlerts.filter(a => a.churnRiskLevel === 'High').length,
        mediumRisk: allAlerts.filter(a => a.churnRiskLevel === 'Medium').length,
      });
  }
}
