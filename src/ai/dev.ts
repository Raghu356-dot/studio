import { config } from 'dotenv';
config();

import '@/ai/flows/fraud-pattern-analysis.ts';
import '@/ai/flows/email-analysis-flow.ts';
import '@/ai/flows/url-risk-assessment.ts';
import '@/ai/flows/incident-correlation-and-alerting.ts';