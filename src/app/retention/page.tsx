'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Users, TrendingDown, Phone, Mail, Clock, CheckCircle, X, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RetentionAlert {
  id: string;
  customerId: string;
  customerName: string;
  churnRiskScore: number;
  churnRiskLevel: string;
  reason: string;
  recommendedAction: string;
  recommendedChannel: string;
  dueDate: string;
  phone?: string;
  email?: string;
  lastContact?: string;
}

interface ActionModalData {
  isOpen: boolean;
  alert: RetentionAlert | null;
  actionType: 'call' | 'email' | 'meeting' | 'offer' | null;
  notes: string;
}

export default function RetentionPage() {
  const [alerts, setAlerts] = useState<RetentionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<ActionModalData>({
    isOpen: false,
    alert: null,
    actionType: null,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch('/api/retention?action=alerts');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const highRisk = alerts.filter(a => a.churnRiskLevel === 'High');
  const mediumRisk = alerts.filter(a => a.churnRiskLevel === 'Medium');

  const openActionModal = (alert: RetentionAlert, actionType: 'call' | 'email' | 'meeting' | 'offer') => {
    setModalData({
      isOpen: true,
      alert,
      actionType,
      notes: '',
    });
  };

  const closeModal = () => {
    setModalData({
      isOpen: false,
      alert: null,
      actionType: null,
      notes: '',
    });
  };

  const handleSubmitAction = async () => {
    if (!modalData.alert || !modalData.actionType) return;
    
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove the alert from the list (simulating successful retention action)
    setAlerts(prev => prev.filter(a => a.id !== modalData.alert!.id));
    
    setSubmitting(false);
    closeModal();
    alert(`Retention action "${modalData.actionType}" has been logged for ${modalData.alert.customerName}. Customer has been moved to active follow-up list.`);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Call': return Phone;
      case 'Email': return Mail;
      case 'Meeting': return MessageSquare;
      default: return Phone;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Call': return 'bg-sky-100 text-sky-600 hover:bg-sky-200';
      case 'Email': return 'bg-violet-100 text-violet-600 hover:bg-violet-200';
      case 'Meeting': return 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Retention Center</h1>
          <p className="text-slate-500 mt-1">Monitor and prevent customer churn</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{highRisk.length}</p>
            <p className="text-sm text-red-600">High Churn Risk</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{mediumRisk.length}</p>
            <p className="text-sm text-amber-600">Medium Churn Risk</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-slate-600">{alerts.length}</p>
            <p className="text-sm text-slate-600">Total Alerts</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">85%</p>
            <p className="text-sm text-emerald-600">Avg Retention</p>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Alerts */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            High Churn Risk ({highRisk.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : highRisk.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-500">No high-risk customers. Great job!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {highRisk.map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{alert.customerName}</h3>
                        <Badge variant="danger">Score: {alert.churnRiskScore}</Badge>
                        {alert.churnRiskScore >= 80 && (
                          <Badge variant="danger" className="animate-pulse">URGENT</Badge>
                        )}
                      </div>
                      <p className="text-sm text-red-700 mb-2">{alert.reason}</p>
                      <p className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Recommended Action:</span> {alert.recommendedAction}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          {(() => {
                            const Icon = getActionIcon(alert.recommendedChannel);
                            return <Icon className="w-3 h-3" />;
                          })()}
                          {alert.recommendedChannel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due: {alert.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => openActionModal(alert, 'call')}
                        className={`p-2 rounded-lg transition-colors ${getActionColor('Call')}`}
                        title="Make a call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openActionModal(alert, 'email')}
                        className={`p-2 rounded-lg transition-colors ${getActionColor('Email')}`}
                        title="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openActionModal(alert, 'meeting')}
                        className={`p-2 rounded-lg transition-colors ${getActionColor('Meeting')}`}
                        title="Schedule meeting"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => openActionModal(alert, 'offer')}
                      >
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medium Risk Alerts */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <TrendingDown className="w-5 h-5" />
            Medium Churn Risk ({mediumRisk.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mediumRisk.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No medium-risk customers.</p>
          ) : (
            <div className="space-y-4">
              {mediumRisk.map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{alert.customerName}</h3>
                        <Badge variant="warning">Score: {alert.churnRiskScore}</Badge>
                      </div>
                      <p className="text-sm text-amber-700 mb-2">{alert.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <Badge variant="outline">{alert.recommendedChannel}</Badge>
                        <span>Due: {alert.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => openActionModal(alert, 'call')}
                        className={`p-2 rounded-lg transition-colors ${getActionColor('Call')}`}
                        title="Make a call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openActionModal(alert, 'email')}
                        className={`p-2 rounded-lg transition-colors ${getActionColor('Email')}`}
                        title="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openActionModal(alert, 'meeting')}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      {modalData.isOpen && modalData.alert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {modalData.actionType === 'call' && 'Log Call Action'}
                {modalData.actionType === 'email' && 'Log Email Action'}
                {modalData.actionType === 'meeting' && 'Schedule Meeting'}
                {modalData.actionType === 'offer' && 'Retention Offer'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Customer Info */}
            <div className="p-4 rounded-lg bg-slate-50 mb-4">
              <p className="font-medium text-slate-900">{modalData.alert.customerName}</p>
              <p className="text-sm text-slate-500">Churn Risk Score: {modalData.alert.churnRiskScore}</p>
              <p className="text-sm text-red-600">{modalData.alert.reason}</p>
            </div>
            
            {/* Action Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Action Type</label>
              <div className="flex gap-2">
                {['call', 'email', 'meeting', 'offer'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setModalData({ ...modalData, actionType: type as any })}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      modalData.actionType === type 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type === 'call' && <Phone className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'email' && <Mail className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'meeting' && <MessageSquare className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'offer' && <CheckCircle className="w-5 h-5 mx-auto mb-1" />}
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes / Outcome
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[100px]"
                placeholder={
                  modalData.actionType === 'call' ? 'Log call notes, customer response, next steps...' :
                  modalData.actionType === 'email' ? 'Email subject, content summary, customer response...' :
                  modalData.actionType === 'meeting' ? 'Meeting agenda, scheduled date, customer commitment...' :
                  'Offer details, customer acceptance, terms agreed...'
                }
                value={modalData.notes}
                onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitAction} 
                className="flex-1"
                disabled={submitting || !modalData.notes.trim()}
              >
                {submitting ? (
                  <>
                    <Send className="w-4 h-4 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Action
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
