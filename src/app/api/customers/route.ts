import { NextResponse } from 'next/server';
import { mockCustomers, searchCustomers, getCustomersBySegment, getHighPriorityCustomers, getRetentionRiskCustomers, getComplaintCustomers } from '@/data/mock-customers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const segment = searchParams.get('segment');
  const search = searchParams.get('search');
  const microSegment = searchParams.get('microSegment');
  const riskLevel = searchParams.get('riskLevel');
  const churnRisk = searchParams.get('churnRisk');
  const complaintStatus = searchParams.get('complaintStatus');

  let customers = [...mockCustomers];

  // Apply filters
  if (segment) {
    customers = customers.filter(c => c.segment === segment);
  }

  if (microSegment) {
    customers = customers.filter(c => c.microSegment === microSegment);
  }

  if (search) {
    customers = searchCustomers(search);
  }

  if (riskLevel) {
    const riskScore = riskLevel === 'High' ? 40 : riskLevel === 'Medium' ? 25 : 0;
    customers = customers.filter(c => {
      if (riskLevel === 'High') return c.creditRiskScore >= 40;
      if (riskLevel === 'Medium') return c.creditRiskScore >= 25 && c.creditRiskScore < 40;
      return c.creditRiskScore < 25;
    });
  }

  if (churnRisk) {
    const churnScore = churnRisk === 'High' ? 50 : churnRisk === 'Medium' ? 35 : 0;
    customers = customers.filter(c => {
      if (churnRisk === 'High') return c.churnRiskScore >= 50;
      if (churnRisk === 'Medium') return c.churnRiskScore >= 35 && c.churnRiskScore < 50;
      return c.churnRiskScore < 35;
    });
  }

  if (complaintStatus) {
    customers = customers.filter(c => c.complaintStatus === complaintStatus);
  }

  return NextResponse.json({
    customers,
    total: customers.length,
    filters: {
      segment,
      search,
      microSegment,
      riskLevel,
      churnRisk,
      complaintStatus,
    },
    segmentCounts: {
      Individual: mockCustomers.filter(c => c.segment === 'Individual').length,
      SME: mockCustomers.filter(c => c.segment === 'SME').length,
      Corporate: mockCustomers.filter(c => c.segment === 'Corporate').length,
      Priority: mockCustomers.filter(c => c.segment === 'Priority').length,
      Affluent: mockCustomers.filter(c => c.segment === 'Affluent').length,
      Mass: mockCustomers.filter(c => c.segment === 'Mass').length,
    },
  });
}
