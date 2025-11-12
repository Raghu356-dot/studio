'use server';

/**
 * @fileOverview This file defines the email analysis flow, which analyzes email content for phishing attempts, scams, and malicious links.
 *
 * - analyzeEmail - A function that handles the email analysis process.
 * - EmailAnalysisInput - The input type for the analyzeEmail function.
 * - EmailAnalysisOutput - The return type for the analyzeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailAnalysisInputSchema = z.object({
  emailContent: z.string().describe('The content of the email to analyze.'),
});
export type EmailAnalysisInput = z.infer<typeof EmailAnalysisInputSchema>;

const EmailAnalysisOutputSchema = z.object({
  riskAssessment: z.string().describe('A risk assessment of the email content.'),
  userGuidance: z.string().describe('Guidance for the user based on the email analysis.'),
  isPhishing: z.boolean().describe('Whether the email is identified as a phishing attempt.'),
  isScam: z.boolean().describe('Whether the email is identified as a scam.'),
  maliciousLinks: z.array(z.string()).describe('A list of malicious links found in the email.'),
});
export type EmailAnalysisOutput = z.infer<typeof EmailAnalysisOutputSchema>;

export async function analyzeEmail(input: EmailAnalysisInput): Promise<EmailAnalysisOutput> {
  return emailAnalysisFlow(input);
}

const emailAnalysisPrompt = ai.definePrompt({
  name: 'emailAnalysisPrompt',
  input: {schema: EmailAnalysisInputSchema},
  output: {schema: EmailAnalysisOutputSchema},
  prompt: `You are a cybersecurity expert specializing in email analysis. Analyze the email content provided and identify potential phishing attempts, scams, and malicious links. Provide a risk assessment and user guidance based on your analysis.

Email Content:
{{{emailContent}}}

Consider the following aspects:
- Sender's address and reputation
- Subject line and its relevance to the content
- Presence of suspicious links or attachments
- Grammar and spelling errors
- Tone and urgency of the message
- Requests for sensitive information

Based on your analysis, provide a risk assessment, user guidance, and a list of any malicious links found. Set the isPhishing and isScam flags appropriately.
`,
});

const emailAnalysisFlow = ai.defineFlow(
  {
    name: 'emailAnalysisFlow',
    inputSchema: EmailAnalysisInputSchema,
    outputSchema: EmailAnalysisOutputSchema,
  },
  async input => {
    const {output} = await emailAnalysisPrompt(input);
    return output!;
  }
);
