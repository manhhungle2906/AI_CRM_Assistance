import { NextResponse } from 'next/server';
import { getAllRiskAlerts, explainRisk, calculateCreditRiskScore, detectEarlyWarningSignals, detectFraudRiskSignals } from '@/lib/risk-engine';
import { mockCustomers } from '@/data/mock-customers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const customerId = searchParams.get('customerId');
  const action = searchParams.get('action');

  if (customerId) {
    if (action === 'explain') {
      const explanation = explainRisk(customerId);
      return NextResponse.json({ explanation });
    }
    
    // Return risk data for specific customer
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({
      customerId,
      customerName: customer.name,
      creditRisk: calculateCreditRiskScore(customerId),
      earlyWarnings: detectEarlyWarningSignals(customerId),
      fraudSignals: detectFraudRiskSignals(customerId),
    });
  }

  // Return all risk alerts
  const { earlyWarnings, creditRisks, fraudSignals } = getAllRiskAlerts();

  return NextResponse.json({
    earlyWarnings,
    creditRisks,
    fraudSignals,
    summary: {
      totalEarlyWarnings: earlyWarnings.length,
      highSeverityWarnings: earlyWarnings.filter(w => w.severity === 'High').length,
      totalCreditRisks: creditRisks.length,
      highCreditRisks: creditRisks.filter(r => r.level === 'High').length,
      totalFraudSignals: fraudSignals.length,
    },
  });
}
