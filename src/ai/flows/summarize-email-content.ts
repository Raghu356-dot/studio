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
  verdict: z.string().describe('A final, one-word verdict: "Safe" or "Malicious".'),
  advice: z.string().describe('Clear, actionable advice for the user based on the verdict.'),
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
  prompt: `You are a security analyst providing a threat assessment of an email. Analyze the following content and provide a summary, verdict, and advice in a structured, easy-to-read format using markdown.

Email Content:
{{{emailContent}}}

Your summary should be a single block of text and include the following sections with markdown formatting:
- **Identified Threats:** (e.g., Phishing attempt, Malware attachment)
- **Sender's Intent:** (e.g., To steal credentials, to install malware)
- **Key Indicators:** Use a bulleted list for 2-3 specific suspicious words, phrases, or links.
- **Overall Risk:** (e.g., High, Medium, Low)

Finally, provide a definitive **verdict** ("Safe" or "Malicious") and actionable **advice** (e.g., "Delete this email immediately and do not click any links." or "This email appears safe, but always be cautious with attachments.").
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
