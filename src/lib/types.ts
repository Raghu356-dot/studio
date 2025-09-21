export type Alert = {
  id: string;
  timestamp: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: 'Phishing' | 'Malware' | 'Fraud' | 'Suspicious Activity';
  description: string;
  source: string;
};

export type ThreatTrendData = {
  date: string;
  phishing: number;
  malware: number;
  fraud: number;
};
