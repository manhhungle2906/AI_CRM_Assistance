'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Phone, Mail, Calendar, Award } from 'lucide-react';
import type { RM } from '@/lib/types';

interface RMProductivity {
  rm: RM;
  productivityScore: number;
  metrics: {
    calls: number;
    emails: number;
    meetings: number;
    tasksCompleted: number;
    activeLeads: number;
    conversionRate: number;
    revenueProgress: number;
    overdueTasks: number;
  };
  ranking: {
    overall: number;
    calls: number;
    meetings: number;
    conversion: number;
  };
}

export default function RMPerformancePage() {
  const [rankings, setRankings] = useState<RMProductivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const response = await fetch('/api/performance?action=ranking');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setRankings(data.rankings || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, []);

  const chartData = rankings.slice(0, 5).map((r) => ({
    name: r.rm.name.split(' ').pop(),
    calls: r.metrics.calls,
    emails: r.metrics.emails,
    meetings: r.metrics.meetings,
    score: r.productivityScore,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">RM Performance</h1>
        <p className="text-slate-500 mt-1">Monitor relationship manager productivity and KPIs</p>
      </div>

      {/* Top Performer */}
      {rankings.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-sky-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Top Performer</p>
                <h2 className="text-2xl font-bold text-slate-900">{rankings[0].rm.name}</h2>
                <p className="text-slate-500">Score: {rankings[0].productivityScore}/100</p>
              </div>
              <div className="ml-auto grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{rankings[0].metrics.calls}</p>
                  <p className="text-xs text-slate-500">Calls</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{rankings[0].metrics.meetings}</p>
                  <p className="text-xs text-slate-500">Meetings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{rankings[0].metrics.conversionRate}%</p>
                  <p className="text-xs text-slate-500">Conv. Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#0EA5E9" name="Calls" />
                <Bar dataKey="meetings" fill="#0369A1" name="Meetings" />
                <Bar dataKey="score" fill="#10B981" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* RM List */}
      <Card>
        <CardHeader>
          <CardTitle>All Relationship Managers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {rankings.map((ranking, index) => (
                <div key={ranking.rm.id} className="p-4 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-semibold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{ranking.rm.name}</h3>
                        <Badge variant="outline">{ranking.rm.region}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{ranking.rm.expertise.slice(0, 3).join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-sky-500" />
                          <p className="text-lg font-semibold">{ranking.metrics.calls}</p>
                        </div>
                        <p className="text-xs text-slate-500">Calls</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-violet-500" />
                          <p className="text-lg font-semibold">{ranking.metrics.emails}</p>
                        </div>
                        <p className="text-xs text-slate-500">Emails</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          <p className="text-lg font-semibold">{ranking.metrics.meetings}</p>
                        </div>
                        <p className="text-xs text-slate-500">Meetings</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-lg font-semibold ${ranking.metrics.revenueProgress >= 100 ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {ranking.metrics.revenueProgress}%
                        </p>
                        <p className="text-xs text-slate-500">Target</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-sky-600">{ranking.productivityScore}</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
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
