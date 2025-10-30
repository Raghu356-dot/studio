import { config } from 'dotenv';
config();

import '@/ai/flows/detect-financial-fraud.ts';
import '@/ai/flows/assess-url-risk.ts';
import '@/ai/flows/summarize-security-incidents.ts';
import '@/ai/flows/analyze-email-for-phishing.ts';