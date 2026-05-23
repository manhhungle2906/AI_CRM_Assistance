'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, DollarSign, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RiskAlert {
  id: string;
  customerId: string;
  customerName: string;
  signalType?: string;
  severity?: string;
  score?: number;
  level?: string;
  description?: string;
  suggestedAction?: string;
  anomalyType?: string;
  transactionSignal?: string;
}

export default function RiskCenterPage() {
  const [data, setData] = useState<{
    earlyWarnings: RiskAlert[];
    creditRisks: RiskAlert[];
    fraudSignals: RiskAlert[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRisks() {
      try {
        const response = await fetch('/api/risk');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRisks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const highEarlyWarnings = data?.earlyWarnings.filter(w => w.severity === 'High') || [];
  const highCreditRisks = data?.creditRisks.filter(r => r.level === 'High') || [];
  const highFraudRisks = data?.fraudSignals.filter(f => (f.score ?? 0) >= 20) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Risk Center</h1>
        <p className="text-slate-500 mt-1">Monitor credit risk, fraud signals, and early warnings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{highEarlyWarnings.length}</p>
            <p className="text-sm text-red-600">High Early Warnings</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{highCreditRisks.length}</p>
            <p className="text-sm text-amber-600">High Credit Risks</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{highFraudRisks.length}</p>
            <p className="text-sm text-purple-600">Fraud Signals</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">92%</p>
            <p className="text-sm text-emerald-600">Portfolio Health</p>
          </CardContent>
        </Card>
      </div>

      {/* Early Warning System */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Early Warning System ({data?.earlyWarnings.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highEarlyWarnings.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <CheckCircle className="w-5 h-5 mr-2" />
              No high-severity early warnings
            </div>
          ) : (
            <div className="space-y-4">
              {highEarlyWarnings.slice(0, 5).map((warning) => (
                <div key={warning.id} className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="danger">{warning.severity}</Badge>
                        <span className="font-medium text-slate-900">{warning.customerName}</span>
                      </div>
                      <p className="text-sm text-red-700 font-medium">{warning.signalType}</p>
                      <p className="text-sm text-slate-600 mt-1">{warning.description}</p>
                      <p className="text-xs text-slate-500 mt-2">Action: {warning.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit Risk */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <DollarSign className="w-5 h-5" />
            Credit Risk Assessment ({data?.creditRisks.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highCreditRisks.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <CheckCircle className="w-5 h-5 mr-2" />
              No high credit risk customers
            </div>
          ) : (
            <div className="space-y-4">
              {highCreditRisks.slice(0, 5).map((risk) => (
                <div key={risk.id} className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="warning">{risk.level}</Badge>
                        <span className="font-medium text-slate-900">{risk.customerName}</span>
                      </div>
                      <p className="text-sm text-amber-700">Score: {risk.score}</p>
                    </div>
                    <Badge variant="outline">Review Required</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fraud Signals */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Shield className="w-5 h-5" />
            Fraud Signals ({data?.fraudSignals.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highFraudRisks.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <CheckCircle className="w-5 h-5 mr-2" />
              No significant fraud signals detected
            </div>
          ) : (
            <div className="space-y-4">
              {highFraudRisks.slice(0, 5).map((fraud) => (
                <div key={fraud.id} className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="danger">Score: {fraud.score}</Badge>
                        <span className="font-medium text-slate-900">{fraud.customerName}</span>
                      </div>
                      <p className="text-sm text-purple-700 font-medium">{fraud.anomalyType}</p>
                      <p className="text-sm text-slate-600 mt-1">{fraud.transactionSignal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
