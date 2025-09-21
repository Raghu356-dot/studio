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
    .describe('A summary of the findings from the URL scan.'),
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
  prompt: `You are a cybersecurity analyst specializing in web security. Analyze the provided URL and determine if it poses a threat.

  URL to Analyze: {{{url}}}

  Based on the URL's structure, domain, and any other relevant factors, determine if it is malicious.
  - If it is malicious, set isMalicious to true and specify the threatType (e.g., "Phishing", "Malware", "Scam").
  - If it is safe, set isMalicious to false and set the threatType to "Benign".
  - Provide a concise summary explaining your reasoning.`,
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
