'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Layers, RefreshCw, FileText, AlertTriangle, CheckCircle, Phone, Mail, Loader2, X, Check } from 'lucide-react';

interface RenewalResult {
  name: string;
  status: 'Eligible' | 'Need Review' | 'Not Eligible';
  reason: string;
}

interface PreApprovedOffer {
  name: string;
  product: string;
  score: number;
  amount: string;
}

interface DocumentCheck {
  documentName: string;
  status: 'Available' | 'Missing';
}

interface AutomationState {
  renewal: { running: boolean; results: RenewalResult[] | null };
  preapproved: { running: boolean; results: PreApprovedOffer[] | null };
  document: { running: boolean; results: any | null };
  missingDoc: { running: boolean; results: DocumentCheck[] | null };
}

export default function AutomationPage() {
  const [state, setState] = useState<AutomationState>({
    renewal: { running: false, results: null },
    preapproved: { running: false, results: null },
    document: { running: false, results: null },
    missingDoc: { running: false, results: null },
  });

  const runRenewalReview = async () => {
    setState(prev => ({
      ...prev,
      renewal: { ...prev.renewal, running: true, results: null },
    }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    const results: RenewalResult[] = [
      { name: 'Nguyen Van A', status: 'Eligible', reason: 'Good payment history, increased income' },
      { name: 'Tran Thi B', status: 'Need Review', reason: 'Slight decline in transactions' },
      { name: 'Le Van C', status: 'Eligible', reason: 'Long-term customer, stable income' },
      { name: 'Pham Thi D', status: 'Need Review', reason: 'Recent late payment' },
      { name: 'Hoang Van E', status: 'Not Eligible', reason: 'Multiple defaults in past year' },
    ];

    setState(prev => ({
      ...prev,
      renewal: { running: false, results },
    }));
  };

  const runPreApprovedOffers = async () => {
    setState(prev => ({
      ...prev,
      preapproved: { ...prev.preapproved, running: true, results: null },
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    const results: PreApprovedOffer[] = [
      { name: 'Bui Thi K', product: 'Wealth Management', score: 85, amount: '500M VND' },
      { name: 'Sunrise Tech Solutions', product: 'SME Overdraft', score: 78, amount: '200M VND' },
      { name: 'Vu Thi F', product: 'Premium Credit Card', score: 82, amount: '50M VND' },
      { name: 'ABC Trading Co.', product: 'Business Loan', score: 75, amount: '300M VND' },
    ];

    setState(prev => ({
      ...prev,
      preapproved: { running: false, results },
    }));
  };

  const simulateDocumentExtraction = async () => {
    setState(prev => ({
      ...prev,
      document: { ...prev.document, running: true, results: null },
    }));

    await new Promise(resolve => setTimeout(resolve, 3000));

    const results = {
      fullName: 'Nguyen Van A',
      idNumber: '025894123456',
      dob: '1994-03-15',
      address: '123 Nguyen Trai St, District 1, HCMC',
      issueDate: '2020-01-15',
      confidence: 92,
      extractedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      document: { running: false, results },
    }));
  };

  const checkMissingDocuments = async () => {
    setState(prev => ({
      ...prev,
      missingDoc: { ...prev.missingDoc, running: true, results: null },
    }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    const results: DocumentCheck[] = [
      { documentName: 'ID Card', status: 'Available' },
      { documentName: 'Bank Statement (3 months)', status: 'Available' },
      { documentName: 'Financial Statement', status: 'Missing' },
      { documentName: 'Proof of Income', status: 'Available' },
      { documentName: 'Business License', status: 'Missing' },
    ];

    setState(prev => ({
      ...prev,
      missingDoc: { running: false, results },
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Eligible':
      case 'Available':
        return <Badge variant="success">Eligible</Badge>;
      case 'Need Review':
        return <Badge variant="warning">Need Review</Badge>;
      case 'Not Eligible':
      case 'Missing':
        return <Badge variant="danger">Missing</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Automation</h1>
        <p className="text-slate-500 mt-1">Automated banking processes and simulations</p>
      </div>

      {/* Warning Banner */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Academic Simulation Mode</p>
              <p className="text-sm text-amber-700 mt-1">
                All credit decisions, pre-approvals, and document processing shown here are simulated for academic demonstration purposes only. 
                No actual banking operations are performed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limit Renewal */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              Limit Renewal Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Simulated eligibility review for credit limit increases based on account behavior.
            </p>
            
            {/* Results Display */}
            {state.renewal.results && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {state.renewal.results.map((result, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                    result.status === 'Eligible' ? 'bg-emerald-50' :
                    result.status === 'Need Review' ? 'bg-amber-50' : 'bg-red-50'
                  }`}>
                    <div>
                      <p className="font-medium text-slate-900">{result.name}</p>
                      <p className="text-xs text-slate-500">{result.reason}</p>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={runRenewalReview}
              disabled={state.renewal.running}
            >
              {state.renewal.running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Review...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Renewal Review
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Pre-approved Offers */}
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-sky-600" />
              Pre-approved Offer Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Simulated pre-approved offers based on customer eligibility criteria.
            </p>
            
            {/* Results Display */}
            {state.preapproved.results && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {state.preapproved.results.map((offer, i) => (
                  <div key={i} className="p-3 rounded-lg bg-sky-50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900">{offer.name}</p>
                      <Badge variant="success">Eligible</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{offer.product} - Score: {offer.score}</p>
                    <p className="text-xs text-sky-600 font-medium">{offer.amount}</p>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={runPreApprovedOffers}
              disabled={state.preapproved.running}
            >
              {state.preapproved.running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Offers...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Generate Pre-approved Offers
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Document Auto-fill */}
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              Document Auto-fill Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Simulated OCR document extraction for automated data entry.
            </p>
            
            {/* Results Display */}
            {state.document.results && (
              <div className="p-4 rounded-lg bg-violet-50 border border-violet-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-900">Extracted Fields</p>
                  <Badge variant="success">{state.document.results.confidence}% Confidence</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Full Name:</span> {state.document.results.fullName}</div>
                  <div><span className="text-slate-500">ID Number:</span> {state.document.results.idNumber}</div>
                  <div><span className="text-slate-500">DOB:</span> {state.document.results.dob}</div>
                  <div><span className="text-slate-500">Issue Date:</span> {state.document.results.issueDate}</div>
                </div>
                <div className="mt-2 pt-2 border-t border-violet-200">
                  <p className="text-xs text-slate-500">Extracted at: {new Date(state.document.results.extractedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={simulateDocumentExtraction}
              disabled={state.document.running}
            >
              {state.document.running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Simulate Document Extraction
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Missing Document Check */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Missing Document Checker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Automated checklist for required customer documents.
            </p>
            
            {/* Results Display */}
            {state.missingDoc.results && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {state.missingDoc.results.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {doc.status === 'Available' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={`text-sm ${doc.status === 'Available' ? 'text-slate-700' : 'text-amber-700'}`}>
                      {doc.documentName}
                    </span>
                    {doc.status === 'Missing' && (
                      <Badge variant="warning" className="ml-auto">Missing</Badge>
                    )}
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <p className="text-sm font-medium">
                    Status: {state.missingDoc.results.filter(d => d.status === 'Available').length}/{state.missingDoc.results.length} documents available
                  </p>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={checkMissingDocuments}
              disabled={state.missingDoc.running}
            >
              {state.missingDoc.running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Check Customer Documents
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
