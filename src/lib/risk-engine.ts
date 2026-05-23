// ============================================
// Risk Engine
// ============================================
import { Customer, RiskLevel, EarlyWarningSignal, CreditRiskAssessment, FraudSignal } from './types';
import { getCustomerById, mockCustomers } from '@/data/mock-customers';

export function calculateCreditRiskScore(customerId: string): CreditRiskAssessment | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  let score = customer.creditRiskScore; // Base from customer data
  
  // Additional factors for scoring
  const factors: string[] = [];

  // Transaction trend impact
  if (customer.transactionTrend3M < -15) {
    score = Math.min(100, score + 15);
    factors.push('Significant transaction decline may indicate financial stress');
  }

  // Product concentration
  if (customer.productCount === 1) {
    factors.push('Single product relationship - limited relationship depth');
  }

  // Complaint history
  if (customer.complaintStatus === 'Open') {
    score = Math.min(100, score + 10);
    factors.push('Active complaint may indicate dissatisfaction');
  }

  // High balance relative to income (for individuals)
  if (customer.age && customer.monthlyIncome && customer.averageBalance > customer.monthlyIncome * 24) {
    factors.push('High balance-to-income ratio');
  }

  // Determine level
  let level: RiskLevel;
  if (score >= 60) level = 'High';
  else if (score >= 35) level = 'Medium';
  else level = 'Low';

  // Warning for sales
  let warningForSales: string | undefined;
  if (level === 'High') {
    warningForSales = 'Do not pursue new credit products. Existing exposure should be reviewed.';
  } else if (level === 'Medium') {
    warningForSales = 'Credit expansion requires careful review. Consider collateral or guarantees.';
  }

  return {
    customerId,
    customerName: customer.name,
    score: Math.min(100, score),
    level,
    mainFactors: factors.length > 0 ? factors : ['Account behavior is stable'],
    warningForSales,
  };
}

export function detectEarlyWarningSignals(customerId: string): EarlyWarningSignal[] {
  const customer = getCustomerById(customerId);
  if (!customer) return [];

  const signals: EarlyWarningSignal[] = [];

  // Cash flow drop
  if (customer.transactionTrend3M < -15) {
    signals.push({
      id: 'ew_cashflow',
      customerId,
      customerName: customer.name,
      signalType: 'Cash Flow Drop',
      severity: customer.transactionTrend3M < -25 ? 'High' : 'Medium',
      description: `Transaction volume declined by ${Math.abs(customer.transactionTrend3M)}% over 3 months. This may indicate cash flow challenges.`,
      suggestedAction: 'Schedule meeting to understand business situation. Review credit facility limits.',
      detectedAt: new Date().toISOString(),
    });
  }

  // Overdue loan (simulated from churn risk)
  if (customer.creditRiskScore > 50 && customer.products.some(p => p.toLowerCase().includes('loan'))) {
    signals.push({
      id: 'ew_overdue',
      customerId,
      customerName: customer.name,
      signalType: 'Overdue Loan',
      severity: customer.creditRiskScore > 65 ? 'High' : 'Medium',
      description: 'Credit risk score elevated. Possible overdue payment pattern detected.',
      suggestedAction: 'Review loan repayment status. Contact customer for payment arrangement if overdue.',
      detectedAt: new Date().toISOString(),
    });
  }

  // International transaction anomaly
  if (customer.internationalTransactionCount > 50) {
    signals.push({
      id: 'ew_intl_anomaly',
      customerId,
      customerName: customer.name,
      signalType: 'International Anomaly',
      severity: 'Medium',
      description: `High volume of international transactions (${customer.internationalTransactionCount} in period). Review for unusual patterns.`,
      suggestedAction: 'Verify transaction legitimacy. Review FX exposure and hedging.',
      detectedAt: new Date().toISOString(),
    });
  }

  // High value transfer (simulated from balance)
  if (customer.averageBalance > 5000000000) {
    signals.push({
      id: 'ew_high_value',
      customerId,
      customerName: customer.name,
      signalType: 'High Value Transfer',
      severity: customer.fraudSignalScore > 20 ? 'High' : 'Medium',
      description: 'Very high account balance detected. Monitor for unusual transfer patterns.',
      suggestedAction: 'Enhanced monitoring. Verify source of funds periodically.',
      detectedAt: new Date().toISOString(),
    });
  }

  // Complaint related to failed transaction
  if (customer.complaintStatus === 'Open') {
    signals.push({
      id: 'ew_complaint',
      customerId,
      customerName: customer.name,
      signalType: 'Complaint Related',
      severity: 'Medium',
      description: 'Open complaint requires immediate attention. Risk of customer churn.',
      suggestedAction: 'Priority complaint resolution. Document handling and follow up.',
      detectedAt: new Date().toISOString(),
    });
  }

  // High credit risk with new loan request
  if (customer.creditRiskScore > 45 && customer.products.some(p => p.toLowerCase().includes('loan'))) {
    signals.push({
      id: 'ew_credit_risk',
      customerId,
      customerName: customer.name,
      signalType: 'Credit Risk High',
      severity: 'High',
      description: 'Elevated credit risk with existing loan exposure. Exercise caution with new credit requests.',
      suggestedAction: 'Do not approve new credit. Review existing exposure. Consider risk mitigation.',
      detectedAt: new Date().toISOString(),
    });
  }

  return signals;
}

