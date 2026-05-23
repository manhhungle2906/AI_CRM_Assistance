import { NextResponse } from 'next/server';
import { mockLeads, getHotLeads, getLeadsByStatus, getLeadsByQualification, getLeadDistribution } from '@/data/mock-leads';
import { generateLeads, scoreLead, qualifyLead } from '@/lib/lead-engine';
import { routeLeadToRM } from '@/lib/lead-routing-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const status = searchParams.get('status');
  const qualification = searchParams.get('qualification');
  const rmId = searchParams.get('rmId');
  const hotOnly = searchParams.get('hotOnly');

  let leads = [...mockLeads];

  if (status) {
    leads = getLeadsByStatus(status as never);
  }

  if (qualification) {
    leads = getLeadsByQualification(qualification as never);
  }

  if (rmId) {
    leads = leads.filter(l => l.assignedRMId === rmId);
  }

  if (hotOnly === 'true') {
    leads = getHotLeads();
  }

  // Add routing recommendations
  const leadsWithRouting = leads.slice(0, 50).map(lead => {
    try {
      const routing = routeLeadToRM(lead);
      return {
        ...lead,
        routingRecommendation: {
          recommendedRM: routing.recommendedRM.name,
          reason: routing.reason,
        },
      };
    } catch {
      return lead;
    }
  });

  return NextResponse.json({
    leads: leadsWithRouting,
    total: leads.length,
    distribution: getLeadDistribution(),
    hotCount: getHotLeads().length,
    warmCount: getLeadsByQualification('Warm').length,
    coldCount: getLeadsByQualification('Cold').length,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, customerId, leadId } = body;

  switch (action) {
    case 'generate':
      const newLeads = generateLeads();
      return NextResponse.json({
        message: `Generated ${newLeads.length} new leads`,
        leads: newLeads.slice(0, 10),
      });

    case 'route':
      if (!leadId) {
        return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
      }
      const lead = mockLeads.find(l => l.id === leadId);
      if (!lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      const routing = routeLeadToRM(lead);
      return NextResponse.json({
        recommendedRM: routing.recommendedRM,
        alternatives: routing.alternativeRMs,
        reason: routing.reason,
        score: routing.score,
      });

    case 'qualify':
      if (!leadId) {
        return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
      }
      const leadToQualify = mockLeads.find(l => l.id === leadId);
      if (!leadToQualify) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      const newQualification = qualifyLead(leadToQualify.leadScore);
      return NextResponse.json({
        leadId,
        oldQualification: leadToQualify.qualification,
        newQualification,
        score: leadToQualify.leadScore,
      });

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
