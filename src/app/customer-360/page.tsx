'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Users, ArrowRight, TrendingUp, AlertTriangle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface Customer {
  id: string;
  name: string;
  segment: string;
  microSegment: string;
  industry?: string;
  region: string;
  averageBalance: number;
  productCount: number;
  opportunityScore: number;
  churnRiskScore: number;
  complaintStatus: string;
  lastInteractionDate: string;
}

interface CustomerListData {
  customers: Customer[];
  total: number;
  segmentCounts: Record<string, number>;
}

const segmentOptions = [
  { value: '', label: 'All Segments' },
  { value: 'Individual', label: 'Individual' },
  { value: 'SME', label: 'SME' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Priority', label: 'Priority' },
  { value: 'Affluent', label: 'Affluent' },
];

const riskOptions = [
  { value: '', label: 'All Risk Levels' },
  { value: 'High', label: 'High Risk' },
  { value: 'Medium', label: 'Medium Risk' },
  { value: 'Low', label: 'Low Risk' },
];

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B';
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + 'M';
  return amount.toLocaleString();
}

export default function Customer360Page() {
  const router = useRouter();
  const [data, setData] = useState<CustomerListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');
  const [riskLevel, setRiskLevel] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (segment) params.set('segment', segment);
        if (riskLevel) params.set('riskLevel', riskLevel);

        const response = await fetch(`/api/customers?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(debounce);
  }, [search, segment, riskLevel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer 360</h1>
          <p className="text-slate-500 mt-1">View and manage all customer relationships</p>
        </div>
        <Badge variant="default" className="text-sm">
          {data?.total || 0} Customers
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, industry, or region..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={segmentOptions}
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full md:w-48"
            />
            <Select
              options={riskOptions}
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full md:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Segment Distribution */}
      {data?.segmentCounts && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.segmentCounts).map(([seg, count]) => (
            <button
              key={seg}
              onClick={() => setSegment(seg)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                segment === seg
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {seg}: {count}
            </button>
          ))}
        </div>
      )}

      {/* Customer List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : data?.customers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No customers found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-sky-200 transition-all cursor-pointer"
              onClick={() => router.push(`/customer-360/${customer.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                      <Badge
                        variant={
                          customer.complaintStatus === 'Open'
                            ? 'danger'
                            : customer.complaintStatus === 'Resolved'
                            ? 'success'
                            : 'default'
                        }
                        className="text-xs"
                      >
                        {customer.complaintStatus === 'None' ? '' : customer.complaintStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {customer.industry || customer.segment} • {customer.region}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(customer.averageBalance)}</p>
                    <p className="text-xs text-slate-500">Balance</p>
                  </div>
                  <div className="text-center">
                    <Badge variant={customer.opportunityScore >= 70 ? 'success' : 'default'}>
                      {customer.opportunityScore}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">Opportunity</p>
                  </div>
                  <div className="text-center">
                    <Badge variant={customer.churnRiskScore >= 50 ? 'danger' : customer.churnRiskScore >= 30 ? 'warning' : 'success'}>
                      {customer.churnRiskScore}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">Churn Risk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600">{customer.productCount}</p>
                    <p className="text-xs text-slate-500">Products</p>
                  </div>
                  
                  {/* Take Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Save customer to localStorage for AI Assistant
                      localStorage.setItem('rm_copilot_selected_customer_v2', customer.id);
                      // Navigate to AI Assistant
                      router.push('/assistant');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Take Action
                  </button>
                  
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>

                {/* Mobile View */}
                <div className="flex md:hidden items-center gap-3">
                  <Badge variant={customer.opportunityScore >= 70 ? 'success' : 'default'}>
                    Score: {customer.opportunityScore}
                  </Badge>
                  <Badge variant={customer.churnRiskScore >= 50 ? 'danger' : 'success'}>
                    Risk: {customer.churnRiskScore}
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('rm_copilot_selected_customer_v2', customer.id);
                      router.push('/assistant');
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs font-medium"
                  >
                    <MessageSquare className="w-3 h-3" />
                    AI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
