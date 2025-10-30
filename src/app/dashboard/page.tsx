"use client";

import { useIncidents } from "@/context/incidents-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { ThreatDashboard } from "@/components/dashboard/threat-dashboard";
import { IncidentCorrelationCard } from "@/components/dashboard/incident-correlation-card";

export default function DashboardPage() {
    const { incidents } = useIncidents();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <DashboardHeader />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <ThreatDashboard incidents={incidents} className="lg:col-span-4" />
                <IncidentCorrelationCard incidents={incidents} className="lg:col-span-3" />
            </div>
        </div>
    );
}
