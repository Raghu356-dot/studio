"use client";

import { useIncidents } from "@/context/incidents-context";
import type { Incident } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmailAnalysisCard } from "@/components/dashboard/email-analysis-card";
import { UrlRiskCard } from "@/components/dashboard/url-risk-card";
import { MalwareAnalysisCard } from "@/components/dashboard/malware-analysis-card";
import { FraudDetectionCard } from "@/components/dashboard/fraud-detection-card";
import { IncidentCorrelationCard } from "@/components/dashboard/incident-correlation-card";

export default function Home() {
  const { addIncident } = useIncidents();

  const handleNewIncident = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    addIncident(newIncident);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader />

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight">Analysis Tools</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <EmailAnalysisCard onNewIncident={handleNewIncident} className="h-full" />
            <UrlRiskCard onNewIncident={handleNewIncident} className="h-full" />
            <MalwareAnalysisCard onNewIncident={handleNewIncident} className="h-full" />
            <FraudDetectionCard onNewIncident={handleNewIncident} className="h-full" />
            <IncidentCorrelationCard className="h-full" />
        </div>
      </div>
    </div>
  );
}
