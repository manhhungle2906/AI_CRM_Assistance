'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Megaphone, Users, TrendingUp, Target, DollarSign } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  productName: string;
  targetSegment: string;
  customersTargeted: number;
  leadsGenerated: number;
  conversions: number;
  conversionRate: number;
  revenueEstimate: number;
  status: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenueEstimate, 0);

  const chartData = campaigns.slice(0, 6).map(c => ({
    name: c.name.substring(0, 15) + '...',
    conversions: c.conversions,
    leads: c.leadsGenerated,
    rate: c.conversionRate,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
        <p className="text-slate-500 mt-1">Monitor and manage marketing campaigns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-sky-50 to-white">
          <CardContent className="p-4 text-center">
            <Megaphone className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{activeCampaigns.length}</p>
            <p className="text-xs text-slate-500">Active Campaigns</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
            <p className="text-xs text-slate-500">Total Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-violet-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{totalConversions}</p>
            <p className="text-xs text-slate-500">Conversions</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{(totalRevenue / 1000000000).toFixed(1)}B</p>
            <p className="text-xs text-slate-500">Est. Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#0369A1" name="Conversions" />
                <Bar dataKey="leads" fill="#0EA5E9" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                        <Badge variant={campaign.status === 'Active' ? 'success' : 'default'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{campaign.productName} • {campaign.targetSegment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">{campaign.conversionRate}%</p>
                      <p className="text-xs text-slate-500">Conv. Rate</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900">{campaign.customersTargeted}</p>
                      <p className="text-xs text-slate-500">Targeted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900">{campaign.leadsGenerated}</p>
                      <p className="text-xs text-slate-500">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900">{campaign.conversions}</p>
                      <p className="text-xs text-slate-500">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900">{(campaign.revenueEstimate / 1000000000).toFixed(1)}B</p>
                      <p className="text-xs text-slate-500">Revenue</p>
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
