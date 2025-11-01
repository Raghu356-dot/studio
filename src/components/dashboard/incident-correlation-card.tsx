"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { summarizeSecurityIncidents, type SummarizeSecurityIncidentsOutput } from "@/ai/flows/summarize-security-incidents";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIncidents } from "@/context/incidents-context";

type IncidentCorrelationCardProps = {
  className?: string;
};

export function IncidentCorrelationCard({ className }: IncidentCorrelationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummarizeSecurityIncidentsOutput | null>(null);
  const { toast } = useToast();
  const { incidents } = useIncidents();

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
        <CardTitle>Threat Correlation</CardTitle>
        <CardDescription>
          Analyzes all detected incidents to find connections and provide a high-level summary of the threat landscape.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleCorrelate} disabled={isLoading || incidents.length === 0} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Correlate Incidents & Generate Summary
          </Button>
          
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            {result ? (
              <Alert>
                <AlertTitle>Correlation Summary</AlertTitle>
                <AlertDescription className="prose prose-sm dark:prose-invert whitespace-pre-wrap mt-2">
                  {result.summary}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <p>
                  {incidents.length > 0
                    ? `Ready to analyze ${incidents.length} incident(s). Click the button to generate an intelligence summary.`
                    : "Run other analysis tools first to generate incidents."}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
