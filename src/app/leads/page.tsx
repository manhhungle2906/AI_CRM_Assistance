'use client';

import { useEffect, useState, useCallback } from 'react';
import { Target, Filter, Plus, ArrowRight, Sparkles, TrendingUp, Phone, Mail, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  source: string;
  suggestedProductName: string;
  leadScore: number;
  qualification: string;
  status: string;
  assignedRMName?: string;
  routingRecommendation?: {
    recommendedRM: string;
    reason: string;
  };
}

interface NewLeadForm {
  customerName: string;
  source: string;
  suggestedProductName: string;
  leadScore: number;
  qualification: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<NewLeadForm>({
    customerName: '',
    source: 'Website',
    suggestedProductName: 'Credit Card',
    leadScore: 50,
    qualification: 'Warm',
  });

  const fetchLeads = useCallback(async () => {
    try {
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(l => l.qualification.toLowerCase() === filter.toLowerCase());

  const hotLeads = leads.filter(l => l.qualification === 'Hot');
  const warmLeads = leads.filter(l => l.qualification === 'Warm');
  const coldLeads = leads.filter(l => l.qualification === 'Cold');

  const getQualificationColor = (q: string) => {
    switch (q) {
      case 'Hot': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleGenerateAILeads = async () => {
    setIsGenerating(true);
    
    // Simulate AI generating new leads
    setTimeout(() => {
      const newLeads: Lead[] = [
        {
          id: `lead_ai_${Date.now()}_1`,
          customerId: `cus_ai_${Date.now()}`,
          customerName: 'AI Generated Lead 1',
          source: 'AI Recommendation',
          suggestedProductName: 'Premium Credit Card',
          leadScore: 85,
          qualification: 'Hot',
          status: 'New',
          assignedRMName: 'Nguyen Van A',
        },
        {
          id: `lead_ai_${Date.now()}_2`,
          customerId: `cus_ai_${Date.now() + 1}`,
          customerName: 'AI Generated Lead 2',
          source: 'AI Cross-sell',
          suggestedProductName: 'Wealth Management',
          leadScore: 72,
          qualification: 'Warm',
          status: 'New',
          assignedRMName: 'Tran Thi B',
        },
        {
          id: `lead_ai_${Date.now()}_3`,
          customerId: `cus_ai_${Date.now() + 2}`,
          customerName: 'AI Generated Lead 3',
          source: 'AI Upsell',
          suggestedProductName: 'SME Overdraft',
          leadScore: 65,
          qualification: 'Warm',
          status: 'New',
        },
      ];
      
      setLeads(prev => [...newLeads, ...prev]);
      setIsGenerating(false);
      alert(`Successfully generated ${newLeads.length} new leads!`);
    }, 2000);
  };

  const handleCreateLead = async () => {
    if (!formData.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      customerId: `cus_${Date.now()}`,
      customerName: formData.customerName,
      source: formData.source,
      suggestedProductName: formData.suggestedProductName,
      leadScore: formData.leadScore,
      qualification: formData.qualification,
      status: 'New',
    };

    setLeads(prev => [newLead, ...prev]);
    setShowModal(false);
    setFormData({
      customerName: '',
      source: 'Website',
      suggestedProductName: 'Credit Card',
      leadScore: 50,
      qualification: 'Warm',
    });
  };

  const handleDeleteLead = (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const handleCall = (lead: Lead) => {
    alert(`Calling ${lead.customerName} about ${lead.suggestedProductName}...`);
  };

  const handleEmail = (lead: Lead) => {
    alert(`Sending email to ${lead.customerName} about ${lead.suggestedProductName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 mt-1">Manage and qualify customer leads</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateAILeads} 
            className="flex items-center gap-2"
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate AI Leads'}
          </Button>
          <Button onClick={() => setShowModal(true)} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('Hot')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{hotLeads.length}</p>
            <p className="text-sm text-red-600">Hot Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('Warm')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{warmLeads.length}</p>
            <p className="text-sm text-amber-600">Warm Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('Cold')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{coldLeads.length}</p>
            <p className="text-sm text-blue-600">Cold Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('all')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-slate-600">{leads.length}</p>
            <p className="text-sm text-slate-600">Total Leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Filter by:</span>
            <div className="flex gap-2">
              {['all', 'Hot', 'Warm', 'Cold', 'Disqualified'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== 'all' && f !== 'Disqualified' && (
                    <span className="ml-1 text-xs opacity-70">
                      ({leads.filter(l => l.qualification === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="ml-auto text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear filter
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'All Leads' : `${filter} Leads`} ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No leads found.</p>
              <Button onClick={() => setShowModal(true)} className="mt-4">
                Add First Lead
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Source</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">RM</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900">{lead.customerName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-600">{lead.suggestedProductName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                lead.leadScore >= 80 ? 'bg-red-500' : 
                                lead.leadScore >= 60 ? 'bg-amber-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${lead.leadScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{lead.leadScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualificationColor(lead.qualification)}`}>
                          {lead.qualification}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-600">{lead.assignedRMName || 'Unassigned'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCall(lead)}
                            className="p-1.5 rounded hover:bg-slate-100" 
                            title="Call"
                          >
                            <Phone className="w-4 h-4 text-slate-500 hover:text-sky-500" />
                          </button>
                          <button 
                            onClick={() => handleEmail(lead)}
                            className="p-1.5 rounded hover:bg-slate-100" 
                            title="Email"
                          >
                            <Mail className="w-4 h-4 text-slate-500 hover:text-sky-500" />
                          </button>
                          <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded hover:bg-red-100" 
                            title="Delete"
                          >
                            <X className="w-4 h-4 text-slate-500 hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Add New Lead</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
                <Input
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={formData.suggestedProductName}
                    onChange={(e) => setFormData({ ...formData, suggestedProductName: e.target.value })}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="SME Overdraft">SME Overdraft</option>
                    <option value="Wealth Management">Wealth Management</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lead Score</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.leadScore}
                    onChange={(e) => setFormData({ ...formData, leadScore: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateLead} className="flex-1">
                  Add Lead
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
