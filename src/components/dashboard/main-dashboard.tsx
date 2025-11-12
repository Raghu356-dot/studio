"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreatProvider } from "@/context/threat-context";
import { Overview } from "@/components/dashboard/overview";
import { EmailAnalyzer } from "@/components/dashboard/email-analyzer";
import { UrlAnalyzer } from "@/components/dashboard/url-analyzer";
import { MalwareAnalyzer } from "@/components/dashboard/malware-analyzer";
import { FraudAnalyzer } from "@/components/dashboard/fraud-analyzer";
import { Activity, ShieldAlert, Link, FileScan, CreditCard, Mail } from "lucide-react";

export function MainDashboard() {
  return (
    <ThreatProvider>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          <TabsTrigger value="dashboard"><Activity className="mr-2" />Dashboard</TabsTrigger>
          <TabsTrigger value="email"><Mail className="mr-2" />Email</TabsTrigger>
          <TabsTrigger value="url"><Link className="mr-2" />URL</TabsTrigger>
          <TabsTrigger value="malware"><FileScan className="mr-2" />Malware</TabsTrigger>
          <TabsTrigger value="fraud"><CreditCard className="mr-2" />Fraud</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4">
          <Overview />
        </TabsContent>
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
      </Tabs>
    </ThreatProvider>
  );
}
