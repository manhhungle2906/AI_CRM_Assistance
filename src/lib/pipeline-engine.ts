// ============================================
// Pipeline Engine
// ============================================
import { Deal } from './types';
import { mockDeals, getActiveDeals, getPipelineValue } from '@/data/mock-deals';
import { getRMById } from '@/data/mock-rms';

export interface DealWinProbability {
  dealId: string;
  customerName: string;
  productName: string;
  value: number;
  currentStage: string;
  winProbability: number;
  factors: string[];
}

export interface PipelineForecast {
  month: string;
  forecastValue: number;
  expectedDeals: number;
  weightedProbability: number;
}

export function predictDealWinProbability(dealId: string): DealWinProbability | null {
  const deal = mockDeals.find(d => d.id === dealId);
  if (!deal) return null;

  const factors: string[] = [];
  let probability = 50; // Base probability

  // Stage-based probability
  switch (deal.stage) {
    case 'Closed Won':
      return {
        dealId: deal.id,
        customerName: deal.customerName || 'Unknown Customer',
        productName: deal.productName || 'Unknown Product',
        value: deal.value,
        currentStage: deal.stage,
        winProbability: 100,
        factors: ['Deal closed successfully'],
      };
    case 'Closed Lost':
      return {
        dealId: deal.id,
        customerName: deal.customerName || 'Unknown Customer',
        productName: deal.productName || 'Unknown Product',
        value: deal.value,
        currentStage: deal.stage,
        winProbability: 0,
        factors: ['Deal did not proceed'],
      };
    case 'Negotiation':
      probability = 75;
      factors.push('Deal in negotiation stage');
      break;
    case 'Proposal':
      probability = 55;
      factors.push('Proposal sent to customer');
      break;
    case 'Qualification':
      probability = 35;
      factors.push('Deal being qualified');
      break;
    case 'Inquiry':
      probability = 20;
      factors.push('Early stage inquiry');
      break;
  }

  // RM performance adjustment
  const rm = getRMById(deal.rmId);
  if (rm) {
    if (rm.conversionRate > 0.4) {
      probability = Math.min(95, probability + 10);
      factors.push(`RM ${rm.name} has strong conversion rate`);
    } else if (rm.conversionRate < 0.25) {
      probability = Math.max(15, probability - 10);
      factors.push(`RM ${rm.name} conversion rate below average`);
    }
  }

  // Deal value consideration
  if (deal.value > 1000000000) {
    probability -= 5; // Larger deals take longer
    factors.push('Large deal requires more attention');
  } else if (deal.value < 100000000) {
    probability += 5; // Smaller deals close faster
    factors.push('Small deal typically closes quickly');
  }

  return {
    dealId: deal.id,
    customerName: deal.customerName || 'Unknown Customer',
    productName: deal.productName || 'Unknown Product',
    value: deal.value,
    currentStage: deal.stage,
    winProbability: Math.max(0, Math.min(100, probability)),
    factors,
  };
}

export function forecastPipeline(rmId?: string): PipelineForecast[] {
  let deals = getActiveDeals();
  
  if (rmId) {
    deals = deals.filter(d => d.rmId === rmId);
  }

  const now = new Date('2026-05-23');
  const forecast: PipelineForecast[] = [];

  // Generate forecast for next 4 months
  for (let i = 0; i < 4; i++) {
    const targetMonth = new Date(now);
    targetMonth.setMonth(targetMonth.getMonth() + i);
    const monthStr = targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const dealsClosing = deals.filter(deal => {
      const closeDate = new Date(deal.expectedCloseDate);
      return closeDate <= targetMonth && !['Closed Lost'].includes(deal.stage);
    });

    const totalValue = dealsClosing.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = dealsClosing.reduce((sum, deal) => {
      const winProb = predictDealWinProbability(deal.id);
      return sum + (deal.value * (winProb?.winProbability || 50) / 100);
    }, 0);

    forecast.push({
      month: monthStr,
      forecastValue: Math.round(weightedValue / 1000000) * 1000000,
      expectedDeals: dealsClosing.length,
      weightedProbability: dealsClosing.length > 0 
        ? Math.round((weightedValue / totalValue) * 100) 
        : 0,
    });
  }

  return forecast;
}

export function getDealStageAnalysis(): {
  stages: { name: string; count: number; value: number }[];
  averageDealSize: number;
  averageCycleTime: number;
  conversionRates: Record<string, number>;
} {
  const stageAnalysis = mockDeals.reduce((acc, deal) => {
    if (!acc[deal.stage]) {
      acc[deal.stage] = { count: 0, value: 0 };
    }
    acc[deal.stage].count++;
    acc[deal.stage].value += deal.value;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const stages = Object.entries(stageAnalysis).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
  }));

  // Calculate conversion rates between stages
  const stageOrder = ['Inquiry', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
  const conversionRates: Record<string, number> = {};
  
  for (let i = 0; i < stageOrder.length - 1; i++) {
    const currentStage = stageOrder[i];
    const nextStage = stageOrder[i + 1];
    
    const currentCount = stageAnalysis[currentStage]?.count || 0;
    const nextCount = stageAnalysis[nextStage]?.count || 0;
    const lostCount = mockDeals.filter(d => d.stage === 'Closed Lost').length;
    
    if (currentCount > 0) {
      // Approximate conversion considering losses
      conversionRates[`${currentStage}→${nextStage}`] = 
        Math.round((nextCount / (currentCount + lostCount)) * 100);
    }
  }

  const allDeals = mockDeals.filter(d => !['Closed Lost'].includes(d.stage));
  const totalValue = allDeals.reduce((sum, d) => sum + d.value, 0);
  const averageDealSize = allDeals.length > 0 ? totalValue / allDeals.length : 0;

  return {
    stages,
    averageDealSize: Math.round(averageDealSize / 1000000) * 1000000,
    averageCycleTime: 45, // Simulated average cycle time in days
    conversionRates,
  };
}
