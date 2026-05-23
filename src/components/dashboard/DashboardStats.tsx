'use client';

import { Card } from '@/components/ui/Card';
import { Users, Target, Phone, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function StatCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'border-slate-200',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-amber-200 bg-amber-50/50',
    danger: 'border-red-200 bg-red-50/50',
  };

  const iconVariants = {
    default: 'bg-sky-100 text-sky-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
  };

  return (
    <Card className={cn('transition-shadow hover:shadow-md', variants[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              'text-sm font-medium mt-2',
              trend.positive ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.positive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconVariants[variant])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface DashboardStatsProps {
  totalCustomers: number;
  highPriorityOpportunities: number;
  followUpsToday: number;
  retentionAlerts: number;
}

export function DashboardStats({ 
  totalCustomers, 
  highPriorityOpportunities, 
  followUpsToday, 
  retentionAlerts 
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Customers"
        value={totalCustomers}
        subtitle="Active relationships"
        icon={<Users className="w-6 h-6" />}
        trend={{ value: 5, positive: true }}
      />
      <StatCard
        title="High Priority"
        value={highPriorityOpportunities}
        subtitle="Opportunity score ≥ 70"
        icon={<Target className="w-6 h-6" />}
        variant="success"
      />
      <StatCard
        title="Follow-ups Today"
        value={followUpsToday}
        subtitle="Tasks due today"
        icon={<Phone className="w-6 h-6" />}
        variant="warning"
      />
      <StatCard
        title="Retention Alerts"
        value={retentionAlerts}
        subtitle="Churn risk > 50%"
        icon={<AlertTriangle className="w-6 h-6" />}
        variant="danger"
      />
    </div>
  );
}
