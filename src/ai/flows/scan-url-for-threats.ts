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

  Carefully examine the URL for the following red flags:
  1.  **Misleading Subdomains:** Look for brand names in the subdomain (e.g., 'paypal.secure-login.com' instead of 'paypal.com').
  2.  **Suspicious TLDs:** Pay attention to TLDs often associated with spam or malware (e.g., .xyz, .club, .top, .site).
  3.  **Character Substitution:** Check for common character impersonations (e.g., 'g00gle.com' instead of 'google.com', or using 'l' for 'i').
  4.  **Excessively Long URLs or Unusual Paths:** Long, complex URLs with random characters can be a sign of a malicious site.

  Based on your analysis:
  - If you find strong indicators of malicious intent, set isMalicious to true and specify the threatType (e.g., "Phishing", "Malware", "Scam").
  - If the URL appears safe, set isMalicious to false and set the threatType to "Benign".
  - Provide a concise summary explaining your reasoning, referencing the specific red flags you identified (or lack thereof).`,
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
