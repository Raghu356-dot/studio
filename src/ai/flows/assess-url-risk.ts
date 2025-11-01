'use server';

/**
 * @fileOverview URL Risk Agent that analyzes website links for malicious domains, redirects, and unsafe content.
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
    .enum(['info', 'low', 'medium', 'high', 'critical'])
    .describe(
      'The risk level of the URL (info, low, medium, high, critical).'
    ),
  reason: z
    .string()
    .describe(
      'The reason for the assigned risk level, including details about malicious domains, redirects, or unsafe content.'
    ),
});
export type AssessUrlRiskOutput = z.infer<typeof AssessUrlRiskOutputSchema>;

export async function assessUrlRisk(input: AssessUrlRiskInput): Promise<AssessUrlRiskOutput> {
  return assessUrlRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessUrlRiskPrompt',
  input: {schema: AssessUrlRiskInputSchema},
  output: {schema: AssessUrlRiskOutputSchema},
  prompt: `You are a cybersecurity expert analyzing website links for potential risks.
  Assess the risk level of the following URL and provide a reason for your assessment.

  URL: {{{url}}}
  \n\
  Respond in the following format:
  {
    "riskLevel": "<risk level>",
    "reason": "<detailed reason>"
  }`,
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
