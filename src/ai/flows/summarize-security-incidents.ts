'use server';

/**
 * @fileOverview Summarizes correlated security incidents, highlighting key findings and confidence levels.
 *
 * - summarizeSecurityIncidents - A function that summarizes correlated security incidents.
 * - SummarizeSecurityIncidentsInput - The input type for the summarizeSecurityIncidents function.
 * - SummarizeSecurityIncidentsOutput - The return type for the summarizeSecurityIncidents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSecurityIncidentsInputSchema = z.object({
  incidents: z.array(
    z.object({
      agent: z.string().describe('The agent that detected the incident.'),
      confidenceLevel: z.number().describe('The confidence level of the incident detection (0-1).'),
      reasoning: z.string().describe('The reasoning behind the incident detection.'),
    })
  ).describe('A list of security incidents to summarize.'),
});
export type SummarizeSecurityIncidentsInput = z.infer<typeof SummarizeSecurityIncidentsInputSchema>;

const SummarizeSecurityIncidentsOutputSchema = z.object({
  summary: z.string().describe('A summary of the correlated security incidents, highlighting key findings and confidence levels.'),
});
export type SummarizeSecurityIncidentsOutput = z.infer<typeof SummarizeSecurityIncidentsOutputSchema>;

export async function summarizeSecurityIncidents(input: SummarizeSecurityIncidentsInput): Promise<SummarizeSecurityIncidentsOutput> {
  return summarizeSecurityIncidentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSecurityIncidentsPrompt',
  input: {schema: SummarizeSecurityIncidentsInputSchema},
  output: {schema: SummarizeSecurityIncidentsOutputSchema},
  prompt: `You are an expert security analyst tasked with summarizing correlated security incidents.

  Given the following security incidents, provide a concise summary highlighting key findings and overall confidence level.  Explain how the incidents are related to each other.
  Include any recommendations you have to improve the security posture.

  Incidents:
  {{#each incidents}}
  - Agent: {{agent}}
    Confidence Level: {{confidenceLevel}}
    Reasoning: {{reasoning}}
  {{/each}}
  `,
});

const summarizeSecurityIncidentsFlow = ai.defineFlow(
  {
    name: 'summarizeSecurityIncidentsFlow',
    inputSchema: SummarizeSecurityIncidentsInputSchema,
    outputSchema: SummarizeSecurityIncidentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