export function detectFraudRiskSignals(customerId: string): FraudSignal | null {
  const customer = getCustomerById(customerId);
  if (!customer) return null;

  // Fraud signal score already in customer data
  const score = customer.fraudSignalScore;
  
  if (score < 10) return null; // No significant fraud risk

  let anomalyType = '';
  let transactionSignal = '';
  let recommendedReview = '';

  if (score >= 25) {
    anomalyType = 'Multiple High-Value Transactions';
    transactionSignal = 'Unusual pattern of high-value transfers detected in recent period.';
    recommendedReview = 'Immediate manual review required. Verify transaction legitimacy with customer.';
  } else if (score >= 20) {
    anomalyType = 'Rapid Transaction Increase';
    transactionSignal = 'Transaction frequency significantly increased beyond normal pattern.';
    recommendedReview = 'Review transaction details. Confirm with customer if legitimate.';
  } else if (score >= 15) {
    anomalyType = 'Unusual Transaction Timing';
    transactionSignal = 'Transactions occurring at unusual times or patterns detected.';
    recommendedReview = 'Monitor closely. Set up alerts for future anomalies.';
  } else {
    anomalyType = 'Minor Transaction Anomaly';
    transactionSignal = 'Minor deviation from normal transaction pattern observed.';
    recommendedReview = 'Continue monitoring. No immediate action required.';
  }

  // Add context based on customer profile
  if (customer.internationalTransactionCount > 30) {
    transactionSignal += ' High volume of international transactions may indicate trade activities.';
  }

  return {
    customerId,
    customerName: customer.name,
    score,
    anomalyType,
    transactionSignal,
    recommendedReview,
  };
}

export function explainRisk(customerId: string): string {
  const customer = getCustomerById(customerId);
  if (!customer) return 'Customer not found';

  const creditRisk = calculateCreditRiskScore(customerId);
  const earlyWarnings = detectEarlyWarningSignals(customerId);
  const fraudRisk = detectFraudRiskSignals(customerId);

  let explanation = `Risk Assessment for ${customer.name}:\n\n`;

  if (creditRisk) {
    explanation += `Credit Risk: ${creditRisk.level} (${creditRisk.score}/100)\n`;
    explanation += `Factors: ${creditRisk.mainFactors.join(', ')}\n`;
    if (creditRisk.warningForSales) {
      explanation += `Sales Warning: ${creditRisk.warningForSales}\n`;
    }
    explanation += '\n';
  }

  if (earlyWarnings.length > 0) {
    explanation += `Early Warning Signals (${earlyWarnings.length}):\n`;
    earlyWarnings.forEach((signal, i) => {
      explanation += `${i + 1}. [${signal.severity}] ${signal.signalType}: ${signal.description}\n`;
      explanation += `   Action: ${signal.suggestedAction}\n`;
    });
    explanation += '\n';
  }

  if (fraudRisk) {
    explanation += `Fraud Risk: Score ${fraudRisk.score}/100\n`;
    explanation += `Anomaly Type: ${fraudRisk.anomalyType}\n`;
    explanation += `Signal: ${fraudRisk.transactionSignal}\n`;
    explanation += `Review: ${fraudRisk.recommendedReview}\n`;
  }

  if (!creditRisk?.warningForSales && earlyWarnings.length === 0 && !fraudRisk) {
    explanation += 'No significant risk indicators detected. Customer profile is stable.';
  }

  return explanation;
}

export function getAllRiskAlerts(): {
  earlyWarnings: EarlyWarningSignal[];
  creditRisks: CreditRiskAssessment[];
  fraudSignals: FraudSignal[];
} {
  const earlyWarnings: EarlyWarningSignal[] = [];
  const creditRisks: CreditRiskAssessment[] = [];
  const fraudSignals: FraudSignal[] = [];

  mockCustomers.forEach(customer => {
    // Early warnings
    const warnings = detectEarlyWarningSignals(customer.id);
    earlyWarnings.push(...warnings);

    // Credit risks (only high/medium)
    const creditRisk = calculateCreditRiskScore(customer.id);
    if (creditRisk && creditRisk.level !== 'Low') {
      creditRisks.push(creditRisk);
    }

    // Fraud signals
    const fraud = detectFraudRiskSignals(customer.id);
    if (fraud) {
      fraudSignals.push(fraud);
    }
  });

  return {
    earlyWarnings: earlyWarnings.sort((a, b) => {
      const severityOrder = { High: 0, Medium: 1, Low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    creditRisks: creditRisks.sort((a, b) => b.score - a.score),
    fraudSignals: fraudSignals.sort((a, b) => b.score - a.score),
  };
}
