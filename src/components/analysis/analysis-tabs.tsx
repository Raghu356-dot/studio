'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhishingDetection } from './phishing-detection';
import { FraudDetection } from './fraud-detection';
import { ThreatCorrelation } from './threat-correlation';
import { UrlScanning } from './url-scanning';
import { Fish, CreditCard, GitMerge, Link as LinkIcon } from 'lucide-react';

export function AnalysisTabs() {
  return (
    <Tabs defaultValue="phishing" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
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
        <TabsTrigger value="url-scanning">
          <LinkIcon className="mr-2 h-4 w-4" />
          URL Scanning
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
      <TabsContent value="url-scanning">
        <UrlScanning />
      </TabsContent>
    </Tabs>
  );
}
