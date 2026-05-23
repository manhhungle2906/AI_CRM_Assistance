// ============================================
// Omnichannel Engine
// ============================================
import { ChannelEvent, Interaction, HandoverRequest, ContactCenterInsight } from './types';
import { mockChannelEvents, getChannelEventsByCustomer, getHandoverRequiredEvents } from '@/data/mock-channel-events';
import { getInteractionsByCustomer } from '@/data/mock-interactions';
import { getCustomerById } from '@/data/mock-customers';

export interface UnifiedTimelineEvent {
  id: string;
  date: string;
  channel: string;
  type: string;
  summary: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  isInteraction: boolean;
}

export function buildUnifiedTimeline(customerId: string): UnifiedTimelineEvent[] {
  const events: UnifiedTimelineEvent[] = [];

  // Get channel events
  const channelEvents = getChannelEventsByCustomer(customerId);
  channelEvents.forEach(event => {
    events.push({
      id: event.id,
      date: event.date,
      channel: event.channel,
      type: event.eventType,
      summary: event.detail,
      sentiment: event.sentiment,
      isInteraction: false,
    });
  });

  // Get interactions
  const interactions = getInteractionsByCustomer(customerId);
  interactions.forEach(interaction => {
    events.push({
      id: interaction.id,
      date: interaction.date,
      channel: interaction.channel,
      type: interaction.topic,
      summary: interaction.summary,
      sentiment: interaction.sentiment,
      isInteraction: true,
    });
  });

  // Sort by date (most recent first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return events.slice(0, 50); // Limit to 50 most recent events
}

export function generateContactCenterInsights(customerId: string): ContactCenterInsight[] {
  const customer = getCustomerById(customerId);
  if (!customer) return [];

  const insights: ContactCenterInsight[] = [];

  // Find contact center interactions
  const interactions = getInteractionsByCustomer(customerId)
    .filter(i => i.channel === 'Contact Center' || i.channel === 'Call');

  interactions.forEach(interaction => {
    insights.push({
      id: interaction.id,
      customerId,
      customerName: customer.name,
      callTopic: interaction.topic,
      sentiment: interaction.sentiment,
      unresolvedIssue: interaction.unresolvedIssue,
      recommendedFollowUp: interaction.nextStep || 'No specific follow-up required',
      date: interaction.date,
    });
  });

  // Find chatbot events that need insights
  const chatbotEvents = mockChannelEvents.filter(
    e => e.customerId === customerId && (e.channel === 'Chatbot' || e.channel === 'Callbot')
  );

  chatbotEvents.forEach(event => {
    if (event.sentiment === 'Negative' || event.handoverRequired) {
      insights.push({
        id: `cc_${event.id}`,
        customerId,
        customerName: customer.name,
        callTopic: event.eventType,
        sentiment: event.sentiment || 'Neutral',
        unresolvedIssue: event.conversationSummary,
        recommendedFollowUp: 'Review chatbot conversation and follow up as needed',
        date: event.date,
      });
    }
  });

  return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function detectHandoverNeeds(): HandoverRequest[] {
  const handoverRequests: HandoverRequest[] = [];

  // Get events requiring handover
  const handoverEvents = getHandoverRequiredEvents();

  handoverEvents.forEach(event => {
    const customer = getCustomerById(event.customerId);
    if (!customer) return;

    // Determine urgency
    let urgency: 'Low' | 'Medium' | 'High';
    if (event.sentiment === 'Negative' && event.eventType === 'Complaint') {
      urgency = 'High';
    } else if (event.sentiment === 'Negative') {
      urgency = 'Medium';
    } else if (event.handoverRequired) {
      urgency = 'Low';
    } else {
      urgency = 'Low';
    }

    handoverRequests.push({
      id: `handover_${event.id}`,
      customerId: event.customerId,
      customerName: event.customerName || customer.name,
      originalChannel: event.channel,
      detectedIntent: event.detectedIntent || event.eventType,
      conversationSummary: event.conversationSummary || event.detail,
      urgency,
      assignedRMId: customer.assignedRMId,
      assignedRMName: undefined, // Would be filled from RM data
      handoverReason: getHandoverReason(event),
      createdAt: event.date,
    });
  });

  // Sort by urgency
  const urgencyOrder = { High: 0, Medium: 1, Low: 2 };
  return handoverRequests.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
}

function getHandoverReason(event: ChannelEvent): string {
  if (event.sentiment === 'Negative') {
    return 'Negative sentiment detected - requires human intervention';
  }
  
  if (event.eventType === 'Complaint') {
    return 'Complaint requires human handling and resolution';
  }
  
  if (event.handoverRequired && event.detectedIntent) {
    return `Customer intent "${event.detectedIntent}" requires specialist assistance`;
  }
  
  return 'Customer inquiry exceeds chatbot capability';
}

export function summarizeChannelEvents(customerId: string): {
  totalEvents: number;
  byChannel: Record<string, number>;
  bySentiment: Record<string, number>;
  unresolvedCount: number;
  lastContact: string;
  channelPreference: string;
} {
  const events = getChannelEventsByCustomer(customerId);
  
  const byChannel: Record<string, number> = {};
  const bySentiment: Record<string, number> = {};
  
  events.forEach(event => {
    byChannel[event.channel] = (byChannel[event.channel] || 0) + 1;
    if (event.sentiment) {
      bySentiment[event.sentiment] = (bySentiment[event.sentiment] || 0) + 1;
    }
  });

  const unresolvedCount = events.filter(e => e.handoverRequired).length;
  const lastContact = events.length > 0 ? events[0].date : 'No contact';

  // Determine channel preference
  const channelPreference = Object.entries(byChannel)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  return {
    totalEvents: events.length,
    byChannel,
    bySentiment,
    unresolvedCount,
    lastContact,
    channelPreference,
  };
}

export function getContactCenterOverview(): {
  totalInteractions: number;
  sentimentDistribution: { sentiment: string; count: number }[];
  topTopics: { topic: string; count: number }[];
  unresolvedRate: number;
  handoverQueue: HandoverRequest[];
} {
  const sentimentDistribution: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};
  let unresolvedCount = 0;
  
  mockChannelEvents.forEach(event => {
    if (event.sentiment) {
      sentimentDistribution[event.sentiment] = (sentimentDistribution[event.sentiment] || 0) + 1;
    }
    
    topicCounts[event.eventType] = (topicCounts[event.eventType] || 0) + 1;
    
    if (event.handoverRequired) {
      unresolvedCount++;
    }
  });

  const totalInteractions = mockChannelEvents.length;
  const handoverQueue = detectHandoverNeeds().slice(0, 10);

  return {
    totalInteractions,
    sentimentDistribution: Object.entries(sentimentDistribution).map(([sentiment, count]) => ({
      sentiment,
      count,
    })),
    topTopics: Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count })),
    unresolvedRate: Math.round((unresolvedCount / totalInteractions) * 100),
    handoverQueue,
  };
}
