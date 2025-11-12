import type { EmailAnalysisOutput } from "@/ai/flows/email-analysis-flow";
import type { AssessUrlRiskOutput } from "@/ai/flows/url-risk-assessment";
import type { AnalyzeTransactionOutput } from "@/ai/flows/fraud-pattern-analysis";
import type { IncidentCorrelationOutput } from "@/ai/flows/incident-correlation-and-alerting";
import type { MalwareAnalysisOutput } from "@/ai/flows/malware-analysis-flow";

export type ThreatAgent = "Email" | "URL" | "Malware" | "Fraud";
export type ThreatSeverity = "Low" | "Medium" | "High" | "Critical";

export type Threat = {
  id: string;
  agent: ThreatAgent;
  timestamp: Date;
  summary: string;
  severity: ThreatSeverity;
  details: any;
};

export type MalwareAnalysisResult = MalwareAnalysisOutput & {
  fileName: string;
  fileSize: number;
};

export type AnalysisResult =
  | (EmailAnalysisOutput & { agent: "Email" })
  | (AssessUrlRiskOutput & { agent: "URL" })
  | (MalwareAnalysisResult & { agent: "Malware" })
  | (AnalyzeTransactionOutput & { agent: "Fraud" });

export type IncidentCorrelationResult = IncidentCorrelationOutput;
