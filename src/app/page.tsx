"use client";

import { useState } from "react";
import type { Incident } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmailAnalysisCard } from "@/components/dashboard/email-analysis-card";
import { UrlRiskCard } from "@/components/dashboard/url-risk-card";
import { MalwareAnalysisCard } from "@/components/dashboard/malware-analysis-card";
import { FraudDetectionCard } from "@/components/dashboard/fraud-detection-card";
import { ThreatDashboard } from "@/components/dashboard/threat-dashboard";
import { IncidentCorrelationCard } from "@/components/dashboard/incident-correlation-card";

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const handleNewIncident = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    setIncidents(prevIncidents => [
      {
        ...newIncident,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      ...prevIncidents,
    ]);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader />

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight">Analysis Tools</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <EmailAnalysisCard onNewIncident={handleNewIncident} />
          <UrlRiskCard onNewIncident={handleNewIncident} />
          <MalwareAnalysisCard onNewIncident={handleNewIncident} />
          <FraudDetectionCard onNewIncident={handleNewIncident} />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <ThreatDashboard incidents={incidents} className="lg:col-span-4" />
        <IncidentCorrelationCard incidents={incidents} className="lg:col-span-3" />
      </div>
    </div>
  );
}
