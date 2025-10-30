'use server';
/**
 * @fileOverview Email Analysis Agent that scans email messages and attachments for phishing attempts, scams, and suspicious links.
 *
 * - analyzeEmailForPhishing - A function that handles the email analysis process.
 * - AnalyzeEmailForPhishingInput - The input type for the analyzeEmailForPhishing function.
 * - AnalyzeEmailForPhishingOutput - The return type for the analyzeEmailForPhishing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmailForPhishingInputSchema = z.object({
  emailContent: z.string().describe('The complete content of the email message, including headers and body.'),
  attachmentDataUris: z.array(z.string()).optional().describe('An optional array of email attachments, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type AnalyzeEmailForPhishingInput = z.infer<typeof AnalyzeEmailForPhishingInputSchema>;

const AnalyzeEmailForPhishingOutputSchema = z.object({
  isPhishing: z.boolean().describe('Whether the email is identified as phishing or not.'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The risk level associated with the email (low, medium, or high).'),
  reason: z.string().describe('The detailed explanation of why the email is considered phishing, including detected scams, suspicious links, and other threats.'),
  suggestedAction: z.string().describe('The suggested actions for the user to take based on the analysis, such as deleting the email or avoiding clicking on links.'),
});
export type AnalyzeEmailForPhishingOutput = z.infer<typeof AnalyzeEmailForPhishingOutputSchema>;

export async function analyzeEmailForPhishing(input: AnalyzeEmailForPhishingInput): Promise<AnalyzeEmailForPhishingOutput> {
  return analyzeEmailForPhishingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailForPhishingPrompt',
  input: {schema: AnalyzeEmailForPhishingInputSchema},
  output: {schema: AnalyzeEmailForPhishingOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in detecting phishing emails. Analyze the provided email content and attachments to identify potential phishing attempts, scams, and suspicious links.

Email Content:
{{emailContent}}

{{#if attachmentDataUris}}
Attachments:
{{#each attachmentDataUris}}
{{media url=this}}
{{/each}}
{{/if}}

Based on your analysis, determine if the email is a phishing attempt and provide a risk assessment.

Output:
- isPhishing: (true/false) Indicate whether the email is a phishing attempt.
- riskLevel: (low/medium/high) The risk level associated with the email.
- reason: A detailed explanation of why the email is considered phishing, including detected scams, suspicious links, and other threats.
- suggestedAction: Suggested actions for the user to take based on the analysis.
`,
});

const analyzeEmailForPhishingFlow = ai.defineFlow(
  {
    name: 'analyzeEmailForPhishingFlow',
    inputSchema: AnalyzeEmailForPhishingInputSchema,
    outputSchema: AnalyzeEmailForPhishingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
