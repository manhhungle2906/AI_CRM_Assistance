'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Layers, Smartphone, Globe, Phone, Mail, MessageSquare, AlertTriangle, CheckCircle, 
  Search, Filter, X, ChevronLeft, Clock, User, Star
} from 'lucide-react';

interface ChannelEvent {
  id: string;
  customerId: string;
  customerName: string;
  channel: string;
  type: string;
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  date: string;
  duration?: string;
  agent?: string;
}

interface ChannelData {
  name: string;
  icon: any;
  count: number;
  color: string;
  events: ChannelEvent[];
}

const channels: ChannelData[] = [
  {
    name: 'Mobile App',
    icon: Smartphone,
    count: 45,
    color: 'sky',
    events: [
      { id: '1', customerId: 'cus_001', customerName: 'Nguyen Van A', channel: 'Mobile App', type: 'Product Click', summary: 'Viewed Credit Card page', sentiment: 'Positive', date: '2026-05-23' },
      { id: '2', customerId: 'cus_002', customerName: 'Tran Thi B', channel: 'Mobile App', type: 'Login', summary: 'App login successful', sentiment: 'Neutral', date: '2026-05-23' },
      { id: '3', customerId: 'cus_003', customerName: 'Le Van C', channel: 'Mobile App', type: 'Transaction', summary: 'Completed fund transfer', sentiment: 'Positive', date: '2026-05-22' },
      { id: '4', customerId: 'cus_004', customerName: 'Pham Thi D', channel: 'Mobile App', type: 'Complaint', summary: 'Reported ATM card issue', sentiment: 'Negative', date: '2026-05-22' },
    ],
  },
  {
    name: 'Website',
    icon: Globe,
    count: 32,
    color: 'violet',
    events: [
      { id: '5', customerId: 'cus_005', customerName: 'Hoang Van E', channel: 'Website', type: 'Product View', summary: 'Viewed Personal Loan page', sentiment: 'Neutral', date: '2026-05-23' },
      { id: '6', customerId: 'cus_006', customerName: 'Vu Thi F', channel: 'Website', type: 'Form Submit', summary: 'Submitted loan application', sentiment: 'Positive', date: '2026-05-22' },
    ],
  },
  {
    name: 'Hotline',
    icon: Phone,
    count: 28,
    color: 'amber',
    events: [
      { id: '7', customerId: 'cus_007', customerName: 'Dao Van G', channel: 'Hotline', type: 'Inquiry', summary: 'Asked about account balance', sentiment: 'Neutral', date: '2026-05-23', duration: '5 min' },
      { id: '8', customerId: 'cus_008', customerName: 'Nguyen Thi H', channel: 'Hotline', type: 'Complaint', summary: 'Complaint about long wait time', sentiment: 'Negative', date: '2026-05-22', duration: '12 min', agent: 'Agent Sarah' },
    ],
  },
  {
    name: 'Branch',
    icon: Layers,
    count: 18,
    color: 'emerald',
    events: [
      { id: '9', customerId: 'cus_009', customerName: 'Trinh Van I', channel: 'Branch', type: 'Meeting', summary: 'Discussed wealth management', sentiment: 'Positive', date: '2026-05-23', agent: 'RM Nguyen' },
      { id: '10', customerId: 'cus_010', customerName: 'Bui Thi K', channel: 'Branch', type: 'Transaction', summary: 'Cash deposit', sentiment: 'Neutral', date: '2026-05-22' },
    ],
  },
  {
    name: 'Email',
    icon: Mail,
    count: 25,
    color: 'rose',
    events: [
      { id: '11', customerId: 'cus_011', customerName: 'ABC Trading Co.', channel: 'Email', type: 'Campaign', summary: 'Opened promotional email', sentiment: 'Neutral', date: '2026-05-23' },
      { id: '12', customerId: 'cus_012', customerName: 'Blue Ocean Logistics', channel: 'Email', type: 'Response', summary: 'Replied to loan inquiry', sentiment: 'Positive', date: '2026-05-22' },
    ],
  },
  {
    name: 'Chatbot',
    icon: MessageSquare,
    count: 35,
    color: 'cyan',
    events: [
      { id: '13', customerId: 'cus_013', customerName: 'Minh An Retail', channel: 'Chatbot', type: 'Complaint', summary: 'Reported delivery delay', sentiment: 'Negative', date: '2026-05-23' },
      { id: '14', customerId: 'cus_014', customerName: 'Lotus Food Service', channel: 'Chatbot', type: 'Inquiry', summary: 'Asked about account opening', sentiment: 'Neutral', date: '2026-05-22' },
    ],
  },
  {
    name: 'Callbot',
    icon: Phone,
    count: 17,
    color: 'indigo',
    events: [
      { id: '15', customerId: 'cus_015', customerName: 'Nguyen Van S', channel: 'Callbot', type: 'Product Inquiry', summary: 'Interested in SME Overdraft', sentiment: 'Positive', date: '2026-05-23' },
      { id: '16', customerId: 'cus_016', customerName: 'Sunrise Tech Solutions', channel: 'Callbot', type: 'Handover', summary: 'Request escalated to RM', sentiment: 'Neutral', date: '2026-05-22' },
    ],
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
};

const sentimentClasses = {
  Positive: 'bg-emerald-100 text-emerald-700',
  Neutral: 'bg-slate-100 text-slate-700',
  Negative: 'bg-red-100 text-red-700',
};

export default function OmnichannelPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [channelTypeFilter, setChannelTypeFilter] = useState<string>('all');

  const currentChannel = channels.find(c => c.name === selectedChannel);

  const filteredEvents = currentChannel?.events.filter(event => {
    const matchesSearch = event.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || event.sentiment === sentimentFilter;
    const matchesChannel = channelTypeFilter === 'all' || event.channel === channelTypeFilter;
    return matchesSearch && matchesSentiment && matchesChannel;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Omnichannel</h1>
        <p className="text-slate-500 mt-1">Unified customer timeline across all channels</p>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const colors = colorClasses[channel.color];
          const isSelected = selectedChannel === channel.name;
          
          return (
            <Card 
              key={channel.name} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? `ring-2 ring-sky-500 ${colors.bg}` : ''
              }`}
              onClick={() => setSelectedChannel(isSelected ? null : channel.name)}
            >
              <CardContent className="p-3 text-center">
                <div className={`w-10 h-10 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-lg font-bold text-slate-900">{channel.count}</p>
                <p className="text-xs text-slate-500">{channel.name}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Handover Queue */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Chatbot/Callbot Handover Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {channels
                .filter(c => c.name === 'Chatbot' || c.name === 'Callbot')
                .flatMap(c => c.events.filter(e => e.type === 'Handover' || e.type === 'Complaint'))
                .slice(0, 5)
                .map((handover, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 hover:border-amber-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedChannel(handover.channel)}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900">{handover.customerName}</p>
                      <Badge variant={handover.sentiment === 'Negative' ? 'danger' : handover.sentiment === 'Positive' ? 'success' : 'default'}>
                        {handover.sentiment}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{handover.channel} - {handover.type}</p>
                    <p className="text-xs text-slate-500 mt-1">{handover.summary}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Center Insights */}
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-600" />
              Contact Center Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">68%</p>
                  <p className="text-xs text-slate-500">Positive</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">22%</p>
                  <p className="text-xs text-slate-500">Neutral</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">10%</p>
                  <p className="text-xs text-slate-500">Negative</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Top Topics</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Product Inquiry</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Account Issue</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Loan Inquiry</span>
                    <span className="font-medium">22%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Detail Panel */}
      {selectedChannel && currentChannel && (
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = currentChannel.icon;
                  return <Icon className={`w-5 h-5 ${colorClasses[currentChannel.color].text}`} />;
                })()}
                {selectedChannel} Interactions
                <Badge variant="outline" className="ml-2">{filteredEvents.length} events</Badge>
              </CardTitle>
              <button 
                onClick={() => setSelectedChannel(null)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by customer name or summary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
              >
                <option value="all">All Sentiment</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No interactions found matching your criteria.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{event.customerName}</p>
                          <p className="text-sm text-slate-500">{event.customerId}</p>
                        </div>
                      </div>
                      <Badge className={sentimentClasses[event.sentiment]}>
                        {event.sentiment === 'Positive' && <Star className="w-3 h-3 mr-1" />}
                        {event.sentiment}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 pl-13">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{event.type}</Badge>
                        <span className="text-sm text-slate-600">{event.summary}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.date}
                        </span>
                        {event.duration && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {event.duration}
                          </span>
                        )}
                        {event.agent && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.agent}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unified Timeline */}
      {!selectedChannel && (
        <Card>
          <CardHeader>
            <CardTitle>Unified Customer Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels
                .flatMap(c => c.events)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 8)
                .map((event, i) => {
                  const channel = channels.find(c => c.name === event.channel);
                  const Icon = channel?.icon || MessageSquare;
                  const colors = colorClasses[channel?.color || 'sky'];
                  
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-20 text-right">
                        <p className="text-sm font-medium text-slate-900">{event.date}</p>
                      </div>
                      <div className="w-4 flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${colors.bg} border-2 ${colors.text}`} />
                        <div className="w-0.5 h-full bg-slate-200 mt-1" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center`}>
                            <Icon className={`w-3 h-3 ${colors.text}`} />
                          </div>
                          <Badge variant="outline" className="text-xs">{event.channel}</Badge>
                          <span className="text-sm text-slate-700">{event.type}</span>
                        </div>
                        <p className="text-sm text-slate-600">{event.customerName}: {event.summary}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${sentimentClasses[event.sentiment]}`}>
                            {event.sentiment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
