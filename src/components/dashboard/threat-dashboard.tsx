"use client";

import { AlertTriangle, Badge, File, Link, Mail, Banknote, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Incident, IncidentAgent, IncidentRiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, Fragment } from "react";

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

function IncidentDetails({ incident }: { incident: Incident }) {
  const source = incident.details?.url || incident.details?.filename || (incident.details?.emailContent ? 'Email Body' : 'Transaction Data');
  const reason = incident.details?.reason || incident.details?.explanation || 'No details provided.';

  return (
    <div className="p-4 bg-muted/50 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Source</h4>
          <p className="break-all text-muted-foreground">{source}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-1">Threat Description</h4>
          <p className="text-muted-foreground">{reason}</p>
        </div>
      </div>
    </div>
  );
}


export function ThreatDashboard({ incidents, className }: ThreatDashboardProps) {
  
  const sortedIncidents = [...incidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const [openIncident, setOpenIncident] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenIncident(prev => (prev === id ? null : id));
  };


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
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedIncidents.length > 0 ? (
                sortedIncidents.map((incident) => (
                  <Collapsible asChild key={incident.id} open={openIncident === incident.id} onOpenChange={() => handleToggle(incident.id)}>
                    <Fragment>
                      <TableRow className="animate-in fade-in-50 cursor-pointer" onClick={() => handleToggle(incident.id)}>
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
                        <TableCell>
                          <CollapsibleTrigger asChild>
                              <button className="p-1">
                                <ChevronDown className={cn("h-4 w-4 transition-transform", openIncident === incident.id && "rotate-180")} />
                              </button>
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                         <tr className="bg-muted/20 hover:bg-muted/20">
                            <TableCell colSpan={5} className="p-0">
                              <IncidentDetails incident={incident} />
                            </TableCell>
                         </tr>
                      </CollapsibleContent>
                    </Fragment>
                  </Collapsible>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
