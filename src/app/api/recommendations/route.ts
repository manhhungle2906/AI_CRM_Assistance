import { NextResponse } from 'next/server';
import { mockCustomers } from '@/data/mock-customers';
import { generateNextBestOffer, generateCrossSellOffers, generateUpsellOffers, generatePreApprovedOffers } from '@/lib/sales-recommendation-engine';
import type { Offer } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type') || 'all';
  const customerId = searchParams.get('customerId');

  const offers: Offer[] = [];

  if (customerId) {
    // Get offers for specific customer
    if (type === 'all' || type === 'next_best_offer') {
      const nbo = generateNextBestOffer(customerId);
      if (nbo) offers.push(nbo);
    }
    if (type === 'all' || type === 'cross_sell') {
      offers.push(...generateCrossSellOffers(customerId));
    }
    if (type === 'all' || type === 'upsell') {
      offers.push(...generateUpsellOffers(customerId));
    }
    if (type === 'all' || type === 'preapproved') {
      offers.push(...generatePreApprovedOffers(customerId));
    }
  } else {
    // Get top offers across all customers
    mockCustomers.slice(0, 20).forEach(customer => {
      const nbo = generateNextBestOffer(customer.id);
      if (nbo) offers.push(nbo);
    });
  }

  // Sort by score
  offers.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    offers: offers.slice(0, 30),
    total: offers.length,
    byType: {
      'Next Best Offer': offers.filter(o => o.offerType === 'Next Best Offer').length,
      'Cross-sell': offers.filter(o => o.offerType === 'Cross-sell').length,
      'Upsell': offers.filter(o => o.offerType === 'Upsell').length,
      'Pre-approved': offers.filter(o => o.offerType === 'Pre-approved').length,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customerId, type } = body;

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  }

  let offers: Offer[] = [];

  switch (type) {
    case 'next_best_offer':
      const nbo = generateNextBestOffer(customerId);
      if (nbo) offers.push(nbo);
      break;
    case 'cross_sell':
      offers = generateCrossSellOffers(customerId);
      break;
    case 'upsell':
      offers = generateUpsellOffers(customerId);
      break;
    case 'preapproved':
      offers = generatePreApprovedOffers(customerId);
      break;
    default:
      const nboAll = generateNextBestOffer(customerId);
      if (nboAll) offers.push(nboAll);
      offers.push(...generateCrossSellOffers(customerId));
      offers.push(...generateUpsellOffers(customerId));
      offers.push(...generatePreApprovedOffers(customerId));
  }

  offers.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    customerId,
    type: type || 'all',
    offers,
    total: offers.length,
  });
}
