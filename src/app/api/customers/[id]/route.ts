import { NextResponse } from 'next/server';
import { getCustomerById } from '@/data/mock-customers';
import { getInteractionsByCustomer } from '@/data/mock-interactions';
import { getTasksByCustomer } from '@/data/mock-tasks';
import { getLeadsByCustomer } from '@/data/mock-leads';
import { generateCustomerBrief } from '@/lib/customer-intelligence-engine';
import { generateNextBestOffer, generateCrossSellOffers, generateUpsellOffers } from '@/lib/sales-recommendation-engine';
import { generateNextBestAction } from '@/lib/next-best-action-engine';
import { calculateChurnRisk } from '@/lib/retention-engine';
import { calculateCreditRiskScore, detectEarlyWarningSignals, detectFraudRiskSignals } from '@/lib/risk-engine';
import { getChannelEventsByCustomer } from '@/data/mock-channel-events';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const customer = getCustomerById(id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  // Get related data
  const interactions = getInteractionsByCustomer(id);
  const tasks = getTasksByCustomer(id);
  const leads = getLeadsByCustomer(id);
  const channelEvents = getChannelEventsByCustomer(id);

  // Generate AI insights
  const customerBrief = generateCustomerBrief(id);
  const nextBestOffer = generateNextBestOffer(id);
  const crossSellOffers = generateCrossSellOffers(id);
  const upsellOffers = generateUpsellOffers(id);
  const nextBestAction = generateNextBestAction(id);
  const churnRisk = calculateChurnRisk(id);
  const creditRisk = calculateCreditRiskScore(id);
  const earlyWarnings = detectEarlyWarningSignals(id);
  const fraudSignals = detectFraudRiskSignals(id);

  // Calculate transaction summary
  const transactionSummary = {
    totalInflow: customer.casaBalance * 1.2,
    totalOutflow: customer.casaBalance * 0.8,
    transactionCount: Math.floor(customer.transactionTrend3M * 10 + 50),
    internationalCount: customer.internationalTransactionCount,
    anomalyFlag: customer.fraudSignalScore > 15,
  };

  return NextResponse.json({
    customer,
    customerBrief,
    nextBestOffer,
    crossSellOffers,
    upsellOffers,
    nextBestAction,
    churnRisk,
    creditRisk,
    earlyWarnings,
    fraudSignals,
    interactions: interactions.slice(0, 20),
    tasks: tasks.slice(0, 10),
    leads: leads.slice(0, 5),
    channelEvents: channelEvents.slice(0, 10),
    transactionSummary,
  });
}
