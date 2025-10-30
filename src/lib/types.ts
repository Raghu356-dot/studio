export type IncidentRiskLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

export type IncidentAgent = 'Email' | 'URL' | 'Malware' | 'Fraud';

export type Incident = {
  id: string;
  agent: IncidentAgent;
  riskLevel: IncidentRiskLevel;
  confidence?: number;
  finding: string;
  timestamp: string;
  details: Record<string, any>;
};
