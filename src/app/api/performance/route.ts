import { NextResponse } from 'next/server';
import { mockRMs } from '@/data/mock-rms';
import { calculateRMProductivity, rankRMs, generateRMPerformanceSummary } from '@/lib/productivity-engine';
import { forecastPipeline, getDealStageAnalysis } from '@/lib/pipeline-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const action = searchParams.get('action');
  const rmId = searchParams.get('rmId');

  if (rmId) {
    if (action === 'productivity') {
      const productivity = calculateRMProductivity(rmId);
      return NextResponse.json(productivity);
    }

    if (action === 'summary') {
      const summary = generateRMPerformanceSummary(rmId);
      return NextResponse.json({ summary });
    }

    if (action === 'pipeline') {
      const forecast = forecastPipeline(rmId);
      return NextResponse.json({ forecast });
    }

    // Default: return RM details with productivity
    const productivity = calculateRMProductivity(rmId);
    return NextResponse.json(productivity);
  }

  if (action === 'ranking') {
    const rankings = rankRMs();
    return NextResponse.json({ rankings });
  }

  if (action === 'pipeline') {
    const forecast = forecastPipeline();
    const analysis = getDealStageAnalysis();
    return NextResponse.json({ forecast, analysis });
  }

  // Default: return all RMs with basic data
  const rankings = rankRMs();

  return NextResponse.json({
    rms: mockRMs,
    rankings,
    total: mockRMs.length,
  });
}
