"use client";

import { useIncidents } from "@/context/incidents-context";
import { EmailAnalysisCard } from "@/components/dashboard/email-analysis-card";
import { UrlRiskCard } from "@/components/dashboard/url-risk-card";
import { MalwareAnalysisCard } from "@/components/dashboard/malware-analysis-card";
import { FraudDetectionCard } from "@/components/dashboard/fraud-detection-card";
import { IncidentCorrelationCard } from "@/components/dashboard/incident-correlation-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, Combine, File, Link, Mail, Bot } from "lucide-react";
import { ThreatDashboard } from "@/components/dashboard/threat-dashboard";
import { Incident } from "@/lib/types";
import { AutonomousModeCard } from "@/components/dashboard/autonomous-mode-card";


function DashboardWrapper() {
  const { incidents } = useIncidents();
  return <ThreatDashboard incidents={incidents} />;
}

export default function Home() {
  const { addIncident } = useIncidents();

  const handleNewIncident = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    addIncident(newIncident);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analysis Tools</h2>
          <p className="text-muted-foreground">
            Leverage specialized AI agents to detect, analyze, and respond to cybersecurity threats.
          </p>
        </div>
      </div>

      <Tabs defaultValue="autonomous" className="space-y-4">
        <TabsList>
           <TabsTrigger value="autonomous">
            <Bot className="mr-2 h-4 w-4" />
            Autonomous Mode
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Phishing Detection
          </TabsTrigger>
          <TabsTrigger value="fraud">
             <Banknote className="mr-2 h-4 w-4" />
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="correlation">
             <Combine className="mr-2 h-4 w-4" />
            Incident Commander
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="mr-2 h-4 w-4" />
            URL Scanning
          </TabsTrigger>
          <TabsTrigger value="malware">
             <File className="mr-2 h-4 w-4" />
            Malware Analysis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="autonomous">
          <AutonomousModeCard onNewIncident={handleNewIncident} />
        </TabsContent>
        <TabsContent value="email">
          <EmailAnalysisCard onNewIncident={handleNewIncident} />
        </TabsContent>
        <TabsContent value="fraud">
          <FraudDetectionCard onNewIncident={handleNewIncident} />
        </TabsContent>
        <TabsContent value="correlation">
          <IncidentCorrelationCard />
        </TabsContent>
        <TabsContent value="url">
          <UrlRiskCard onNewIncident={handleNewIncident} />
        </TabsContent>
        <TabsContent value="malware">
          <MalwareAnalysisCard onNewIncident={handleNewIncident} />
        </TabsContent>
      </Tabs>
      
      <div className="pt-6">
        <DashboardWrapper />
      </div>
    </div>
  );
}
