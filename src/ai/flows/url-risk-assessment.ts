'use server';

/**
 * @fileOverview URL Risk Assessment AI agent.
 *
 * - assessUrlRisk - A function that handles the URL risk assessment process.
 * - AssessUrlRiskInput - The input type for the assessUrlRisk function.
 * - AssessUrlRiskOutput - The return type for the assessUrlRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessUrlRiskInputSchema = z.object({
  url: z.string().url().describe('The URL to assess for risk.'),
});
export type AssessUrlRiskInput = z.infer<typeof AssessUrlRiskInputSchema>;

const AssessUrlRiskOutputSchema = z.object({
  riskLevel: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .describe('The risk level of the URL.'),
  reasoning: z.string().describe('The reasoning behind the risk assessment.'),
});
export type AssessUrlRiskOutput = z.infer<typeof AssessUrlRiskOutputSchema>;

export async function assessUrlRisk(input: AssessUrlRiskInput): Promise<AssessUrlRiskOutput> {
  return assessUrlRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessUrlRiskPrompt',
  input: {schema: AssessUrlRiskInputSchema},
  output: {schema: AssessUrlRiskOutputSchema},
  prompt: `You are a cybersecurity expert assessing the risk of a given URL.

  Analyze the URL and provide a risk level (LOW, MEDIUM, or HIGH) and the reasoning behind your assessment.

  URL: {{{url}}}
  `,
});

const assessUrlRiskFlow = ai.defineFlow(
  {
    name: 'assessUrlRiskFlow',
    inputSchema: AssessUrlRiskInputSchema,
    outputSchema: AssessUrlRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
