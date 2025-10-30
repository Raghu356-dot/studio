"use client";

import { useState } from "react";
import { Combine, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { Incident } from "@/lib/types";
import { summarizeSecurityIncidents, type SummarizeSecurityIncidentsOutput } from "@/ai/flows/summarize-security-incidents";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type IncidentCorrelationCardProps = {
  incidents: Incident[];
  className?: string;
};

export function IncidentCorrelationCard({ incidents, className }: IncidentCorrelationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummarizeSecurityIncidentsOutput | null>(null);
  const { toast } = useToast();

  async function handleCorrelate() {
    if (incidents.length === 0) {
      toast({
        title: "No Incidents",
        description: "There are no incidents to correlate.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const incidentsToCorrelate = incidents.map(i => ({
        agent: i.agent,
        confidenceLevel: i.confidence ?? (i.riskLevel === 'high' || i.riskLevel === 'critical' ? 0.8 : 0.5),
        reasoning: i.details?.reason || i.details?.explanation || i.finding,
      }));

      const correlationResult = await summarizeSecurityIncidents({ incidents: incidentsToCorrelate });
      setResult(correlationResult);
    } catch (error) {
      console.error("Incident correlation failed:", error);
      toast({
        variant: "destructive",
        title: "Correlation Failed",
        description: "Could not correlate the incidents.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg text-primary">
            <Combine className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Incident Correlation Agent</CardTitle>
            <CardDescription>Connects events to form a complete picture.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleCorrelate} disabled={isLoading || incidents.length === 0} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Correlate Incidents
          </Button>
          
          <ScrollArea className="h-72 w-full">
            {result ? (
              <Alert>
                <AlertTitle>Correlation Summary</AlertTitle>
                <AlertDescription className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                  {result.summary}
                </AlertDescription>
              </Alert>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Click the button to generate an intelligence summary.</p>
                </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
