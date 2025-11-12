"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreatProvider } from "@/context/threat-context";
import { EmailAnalyzer } from "@/components/dashboard/email-analyzer";
import { UrlAnalyzer } from "@/components/dashboard/url-analyzer";
import { MalwareAnalyzer } from "@/components/dashboard/malware-analyzer";
import { FraudAnalyzer } from "@/components/dashboard/fraud-analyzer";
import { IncidentCorrelator } from "@/components/dashboard/incident-correlator";
import { Link, FileScan, CreditCard, Mail, Combine } from "lucide-react";

export function MainDashboard() {
  return (
    <ThreatProvider>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          <TabsTrigger value="email"><Mail className="mr-2" />Email</TabsTrigger>
          <TabsTrigger value="url"><Link className="mr-2" />URL</TabsTrigger>
          <TabsTrigger value="malware"><FileScan className="mr-2" />Malware</TabsTrigger>
          <TabsTrigger value="fraud"><CreditCard className="mr-2" />Fraud</TabsTrigger>
          <TabsTrigger value="correlator"><Combine className="mr-2" />Correlator</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="mt-4">
          <EmailAnalyzer />
        </TabsContent>
        <TabsContent value="url" className="mt-4">
          <UrlAnalyzer />
        </TabsContent>
        <TabsContent value="malware" className="mt-4">
          <MalwareAnalyzer />
        </TabsContent>
        <TabsContent value="fraud" className="mt-4">
          <FraudAnalyzer />
        </TabsContent>
        <TabsContent value="correlator" className="mt-4">
          <IncidentCorrelator />
        </TabsContent>
      </Tabs>
    </ThreatProvider>
  );
}
