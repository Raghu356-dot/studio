'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhishingDetection } from './phishing-detection';
import { FraudDetection } from './fraud-detection';
import { ThreatCorrelation } from './threat-correlation';
import { Fish, CreditCard, GitMerge } from 'lucide-react';

export function AnalysisTabs() {
  return (
    <Tabs defaultValue="phishing" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="phishing">
          <Fish className="mr-2 h-4 w-4" />
          Phishing Detection
        </TabsTrigger>
        <TabsTrigger value="fraud">
          <CreditCard className="mr-2 h-4 w-4" />
          Fraud Detection
        </TabsTrigger>
        <TabsTrigger value="correlation">
          <GitMerge className="mr-2 h-4 w-4" />
          Threat Correlation
        </TabsTrigger>
      </TabsList>
      <TabsContent value="phishing">
        <PhishingDetection />
      </TabsContent>
      <TabsContent value="fraud">
        <FraudDetection />
      </TabsContent>
      <TabsContent value="correlation">
        <ThreatCorrelation />
      </TabsContent>
    </Tabs>
  );
}
