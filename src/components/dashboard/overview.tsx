"use client";

import { useState } from "react";
import { useThreats } from "@/context/threat-context";
import type { Threat, IncidentCorrelationResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, CheckCircle, BarChart, AlertTriangle, ShieldCheck, FileWarning, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { correlateIncidentsAction } from "@/app/actions";
import { Separator } from "@/components/ui/separator";

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function ThreatListItem({ threat }: { threat: Threat }) {
  const severityIcons = {
    Low: <CheckCircle className="h-5 w-5 text-green-500" />,
    Medium: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    High: <AlertCircle className="h-5 w-5 text-orange-500" />,
    Critical: <ShieldAlert className="h-5 w-5 text-red-500" />,
  };
  const severityClasses = {
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:bg-secondary/50 transition-colors">
      <div className="pt-1">{severityIcons[threat.severity]}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{threat.summary}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(threat.timestamp, { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>Agent: {threat.agent}</span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline" className={severityClasses[threat.severity]}>
            {threat.severity}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function Overview() {
  const { threats, clearThreats } = useThreats();
  const [correlationResult, setCorrelationResult] = useState<IncidentCorrelationResult | null>(null);
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
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Detections" value={threats.length} icon={BarChart} />
        <StatCard title="High Severity" value={highSeverityThreats} icon={ShieldAlert} />
        <StatCard title="Incidents" value={correlationResult?.isIncident ? '1' : '0'} icon={FileWarning} />
        <StatCard title="System Status" value="Secure" icon={ShieldCheck} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Real-time Threat Feed</CardTitle>
          </CardHeader>
          <CardContent>
            {threats.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {threats.map(threat => <ThreatListItem key={threat.id} threat={threat} />)}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No threats detected yet.</p>
                <p className="text-sm">Use the agent tabs to start an analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Incident Correlation Agent</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              The correlation agent analyzes findings from all other agents to identify coordinated attacks and assess overall risk.
            </p>
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
                <p><strong>Severity:</strong> <Badge variant="destructive">{correlationResult.severity}</Badge></p>
                <p className="mt-2"><strong>Summary:</strong></p>
                <p className="text-sm text-muted-foreground">{correlationResult.summary}</p>
                <p className="mt-2"><strong>Recommendations:</strong></p>
                <p className="text-sm text-muted-foreground">{correlationResult.recommendations}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
