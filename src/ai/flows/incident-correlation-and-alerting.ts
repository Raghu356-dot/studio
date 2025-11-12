'use server';
/**
 * @fileOverview This file contains the Genkit flow for incident correlation and alerting.
 *
 * - `correlateIncidentsAndAlert` - A function that aggregates findings from all agents, identifies and correlates security incidents, determines the need for escalation, and generates alerts.
 * - `IncidentCorrelationInput` - The input type for the `correlateIncidentsAndAlert` function.
 * - `IncidentCorrelationOutput` - The return type for the `correlateIncidentsAndAlert` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncidentCorrelationInputSchema = z.object({
  emailAnalysis: z.string().optional().describe('Findings from the email analysis agent.'),
  urlRiskAssessment: z.string().optional().describe('Findings from the URL risk assessment agent.'),
  malwareDetection: z.string().optional().describe('Findings from the malware detection agent.'),
  fraudPatternAnalysis: z.string().optional().describe('Findings from the fraud pattern analysis agent.'),
});
export type IncidentCorrelationInput = z.infer<typeof IncidentCorrelationInputSchema>;

const IncidentCorrelationOutputSchema = z.object({
  isIncident: z.boolean().describe('Whether a security incident is detected.'),
  severity: z.string().describe('The severity level of the incident (e.g., low, medium, high).'),
  summary: z.string().describe('A summary of the correlated incident.'),
  recommendations: z.string().describe('Recommended actions to address the incident.'),
});
export type IncidentCorrelationOutput = z.infer<typeof IncidentCorrelationOutputSchema>;

export async function correlateIncidentsAndAlert(input: IncidentCorrelationInput): Promise<IncidentCorrelationOutput> {
  return incidentCorrelationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'incidentCorrelationPrompt',
  input: {schema: IncidentCorrelationInputSchema},
  output: {schema: IncidentCorrelationOutputSchema},
  prompt: `You are an expert cybersecurity incident responder.

You will receive findings from various security agents, including email analysis, URL risk assessment, malware detection, and fraud pattern analysis.

Your task is to correlate these findings to determine if a security incident has occurred, assess its severity, summarize the incident, and provide recommendations for addressing it.

Email Analysis Findings: {{{emailAnalysis}}}
URL Risk Assessment Findings: {{{urlRiskAssessment}}}
Malware Detection Findings: {{{malwareDetection}}}
Fraud Pattern Analysis Findings: {{{fraudPatternAnalysis}}}

Based on these findings, determine:

- isIncident: Has a security incident occurred? (true/false)
- severity: What is the severity level of the incident? (low, medium, high, critical)
- summary: Provide a concise summary of the incident.
- recommendations: What actions should be taken to address the incident?

Ensure the output is well-structured and easy to understand.
`,
});

const incidentCorrelationFlow = ai.defineFlow(
  {
    name: 'incidentCorrelationFlow',
    inputSchema: IncidentCorrelationInputSchema,
    outputSchema: IncidentCorrelationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
