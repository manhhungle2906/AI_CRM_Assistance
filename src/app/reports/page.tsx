'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart2, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">Business intelligence and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-sky-50 to-white">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">50</p>
            <p className="text-xs text-slate-500">Total Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">125</p>
            <p className="text-xs text-slate-500">Active Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-violet-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">15.8B</p>
            <p className="text-xs text-slate-500">Pipeline Value</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">28%</p>
            <p className="text-xs text-slate-500">Avg Conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-sky-600" />
              Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Monthly Target</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full">
                  <div className="h-2 bg-sky-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Lead Conversion</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full">
                  <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Customer Satisfaction</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full">
                  <div className="h-2 bg-violet-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Segment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { segment: 'Individual', count: 20, percentage: 40 },
                { segment: 'SME', count: 18, percentage: 36 },
                { segment: 'Corporate', count: 7, percentage: 14 },
                { segment: 'Priority', count: 5, percentage: 10 },
              ].map((item) => (
                <div key={item.segment}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.segment}</span>
                    <span className="font-medium">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full">
                    <div className="h-2 bg-sky-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Metric</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">This Month</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">Last Month</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-2">New Customers</td>
                  <td className="py-3 px-2 text-right">8</td>
                  <td className="py-3 px-2 text-right">6</td>
                  <td className="py-3 px-2 text-right text-emerald-600">+33%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-2">Leads Generated</td>
                  <td className="py-3 px-2 text-right">45</td>
                  <td className="py-3 px-2 text-right">38</td>
                  <td className="py-3 px-2 text-right text-emerald-600">+18%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-2">Conversions</td>
                  <td className="py-3 px-2 text-right">12</td>
                  <td className="py-3 px-2 text-right">10</td>
                  <td className="py-3 px-2 text-right text-emerald-600">+20%</td>
                </tr>
                <tr>
                  <td className="py-3 px-2">Revenue (B VND)</td>
                  <td className="py-3 px-2 text-right">2.8</td>
                  <td className="py-3 px-2 text-right">2.4</td>
                  <td className="py-3 px-2 text-right text-emerald-600">+17%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
