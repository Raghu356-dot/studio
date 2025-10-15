'use server';

/**
 * @fileOverview Scans a URL for potential threats like phishing and malware.
 *
 * - scanUrlForThreats - A function that handles the URL scanning process.
 * - ScanUrlForThreatsInput - The input type for the scanUrlForThreats function.
 * - ScanUrlForThreatsOutput - The return type for the scanUrlForThreats function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanUrlForThreatsInputSchema = z.object({
  url: z.string().url().describe('The URL to scan for threats.'),
});
export type ScanUrlForThreatsInput = z.infer<typeof ScanUrlForThreatsInputSchema>;

const ScanUrlForThreatsOutputSchema = z.object({
  isMalicious: z
    .boolean()
    .describe('Whether the URL is considered malicious or not.'),
  threatType: z
    .string()
    .describe(
      'The type of threat detected (e.g., Phishing, Malware, Benign).'
    ),
  summary: z
    .string()
    .describe(
      'A detailed summary of the findings from the URL scan, explaining the reasoning and specific red flags identified.'
    ),
  verdict: z.string().describe('A final, one-word verdict: "Safe" or "Malicious".'),
  advice: z.string().describe('Clear, actionable advice for the user based on the verdict.'),
});
export type ScanUrlForThreatsOutput = z.infer<typeof ScanUrlForThreatsOutputSchema>;

export async function scanUrlForThreats(
  input: ScanUrlForThreatsInput
): Promise<ScanUrlForThreatsOutput> {
  return scanUrlForThreatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanUrlForThreatsPrompt',
  input: {schema: ScanUrlForThreatsInputSchema},
  output: {schema: ScanUrlForThreatsOutputSchema},
  prompt: `You are a cybersecurity analyst. Analyze the provided URL and determine if it poses a threat. Format your output using markdown.

  URL to Analyze: {{{url}}}

  Provide a concise summary explaining your reasoning. Your output should be a single block of text.
  - **Analysis:** Briefly explain your conclusion.
  - **Red Flags:** Use a bulleted list for 1-2 red flags if malicious, otherwise "None".

  Finally, provide a definitive **verdict** ("Safe" or "Malicious") and actionable **advice** (e.g., "Avoid this site and do not enter any personal information." or "This URL appears safe to visit.").
  `,
});

const scanUrlForThreatsFlow = ai.defineFlow(
  {
    name: 'scanUrlForThreatsFlow',
    inputSchema: ScanUrlForThreatsInputSchema,
    outputSchema: ScanUrlForThreatsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
