'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Target, RefreshCw, FileText, AlertTriangle, DollarSign } from 'lucide-react';
import type { Offer } from '@/lib/types';

export default function SalesAIPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setOffers(data.offers || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales AI</h1>
          <p className="text-slate-500 mt-1">AI-powered product recommendations and offers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{offers.filter(o => o.offerType === 'Next Best Offer').length}</p>
            <p className="text-sm text-emerald-600">Next Best Offers</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-sky-50 to-white border-sky-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-sky-600">{offers.filter(o => o.offerType === 'Cross-sell').length}</p>
            <p className="text-sm text-sky-600">Cross-sell</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-violet-600">{offers.filter(o => o.offerType === 'Upsell').length}</p>
            <p className="text-sm text-violet-600">Upsell</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{offers.filter(o => o.offerType === 'Pre-approved').length}</p>
            <p className="text-sm text-amber-600">Pre-approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Offers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-600" />
            All Offers ({offers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No offers available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.slice(0, 15).map((offer) => (
                <div key={offer.id} className="p-4 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={offer.offerType === 'Next Best Offer' ? 'success' : offer.offerType === 'Pre-approved' ? 'warning' : 'default'}>
                          {offer.offerType}
                        </Badge>
                        <span className="font-semibold text-slate-900">{offer.productName}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{offer.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{offer.customerName}</span>
                        <Badge variant="outline">{offer.suggestedChannel}</Badge>
                        <Badge variant={offer.eligibility === 'Eligible' ? 'success' : offer.eligibility === 'Need Review' ? 'warning' : 'default'}>
                          {offer.eligibility}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-sky-600">{offer.score}</p>
                      <p className="text-xs text-slate-500">Score</p>
                    </div>
                  </div>
                  {offer.riskWarning && (
                    <div className="mt-3 p-2 rounded bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700">{offer.riskWarning}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
