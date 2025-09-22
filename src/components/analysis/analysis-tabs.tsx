'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhishingDetection } from './phishing-detection';
import { FraudDetection } from './fraud-detection';
import { ThreatCorrelation } from './threat-correlation';
import { UrlScanning } from './url-scanning';
import { MalwareAnalysis } from './malware-analysis';
import {
  Fish,
  CreditCard,
  GitMerge,
  Link as LinkIcon,
  FileScan,
} from 'lucide-react';

export function AnalysisTabs() {
  return (
    <Tabs defaultValue="phishing" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
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
        <TabsTrigger value="malware-analysis">
          <FileScan className="mr-2 h-4 w-4" />
          Malware Analysis
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
      <TabsContent value="malware-analysis">
        <MalwareAnalysis />
      </TabsContent>
    </Tabs>
  );
}
