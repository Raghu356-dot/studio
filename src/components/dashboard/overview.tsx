"use client";

import { useThreats } from "@/context/threat-context";
import type { Threat } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

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
  const { threats } = useThreats();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Threat Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {threats.length > 0 ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
  );
}
