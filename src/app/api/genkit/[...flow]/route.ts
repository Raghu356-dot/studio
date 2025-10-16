'use server';
import { runFlow } from '@genkit-ai/next/server';

// Import all flows that should be exposed via the API route.
import '@/ai/flows/summarize-email-content.ts';
import '@/ai/flows/correlate-phishing-email-and-fraudulent-transaction.ts';
import '@/ai/flows/enhance-fraud-alerts-with-explanations.ts';
import '@/ai/flows/scan-url-for-threats.ts';
import '@/ai/flows/analyze-file-for-malware.ts';

export { runFlow as POST, runFlow as GET };
