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
  prompt: `You are a security analyst providing a threat assessment of an email. Analyze the following content and provide a summary in a structured, easy-to-read format.

Email Content:
{{{emailContent}}}

Your summary should be a single block of text and include the following sections with clear headings:
- **Identified Threats:** (e.g., Phishing attempt, Malware attachment)
- **Sender's Intent:** (e.g., To steal credentials, to install malware)
- **Key Indicators:** (List 2-3 specific suspicious words, phrases, or links)
- **Overall Risk:** (e.g., High, Medium, Low)
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
