'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  CreditCard,
  AlertTriangle,
  Target,
  Clock,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Bot,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Customer, CustomerBrief, Offer, NextBestAction, Interaction, Task, Lead, CreditRiskAssessment, EarlyWarningSignal } from '@/lib/types';

interface CustomerDetail {
  customer: Customer;
  customerBrief: CustomerBrief;
  nextBestOffer: Offer | null;
  crossSellOffers: Offer[];
  upsellOffers: Offer[];
  nextBestAction: NextBestAction | null;
  churnRisk: { score: number; level: string; factors: string[] };
  creditRisk: CreditRiskAssessment | null;
  earlyWarnings: EarlyWarningSignal[];
  interactions: Interaction[];
  tasks: Task[];
  leads: Lead[];
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B';
  if (amount >= 1000000) return (amount / 1000000).toFixed(0) + 'M';
  return amount.toLocaleString();
}

export default function CustomerDetailPage() {
  const params = useParams();
  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Customer not found.</p>
        <Link href="/customer-360" className="text-sky-600 hover:underline mt-2 inline-block">
          Back to Customer List
        </Link>
      </div>
    );
  }

  const { customer, customerBrief, nextBestOffer, crossSellOffers, upsellOffers, nextBestAction, churnRisk, creditRisk } = data;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'products', label: 'Products', icon: CreditCard },
    { id: 'interactions', label: 'Interactions', icon: MessageSquare },
    { id: 'recommendations', label: 'Recommendations', icon: Target },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/customer-360"
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
              <Badge variant="default">{customer.segment}</Badge>
              <Badge variant="outline">{customer.microSegment}</Badge>
              {customer.complaintStatus !== 'None' && (
                <Badge variant="danger">{customer.complaintStatus} Complaint</Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1">
              {customer.industry || 'Banking Customer'} • {customer.region}
            </p>
          </div>
        </div>
        
        {/* Take Action Button */}
        <button
          onClick={() => {
            // Save customer to localStorage for AI Assistant
            localStorage.setItem('rm_copilot_selected_customer_v2', customer.id);
            // Navigate to AI Assistant
            window.location.href = '/assistant';
          }}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <MessageSquare className="w-5 h-5" />
          Take Action
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-sky-600">{formatCurrency(customer.averageBalance)}</p>
            <p className="text-xs text-slate-500">Balance (VND)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{customer.opportunityScore}</p>
            <p className="text-xs text-slate-500">Opportunity Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${churnRisk?.level === 'High' ? 'text-red-600' : churnRisk?.level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
              {churnRisk?.score || 0}
            </p>
            <p className="text-xs text-slate-500">Churn Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${creditRisk?.level === 'High' ? 'text-red-600' : creditRisk?.level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
              {creditRisk?.score || 0}
            </p>
            <p className="text-xs text-slate-500">Credit Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Customer Brief */}
              {customerBrief && (
                <Card className="border-l-4 border-l-sky-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-sky-600" />
                      AI Customer Brief
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{customerBrief.summary}</p>
                    
                    {customerBrief.keyInsights?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Key Insights</h4>
                        <ul className="space-y-1">
                          {customerBrief.keyInsights.map((insight: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <TrendingUp className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {customerBrief.riskFactors?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 text-amber-700">Risk Factors</h4>
                        <ul className="space-y-1">
                          {customerBrief.riskFactors.map((risk: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-amber-600">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {customerBrief.opportunities?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 text-emerald-700">Opportunities</h4>
                        <ul className="space-y-1">
                          {customerBrief.opportunities.map((opp: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-emerald-600">
                              <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recent Interactions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Interactions</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('interactions')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {data.interactions.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No interactions recorded.</p>
                  ) : (
                    <div className="space-y-4">
                      {data.interactions.slice(0, 5).map((interaction) => (
                        <div key={interaction.id} className="flex gap-4 p-3 rounded-lg bg-slate-50">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            interaction.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-600' :
                            interaction.sentiment === 'Negative' ? 'bg-red-100 text-red-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {interaction.channel === 'Call' ? <Phone className="w-4 h-4" /> :
                             interaction.channel === 'Email' ? <Mail className="w-4 h-4" /> :
                             interaction.channel === 'Meeting' ? <Calendar className="w-4 h-4" /> :
                             <MessageSquare className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-slate-900">{interaction.topic}</p>
                              <span className="text-xs text-slate-500">{interaction.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{interaction.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <CardTitle>Products ({customer.products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {customer.products.map((product: string, i: number) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product}</p>
                          <p className="text-xs text-slate-500">Active</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'interactions' && (
            <Card>
              <CardHeader>
                <CardTitle>All Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                {data.interactions.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No interactions recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {data.interactions.map((interaction) => (
                      <div key={interaction.id} className="flex gap-4 p-4 rounded-lg border border-slate-200">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          interaction.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-600' :
                          interaction.sentiment === 'Negative' ? 'bg-red-100 text-red-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-900">{interaction.topic}</p>
                              <p className="text-xs text-slate-500">{interaction.channel} • {interaction.date}</p>
                            </div>
                            <Badge variant={interaction.sentiment === 'Positive' ? 'success' : interaction.sentiment === 'Negative' ? 'danger' : 'default'}>
                              {interaction.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{interaction.summary}</p>
                          {interaction.nextStep && (
                            <p className="text-sm text-sky-600 mt-2">Next: {interaction.nextStep}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {/* Next Best Offer */}
              {nextBestOffer && (
                <Card className="border-l-4 border-l-emerald-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <Target className="w-5 h-5" />
                      Next Best Offer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{nextBestOffer.productName}</p>
                        <p className="text-sm text-slate-500">{nextBestOffer.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{nextBestOffer.score}</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={nextBestOffer.eligibility === 'Eligible' ? 'success' : 'warning'}>
                        {nextBestOffer.eligibility}
                      </Badge>
                      <Badge variant="default">{nextBestOffer.suggestedChannel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cross-sell */}
              {crossSellOffers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cross-sell Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {crossSellOffers.slice(0, 5).map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <div>
                            <p className="font-medium text-slate-900">{offer.productName}</p>
                            <p className="text-xs text-slate-500">{offer.reason}</p>
                          </div>
                          <Badge variant={offer.score >= 70 ? 'success' : 'default'}>{offer.score}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Best Action */}
              {nextBestAction && (
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader>
                    <CardTitle>Recommended Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{nextBestAction.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{nextBestAction.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Badge variant={nextBestAction.priority === 'High' ? 'danger' : nextBestAction.priority === 'Medium' ? 'warning' : 'default'}>
                        {nextBestAction.priority} Priority
                      </Badge>
                      <Badge variant="default">{nextBestAction.recommendedChannel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              {/* Churn Risk */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Churn Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant={churnRisk?.level === 'High' ? 'danger' : churnRisk?.level === 'Medium' ? 'warning' : 'success'}>
                        {churnRisk?.level} Risk
                      </Badge>
                      <p className="text-sm text-slate-500 mt-2">Score: {churnRisk?.score}/100</p>
                    </div>
                    <div className="text-4xl font-bold text-red-600">{churnRisk?.score}</div>
                  </div>
                  {churnRisk?.factors?.length > 0 && (
                    <ul className="space-y-2">
                      {churnRisk.factors.map((factor: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Credit Risk */}
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle>Credit Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={creditRisk?.level === 'High' ? 'danger' : creditRisk?.level === 'Medium' ? 'warning' : 'success'}>
                      {creditRisk?.level} Risk
                    </Badge>
                    <div className="text-4xl font-bold text-amber-600">{creditRisk?.score}</div>
                  </div>
                  {creditRisk?.warningForSales && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      {creditRisk.warningForSales}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Early Warnings */}
              {data.earlyWarnings?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Early Warning Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.earlyWarnings.map((warning) => (
                        <div key={warning.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-red-700">{warning.signalType}</p>
                            <Badge variant="danger">{warning.severity}</Badge>
                          </div>
                          <p className="text-sm text-red-600 mt-1">{warning.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {data.tasks.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No tasks assigned.</p>
                ) : (
                  <div className="space-y-3">
                    {data.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">{task.title}</p>
                          <p className="text-xs text-slate-500">Due: {task.dueDate}</p>
                        </div>
                        <Badge variant={task.status === 'Done' ? 'success' : task.status === 'Overdue' ? 'danger' : task.priority === 'High' ? 'danger' : 'default'}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/assistant?customerId=${customer.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Book Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{customer.region}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Last contact: {customer.lastInteractionDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Trend: {customer.transactionTrend3M}%</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Digital Score: {customer.digitalAdoptionScore}/100</span>
              </div>
            </CardContent>
          </Card>

          {/* Assigned RM */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned RM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-semibold">NV</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Nguyen Van A</p>
                  <p className="text-xs text-slate-500">Relationship Manager</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
