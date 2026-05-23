'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Bot, Lightbulb } from 'lucide-react';

interface DailyBriefingCardProps {
  briefing: string;
}

export function DailyBriefingCard({ briefing }: DailyBriefingCardProps) {
  const paragraphs = briefing.split('\n\n');
  
  return (
    <Card className="bg-gradient-to-br from-sky-50 to-sky-100/50 border-sky-200">
      <CardHeader className="border-b border-sky-200/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100">
            <Bot className="w-5 h-5 text-sky-600" />
          </div>
          <CardTitle className="text-sky-900">AI Daily Briefing</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="mb-3 last:mb-0">
            {paragraph.startsWith('TODAY\'S PRIORITY:') ? (
              <div className="mt-4 p-3 bg-white/60 rounded-lg border border-sky-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-sky-800 whitespace-pre-line">{paragraph}</p>
                </div>
              </div>
            ) : paragraph.startsWith('•') ? (
              <ul className="space-y-1 ml-2">
                {paragraph.split('\n').map((item, i) => (
                  <li key={i} className="text-sm text-sky-800">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-sky-800 whitespace-pre-line">{paragraph}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
