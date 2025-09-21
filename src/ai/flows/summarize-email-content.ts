// Summarize email content for quick threat assessment.

'use server';

/**
 * @fileOverview Summarizes the content of an email.
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
  summary: z.string().describe('A short summary of the email content.'),
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
  prompt: `You are a security analyst summarizing email content for threat assessment. Provide a concise summary of the following email content:\n\n{{{emailContent}}}`,
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
