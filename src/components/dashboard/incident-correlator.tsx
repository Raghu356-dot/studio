"use client";

import { useState } from "react";
import { useThreats } from "@/context/threat-context";
import type { IncidentCorrelationOutput } from "@/ai/flows/incident-correlation-and-alerting";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Combine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { correlateIncidentsAction } from "@/app/actions";
import { Separator } from "@/components/ui/separator";

export function IncidentCorrelator() {
  const { threats, clearThreats } = useThreats();
  const [correlationResult, setCorrelationResult] = useState<IncidentCorrelationOutput | null>(null);
  const [isCorrelating, setIsCorrelating] = useState(false);

  const highSeverityThreats = threats.filter(t => t.severity === 'High' || t.severity === 'Critical').length;

  const handleCorrelate = async () => {
    setIsCorrelating(true);
    setCorrelationResult(null);
    try {
      const findings = {
        emailAnalysis: threats.filter(t => t.agent === 'Email').map(t => JSON.stringify(t.details)).join('\n\n'),
        urlRiskAssessment: threats.filter(t => t.agent === 'URL').map(t => JSON.stringify(t.details)).join('\n\n'),
        malwareDetection: threats.filter(t => t.agent === 'Malware').map(t => JSON.stringify(t.details)).join('\n\n'),
        fraudPatternAnalysis: threats.filter(t => t.agent === 'Fraud').map(t => JSON.stringify(t.details)).join('\n\n'),
      };
      const result = await correlateIncidentsAction(findings);
      setCorrelationResult(result);
    } finally {
      setIsCorrelating(false);
    }
  };

  return (
    <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2"><Combine /> Incident Correlation Agent</CardTitle>
        <CardDescription>
            The correlation agent analyzes findings from all other agents to identify coordinated attacks and assess overall risk.
        </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
        <div className="text-center p-8 border-2 border-dashed rounded-lg border-muted-foreground/50">
            <p>{threats.length} threats in the feed.</p>
            <p className="text-sm text-muted-foreground">{highSeverityThreats} of them are high or critical severity.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleCorrelate} disabled={isCorrelating || threats.length === 0} className="w-full">
            <Bot className="mr-2" />
            {isCorrelating ? 'Correlating...' : 'Correlate Incidents'}
            </Button>
            <Button variant="outline" onClick={clearThreats} disabled={threats.length === 0} className="w-full">Clear Feed</Button>
        </div>
        
        {isCorrelating && <p className="text-center text-sm text-muted-foreground">Agent is thinking...</p>}

        {correlationResult && (
            <div className="mt-4 p-4 rounded-lg bg-secondary animate-in fade-in">
            <h4 className="font-semibold">Correlation Report</h4>
            <Separator className="my-2" />
            <p><strong>Incident Detected:</strong> {correlationResult.isIncident ? 'Yes' : 'No'}</p>
            <div className="flex items-center gap-2"><strong>Severity:</strong> <Badge variant={correlationResult.severity === 'high' || correlationResult.severity === 'critical' ? 'destructive' : 'secondary'}>{correlationResult.severity}</Badge></div>
            <p className="mt-2"><strong>Summary:</strong></p>
            <p className="text-sm text-muted-foreground">{correlationResult.summary}</p>
            <p className="mt-2"><strong>Recommendations:</strong></p>
            <p className="text-sm text-muted-foreground">{correlationResult.recommendations}</p>
            </div>
        )}
        </CardContent>
    </Card>
  );
}
