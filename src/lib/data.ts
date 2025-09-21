import { type Alert, type ThreatTrendData } from './types';

export const overviewStats = [
  {
    title: 'System Status',
    value: 'Operational',
    icon: 'ShieldCheck',
    color: 'text-green-400',
  },
  {
    title: 'Threats Detected (24h)',
    value: '14',
    icon: 'AlertTriangle',
    color: 'text-yellow-400',
  },
  {
    title: 'Emails Scanned',
    value: '12,543',
    icon: 'Mail',
  },
  {
    title: 'Transactions Monitored',
    value: '8,765',
    icon: 'CreditCard',
  },
];

export const recentAlerts: Alert[] = [
  {
    id: 'alert-1',
    timestamp: '2m ago',
    severity: 'Critical',
    type: 'Fraud',
    description: 'Anomalous transaction from new device',
    source: '192.168.1.10',
  },
  {
    id: 'alert-2',
    timestamp: '5m ago',
    severity: 'High',
    type: 'Phishing',
    description: 'Suspicious link detected in email',
    source: 'ceo@example.com',
  },
  {
    id: 'alert-3',
    timestamp: '15m ago',
    severity: 'Medium',
    type: 'Malware',
    description: 'Malware signature found in attachment',
    source: 'invoice.pdf',
  },
  {
    id: 'alert-4',
    timestamp: '30m ago',
    severity: 'Low',
    type: 'Suspicious Activity',
    description: 'Multiple failed login attempts',
    source: 'user_admin',
  },
  {
    id: 'alert-5',
    timestamp: '1h ago',
    severity: 'High',
    type: 'Fraud',
    description: 'High-value transfer to unknown recipient',
    source: 'user_finance',
  },
];

export const threatActivityData: ThreatTrendData[] = [
  { date: 'Mon', phishing: 12, malware: 5, fraud: 2 },
  { date: 'Tue', phishing: 18, malware: 7, fraud: 4 },
  { date: 'Wed', phishing: 15, malware: 6, fraud: 3 },
  { date: 'Thu', phishing: 22, malware: 10, fraud: 5 },
  { date: 'Fri', phishing: 20, malware: 8, fraud: 6 },
  { date: 'Sat', phishing: 25, malware: 12, fraud: 8 },
  { date: 'Sun', phishing: 14, malware: 4, fraud: 3 },
];
