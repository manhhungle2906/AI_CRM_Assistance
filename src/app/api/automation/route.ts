import { NextResponse } from 'next/server';
import { reviewLimitRenewalEligibility, generatePreApprovedOffer, extractDocumentFields, checkMissingDocuments } from '@/lib/automation-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const customerId = searchParams.get('customerId');
  const action = searchParams.get('action');
  const documentId = searchParams.get('documentId');

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  }

  if (action === 'limit_renewal') {
    const result = reviewLimitRenewalEligibility(customerId);
    if (!result) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  if (action === 'preapproved') {
    const result = generatePreApprovedOffer(customerId);
    if (!result) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  if (action === 'missing_documents') {
    const result = checkMissingDocuments(customerId);
    if (!result) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  if (documentId && action === 'extract') {
    const result = extractDocumentFields(documentId);
    if (!result) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  // Return all automation options for customer
  const limitRenewal = reviewLimitRenewalEligibility(customerId);
  const preapproved = generatePreApprovedOffer(customerId);
  const missingDocs = checkMissingDocuments(customerId);

  return NextResponse.json({
    customerId,
    limitRenewal,
    preapproved,
    missingDocuments: missingDocs,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, customerId, documentId, taskData } = body;

  if (!customerId && !documentId) {
    return NextResponse.json({ error: 'Customer ID or Document ID required' }, { status: 400 });
  }

  switch (action) {
    case 'review_limit_renewal':
      const limitRenewal = reviewLimitRenewalEligibility(customerId);
      return NextResponse.json(limitRenewal);

    case 'generate_preapproved':
      const preapproved = generatePreApprovedOffer(customerId);
      return NextResponse.json(preapproved);

    case 'extract_documents':
      const extracted = extractDocumentFields(documentId);
      return NextResponse.json(extracted);

    case 'check_missing':
      const missing = checkMissingDocuments(customerId);
      return NextResponse.json(missing);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
