"use client";

import { useIncidents } from "@/context/incidents-context";
import type { Incident } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmailAnalysisCard } from "@/components/dashboard/email-analysis-card";
import { UrlRiskCard } from "@/components/dashboard/url-risk-card";
import { MalwareAnalysisCard } from "@/components/dashboard/malware-analysis-card";
import { FraudDetectionCard } from "@/components/dashboard/fraud-detection-card";
import { IncidentCorrelationCard } from "@/components/dashboard/incident-correlation-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <EmailAnalysisCard onNewIncident={handleNewIncident} className="h-full" />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <UrlRiskCard onNewIncident={handleNewIncident} className="h-full" />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <MalwareAnalysisCard onNewIncident={handleNewIncident} className="h-full" />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <FraudDetectionCard onNewIncident={handleNewIncident} className="h-full" />
            </CarouselItem>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <IncidentCorrelationCard className="h-full" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
