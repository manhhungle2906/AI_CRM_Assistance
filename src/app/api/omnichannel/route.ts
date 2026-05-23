import { NextResponse } from 'next/server';
import { buildUnifiedTimeline, detectHandoverNeeds, getContactCenterOverview, summarizeChannelEvents } from '@/lib/omnichannel-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const customerId = searchParams.get('customerId');
  const action = searchParams.get('action');

  if (customerId) {
    if (action === 'timeline') {
      const timeline = buildUnifiedTimeline(customerId);
      return NextResponse.json({ timeline, total: timeline.length });
    }
    
    if (action === 'summary') {
      const summary = summarizeChannelEvents(customerId);
      return NextResponse.json(summary);
    }
  }

  if (action === 'handover') {
    const handoverQueue = detectHandoverNeeds();
    return NextResponse.json({
      handoverQueue,
      total: handoverQueue.length,
      highUrgency: handoverQueue.filter(h => h.urgency === 'High').length,
    });
  }

  // Return overview
  const overview = getContactCenterOverview();

  return NextResponse.json(overview);
}
