'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/lib/language-context';
import type { Customer, Lead, Task } from '@/lib/types';

interface DashboardData {
  kpis: {
    totalCustomers: number;
    aiGeneratedLeads: number;
    highPriorityLeads: number;
    crossSellOpportunities: number;
    upsellOpportunities: number;
    retentionAlerts: number;
    riskAlerts: number;
    overdueFollowUps: number;
  };
  dailyBriefing: string;
  priorityCustomers: Customer[];
  hotLeads: Lead[];
  riskAlerts: Customer[];
  todaysTasks: Task[];
  segmentDistribution: { name: string; value: number; color: string }[];
  leadPriorityDistribution: { name: string; value: number }[];
  pipelineForecast: { month: string; forecast: number }[];
  campaignConversion: { name: string; rate: number }[];
  rmProductivity: { name: string; calls: number; emails: number; meetings: number }[];
}

const colorMap: Record<string, string> = {
  sky: 'bg-sky-100 text-sky-700',
  violet: 'bg-violet-100 text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  pink: 'bg-pink-100 text-pink-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  rose: 'bg-rose-100 text-rose-700',
};

const pieColors = ['#0EA5E9', '#0369A1', '#075985', '#0284C7', '#06B6D4', '#7C3AED'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  const kpiCards = [
    { key: 'totalCustomers', label: t('dashboard.totalCustomers'), icon: Users, color: 'sky' },
    { key: 'aiGeneratedLeads', label: t('dashboard.aiLeads'), icon: Sparkles, color: 'violet' },
    { key: 'highPriorityLeads', label: t('dashboard.highPriority'), icon: Target, color: 'emerald' },
    { key: 'crossSellOpportunities', label: t('dashboard.crossSell'), icon: DollarSign, color: 'amber' },
    { key: 'upsellOpportunities', label: t('dashboard.upsell'), icon: TrendingUp, color: 'pink' },
    { key: 'retentionAlerts', label: t('dashboard.retentionAlerts'), icon: AlertTriangle, color: 'orange' },
    { key: 'riskAlerts', label: t('dashboard.riskAlerts'), icon: AlertTriangle, color: 'red' },
    { key: 'overdueFollowUps', label: t('dashboard.overdueTasks'), icon: Clock, color: 'rose' },
  ];

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{language === 'vi' ? 'Không thể tải dữ liệu dashboard.' : 'Unable to load dashboard data.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.dashboard')}</h1>
        <p className="text-slate-500 mt-1">
          {language === 'vi' ? 'Chào mừng trở lại! Đây là tổng quan CRM của bạn.' : 'Welcome back! Here\'s your CRM overview.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const value = data.kpis[kpi.key as keyof typeof data.kpis];
          return (
            <Card key={kpi.key} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${colorMap[kpi.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Daily Briefing */}
      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <CardTitle className="text-lg text-sky-800">{t('dashboard.dailyBriefing')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">{data.dailyBriefing}</p>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'vi' ? 'Khách hàng theo phân khúc' : 'Customer by Segment'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.segmentDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.segmentDistribution.map((entry, index) => (
                      <Cell key={index} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'vi' ? 'Phân bố Lead' : 'Lead Distribution'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.leadPriorityDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0369A1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'vi' ? 'Dự báo Pipeline' : 'Pipeline Forecast'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.pipelineForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000000000).toFixed(1)}B`} />
                <Tooltip formatter={(value) => [`${((value as number) / 1000000000).toFixed(1)}B VND`, 'Forecast']} />
                <Area type="monotone" dataKey="forecast" stroke="#0369A1" fill="#0EA5E9" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.priorityCustomers')}</CardTitle>
            <Link href="/customer-360" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              {language === 'vi' ? 'Xem tất cả' : 'View all'} <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.priorityCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/customer-360/${customer.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.segment} • {customer.region}</p>
                  </div>
                  <Badge variant={customer.opportunityScore >= 80 ? 'success' : customer.opportunityScore >= 60 ? 'warning' : 'default'}>
                    {customer.opportunityScore}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hot Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.hotLeads')}</CardTitle>
            <Link href="/leads" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              {language === 'vi' ? 'Xem tất cả' : 'View all'} <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.hotLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{lead.customerName}</p>
                    <p className="text-xs text-slate-500">{lead.suggestedProductName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">{lead.leadScore}</p>
                    <p className="text-xs text-slate-500">{lead.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.todayTasks')}</CardTitle>
            <Link href="/tasks" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              {language === 'vi' ? 'Xem tất cả' : 'View all'} <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.todaysTasks.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">{language === 'vi' ? 'Không có công việc hôm nay' : 'No tasks due today'}</p>
            ) : (
              <div className="space-y-3">
                {data.todaysTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-sky-200 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.customerName}</p>
                    </div>
                    <Badge variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
