"use client";

import { AlertTriangle, Badge, File, Link, Mail, Banknote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Incident, IncidentAgent, IncidentRiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const riskColors: Record<IncidentRiskLevel, string> = {
  info: "bg-blue-500",
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

const agentIcons: Record<IncidentAgent, React.ReactNode> = {
  Email: <Mail className="h-4 w-4" />,
  URL: <Link className="h-4 w-4" />,
  Malware: <File className="h-4 w-4" />,
  Fraud: <Banknote className="h-4 w-4" />,
};

type ThreatDashboardProps = {
  incidents: Incident[];
  className?: string;
};

export function ThreatDashboard({ incidents, className }: ThreatDashboardProps) {
  
  const sortedIncidents = [...incidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
                <CardTitle>Unified Threat Dashboard</CardTitle>
                <CardDescription>Live feed of correlated security incidents.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[80px]">Agent</TableHead>
                <TableHead>Finding</TableHead>
                <TableHead className="w-[100px] text-center">Risk</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedIncidents.length > 0 ? (
                sortedIncidents.map((incident) => (
                  <TableRow key={incident.id} className="animate-in fade-in-50">
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        {agentIcons[incident.agent]}
                        {incident.agent}
                      </div>
                    </TableCell>
                    <TableCell>{incident.finding}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="capitalize flex items-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", riskColors[incident.riskLevel])} />
                        {incident.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(incident.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No incidents detected yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
