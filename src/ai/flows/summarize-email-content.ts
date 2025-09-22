'use server';

/**
 * @fileOverview Summarizes the content of an email for threat assessment.
 *
 * - summarizeEmailContent - A function that summarizes email content.
 * - SummarizeEmailContentInput - The input type for the summarizeEmailContent function.
 * - SummarizeEmailContentOutput - The return type for the summarizeEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailContentInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to be summarized.'),
});
export type SummarizeEmailContentInput = z.infer<
  typeof SummarizeEmailContentInputSchema
>;

const SummarizeEmailContentOutputSchema = z.object({
  summary: z.string().describe('A detailed summary of the email content, including an analysis of potential threats, sender intent, and overall risk.'),
});
export type SummarizeEmailContentOutput = z.infer<
  typeof SummarizeEmailContentOutputSchema
>;

export async function summarizeEmailContent(
  input: SummarizeEmailContentInput
): Promise<SummarizeEmailContentOutput> {
  return summarizeEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailContentPrompt',
  input: {schema: SummarizeEmailContentInputSchema},
  output: {schema: SummarizeEmailContentOutputSchema},
  prompt: `You are a security analyst providing a detailed threat assessment of an email. Analyze the following content and provide a comprehensive summary.

Email Content:
{{{emailContent}}}

Your summary should include the following sections:
- **Identified Threats:** (e.g., Phishing attempt, Malware attachment, Social engineering)
- **Sender's Intent:** (e.g., To steal credentials, to install malware, to request a fraudulent payment)
- **Key Indicators:** (List the specific words, phrases, or links that are suspicious)
- **Overall Risk Assessment:** (Provide a brief explanation of the risk level and your reasoning)
`,
});

const summarizeEmailContentFlow = ai.defineFlow(
  {
    name: 'summarizeEmailContentFlow',
    inputSchema: SummarizeEmailContentInputSchema,
    outputSchema: SummarizeEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
